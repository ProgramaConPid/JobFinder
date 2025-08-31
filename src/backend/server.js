// src/backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();

/* ===== Middleware ===== */
app.use(cors({
  origin: 'https://jobfinderprojectdemo.netlify.app/',
  credentials: true,
  methods: 'GET,POST,PUT,DELETE,OPTIONS'
}));
app.use(express.json());

/* ===== Static (frontend) ===== */
const publicDir = path.resolve(__dirname, '../public');
app.use(express.static(publicDir));

/* ===== DB Pool ===== */
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'Db_JobFinder',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: { rejectUnauthorized: false }
});

/* ===== Constantes ENUM ===== */
const MODALITY_ENUM = ['Remote', 'Hybrid', 'On-site'];
const LEVEL_ENUM    = ['Junior', 'Mid-level', 'Senior'];

/* ===== Logger simple para /api ===== */
app.use('/api', (req, _res, next) => {
  console.log(`[API] ${req.method} ${req.path}`);
  next();
});

/* ===== Health ===== */
app.get('/api/health', async (_req, res) => {
  try {
    const [r] = await pool.query('SELECT 1 AS ok');
    res.json({ ok: r?.[0]?.ok === 1, db: 'up' });
  } catch (e) {
    console.error('[health] DB error:', e.message);
    res.status(500).json({ ok: false, db: 'down' });
  }
});

/* ===================================================================
   COMPANIES
   =================================================================== */
const companies = express.Router();

companies.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, name, industry, website, company_size, email, phone, address, created_at, updated_at
      FROM Companies
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (e) {
    console.error('[GET /api/companies] SQL error:', e.message);
    res.status(500).json({ error: 'Error obteniendo companies' });
  }
});

companies.post('/', async (req, res) => {
  try {
    let {
      name, industry, website, company_size, description,
      contact_person, contact_position, email, phone, address, password
    } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email y password son requeridos' });
    }

    industry       = industry       || 'General';
    contact_person = contact_person || name;
    phone          = phone          || '0000000000';
    address        = address        || 'Pending';

    const sql = `
      INSERT INTO Companies
        (name, industry, website, company_size, description, contact_person, contact_position, email, phone, address, password)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [r] = await pool.query(sql, [
      name, industry, website || null, company_size || null, description || null,
      contact_person, contact_position || null, email, phone, address, password
    ]);
    res.status(201).json({ id: r.insertId });
  } catch (e) {
    console.error('[POST /api/companies] SQL error:', e.message);
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email o website ya están registrados' });
    }
    res.status(500).json({ error: 'Error creando company' });
  }
});

/* Login simple (sin hash) */
app.post('/api/auth/company/login', async (req, res) => {
  try {
    let { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'email y password son requeridos' });

    email = String(email).trim().toLowerCase();
    const [rows] = await pool.query(
      'SELECT id, name, password FROM Companies WHERE LOWER(email) = ? LIMIT 1',
      [email]
    );
    if (!rows || rows.length === 0) {
      return res.status(401).json({ error: 'El correo no está registrado' });
    }
    const u = rows[0];
    if (String(u.password) !== String(password)) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
    res.json({ id: u.id, name: u.name });
  } catch (e) {
    console.error('[POST /api/auth/company/login] SQL error:', e.message);
    res.status(500).json({ error: 'Error en login' });
  }
});

app.use('/api/companies', companies);

/* ===================================================================
   OFFERS
   =================================================================== */
const offers = express.Router();

/* Listado (opcional por company_id) */
offers.get('/', async (req, res) => {
  try {
    const { company_id } = req.query;
    const base = `
      SELECT
        o.id, o.company_id, c.name AS company_name,
        o.title, o.description, o.location,
        o.salary_min, o.salary_max, o.modality, o.level,
        o.created_at, o.updated_at
      FROM JobOffers o
      JOIN Companies c ON c.id = o.company_id
    `;
    const order = ' ORDER BY o.created_at DESC';

    if (company_id) {
      const [rows] = await pool.query(base + ' WHERE o.company_id = ?' + order, [company_id]);
      return res.json(rows);
    }
    const [rows] = await pool.query(base + order);
    res.json(rows);
  } catch (e) {
    console.error('[GET /api/offers] SQL error:', e.message);
    res.status(500).json({ error: 'Error obteniendo ofertas' });
  }
});

/* Crear */
offers.post('/', async (req, res) => {
  try {
    const { company_id, title, description, location, salary_min, salary_max, modality, level } = req.body || {};
    if (!company_id || !title || !description || !location || !modality || !level) {
      return res.status(400).json({ error: 'company_id, title, description, location, modality y level son requeridos' });
    }
    if (!MODALITY_ENUM.includes(String(modality))) {
      return res.status(400).json({ error: `modality inválida. Use: ${MODALITY_ENUM.join(', ')}` });
    }
    if (!LEVEL_ENUM.includes(String(level))) {
      return res.status(400).json({ error: `level inválido. Use: ${LEVEL_ENUM.join(', ')}` });
    }

    const toDec = (v) =>
      (v === undefined || v === null || v === '' || Number.isNaN(Number(v))) ? null : Number(v);

    const sql = `
      INSERT INTO JobOffers (company_id, title, description, location, salary_min, salary_max, modality, level)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [r] = await pool.query(sql, [
      Number(company_id), String(title), String(description), String(location),
      toDec(salary_min), toDec(salary_max), String(modality), String(level)
    ]);
    res.status(201).json({ id: r.insertId });
  } catch (e) {
    console.error('[POST /api/offers] SQL error:', e.message);
    res.status(500).json({ error: 'Error creando oferta' });
  }
});

/* Editar (tolerante a "sin cambios") */
offers.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'id inválido' });

    const [ex] = await pool.query('SELECT id FROM JobOffers WHERE id = ? LIMIT 1', [id]);
    if (!ex || ex.length === 0) return res.status(404).json({ error: 'Offer no encontrada' });

    let { title, description, location, salary_min, salary_max, modality, level } = req.body || {};

    if (modality !== undefined && !MODALITY_ENUM.includes(String(modality))) {
      return res.status(400).json({ error: `modality inválida. Use: ${MODALITY_ENUM.join(', ')}` });
    }
    if (level !== undefined && !LEVEL_ENUM.includes(String(level))) {
      return res.status(400).json({ error: `level inválido. Use: ${LEVEL_ENUM.join(', ')}` });
    }

    const toDec = (v) =>
      (v === undefined || v === null || v === '' || Number.isNaN(Number(v))) ? null : Number(v);
    if (salary_min !== undefined) salary_min = toDec(salary_min);
    if (salary_max !== undefined) salary_max = toDec(salary_max);
    if (location === undefined && modality !== undefined) {
      location = (modality === 'Remote') ? 'Remote' : 'Por definir';
    }

    const set = [];
    const vals = [];
    const add = (c, v) => { set.push(`${c} = ?`); vals.push(v); };

    if (title !== undefined)       add('title', String(title));
    if (description !== undefined) add('description', String(description));
    if (location !== undefined)    add('location', String(location));
    if (salary_min !== undefined)  add('salary_min', salary_min);
    if (salary_max !== undefined)  add('salary_max', salary_max);
    if (modality !== undefined)    add('modality', String(modality));
    if (level !== undefined)       add('level', String(level));

    if (set.length === 0) return res.json({ ok: true, unchanged: true });

    vals.push(id);
    const sql = `UPDATE JobOffers SET ${set.join(', ')} WHERE id = ?`;
    const [r] = await pool.query(sql, vals);

    res.json({ ok: true, affectedRows: r.affectedRows ?? 0 });
  } catch (e) {
    console.error('[PUT /api/offers/:id] SQL error:', e);
    res.status(500).json({ error: 'Error actualizando oferta' });
  }
});

/* === DELETE: elimina oferta por id === */
offers.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'id inválido' });

    const [r] = await pool.query('DELETE FROM JobOffers WHERE id = ?', [id]);
    if (r.affectedRows === 0) {
      return res.status(404).json({ error: 'Offer no encontrada' });
    }
    // Applications / Interviews se eliminan por ON DELETE CASCADE (según tu esquema).
    res.json({ ok: true, deleted: r.affectedRows });
  } catch (e) {
    console.error('[DELETE /api/offers/:id] SQL error:', e);
    res.status(500).json({ error: 'Error eliminando oferta' });
  }
});

app.use('/api/offers', offers);

/* ===== Fallback para el frontend ===== */
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/')) {
    return res.sendFile(path.join(publicDir, 'index.html'));
  }
  next();
});

/* ===== Arranque ===== */
const PORT = Number(process.env.PORT || 3000); // usa 3000 por defecto
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Serving static from: ${publicDir}`);
});
