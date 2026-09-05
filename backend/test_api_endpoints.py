import urllib.request
import urllib.parse
import json
import os
import io

BASE_URL = "http://127.0.0.1:8000"

def test_health():
    url = f"{BASE_URL}/api/health"
    req = urllib.request.Request(url, method="GET")
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        print("\n--- GET /api/health ---")
        print(json.dumps(data, indent=2))
        assert data.get("status") == "ok"

def test_profile():
    url = f"{BASE_URL}/api/profile"
    req = urllib.request.Request(url, method="GET")
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        print("\n--- GET /api/profile ---")
        print(json.dumps(data, indent=2))
        assert "average_amount" in data
        assert "common_categories" in data

def test_analyze():
    url = f"{BASE_URL}/api/transactions/analyze"
    payload = {
        "amount": 350.00,
        "recipient": "Swiggy Food Order",
        "category": "Food",
        "timestamp": "2026-09-03T20:00:00Z",
        "source": "UPI"
    }
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        print("\n--- POST /api/transactions/analyze ---")
        print(json.dumps(data, indent=2))
        assert "risk_score" in data
        assert "risk_level" in data
        assert "signals" in data

def test_upload():
    url = f"{BASE_URL}/api/transactions/upload"
    boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
    
    csv_content = (
        "Date,Time,Amount,Type,Payee,Reference,Balance\n"
        "2026-09-01,10:15:30,120.50,DEBIT,Swiggy Food Order,REF1001,4879.50\n"
        "2026-09-02,02:05:00,7500.00,DEBIT,Unknown Off-Shore Wallet,REF1002,2364.30\n"
    )

    body_parts = []
    body_parts.append(f"--{boundary}\r\n".encode("utf-8"))
    body_parts.append('Content-Disposition: form-data; name="file"; filename="test_transactions.csv"\r\n'.encode("utf-8"))
    body_parts.append("Content-Type: text/csv\r\n\r\n".encode("utf-8"))
    body_parts.append(csv_content.encode("utf-8"))
    body_parts.append(f"\r\n--{boundary}--\r\n".encode("utf-8"))
    
    body = b"".join(body_parts)
    headers = {"Content-Type": f"multipart/form-data; boundary={boundary}"}

    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        print("\n--- POST /api/transactions/upload ---")
        print(json.dumps(data, indent=2))
        assert "total_count" in data
        assert "counts" in data
        assert len(data["results"]) == 2

if __name__ == "__main__":
    test_health()
    test_profile()
    test_analyze()
    test_upload()
    print("\n[SUCCESS] All FastAPI endpoints verified successfully against live Uvicorn server!")
