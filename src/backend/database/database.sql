-- =========================
-- USERS
-- =========================
CREATE DATABASE IF NOT EXISTS JobPortal;
USE JobPortal;
-- =========================
-- USERS
-- =========================
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('coder', 'company') NOT NULL
);

-- =========================
-- CODERS
-- =========================
CREATE TABLE Coders (
    coder_id INT PRIMARY KEY,
    resume TEXT,
    portfolio TEXT,
    profile_completion INT DEFAULT 0,
    FOREIGN KEY (coder_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- =========================
-- COMPANIES
-- =========================
CREATE TABLE Companies (
    company_id INT PRIMARY KEY,
    company_name VARCHAR(200) NOT NULL,
    industry VARCHAR(150),
    description TEXT,
    profile_completion INT DEFAULT 0,
    FOREIGN KEY (company_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- =========================
-- JOB OFFERS
-- =========================
CREATE TABLE JobOffers (
    offer_id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    location VARCHAR(150),
    salary_min DECIMAL(10,2),
    salary_max DECIMAL(10,2),
    work_mode ENUM('Remote', 'On-site', 'Hybrid'),
    
    status ENUM('open', 'closed') DEFAULT 'open',
    Fseniority ENUM('Junior', 'Middle', 'Senior'),
    publish_date DATE DEFAULT CURRENT_DATE,OREIGN KEY (company_id) REFERENCES Companies(company_id) ON DELETE CASCADE
);

-- =========================
-- APPLICATIONS
-- =========================
CREATE TABLE Applications (
    application_id INT PRIMARY KEY AUTO_INCREMENT,
    offer_id INT NOT NULL,
    coder_id INT NOT NULL,
    application_date DATE DEFAULT CURRENT_DATE,
    status ENUM('pending', 'in progress', 'accepted', 'rejected') DEFAULT 'pending',
    FOREIGN KEY (offer_id) REFERENCES JobOffers(offer_id) ON DELETE CASCADE,
    FOREIGN KEY (coder_id) REFERENCES Coders(coder_id) ON DELETE CASCADE
);

-- =========================
-- SKILLS
-- =========================
CREATE TABLE Skills (
    skill_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- =========================
-- CODERS_SKILLS (M:N)
-- =========================
CREATE TABLE Coders_Skills (
    coder_id INT NOT NULL,
    skill_id INT NOT NULL,
    level ENUM('Beginner', 'Intermediate', 'Advanced'),
    PRIMARY KEY (coder_id, skill_id),
    FOREIGN KEY (coder_id) REFERENCES Coders(coder_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES Skills(skill_id) ON DELETE CASCADE
);

-- =========================
-- OFFERS_SKILLS (M:N)
-- =========================
CREATE TABLE Offers_Skills (
    offer_id INT NOT NULL,
    skill_id INT NOT NULL,
    required BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (offer_id, skill_id),
    FOREIGN KEY (offer_id) REFERENCES JobOffers(offer_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES Skills(skill_id) ON DELETE CASCADE
);