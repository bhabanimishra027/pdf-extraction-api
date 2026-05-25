# PDF Information Extraction API

A FastAPI-based application that extracts important information from PDF files.

This project supports:

- Text PDFs
- Scanned PDFs using OCR
- Structured and unstructured PDFs
- Keyword-based extraction
- AI-based parsing using OpenAI
- JSON output format

---

# Features

## Rule-Based Extraction
- Extract headings
- Extract important details
- Keyword-based searching
- PDF text parsing

## OCR Support
- Supports scanned PDFs
- Uses Tesseract OCR
- Converts PDF pages into images

## AI-Based Parsing
- Uses OpenAI LLM
- Dynamic keyword extraction
- Intelligent document understanding
- Structured JSON response

---

# Technologies Used

- Python
- FastAPI
- pdfplumber
- pytesseract
- pdf2image
- OpenAI API
- Postman

---

# Project Structure

```text
pdf-extraction-api/
│
├── app/
│   ├── main.py
│   └── services/
│       ├── pdf_extractor.py
│       ├── ocr_service.py
│       └── parser.py
│
├── uploads/
├── requirements.txt
├── README.md
├── .gitignore
└── .env
```

---

# Installation

## Clone Repository

```bash
git clone YOUR_GITHUB_REPO_LINK
cd pdf-extraction-api
```

---

## Create Virtual Environment

```bash
python -m venv venv
```

Activate environment:

### Windows

```bash
venv\Scripts\activate
```

### Mac/Linux

```bash
source venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

# Environment Variables

Create a `.env` file and add:

```env
OPENAI_API_KEY=your_openai_api_key
```

---

# Run the Application

```bash
python -m uvicorn app.main:app --reload
```

Application will run at:

```text
http://127.0.0.1:8000
```

---

# API Endpoints

## Home Endpoint

### GET `/`

Returns API status.

---

## Rule-Based PDF Parsing

### POST `/parse-pdf`

Extracts:
- headings
- important details
- keyword matches

### Form Data

| Key | Type |
|---|---|
| file | File |
| keyword | Text (optional) |

---

## AI-Based PDF Parsing

### POST `/parse-pdf-ai`

Uses OpenAI LLM for intelligent extraction.

### Form Data

| Key | Type |
|---|---|
| file | File |
| keyword | Text (optional) |

---

# Testing with Postman

## URL Example

```text
http://127.0.0.1:8000/parse-pdf
```

or deployed URL:

```text
https://your-api.onrender.com/parse-pdf
```

---

## Postman Setup

- Method: POST
- Body → form-data

### Fields

| Key | Type |
|---|---|
| file | File |
| keyword | Text |

---

# OCR Setup

Install:
- Tesseract OCR
- Poppler

Add paths in `ocr_service.py`.

---

# Deployment

This project can be deployed using:

- Render
- Railway
- Replit

---

# Author

Bhabani Mishra