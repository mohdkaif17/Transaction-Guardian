from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, UploadFile, File, Form

from app.models.schemas import QRAnalyzeResponse, QRDecodedPayload
from app.services.qr_service import decode_qr, parse_upi_payload
from app.risk.risk_engine import analyze_transaction

router = APIRouter(prefix="/api/qr", tags=["QR Code"])


@router.post("/analyze", response_model=QRAnalyzeResponse)
async def analyze_qr_code(
    file: UploadFile = File(...),
    amount: Optional[float] = Form(None),
    category: Optional[str] = Form(None)
):
    """
    POST /api/qr/analyze
    Accepts an uploaded QR code image file, decodes the QR, parses the UPI payload,
    determines payment amount (from QR or manual input), passes transaction payload
    through analyze_transaction(), and returns clearly separated 'decoded' and 'risk_result' sections.
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        # Still attempt to read if extension is image
        valid_exts = (".png", ".jpg", ".jpeg", ".webp", ".bmp", ".gif")
        if not file.filename or not file.filename.lower().endswith(valid_exts):
            raise HTTPException(status_code=400, detail="Uploaded file must be a valid image format.")

    try:
        image_bytes = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read uploaded file: {str(e)}")

    # 1. Decode QR code from image
    try:
        raw_qr_string = decode_qr(image_bytes)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"QR decoding error: {str(e)}")

    # 2. Parse UPI payload from raw string
    parsed_payload = parse_upi_payload(raw_qr_string)
    if not parsed_payload.get("is_upi"):
        raise HTTPException(
            status_code=400,
            detail=parsed_payload.get("error", "Not a valid UPI QR code")
        )

    # 3. Determine amount (from QR or manual form parameter)
    qr_amount = parsed_payload.get("amount")
    final_amount = qr_amount if qr_amount is not None else amount

    if final_amount is None or final_amount <= 0:
        raise HTTPException(
            status_code=400,
            detail="Amount is missing from QR code payload. Please provide manual 'amount' field."
        )

    # 4. Build transaction dictionary and analyze using the SAME risk engine
    tx_payload = {
        "amount": float(final_amount),
        "recipient": parsed_payload.get("payee_name") or parsed_payload.get("upi_id"),
        "upi_id": parsed_payload.get("upi_id"),
        "category": category if category and category.strip() != "Unknown" else "Transfer",
        "timestamp": datetime.now().isoformat(),
        "source": "UPI"
    }

    try:
        risk_result = analyze_transaction(tx_payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Risk analysis failed: {str(e)}")

    # 5. Build response with clearly separate 'decoded' and 'risk_result' sections
    decoded = QRDecodedPayload(
        success=True,
        upi_id=parsed_payload.get("upi_id"),
        payee_name=parsed_payload.get("payee_name"),
        amount=qr_amount,  # Original amount parsed from QR (or None if missing)
        currency=parsed_payload.get("currency", "INR"),
        reference=parsed_payload.get("reference"),
        payment_direction="OUTGOING"
    )

    return QRAnalyzeResponse(
        decoded=decoded,
        risk_result=risk_result
    )
