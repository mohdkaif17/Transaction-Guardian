# Transaction Guardian 🛡️
**Personal UPI Payment Firewall & Real-time Behavioral Anomaly Detection**

Transaction Guardian learns how you normally pay and warns you when a payment doesn't look like you — before your money leaves your account.

---

## 🏗️ Architecture

The repository is organized into a clean decoupled frontend and backend:

- **`frontend/`**: React + TypeScript + Vite + Tailwind CSS dashboard & interactive payment safety UI.
- **`backend/`**: Python FastAPI + scikit-learn Isolation Forest ML engine for transaction risk scoring, behavioral profile baselining, and QR scanning evaluation.

---

## 🚀 Quick Start (Local Development)

### 1. Run Backend (FastAPI)
```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

### 2. Run Frontend (React + Vite)
```bash
# From project root:
npm run dev

# Or inside frontend folder:
cd frontend
npm run dev
```

Visit `http://localhost:5173/` in your browser.

---

## 🌐 Deployment Setup

- **Frontend (Vercel)**: Set Root Directory to `frontend`.
- **Backend (Render)**: Set Root Directory to `backend` and build command to `pip install -r requirements.txt`.
