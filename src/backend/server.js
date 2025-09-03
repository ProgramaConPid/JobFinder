// src/backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mysql = require("mysql2/promise");

const app = express();

/* ===== Middleware ===== */
app.use(
  cors({
    origin: "https://jobfinderprojectdemo.netlify.app",
    credentials: true,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
  })
);
app.use(express.json());

/* ===== Static (frontend) ===== */
const publicDir = path.resolve(__dirname, "../public");
app.use(express.static(publicDir));

/* ===== DB Pool ===== */
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "Db_JobFinder",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: { rejectUnauthorized: false },
});

/* ===== Constantes ENUM ===== */
const MODALITY_ENUM = ["Remote", "Hybrid", "On-site"];
const LEVEL_ENUM = ["Junior", "Mid-level", "Senior"];

/* ===== Logger simple para /api ===== */
app.use("/api", (req, _res, next) => {
  console.log(`[API] ${req.method} ${req.path}`);
  next();
});

/* ===== Health ===== */
app.get("/api/health", async (_req, res) => {
  try {
    const [r] = await pool.query("SELECT 1 AS ok");
    res.json({ ok: r?.[0]?.ok === 1, db: "up" });
  } catch (e) {
    console.error("[health] DB error:", e.message);
    res.status(500).json({ ok: false, db: "down" });
  }
});

/* ===================================================================
   COMPANIES
   =================================================================== */
const companies = express.Router();

companies.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, name, industry, website, company_size, email, phone, address, created_at, updated_at
      FROM Companies
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (e) {
    console.error("[GET /api/companies] SQL error:", e.message);
    res.status(500).json({ error: "Error obteniendo companies" });
  }
});

companies.post("/", async (req, res) => {
  try {
    let {
      name,
      industry,
      website,
      company_size,
      description,
      contact_person,
      contact_position,
      email,
      phone,
      address,
      password,
    } = req.body || {};

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "name, email y password son requeridos" });
    }

    industry = industry || "General";
    contact_person = contact_person || name;
    phone = phone || "0000000000";
    address = address || "Pending";

    const sql = `
      INSERT INTO Companies
        (name, industry, website, company_size, description, contact_person, contact_position, email, phone, address, password)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [r] = await pool.query(sql, [
      name,
      industry,
      website || null,
      company_size || null,
      description || null,
      contact_person,
      contact_position || null,
      email,
      phone,
      address,
      password,
    ]);
    res.status(201).json({ id: r.insertId });
  } catch (e) {
    console.error("[POST /api/companies] SQL error:", e.message);
    if (e.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ error: "Email o website ya están registrados" });
    }
    res.status(500).json({ error: "Error creando company" });
  }
});

/* Login simple (sin hash) */
app.post("/api/auth/company/login", async (req, res) => {
  try {
    let { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ error: "email y password son requeridos" });

    email = String(email).trim().toLowerCase();
    const [rows] = await pool.query(
      "SELECT id, name, password FROM Companies WHERE LOWER(email) = ? LIMIT 1",
      [email]
    );
    if (!rows || rows.length === 0) {
      return res.status(401).json({ error: "El correo no está registrado" });
    }
    const u = rows[0];
    if (String(u.password) !== String(password)) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }
    res.json({ id: u.id, name: u.name });
  } catch (e) {
    console.error("[POST /api/auth/company/login] SQL error:", e.message);
    res.status(500).json({ error: "Error en login" });
  }
});

app.use("/api/companies", companies);

/* ===================================================================
   APPLICANTS (CODERS)
   =================================================================== */

/* Login Coder (adaptado a Applicants con first_name / last_name) */
app.post("/api/auth/coder/login", async (req, res) => {
  try {
    let { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "email y password son requeridos" });
    }

    email = String(email).trim().toLowerCase();
    const [rows] = await pool.query(
      "SELECT id, first_name, last_name, password FROM Applicants WHERE LOWER(email) = ? LIMIT 1",
      [email]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "No registrado" });
    }

    const u = rows[0];
    if (String(u.password) !== String(password)) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const name = [u.first_name, u.last_name].filter(Boolean).join(" ");
    return res.json({ applicant_id: u.id, name });
  } catch (e) {
    console.error("[POST /api/auth/coder/login] SQL error:", e);
    res.status(500).json({ error: "Error en login" });
  }
});

/* Registro Coder (adaptado al esquema Applicants) */
app.post("/api/auth/coder/register", async (req, res) => {
  try {
    const b = req.body || {};
    // Acepta first_name/last_name o full_name (lo separamos)
    let first_name = b.first_name ?? null;
    let last_name = b.last_name ?? null;

    if (!first_name && !last_name && (b.full_name || b.fullName)) {
      const full = String(b.full_name ?? b.fullName).trim();
      const parts = full.split(/\s+/);
      first_name = parts.shift() || "";
      last_name = parts.join(" ") || "-";
    }

    const email = b.email ? String(b.email).trim().toLowerCase() : null;
    const password = b.password ?? null;

    // NOT NULL en tu esquema: garantizamos defaults si no vienen
    const phone = (b.phone && String(b.phone).trim()) || "0000000000";
    const address = (b.address && String(b.address).trim()) || "Pending";
    const profession =
      (b.profession && String(b.profession).trim()) || "Unspecified";

    // Opcionales
    const years_experience = Number.isFinite(Number(b.years_experience))
      ? Number(b.years_experience)
      : 0;
    const education_level = b.education_level ?? null;
    const skills = b.skills ?? null;
    const resume_url = b.resume_url ?? b.resumeUrl ?? null;
    const linkedin = b.linkedin ?? null;
    const twitter = b.twitter ?? null;
    const facebook = b.facebook ?? null;
    const instagram = b.instagram ?? null;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        error: "first_name/last_name, email y password son requeridos",
      });
    }

    // ¿email ya existe?
    const [ex] = await pool.query(
      "SELECT id FROM Applicants WHERE LOWER(email) = ? LIMIT 1",
      [email]
    );
    if (ex && ex.length > 0) {
      return res.status(409).json({ error: "El email ya está registrado" });
    }

    const sql = `
      INSERT INTO Applicants (
        first_name, last_name, email, phone, address, password, profession,
        years_experience, education_level, skills, resume_url,
        linkedin, twitter, facebook, instagram
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      first_name,
      last_name,
      email,
      phone,
      address,
      String(password),
      profession,
      years_experience,
      education_level,
      skills,
      resume_url,
      linkedin,
      twitter,
      facebook,
      instagram,
    ];

    const [r] = await pool.query(sql, params);
    return res.status(201).json({ applicant_id: r.insertId });
  } catch (e) {
    console.error("[POST /api/auth/coder/register] SQL error:", e);
    if (e.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "El email ya está registrado" });
    }
    return res.status(500).json({ error: "Error registrando applicant" });
  }
});

/* ===================================================================
   APPLICATIONS
   =================================================================== */
const applications = express.Router();

/* Listar aplicaciones por applicant_id */
applications.get("/", async (req, res) => {
  try {
    const { applicant_id } = req.query;
    if (!applicant_id) {
      return res.status(400).json({ error: "applicant_id requerido" });
    }
    const sql = `
      SELECT a.id, a.applicant_id, a.job_id, a.status, a.applied_at,
             o.title, o.location, o.modality, o.level, o.company_id, c.name AS company_name
      FROM Applications a
      JOIN JobOffers o ON o.id = a.job_id
      JOIN Companies c ON c.id = o.company_id
      WHERE a.applicant_id = ?
      ORDER BY a.applied_at DESC
    `;
    const [rows] = await pool.query(sql, [Number(applicant_id)]);
    res.json(rows);
  } catch (e) {
    console.error("[GET /api/applications] SQL error:", e);
    res.status(500).json({ error: "Error obteniendo aplicaciones" });
  }
});

/* Crear una aplicación (Under Review por defecto) */
applications.post("/", async (req, res) => {
  try {
    const { applicant_id, job_id } = req.body || {};
    if (!applicant_id || !job_id) {
      return res
        .status(400)
        .json({ error: "applicant_id y job_id son requeridos" });
    }

    // Evita duplicados (un usuario aplicando 2 veces al mismo job)
    const [dup] = await pool.query(
      "SELECT id FROM Applications WHERE applicant_id = ? AND job_id = ? LIMIT 1",
      [Number(applicant_id), Number(job_id)]
    );
    if (dup && dup.length > 0) {
      return res.status(409).json({ error: "Ya aplicaste a esta oferta" });
    }

    const [r] = await pool.query(
      "INSERT INTO Applications (applicant_id, job_id, status) VALUES (?, ?, ?)",
      [Number(applicant_id), Number(job_id), "Under Review"]
    );
    res.status(201).json({ id: r.insertId, ok: true });
  } catch (e) {
    console.error("[POST /api/applications] SQL error:", e);
    res.status(500).json({ error: "Error creando aplicación" });
  }
});

app.use("/api/applications", applications);

/* ===================================================================
   OFFERS
   =================================================================== */
const offers = express.Router();

/* Listado (opcional por company_id) */
offers.get("/", async (req, res) => {
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
    const order = " ORDER BY o.created_at DESC";

    if (company_id) {
      const [rows] = await pool.query(
        base + " WHERE o.company_id = ?" + order,
        [company_id]
      );
      return res.json(rows);
    }
    const [rows] = await pool.query(base + order);
    res.json(rows);
  } catch (e) {
    console.error("[GET /api/offers] SQL error:", e.message);
    res.status(500).json({ error: "Error obteniendo ofertas" });
  }
});

/* Crear */
offers.post("/", async (req, res) => {
  try {
    const {
      company_id,
      title,
      description,
      location,
      salary_min,
      salary_max,
      modality,
      level,
    } = req.body || {};
    if (
      !company_id ||
      !title ||
      !description ||
      !location ||
      !modality ||
      !level
    ) {
      return res.status(400).json({
        error:
          "company_id, title, description, location, modality y level son requeridos",
      });
    }
    if (!MODALITY_ENUM.includes(String(modality))) {
      return res
        .status(400)
        .json({ error: `modality inválida. Use: ${MODALITY_ENUM.join(", ")}` });
    }
    if (!LEVEL_ENUM.includes(String(level))) {
      return res
        .status(400)
        .json({ error: `level inválido. Use: ${LEVEL_ENUM.join(", ")}` });
    }

    const toDec = (v) =>
      v === undefined || v === null || v === "" || Number.isNaN(Number(v))
        ? null
        : Number(v);

    const sql = `
      INSERT INTO JobOffers (company_id, title, description, location, salary_min, salary_max, modality, level)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [r] = await pool.query(sql, [
      Number(company_id),
      String(title),
      String(description),
      String(location),
      toDec(salary_min),
      toDec(salary_max),
      String(modality),
      String(level),
    ]);
    res.status(201).json({ id: r.insertId });
  } catch (e) {
    console.error("[POST /api/offers] SQL error:", e.message);
    res.status(500).json({ error: "Error creando oferta" });
  }
});

/* Editar */
offers.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "id inválido" });

    const [ex] = await pool.query(
      "SELECT id FROM JobOffers WHERE id = ? LIMIT 1",
      [id]
    );
    if (!ex || ex.length === 0)
      return res.status(404).json({ error: "Offer no encontrada" });

    let {
      title,
      description,
      location,
      salary_min,
      salary_max,
      modality,
      level,
    } = req.body || {};

    if (modality !== undefined && !MODALITY_ENUM.includes(String(modality))) {
      return res
        .status(400)
        .json({ error: `modality inválida. Use: ${MODALITY_ENUM.join(", ")}` });
    }
    if (level !== undefined && !LEVEL_ENUM.includes(String(level))) {
      return res
        .status(400)
        .json({ error: `level inválido. Use: ${LEVEL_ENUM.join(", ")}` });
    }

    const toDec = (v) =>
      v === undefined || v === null || v === "" || Number.isNaN(Number(v))
        ? null
        : Number(v);
    if (salary_min !== undefined) salary_min = toDec(salary_min);
    if (salary_max !== undefined) salary_max = toDec(salary_max);
    if (location === undefined && modality !== undefined) {
      location = modality === "Remote" ? "Remote" : "Por definir";
    }

    const set = [];
    const vals = [];
    const add = (c, v) => {
      set.push(`${c} = ?`);
      vals.push(v);
    };

    if (title !== undefined) add("title", String(title));
    if (description !== undefined) add("description", String(description));
    if (location !== undefined) add("location", String(location));
    if (salary_min !== undefined) add("salary_min", salary_min);
    if (salary_max !== undefined) add("salary_max", salary_max);
    if (modality !== undefined) add("modality", String(modality));
    if (level !== undefined) add("level", String(level));

    if (set.length === 0) return res.json({ ok: true, unchanged: true });

    vals.push(id);
    const sql = `UPDATE JobOffers SET ${set.join(", ")} WHERE id = ?`;
    const [r] = await pool.query(sql, vals);

    res.json({ ok: true, affectedRows: r.affectedRows ?? 0 });
  } catch (e) {
    console.error("[PUT /api/offers/:id] SQL error:", e);
    res.status(500).json({ error: "Error actualizando oferta" });
  }
});

/* Eliminar */
offers.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "id inválido" });

    const [r] = await pool.query("DELETE FROM JobOffers WHERE id = ?", [id]);
    if (r.affectedRows === 0) {
      return res.status(404).json({ error: "Offer no encontrada" });
    }
    res.json({ ok: true, deleted: r.affectedRows });
  } catch (e) {
    console.error("[DELETE /api/offers/:id] SQL error:", e);
    res.status(500).json({ error: "Error eliminando oferta" });
  }
});

app.use("/api/offers", offers);

/* ===================================================================
   CODERS (Applicants profile)
   =================================================================== */

// Obtener perfil de un applicant por id
app.get("/api/coders/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id) || id <= 0) {
      return res.status(400).json({ error: "id inválido" });
    }

    const [rows] = await pool.query(
      `SELECT id, first_name, last_name, email, phone, address,
          skills, resume_url, linkedin, twitter, facebook, instagram
   FROM Applicants
   WHERE id = ? LIMIT 1`,
      [id]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "Perfil no encontrado" });
    }

    res.json(rows[0]);
  } catch (e) {
    console.error("[GET /api/coders/:id] SQL error:", e.message);
    res.status(500).json({ error: "Error obteniendo perfil" });
  }
});

// Actualizar perfil de un applicant
app.put('/api/coders/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id) || id <= 0) {
      return res.status(400).json({ error: 'id inválido' });
    }

    const {
      first_name, last_name, phone, address,
      skills, resume_url, linkedin, twitter, facebook, instagram
    } = req.body || {};

    const sql = `
      UPDATE Applicants
      SET first_name=?, last_name=?, phone=?, address=?,
          skills=?, resume_url=?,
          linkedin=?, twitter=?, facebook=?, instagram=?,
          updated_at = NOW()
      WHERE id=?
    `;
    const params = [
      first_name, last_name, phone, address,
      skills, resume_url,
      linkedin, twitter, facebook, instagram,
      id
    ];

    const [r] = await pool.query(sql, params);

    if (r.affectedRows === 0) {
      return res.status(404).json({ error: 'Perfil no encontrado' });
    }

    // Devolver el perfil actualizado
    const [rows] = await pool.query(
      `SELECT id, first_name, last_name, email, phone, address,
              skills, resume_url, linkedin, twitter, facebook, instagram
       FROM Applicants
       WHERE id = ? LIMIT 1`,
      [id]
    );

    res.json(rows[0]);
  } catch (e) {
    console.error('[PUT /api/coders/:id] SQL error:', e.message);
    res.status(500).json({ error: 'Error actualizando perfil' });
  }
});

/* ===================================================================
   COMPANY PROFILE
   =================================================================== */

// Obtener perfil de una company por id
app.get('/api/companies/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isFinite(id) || id <= 0) {
            return res.status(400).json({ error: 'id inválido' });
        }

        const [rows] = await pool.query(
            `SELECT id, name, industry, company_size,
                    contact_person, contact_position,
                    email, phone, address, description,
                    website, linkedin, twitter, facebook, instagram
             FROM Companies
             WHERE id = ? LIMIT 1`,
            [id]
        );

        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: 'Perfil no encontrado' });
        }

        res.json(rows[0]);
    } catch (e) {
        console.error('[GET /api/companies/:id] SQL error:', e.message);
        res.status(500).json({ error: 'Error obteniendo perfil' });
    }
});


// Actualizar perfil de una company
app.put('/api/companies/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isFinite(id) || id <= 0) {
            return res.status(400).json({ error: 'id inválido' });
        }

        const {
            name, industry, website, company_size, description,
            contact_person, contact_position,
            email, phone, address,
            linkedin, twitter, facebook, instagram
        } = req.body || {};

        const sql = `
            UPDATE Companies
            SET name=?, industry=?, website=?, company_size=?, description=?,
                contact_person=?, contact_position=?, email=?, phone=?, address=?,
                linkedin=?, twitter=?, facebook=?, instagram=?,
                updated_at = NOW()
            WHERE id=?
        `;

        const params = [
            name, industry, website, company_size, description,
            contact_person, contact_position, email, phone, address,
            linkedin, twitter, facebook, instagram,
            id
        ];

        const [r] = await pool.query(sql, params);

        if (r.affectedRows === 0) {
            return res.status(404).json({ error: 'Perfil no encontrado' });
        }

        const [rows] = await pool.query(
            `SELECT id, name, industry, website, company_size, description,
                    contact_person, contact_position, email, phone, address,
                    linkedin, twitter, facebook, instagram
             FROM Companies
             WHERE id = ? LIMIT 1`,
            [id]
        );

        res.json(rows[0]);
    } catch (e) {
        console.error('[PUT /api/companies/:id] SQL error:', e.message);
        res.status(500).json({ error: 'Error actualizando perfil' });
    }
});




/* ===== Fallback para el frontend ===== */
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api/")) {
    return res.sendFile(path.join(publicDir, "index.html"));
  }
  next();
});

/* ===== New Applicants (total) por empresa ===== */
app.get("/api/companies/:id/new-applicants", async (req, res) => {
  try {
    const companyId = Number(req.params.id);
    if (!Number.isFinite(companyId) || companyId <= 0) {
      return res.status(400).json({ error: "Parámetro id inválido" });
    }

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total
         FROM Applications A
         JOIN JobOffers J ON J.id = A.job_id
        WHERE J.company_id = ?`,
      [companyId]
    );

    res.json({ total: Number(total || 0) });
  } catch (err) {
    console.error("GET /api/companies/:id/new-applicants error", err);
    res.status(500).json({ error: "Error interno" });
  }
});

/* =========================================
   APPLICANTS POR OFERTA (con contador por aplicante)
   GET /api/offers/:id/applicants
   -> [{ application_id, applicant_id, name, email, interviews_count }]
========================================= */
app.get("/api/offers/:id/applicants", async (req, res) => {
  try {
    const offerId = Number(req.params.id);
    if (!Number.isFinite(offerId) || offerId <= 0) {
      return res.status(400).json({ error: "Parámetro id inválido" });
    }

    const [rows] = await pool.query(
      `SELECT 
         A.id     AS application_id,
         AP.id    AS applicant_id,
         CONCAT(COALESCE(AP.first_name,''),' ',COALESCE(AP.last_name,'')) AS name,
         AP.email AS email,
         (SELECT COUNT(*) FROM Interviews I WHERE I.application_id = A.id) AS interviews_count
       FROM Applications A
       JOIN Applicants  AP ON AP.id = A.applicant_id
      WHERE A.job_id = ?
      ORDER BY A.id DESC`,
      [offerId]
    );

    res.json(
      rows.map((r) => ({
        application_id: r.application_id,
        applicant_id: r.applicant_id,
        name: (r.name || "").trim(),
        email: r.email,
        interviews_count: Number(r.interviews_count || 0),
      }))
    );
  } catch (err) {
    console.error("GET /api/offers/:id/applicants error", err);
    res.status(500).json({ error: "Error interno" });
  }
});

/* =========================================
   AGENDAR ENTREVISTA (simple y devuelve totales)
   POST /api/interviews
   body: { application_id }
   -> { id, application_id, applicant_id, status, interviews_total }
========================================= */
app.post("/api/interviews", express.json(), async (req, res) => {
  try {
    const { application_id } = req.body || {};
    const appId = Number(application_id);
    if (!Number.isFinite(appId) || appId <= 0) {
      return res.status(400).json({ error: "application_id inválido" });
    }

    // trae applicant_id de la aplicación
    const [[appRow]] = await pool.query(
      `SELECT id, applicant_id FROM Applications WHERE id = ? LIMIT 1`,
      [appId]
    );
    if (!appRow)
      return res.status(404).json({ error: "Application no encontrada" });

    // crea entrevista
    const [r] = await pool.query(
      `INSERT INTO Interviews (application_id, interview_date, status, notes)
       VALUES (?, NOW(), 'Scheduled', NULL)`,
      [appId]
    );

    // total actualizado para esa aplicación
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM Interviews WHERE application_id = ?`,
      [appId]
    );

    res.status(201).json({
      id: r.insertId,
      application_id: appId,
      applicant_id: appRow.applicant_id,
      status: "Scheduled",
      interviews_total: Number(total || 0),
    });
  } catch (err) {
    console.error("POST /api/interviews error", err);
    res.status(500).json({ error: "Error interno" });
  }
});

/* =========================================
   CONTADOR DE ENTREVISTAS POR APPLICANT
   GET /api/applicants/:id/interviews/count
   -> { total }
========================================= */
app.get("/api/applicants/:id/interviews/count", async (req, res) => {
  try {
    const applicantId = Number(req.params.id);
    if (!Number.isFinite(applicantId) || applicantId <= 0) {
      return res.status(400).json({ error: "Parámetro id inválido" });
    }

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total
         FROM Interviews I
         JOIN Applications A ON A.id = I.application_id
        WHERE A.applicant_id = ?`,
      [applicantId]
    );

    res.json({ total: Number(total || 0) });
  } catch (err) {
    console.error("GET /api/applicants/:id/interviews/count error", err);
    res.status(500).json({ error: "Error interno" });
  }
});

/* ===== Arranque ===== */
const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Serving static from: ${publicDir}`);
});
