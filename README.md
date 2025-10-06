# 💼 JobFinder

**JobFinder** is a web and mobile platform designed to enhance
employability by connecting candidates with relevant job opportunities,
while providing companies with efficient recruitment tools.
This project also strengthens the relationship between the Employability
Department and organizations, creating a dynamic and reliable talent
ecosystem.

------------------------------------------------------------------------

## 📖 Table of Contents

1.  [About the Project](#-about-the-project)
2.  [Objectives](#-objectives)
3.  [Scope](#-scope)
4.  [Methodology](#-methodology)
5.  [Database Architecture](#-database-architecture)
6.  [Navigation Flow](#-navigation-flow)
7.  [Project Structure](#-project-structure)
8.  [Technologies](#-technologies)
9.  [Installation & Execution](#-installation--execution)
10. [MVP (Minimum Viable Product)](#-mvp-minimum-viable-product)
11. [Expected Results](#-expected-results)
12. [Team](#-team)
13. [Figma](#-Figma)

------------------------------------------------------------------------

## 📌 About the Project

**JobFinder** aims to bridge the gap between talent and companies by
offering:
- Candidate profiles with online CV upload.
- Job posting and management for companies.
- Application and interview tracking.
- An admin panel for the Employability Department.

In short: **a complete solution for job matching and employability
improvement.**

------------------------------------------------------------------------

## 🎯 Objectives

### General Objective

Design and implement a digital solution (website and mobile app) that
improves employability within organizations by connecting talent with
opportunities and offering companies efficient recruitment tools.

### Specific Objectives

1.  Expand access to job opportunities and career growth.
2.  Strengthen partnerships between the Employability Department and
    companies.
3.  Facilitate interaction between applicants and organizations.
4.  Help companies find qualified candidates efficiently.

------------------------------------------------------------------------

## 📍 Scope

The platform includes:
- User registration and authentication.
- Candidate profile management.
- Job posting, searching, and applying.
- Application and interview management.
- An admin dashboard for employability staff.

------------------------------------------------------------------------

## 📌 Methodology

The project follows an **Agile (Scrum)** methodology, focusing on
iterative development, testing, and stakeholder feedback.

Main phases:
1. Requirements gathering.
2. UI and system architecture design.
3. Core development (front-end + back-end).
4. Testing and integration.
5. Deployment and feedback.

------------------------------------------------------------------------

## 🗄 Database Architecture

The database is designed to reflect relationships between **companies,
applicants, job offers, applications, and interviews**.

![Database Model](https://github.com/ProgramaConPid/JobFinder/blob/develop/Docs/DB_image.png?raw=true)

**Explanation:**
- **Applicants**: candidate information (CV, skills, experience, social
links).
- **Companies**: company details (industry, size, contacts).
- **JobOffers**: job postings linked to companies.
- **Applications**: connects candidates with jobs.
- **Interviews**: scheduled interviews linked to applications.

This design ensures integrity, traceability, and efficient queries.

------------------------------------------------------------------------

## 🔀 Navigation Flow

Two main flows exist: **Companies** and **Applicants**.

![Navigation Flow](https://github.com/ProgramaConPid/JobFinder/blob/develop/Docs/Navigation-Diagram.jpg?raw=true)

**Flow explanation:**
- **Companies**: register/login, manage offers, track applications, view
stats, and edit profile.
- **Applicants**: register/login, manage profile, browse jobs, apply,
and track interviews.
- **Both**: simple login and logout functionality.

------------------------------------------------------------------------

## 📂 Project Structure
The repository is organized as follows:

```bash
JobFinder
 ┣ 📂 Docs
 ┣ 📂 src
 ┃ ┣ 📂 backend
 ┃ ┃ ┣ 📂 database
 ┃ ┃ ┃ ┗ 📜database.sql 
 ┃ ┃ ┗ 📜 server.js
 ┃ ┗ 📂 public
 ┃   ┣ 📂 assets
 ┃   ┣ 📂 css
 ┃   ┣ 📂 js
 ┃   ┣ 📂 views
 ┃   ┣ 📜 app.js
 ┃   ┗ 📜 index.html
 ┣ 📜 .gitnore
 ┣ 📜 netlify.toml
 ┣ 📜 package-lock.json
 ┣ 📜 package.json
 ┗ 📜 README.md
```

**Explanation:**
- **backend/** → API logic, routes, and controllers.
- **frontend/** → web app with UI components.
- **database/** → SQL scripts (schema & seed data).
- **docs/** → project documentation.

------------------------------------------------------------------------

## 🛠 Technologies

-   **Frontend**: HTML5, CSS3
-   **Backend**: JavaScript
-   **Database**: MySQL
-   **Version Control**: Git & GitHub
-   **Methodology**: Agile (Scrum)

------------------------------------------------------------------------

## ⚙️ Installation & Execution

### 📥 Download the Project

Clone the repository from GitHub:
```bash git clone https://github.com/your-username/jobfinder.git cdjobfinder ```

### 🔧 Backend Setup

```bash cd backend npm install # or for Python dependencies pipinstall -r requirements.txt ```

### 💻 Frontend Setup

```bash cd frontend npm install ```

### 🗄 Database Setup

1.  Create a MySQL database.
2.  Import the schema:
    ```bash mysql -u your_user -p your_database < database/schema.sql ```
3.  (Optional) Seed the database:
    ```bash mysql -u your_user -p your_database < database/seeds.sql ```

### 🚀 Run the Project

Run backend:
```bash npm start # or python app.py ```

Run frontend:
```bash npm start ```

The app will be available at:
👉 **Frontend:** `http://localhost:3000`
👉 **Backend API:** `http://localhost:5000`

------------------------------------------------------------------------

## 🚀 MVP (Minimum Viable Product)

The first version delivers:
- User registration/login.
- Candidate profile + CV upload.
- Job posting by companies.
- Basic job search & applications.
- Initial admin panel.

------------------------------------------------------------------------

## 📊 Expected Results

-   Improved employability for students and graduates.
-   Faster and more efficient recruitment.
-   Stronger company partnerships.
-   Better matching between candidates and offers.
-   Data insights for HR strategies.

------------------------------------------------------------------------

## 👨‍💻 Team  

**Team Name:** 🚀 *Breakpoint*

**Members:**
- **Kevin** *(Clan: Linus)* → Product Owner → Full stack
- **Pipe** *(Clan: Linus)* → Scrum Master → Full stack
- **Emanuel** *(Clan: Lovelace)* → Developer Frontend
- **Andres** *(Clan: Lovelace)* → Developer Frontend 
- **Samuel** *(Clan: Gosling)* → Developer Backend → Database

------------------------------------------------------------------------

## Figma  

Below you can see the figma that was developed to give us the bases of what was going to be the background of the project.

<a href="https://www.figma.com/design/Ots72SBiH994eJT2WIZnl1/JobFinder-Final-Design?m=auto&t=d3ZB0Nre7DoG41L4-1">
  <img src="https://github.com/ProgramaConPid/JobFinder/blob/develop/Docs/figma.png?raw=true" alt="Figma" width="80"/>
</a>


