import os
import shutil
from dotenv import load_dotenv

from fastapi import FastAPI, UploadFile, File, Form

from app.services.pdf_extractor import extract_text_from_pdf, extract_tables_from_pdf
from app.services.ocr_service import extract_text_using_ocr
from app.services.parser import (
    clean_text,
    extract_data_with_llm
)

# Load environment variables
load_dotenv()

app = FastAPI(
    title="PDF Information Extraction API",
    description="Upload a PDF and extract important details in JSON format using LLM",
    version="1.0.0"
)


UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.get("/")
def home():
    return {
        "message": "PDF Extraction API is running successfully"
    }


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

        file_path = os.path.join(UPLOAD_DIR, file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Extract raw text
        extracted_text = extract_text_from_pdf(file_path)

        if extracted_text.strip():
            document_type = "text_pdf"
        else:
            document_type = "scanned_pdf"
            extracted_text = extract_text_using_ocr(file_path)

        cleaned_text = clean_text(extracted_text)

        # Extract intelligent data via LLM
        llm_extracted_data = extract_data_with_llm(cleaned_text, keyword.strip())

        return {
            "status": "success",
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