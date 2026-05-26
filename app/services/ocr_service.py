from pdf2image import convert_from_path
import pytesseract


def extract_text_using_ocr(pdf_path):
    text = ""

    try:
        images = convert_from_path(pdf_path)

        for image in images:
            page_text = pytesseract.image_to_string(image)
            text += page_text + "\n"

    except Exception as e:
        raise ValueError(f"OCR Processing failed: {str(e)}")

    return text