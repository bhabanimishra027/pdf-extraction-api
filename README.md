# PDF Information Extraction API

# AI-Powered PDF Information Extraction API

## Overview

This project is a FastAPI-based PDF Information Extraction API that processes both text-based and scanned PDF documents. It uses OCR and Generative AI to extract structured information and return the results in JSON format.

The API supports multiple file upload methods including Form Data, Binary Upload, and Base64 Upload.

---

## Features

* Extract text from text-based PDFs
* OCR support for scanned PDFs
* AI-powered document understanding using Gemini
* Dynamic keyword-based information extraction
* Structured JSON responses
* Supports:

  * Multipart/Form-Data Upload
  * Raw Binary Upload
  * Base64 Upload
* Dockerized deployment
* Postman and Swagger testing support
* Cloud deployment using Render

---

## Project Architecture

```text
Client
│
├── Form Data Upload
├── Binary Upload
└── Base64 Upload
        │
        ▼
FastAPI Backend
        │
        ▼
PDF Processing Layer
        │
        ├── pdfplumber (Text PDFs)
        └── OCR Pipeline
                │
                ├── pdf2image
                └── Tesseract OCR
        │
        ▼
Gemini AI Processing
        │
        ▼
Structured JSON Output
```

---

## Technologies Used

### Backend

* FastAPI
* Uvicorn

### PDF Processing

* pdfplumber
* pdf2image

### OCR

* Tesseract OCR
* pytesseract
* Poppler

### AI

* Google Gemini API

### Deployment

* Docker
* Render

### Testing

* Postman
* Swagger UI

---

## Project Structure

```text
pdf-extraction-api/
│
├── app/
│   ├── main.py
│   └── services/
│       ├── pdf_extractor.py
│       ├── ocr_service.py
│       ├── parser.py
│       └── __init__.py
│
├── uploads/
│
├── Dockerfile
├── requirements.txt
├── README.md
├── .env
└── .gitignore
```

---

## API Endpoints

### 1. Form Data Upload

```http
POST /parse-pdf
```

Accepts PDF files using multipart/form-data.

---

### 2. Binary Upload

```http
POST /parse-pdf-binary
```

Accepts raw PDF bytes directly in the request body.

---

### 3. Base64 Upload

```http
POST /parse-pdf-base64
```

Accepts Base64-encoded PDF content in JSON format.

Example Request:

```json
{
  "filename": "NALCO.pdf",
  "pdf_data": "<BASE64_STRING>",
  "keyword": "amount"
}
```

---

## OCR Workflow

```text
Scanned PDF
      │
      ▼
pdf2image
      │
      ▼
Images
      │
      ▼
Tesseract OCR
      │
      ▼
Extracted Text
```

---

## AI Processing Workflow

```text
Extracted Text
      │
      ▼
Gemini AI
      │
      ▼
Keyword-Based Extraction
      │
      ▼
Structured JSON Output
```

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd pdf-extraction-api
```

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate Environment

Windows:

```bash
venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Environment Variables

Create a `.env` file:

```env
GEMINI_API_KEY=YOUR_API_KEY
```

---

## Run Locally

```bash
python -m uvicorn app.main:app --reload
```

API:

```text
http://127.0.0.1:8000
```

Swagger Documentation:

```text
http://127.0.0.1:8000/docs
```

---

## Deployment

The application is Dockerized and deployed on Render.

Live API:

```text
https://pdf-extraction-api-o2h7.onrender.com
```

Swagger Docs:

```text
https://pdf-extraction-api-o2h7.onrender.com/docs
```

---

## Sample Use Cases

* Invoice Information Extraction
* Purchase Order Analysis
* Financial Document Processing
* Scanned PDF Digitization
* Dynamic Keyword Search
* AI-Based Document Understanding

---

## Future Improvements

* Multi-language OCR support
* Database integration
* User authentication
* Batch PDF processing
* Frontend dashboard
* Support for Word and Excel documents

---

## Author

Bhabani Mishra

Built as part of an AI-powered document processing and information extraction project using FastAPI, OCR, Docker, and Gemini AI.

Bhabani Mishra
