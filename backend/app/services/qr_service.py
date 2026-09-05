import urllib.parse
import cv2
import numpy as np
from pyzbar import pyzbar
from typing import Dict, Any, Optional


def decode_qr(image_bytes: bytes) -> str:
    """
    Reads an image from bytes using OpenCV, decodes any QR code found using pyzbar
    (with OpenCV QRCodeDetector fallback), and returns the raw decoded string.
    Raises ValueError if no QR code is found or if the image is invalid.
    """
    if not image_bytes:
        raise ValueError("Empty image data received")

    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if img is None:
        raise ValueError("Invalid image file: unable to decode image with OpenCV")

    # Primary decode attempt using pyzbar
    try:
        decoded_objs = pyzbar.decode(img)
        if decoded_objs:
            for obj in decoded_objs:
                if obj.type == 'QRCODE' or obj.data:
                    raw_data = obj.data.decode("utf-8")
                    if raw_data:
                        return raw_data
    except Exception:
        # Fallback to OpenCV QRCodeDetector if pyzbar fails or lacks DLLs
        pass

    # Secondary decode fallback using OpenCV QRCodeDetector
    detector = cv2.QRCodeDetector()
    val, pts, _ = detector.detectAndDecode(img)
    if val:
        return val

    # Convert to grayscale & try again with pyzbar/OpenCV for low-contrast QRs
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    try:
        decoded_objs_gray = pyzbar.decode(gray)
        if decoded_objs_gray:
            for obj in decoded_objs_gray:
                raw_data = obj.data.decode("utf-8")
                if raw_data:
                    return raw_data
    except Exception:
        pass

    val_gray, _, _ = detector.detectAndDecode(gray)
    if val_gray:
        return val_gray

    raise ValueError("No QR code found in the image")


def parse_upi_payload(raw_string: str) -> Dict[str, Any]:
    """
    Parses a raw UPI QR string in the format:
    upi://pay?pa=<payee-vpa>&pn=<payee-name>&am=<amount>&cu=<currency>&tr=<ref>
    
    Extracts present fields into a dict. If not a valid upi:// payload,
    returns a clear 'not a UPI QR code' result rather than crashing.
    """
    if not raw_string or not isinstance(raw_string, str):
        return {
            "is_upi": False,
            "error": "Empty or invalid raw payload string",
            "upi_id": None,
            "payee_name": None,
            "amount": None,
            "currency": None,
            "reference": None,
            "payment_direction": "OUTGOING"
        }

    raw_cleaned = raw_string.strip()
    if not raw_cleaned.lower().startswith("upi://"):
        return {
            "is_upi": False,
            "error": "Not a valid UPI QR code",
            "raw": raw_cleaned,
            "upi_id": None,
            "payee_name": None,
            "amount": None,
            "currency": None,
            "reference": None,
            "payment_direction": "OUTGOING"
        }

    try:
        parsed_url = urllib.parse.urlparse(raw_cleaned)
        query_params = urllib.parse.parse_qs(parsed_url.query)

        pa_list = query_params.get("pa", [])
        pn_list = query_params.get("pn", [])
        am_list = query_params.get("am", [])
        cu_list = query_params.get("cu", [])
        tr_list = query_params.get("tr", [])

        upi_id = pa_list[0].strip() if pa_list and pa_list[0] else None
        payee_name = urllib.parse.unquote(pn_list[0]).strip() if pn_list and pn_list[0] else None
        
        amount: Optional[float] = None
        if am_list and am_list[0]:
            try:
                amount = float(am_list[0].strip())
            except ValueError:
                amount = None

        currency = cu_list[0].strip() if cu_list and cu_list[0] else "INR"
        reference = tr_list[0].strip() if tr_list and tr_list[0] else None

        if not upi_id:
            return {
                "is_upi": False,
                "error": "Missing VPA (pa parameter) in UPI payload",
                "raw": raw_cleaned,
                "upi_id": None,
                "payee_name": payee_name,
                "amount": amount,
                "currency": currency,
                "reference": reference,
                "payment_direction": "OUTGOING"
            }

        return {
            "is_upi": True,
            "upi_id": upi_id,
            "payee_name": payee_name or upi_id,
            "amount": amount,
            "currency": currency,
            "reference": reference,
            "payment_direction": "OUTGOING"
        }
    except Exception as e:
        return {
            "is_upi": False,
            "error": f"Failed to parse UPI payload: {str(e)}",
            "raw": raw_cleaned,
            "upi_id": None,
            "payee_name": None,
            "amount": None,
            "currency": None,
            "reference": None,
            "payment_direction": "OUTGOING"
        }
