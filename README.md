# 🚀 Smart Finance Tracker

A modern and premium **Full-Stack Personal Finance Dashboard** application built using **ReactJS (Vite + Tailwind CSS)**, **Java (Spring Boot)**, and **MySQL**. This project was developed using an agent-first architecture with Google Antigravity.

---

## ✨ Features

- **Dynamic Dashboard:** Clean visual analysis of your expenses categorized using a customized SVG/Chart interface.
- **Full CRUD Operations:** Add, view, and instantly delete expense transactions in real-time.
- **Full-Stack Integration:** React frontend communicates securely with Java REST APIs via Axios.
- **Auto Database Creation:** Automatic MySQL table generation handled seamlessly by Hibernate DDL-Auto configuration.
- **Premium UI:** Sleek and responsive dark-themed interface built entirely with Tailwind CSS.

---

## 🛠️ Tech Stack

- **Frontend:** ReactJS (Vite), Tailwind CSS, Axios
- **Backend:** Java 21, Spring Boot (Spring Web, Spring Data JPA)
- **Database:** MySQL Server

---

## 🚀 Step-by-Step Setup Guide

Follow these exact steps to clone, configure, and run this project on any new machine or system:

### Step 1: Install Prerequisites
Before getting started, ensure you have the following software installed on your system:
1. **Node.js** (v18 or higher)
2. **Java JDK 21**
3. **MySQL Server**

---

### Step 2: Clone the Project
Open your terminal (Command Prompt / PowerShell) and navigate to the directory where you want to keep the project. Run:
```bash
git clone https://github.com
cd smart-finance-tracker
```

---

### 🗄️ Step 3: Database Configuration
1. Open your MySQL Workbench or MySQL Command Line Client.
2. Execute the following SQL command to create an empty database:
   ```sql
   CREATE DATABASE personal_finance_db;
   ```
3. Open the cloned repository in your code editor (e.g., VS Code) and open the file located at: `backend/src/main/resources/application.properties`.
4. Update the datasource password line by replacing `YOUR_MYSQL_PASSWORD` with your actual local MySQL database password:
   ```properties
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```

---

### ☕ Step 4: Run the Java Backend
1. Open a **new terminal window (Terminal 1)**.
2. Navigate into the backend directory:
   ```bash
   cd backend
   ```
3. Boot up the Spring Boot application by running the appropriate command for your OS:
   - **On Windows:** `mvnw.cmd spring-boot:run`
   - **On Mac/Linux:** `./mvnw spring-boot:run`

*(Note: The backend server will start and listen on **Port 8081**).*

---

### ⚛️ Step 5: Run the React Frontend
1. Open another **new terminal window (Terminal 2)**.
2. Navigate into the frontend directory:
   ```bash
   cd frontend
   ```
3. Install all the necessary node module dependencies:
   ```bash
   npm install
   ```
4. Start the local Vite development server:
   ```bash
   npm run dev
   ```

*(Note: The frontend development server will spin up on **Port 5173**).*

---

## 🌐 Test the Application
Once both servers are running, open your web browser (e.g., Google Chrome) and go to:
```text
http://localhost:5173
```
You can now start testing the full-stack pipeline by adding or deleting expense items directly from your live dashboard!
