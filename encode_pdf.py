import base64
import json

with open("uploads/RECIEPT.pdf", "rb") as pdf_file:
    encoded = base64.b64encode(
        pdf_file.read()
    ).decode()

data = {
    "filename": "RECIEPT.pdf",
    "pdf_data": encoded,
    "keyword": "amount"
}

with open("data.json", "w") as f:
    json.dump(data, f, indent=4)

print("data.json created successfully")