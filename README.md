# Transaction Guardian

### Personal UPI Payment Firewall

Transaction Guardian is an intelligent transaction security platform that analyzes a user's payment behavior and identifies unusual or potentially risky transactions **before money is sent**.

> **“Does this payment make sense for you?”**

## Problem Statement

Digital payments such as UPI are widely used, but users can unknowingly pay:

* Unknown or new recipients
* Unusual amounts
* Suspicious payment requests
* At unusual times
* Through unexpected QR payment details

Traditional fraud detection focuses on generic fraud patterns. A transaction may be normal for one user but unusual for another.

## Proposed Solution

Transaction Guardian creates a **Personal Payment Fingerprint** from historical transactions and analyzes new payments against the user's normal:

* Transaction amounts
* Recipients
* Payment categories
* Transaction times
* Frequency and spending patterns

It combines machine learning and behavioral rules to generate an explainable risk score.

### Risk Levels

| Score  | Result       |
| ------ | ------------ |
| 0–40   | 🟢 SAFE      |
| 41–70  | 🟡 REVIEW    |
| 71–100 | 🔴 HIGH RISK |

The system identifies unusual behavior and recommends verification; it does **not** claim to definitively prove fraud.

## Key Features

* 🛡️ **Personal Payment Firewall** — evaluates payments against individual behavior.
* 📊 **Personal Payment Fingerprint** — learns normal payment patterns.
* 🔍 **Check Before You Pay** — checks UPI ID and amount before payment.
* 📷 **QR Code Analysis** — extracts UPI ID, payee, amount and reference details from QR codes.
* 🧠 **Behavioral Anomaly Detection** — detects deviations from normal activity.
* 👤 **New Recipient Detection** — identifies unfamiliar recipients.
* 💰 **Amount Analysis** — detects unusually large payments.
* ⏰ **Time & Velocity Analysis** — detects unusual times and transaction bursts.
* 📁 **Transaction History Analysis** — analyzes uploaded CSV transaction statements.
* 🔎 **Explainable Risk Results** — shows why a transaction was flagged.
* 📈 **Risk Insights & Analytics** — visualizes spending and risk patterns.

## How It Works

```text
Transaction / QR / History
          ↓
Transaction Processing
          ↓
Feature Engineering
          ↓
Personal Payment Fingerprint
          ↓
Unified Risk Engine
     ┌────┴────┐
     ↓         ↓
Isolation   Behavioral
 Forest       Rules
     └────┬────┘
          ↓
     Risk Fusion
          ↓
   Risk Score 0–100
          ↓
 SAFE / REVIEW / HIGH RISK
          ↓
 Explanation & Recommendation
```

## Technology Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, Recharts, Lucide React

**Backend:** Python, FastAPI, Pydantic, Uvicorn

**ML & Data:** Pandas, NumPy, Scikit-learn, Isolation Forest

**QR Processing:** OpenCV QRCodeDetector

**Tools & Deployment:** Git, GitHub, Postman, Vercel, Render

## Project Structure

```text
Transaction-Guardian/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── app/
│   ├── data/
│   └── requirements.txt
└── README.md
```

## Setup & Usage

### 1. Clone the Repository

```bash
git clone https://github.com/mohdkaif17/Transaction-Guardian.git
cd Transaction-Guardian
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8001
```

API documentation:

```text
http://127.0.0.1:8001/docs
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

### Environment Variable

Create `frontend/.env`:

```env
VITE_API_URL=http://127.0.0.1:8001
```

For production, set `VITE_API_URL` in Vercel to the deployed Render backend URL.

**Do not commit `.env` files or API keys.**

## Usage

### Check a Payment

Enter a UPI ID and amount → submit → receive the risk score, reasons and recommendation.

### Scan QR

Upload a UPI QR image → extract payment details → analyze the payment against the personal payment fingerprint.

### Analyze Transaction History

Upload a CSV transaction statement → generate behavioral patterns → identify anomalies and risk insights.

### Test a Transaction

Enter transaction details → compare against historical behavior → receive an immediate risk assessment.

## Security & Privacy

Transaction Guardian:

* Does not request UPI PINs or bank passwords.
* Does not initiate or process real payments.
* Does not directly access bank accounts.
* Only analyzes transaction information provided by the user.

## Future Scope

* Real-time authorized payment API integration
* User authentication and persistent profiles
* Database-backed transaction history
* Adaptive behavioral models
* Device and location intelligence
* Real-time alerts
* Mobile application
* Advanced fraud intelligence

## Team

### Team Dev Duo

* **Umme Rabiya**
* **Mohammad Kaif**

## Vision

> **“Don't just ask if the transaction is fraudulent. Ask if the transaction makes sense for you.”**

**Transaction Guardian — Your Personal UPI Payment Firewall.**
