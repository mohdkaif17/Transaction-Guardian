import io
import qrcode
from fastapi.testclient import TestClient

from app.main import app
from app.services.qr_service import decode_qr, parse_upi_payload


def generate_qr_bytes(upi_string: str) -> bytes:
    """Generates PNG image bytes for a given string using qrcode."""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(upi_string)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    return buffer.getvalue()


def test_qr_decoding_and_parsing():
    print("\n--- 1. Testing QR Decoding & Parsing ---")

    # Test payload 1: Full UPI payload with amount
    payload_1 = "upi://pay?pa=swiggy@icici&pn=Swiggy%20Foods&am=1250.00&cu=INR&tr=TXN987654321"
    img_bytes_1 = generate_qr_bytes(payload_1)
    
    decoded_raw_1 = decode_qr(img_bytes_1)
    parsed_1 = parse_upi_payload(decoded_raw_1)
    
    print("Payload 1 Decoded Output:")
    print(f"  Raw: {decoded_raw_1}")
    print(f"  Parsed: {parsed_1}\n")
    
    assert decoded_raw_1 == payload_1
    assert parsed_1["is_upi"] is True
    assert parsed_1["upi_id"] == "swiggy@icici"
    assert parsed_1["payee_name"] == "Swiggy Foods"
    assert parsed_1["amount"] == 1250.0
    assert parsed_1["currency"] == "INR"
    assert parsed_1["reference"] == "TXN987654321"
    assert parsed_1["payment_direction"] == "OUTGOING"

    # Test payload 2: Payload missing amount
    payload_2 = "upi://pay?pa=store@ybl&pn=Corner%20Store&cu=INR&tr=REF112233"
    img_bytes_2 = generate_qr_bytes(payload_2)
    
    decoded_raw_2 = decode_qr(img_bytes_2)
    parsed_2 = parse_upi_payload(decoded_raw_2)
    
    print("Payload 2 (No Amount) Decoded Output:")
    print(f"  Raw: {decoded_raw_2}")
    print(f"  Parsed: {parsed_2}\n")
    
    assert parsed_2["is_upi"] is True
    assert parsed_2["upi_id"] == "store@ybl"
    assert parsed_2["payee_name"] == "Corner Store"
    assert parsed_2["amount"] is None

    # Test payload 3: Non-UPI string
    payload_3 = "https://example.com/not-a-upi-qr"
    img_bytes_3 = generate_qr_bytes(payload_3)
    decoded_raw_3 = decode_qr(img_bytes_3)
    parsed_3 = parse_upi_payload(decoded_raw_3)
    
    print("Payload 3 (Non-UPI) Decoded Output:")
    print(f"  Raw: {decoded_raw_3}")
    print(f"  Parsed: {parsed_3}\n")
    
    assert parsed_3["is_upi"] is False
    assert "Not a valid UPI QR code" in parsed_3["error"]


def test_qr_api_endpoint():
    print("--- 2. Testing POST /api/qr/analyze Endpoint ---")
    client = TestClient(app)

    # Test Case A: Upload QR Image 1 with full payload (amount included)
    payload_1 = "upi://pay?pa=swiggy@icici&pn=Swiggy%20Foods&am=1250.00&cu=INR&tr=TXN987654321"
    img_bytes_1 = generate_qr_bytes(payload_1)
    
    response_1 = client.post(
        "/api/qr/analyze",
        files={"file": ("qr_swiggy.png", img_bytes_1, "image/png")}
    )
    print(f"Endpoint Test A Status: {response_1.status_code}")
    res_json_1 = response_1.json()
    print("Endpoint Test A JSON Output:")
    print(res_json_1, "\n")
    
    assert response_1.status_code == 200
    assert "decoded" in res_json_1
    assert "risk_result" in res_json_1
    assert res_json_1["decoded"]["success"] is True
    assert res_json_1["decoded"]["upi_id"] == "swiggy@icici"
    assert res_json_1["decoded"]["payee_name"] == "Swiggy Foods"
    assert res_json_1["decoded"]["amount"] == 1250.0
    assert res_json_1["decoded"]["payment_direction"] == "OUTGOING"
    assert "risk_score" in res_json_1["risk_result"]
    assert "risk_level" in res_json_1["risk_result"]

    # Test Case B: Upload QR Image 2 (no amount in QR) + manual amount parameter=450.0
    payload_2 = "upi://pay?pa=merchant_xyz@okaxis&pn=Local%20Vendor&cu=INR"
    img_bytes_2 = generate_qr_bytes(payload_2)
    
    response_2 = client.post(
        "/api/qr/analyze",
        files={"file": ("qr_vendor.png", img_bytes_2, "image/png")},
        data={"amount": "450.00", "category": "Shopping"}
    )
    print(f"Endpoint Test B Status: {response_2.status_code}")
    res_json_2 = response_2.json()
    print("Endpoint Test B JSON Output:")
    print(res_json_2, "\n")
    
    assert response_2.status_code == 200
    assert res_json_2["decoded"]["amount"] is None  # decoded QR itself has no amount
    assert res_json_2["risk_result"]["amount"] == 450.0  # manual amount fed into risk engine
    assert res_json_2["risk_result"]["recipient"] == "Local Vendor"

    # Test Case C: High Risk QR (amount 25000.0)
    payload_3 = "upi://pay?pa=unknown_crypto@okaxis&pn=Crypto%20Hub&am=25000.00&cu=INR"
    img_bytes_3 = generate_qr_bytes(payload_3)
    
    response_3 = client.post(
        "/api/qr/analyze",
        files={"file": ("qr_crypto.png", img_bytes_3, "image/png")}
    )
    print(f"Endpoint Test C Status: {response_3.status_code}")
    res_json_3 = response_3.json()
    print("Endpoint Test C JSON Output:")
    print(res_json_3, "\n")
    
    assert response_3.status_code == 200
    assert res_json_3["risk_result"]["risk_level"] in ["HIGH_RISK", "REVIEW"]

    print("ALL TESTS PASSED SUCCESSFULLY!")


if __name__ == "__main__":
    test_qr_decoding_and_parsing()
    test_qr_api_endpoint()
