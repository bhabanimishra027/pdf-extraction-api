import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.environ.get("GEMINI_API_KEY")

try:
    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model='gemini-2.5-flash-lite',
        contents="Hello, please respond in JSON format.",
        config=genai.types.GenerateContentConfig(
            response_mime_type="application/json",
        )
    )
    print("Success:", response.text)
except Exception as e:
    import traceback
    traceback.print_exc()
