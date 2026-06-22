# 🚀 Smart Finance Tracker

A premium **Full-Stack Personal Finance Dashboard** application built using **ReactJS (Vite + Tailwind CSS)**, **Java (Spring Boot)**, and **MySQL**. Is project ko Google Antigravity एआई-एजेंट की मदद से "Zero to One" आर्किटेक्चर पर बनाया गया है।

---

## ✨ Features

- **Dynamic Dashboard:** Aapke expenses (खर्चों) ka category ke hisab se sundar SVG/Chart analysis.
- **Full CRUD Operations:** New expense entries ko add karna, view karna aur instantly delete karna.
- **Full-Stack Integration:** React frontend Axios ke jariye Java REST APIs se securely baat karta hai.
- **Auto Database Creation:** Hibernate DDL-Auto ke jariye MySQL tables apne aap background me ban jati hain.
- **Premium UI:** Tailwind CSS par aadharit ekdam modern aur responsive dark-themed interface.

---

## 🛠️ Tech Stack

- **Frontend:** ReactJS (Vite), Tailwind CSS, Axios
- **Backend:** Java 21, Spring Boot (Spring Web, Spring Data JPA)
- **Database:** MySQL Server

---

## 🚀 Step-by-Step Setup Guide

Is project ko kisi bhi naye computer ya system par chalane ke liye niche diye gaye steps ko bilkul isi order me follow karein:

### Step 1: Install Prerequisites
Shuru karne se pehle aapke computer me ye software installed hone chahiye:
1. **Node.js** (v18 ya usse upar)
2. **Java JDK 21**
3. **MySQL Server**

---

### Step 2: Clone the Project
Apna terminal (Command Prompt / PowerShell) kholein aur us folder me jayein jahan project rakhna hai. Phir ye command chalayein:
```bash
git clone https://github.com
cd smart-finance-tracker
```

---

### 🗄️ Step 3: Database Configuration
1. Apna MySQL Workbench ya MySQL Command Line Client kholein.
2. Ek khali database banane ke liye ye SQL command chalayein:
   ```sql
   CREATE DATABASE personal_finance_db;
   ```
3. Cloned repository ko apne code editor (jaise VS Code) me kholein aur is file par jayein: `backend/src/main/resources/application.properties`
4. Is file me `YOUR_MYSQL_PASSWORD` ko hata kar apne local MySQL ka asli password likhein aur save kar dein:
   ```properties
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```

---

### ☕ Step 4: Run the Java Backend
1. Ek **naya terminal window (Terminal 1)** kholein.
2. Backend directory ke andar jayein:
   ```bash
   cd backend
   ```
3. Spring Boot application ko start karne ke liye apne OS ke hisab se command chalayein:
   - **Windows par:** `mvnw.cmd spring-boot:run`
   - **Mac/Linux par:** `./mvnw spring-boot:run`

*(Note: Aapka backend server start ho kar **Port 8081** par live ho jayega).*

---

### ⚛️ Step 5: Run the React Frontend
1. Ek aur **naya terminal window (Terminal 2)** kholein.
2. Frontend directory ke andar jayein:
   ```bash
   cd frontend
   ```
3. Sabhi jaroori node module dependencies ko install karne ke liye ye command chalayein:
   ```bash
   npm install
   ```
4. Local Vite development server ko chalane ke liye ye command chalayein:
   ```bash
   npm run dev
   ```

*(Note: Aapka frontend development server **Port 5173** पर spin up ho jayega).*

---

## 🌐 Test the Application
Dono servers chalne ke baad, apna web browser (jaise Google Chrome) kholein aur address bar me type karein:
```text
http://localhost:5173
```
Ab aap apne live dashboard se expenses ko add ya delete karke is full-stack pipeline ka pura test kar sakte hain!
