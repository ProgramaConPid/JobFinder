-- ==========================================
-- Crear base de datos
-- ==========================================
CREATE DATABASE IF NOT EXISTS Db_JobFinder;
USE Db_JobFinder;

-- ==========================================
-- Tabla Applicants
-- ==========================================
CREATE TABLE Applicants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    profession VARCHAR(100) NOT NULL,
    years_experience INT DEFAULT 0,
    education_level VARCHAR(100) NULL,
    skills TEXT NULL,
    resume_url VARCHAR(255) NULL,

    -- Redes sociales (opcionales)
    linkedin VARCHAR(255) NULL,
    twitter VARCHAR(255) NULL,
    facebook VARCHAR(255) NULL,
    instagram VARCHAR(255) NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================================
-- Tabla Companies
-- ==========================================
CREATE TABLE Companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    website VARCHAR(255) UNIQUE,
    company_size VARCHAR(50) NULL,
    description TEXT NULL,
    contact_person VARCHAR(100) NOT NULL,
    contact_position VARCHAR(100) NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,

    -- Redes sociales (opcionales)
    linkedin VARCHAR(255) NULL,
    twitter VARCHAR(255) NULL,
    facebook VARCHAR(255) NULL,
    instagram VARCHAR(255) NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================================
-- Tabla JobOffers
-- ==========================================
CREATE TABLE JobOffers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(100) NOT NULL,
    salary_min DECIMAL(10,2) NULL,
    salary_max DECIMAL(10,2) NULL,
    modality ENUM('Remote','Hybrid','On-site') NOT NULL,
    level ENUM('Junior','Mid-level','Senior') NOT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_joboffers_company FOREIGN KEY (company_id) REFERENCES Companies(id) ON DELETE CASCADE
);

-- ==========================================
-- Tabla Applications
-- ==========================================
CREATE TABLE Applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_id INT NOT NULL,
    job_id INT NOT NULL,
    status ENUM('Under Review','Interview Scheduled','Rejected','Accepted') DEFAULT 'Under Review',
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_applications_applicant FOREIGN KEY (applicant_id) REFERENCES Applicants(id) ON DELETE CASCADE,
    CONSTRAINT fk_applications_job FOREIGN KEY (job_id) REFERENCES JobOffers(id) ON DELETE CASCADE
);

-- ==========================================
-- Tabla Interviews
-- ==========================================
CREATE TABLE Interviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    interview_date DATETIME NOT NULL,
    status ENUM('Scheduled','Completed','Cancelled') DEFAULT 'Scheduled',
    notes TEXT NULL,

    CONSTRAINT fk_interviews_application FOREIGN KEY (application_id) REFERENCES Applications(id) ON DELETE CASCADE
);