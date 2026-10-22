================================================================
  WELLORA — HOW TO START THE WEBSITE & BACKEND
================================================================

PREREQUISITES:
  - Node.js (v18+ or v20+ recommended)
  - npm

================================================================
OPTION 1: QUICK ONE-CLICK START (RECOMMENDED)
================================================================

1. Open PowerShell in the project root directory:
     d:\Projects\Wellora-NutriFlow-AI

2. Run the startup script:
     powershell -ExecutionPolicy Bypass -File .\start.ps1

   (This automatically launches both Backend and Frontend in separate windows)

================================================================
OPTION 2: MANUAL START (STEP-BY-STEP)
================================================================

--- STEP 1: Start Backend Server ---
1. Open a PowerShell terminal and navigate to backend:
     cd Backend

2. (First time only) Install packages & generate Prisma client:
     npm install
     npx prisma generate

3. Start the backend development server:
     npm run dev

   -> Backend runs at:  http://localhost:3001
   -> Health Check:     http://localhost:3001/api/health


--- STEP 2: Start Frontend Website ---
1. Open a SECOND PowerShell terminal and navigate to frontend:
     cd frontend

2. (First time only) Install packages:
     npm install

3. Start the frontend development server:
     npm run dev

   -> Frontend runs at: http://localhost:5173
   -> Open http://localhost:5173 in your browser to view the website!

================================================================
DEMO LOGIN CREDENTIALS
================================================================

• Customer / Patient Account:
    Email:    priya@wellora.ai
    Password: password123

• Administrator Account:
    Email:    admin@wellora.ai
    Password: password123

================================================================
KEY BACKEND API ENDPOINTS
================================================================
  GET    /api/health                - Health check
  POST   /api/auth/login            - User & Admin Login
  POST   /api/auth/register         - User Registration
  GET    /api/auth/me               - Current User Info
  GET    /api/meals                 - Recommended Meals & Menu
  GET    /api/restaurants           - Restaurant List
  POST   /api/orders                - Place Food/Grocery Orders
  GET    /api/orders                - Order History
  GET    /api/nutrition/daily       - Daily Nutrition Tracking
  POST   /api/nutrition/log         - Log Meals/Calories
  GET    /api/grocery/products      - Grocery Catalog
  GET    /api/doctors               - Doctor & Specialist Directory
  POST   /api/doctors/appointments - Book Doctor Consultation
  POST   /api/ai/chat               - Wellora AI Health Assistant
  GET    /api/health-profile        - User Health & Biometric Data
  PUT    /api/health-profile        - Update Health Profile
  POST   /api/meal-plans/generate   - AI Meal Plan Generator
  GET    /api/meal-plans/weekly     - Weekly Meal Schedule

================================================================
TROUBLESHOOTING
================================================================
1. "Port 3001 or 5173 already in use":
   Close existing node processes or restart terminal.

2. "PrismaClientInitializationError":
   Run in Backend folder:
     npx prisma generate

3. "Missing dependencies / Module not found":
   Run `npm install` inside both `Backend` and `frontend` folders.
================================================================
