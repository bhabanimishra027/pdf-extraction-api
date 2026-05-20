from pdf2image import convert_from_path
import pytesseract

# Fixed path: The actual executable is in Program Files, not the Start Menu shortcut folder.
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

POPPLER_PATH = r"D:\Downloads\Release-26.02.0-0\poppler-26.02.0\Library\bin"

def extract_text_using_ocr(pdf_path):
    text = ""

    try:
        images = convert_from_path(pdf_path, poppler_path=POPPLER_PATH)

        for image in images:
            page_text = pytesseract.image_to_string(image)
            text = text + page_text + "\n"
            
    except Exception as e:
        print("Error while doing OCR:", e)
        # Raise the exception so the API doesn't silently fail and return empty data
        raise ValueError(f"OCR Processing failed: {str(e)}")

    return text