import urllib.parse
import cv2
import numpy as np
from typing import Dict, Any, Optional

# Try importing pyzbar optionally so missing system C-library (libzbar) doesn't crash app startup
try:
    from pyzbar import pyzbar
    HAS_PYZBAR = True
except Exception:
    pyzbar = None
    HAS_PYZBAR = False


def decode_qr(image_bytes: bytes) -> str:
    """
    Reads an image from bytes using OpenCV, decodes any QR code found using multi-scale
    pyzbar, OpenCV QRCodeDetector & Thresholding pipeline, returning the raw decoded string.
    Raises ValueError if no QR code is found or if the image is invalid.
    """
    if not image_bytes:
        raise ValueError("Empty image data received")

    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if img is None:
        raise ValueError("Invalid image file: unable to decode image with OpenCV")

    detector = cv2.QRCodeDetector()

    # Pre-generate image variations (Original, Resized, Grayscale, Thresholded)
    images_to_try = [img]

    # Scale high-resolution images down to ~1024px for faster, more accurate matrix detection
    h, w = img.shape[:2]
    if max(h, w) > 1024:
        scale = 1024.0 / max(h, w)
        resized = cv2.resize(img, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)
        images_to_try.append(resized)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    images_to_try.append(gray)

    # Otsu Binarization for low-contrast/glare QR codes
    try:
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        images_to_try.append(thresh)
    except Exception:
        pass

    # 1. Primary decode attempt using pyzbar (if available on system)
    if HAS_PYZBAR and pyzbar is not None:
        for target_img in images_to_try:
            try:
                decoded_objs = pyzbar.decode(target_img)
                if decoded_objs:
                    for obj in decoded_objs:
                        if obj.data:
                            raw_data = obj.data.decode("utf-8").strip()
                            if raw_data:
                                return raw_data
            except Exception:
                pass

    # 2. Secondary decode fallback using OpenCV QRCodeDetector (Single & Multi-QR)
    for target_img in images_to_try:
        try:
            val, pts, _ = detector.detectAndDecode(target_img)
            if val and val.strip():
                return val.strip()
        except Exception:
            pass

        try:
            ok, decoded_info, _, _ = detector.detectAndDecodeMulti(target_img)
            if ok and decoded_info:
                for info in decoded_info:
                    if info and info.strip():
                        return info.strip()
        except Exception:
            pass

    raise ValueError("No QR code detected in the image. Please upload a clear image of a UPI QR code.")


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
        # Standardize URL structure for urlparse if upi://pay? or upi://pay/?
        url_str = raw_cleaned
        if url_str.lower().startswith("upi://pay/?"):
            url_str = url_str.replace("upi://pay/?", "upi://pay?", 1)

        parsed_url = urllib.parse.urlparse(url_str)
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
