import os
import shutil
import uuid
import base64

from dotenv import load_dotenv

from fastapi import (
    FastAPI,
    UploadFile,
    File,
    Form,
    Request
)

from pydantic import BaseModel

from app.services.pdf_extractor import (
    extract_text_from_pdf,
    extract_tables_from_pdf
)

from app.services.ocr_service import (
    extract_text_using_ocr
)

from app.services.parser import (
    clean_text,
    extract_data_with_llm
)

# ---------------------------------------------------
# LOAD ENV VARIABLES
# ---------------------------------------------------
load_dotenv()

app = FastAPI(
    title="PDF Information Extraction API",
    description="Upload PDFs and extract structured information using OCR and LLM",
    version="1.0.0"
)

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


# ---------------------------------------------------
# BASE64 REQUEST MODEL
# ---------------------------------------------------
class Base64PDFRequest(BaseModel):
    filename: str
    pdf_data: str
    keyword: str = ""


# ---------------------------------------------------
# HOME ROUTE
# ---------------------------------------------------
@app.get("/")
def home():
    return {
        "message": "PDF Extraction API is running successfully"
    }


# ---------------------------------------------------
# FORM-DATA PDF UPLOAD
# ---------------------------------------------------
@app.post("/parse-pdf")
async def parse_pdf(
    file: UploadFile = File(...),
    keyword: str = Form("")
):
    try:

        if not file.filename.lower().endswith(".pdf"):
            return {
                "status": "error",
                "message": "Only PDF files are allowed"
            }

        file_path = os.path.join(
            UPLOAD_DIR,
            file.filename
        )

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(
                file.file,
                buffer
            )

        extracted_text = extract_text_from_pdf(
            file_path
        )

        if extracted_text.strip():
            document_type = "text_pdf"
        else:
            document_type = "scanned_pdf"
            extracted_text = extract_text_using_ocr(
                file_path
            )

        cleaned_text = clean_text(
            extracted_text
        )

        llm_extracted_data = extract_data_with_llm(
            cleaned_text,
            keyword.strip()
        )

        return {
            "status": "success",
            "upload_mode": "form-data",
            "filename": file.filename,
            "document_type": document_type,
            "keyword": keyword if keyword.strip() else None,
            "extracted_data": llm_extracted_data,
            "preview_text": cleaned_text[:1000]
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


# ---------------------------------------------------
# RAW BINARY PDF UPLOAD
# ---------------------------------------------------
@app.post("/parse-pdf-binary")
async def parse_pdf_binary(
    request: Request,
    keyword: str = ""
):
    try:

        pdf_bytes = await request.body()

        if not pdf_bytes:
            return {
                "status": "error",
                "message": "No PDF data received"
            }

        filename = f"{uuid.uuid4()}.pdf"

        file_path = os.path.join(
            UPLOAD_DIR,
            filename
        )

        with open(file_path, "wb") as f:
            f.write(pdf_bytes)

        extracted_text = extract_text_from_pdf(
            file_path
        )

        if extracted_text.strip():
            document_type = "text_pdf"
        else:
            document_type = "scanned_pdf"
            extracted_text = extract_text_using_ocr(
                file_path
            )

        cleaned_text = clean_text(
            extracted_text
        )

        llm_extracted_data = extract_data_with_llm(
            cleaned_text,
            keyword.strip()
        )

        return {
            "status": "success",
            "upload_mode": "binary",
            "filename": filename,
            "document_type": document_type,
            "keyword": keyword if keyword else None,
            "extracted_data": llm_extracted_data,
            "preview_text": cleaned_text[:1000]
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


# ---------------------------------------------------
# BASE64 PDF UPLOAD
# ---------------------------------------------------
@app.post("/parse-pdf-base64")
async def parse_pdf_base64(
    request_data: Base64PDFRequest
):
    try:

        pdf_bytes = base64.b64decode(
            request_data.pdf_data
        )

        file_path = os.path.join(
            UPLOAD_DIR,
            request_data.filename
        )

        with open(file_path, "wb") as f:
            f.write(pdf_bytes)

        extracted_text = extract_text_from_pdf(
            file_path
        )

        if extracted_text.strip():
            document_type = "text_pdf"
        else:
            document_type = "scanned_pdf"
            extracted_text = extract_text_using_ocr(
                file_path
            )

        cleaned_text = clean_text(
            extracted_text
        )

        llm_extracted_data = extract_data_with_llm(
            cleaned_text,
            request_data.keyword.strip()
        )

        return {
            "status": "success",
            "upload_mode": "base64",
            "filename": request_data.filename,
            "document_type": document_type,
            "keyword": request_data.keyword if request_data.keyword.strip() else None,
            "extracted_data": llm_extracted_data,
            "preview_text": cleaned_text[:1000]
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }