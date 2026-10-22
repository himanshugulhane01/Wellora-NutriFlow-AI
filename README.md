# 🥗 Wellora — Autonomous AI Clinical Health & Food Intelligence

## 🚀 How to Start the Website

### Option 1: One-Click Quick Start (PowerShell)
From the project root:
```powershell
powershell -ExecutionPolicy Bypass -File .\start.ps1
```
This automatically launches both the **Backend** and **Frontend** in separate windows.

---

### Option 2: Manual Start

#### 1. Start the Backend Server
```powershell
cd Backend
npm install          # (First time only)
npx prisma generate  # (First time only)
npm run dev
```
- **Backend API**: [http://localhost:3001](http://localhost:3001)
- **Health Check**: [http://localhost:3001/api/health](http://localhost:3001/api/health)

#### 2. Start the Frontend Website
In a second terminal:
```powershell
cd frontend
npm install          # (First time only)
npm run dev
```
- **Frontend App**: [http://localhost:5173](http://localhost:5173)

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **User / Patient** | `priya@wellora.ai` | `password123` |
| **Admin** | `admin@wellora.ai` | `password123` |

---

## 🛠️ Project Structure
```
Wellora-NutriFlow-AI/
├── Backend/                 # Express + Prisma + SQLite Backend API
├── frontend/                # React + Vite + TailwindCSS Frontend Application
├── start.ps1                # One-click startup script for Windows PowerShell
├── README.txt               # Plain text startup guide
├── HOW_TO_START.txt         # Quick reference guide
└── README.md                # Markdown project documentation
```