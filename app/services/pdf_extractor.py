import pdfplumber

def extract_text_from_pdf(pdf_path):
    text = ""

    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()

                if page_text:
                    text = text + page_text + "\n"

    except Exception as e:
        print("Error while extracting text:", e)

    return text


def extract_tables_from_pdf(pdf_path):
    all_tables = []

    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                tables = page.extract_tables()

                for table in tables:
                    if table:
                        all_tables.append(table)

    except Exception as e:
        print("Error while extracting tables:", e)

    return all_tables