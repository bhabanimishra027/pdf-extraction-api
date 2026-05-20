import os
import json
import re
from google import genai
from tenacity import retry, stop_after_attempt, wait_exponential


def clean_text(text):
    text = re.sub(r"\n+", "\n", text)
    text = re.sub(r"[ \t]+", " ", text)
    return text.strip()


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def generate_with_retry(client, prompt):
    # Falling back to gemini-2.5-flash-lite as it has better availability 
    # and quota limits on the free tier.
    return client.models.generate_content(
        model='gemini-2.5-flash-lite',
        contents=prompt,
        config=genai.types.GenerateContentConfig(
            response_mime_type="application/json",
        ),
    )


def extract_data_with_llm(text, keyword=""):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key or api_key == "your_api_key_here":
        raise ValueError("GEMINI_API_KEY is missing or not set. Please update the .env file with your Google Gemini API key.")

    client = genai.Client(api_key=api_key)
    
    prompt = f"""
    You are an expert data extraction assistant. Your task is to extract structured information from the provided document text (which may be OCR'd from a scanned PDF or extracted from a standard PDF).
    
    Analyze the document and dynamically determine its type and the most important information it contains. 
    Return the extracted details STRICTLY in valid JSON format matching this generalized schema:
    {{
      "title": "Dynamically determined title or type of the document (e.g., Invoice, Resume, Contract, Research Paper)",
      "headings": ["List", "of", "Main", "Headings"],
      "important_details": {{
        // Dynamically create key-value pairs for the most critical metadata found in the document.
        // Examples:
        // - For an invoice: "invoice_number", "date", "total_amount", "vendor_name"
        // - For a resume: "name", "email", "phone", "highest_education"
        // - For a contract: "party_a", "party_b", "effective_date"
        "dynamic_key_1": "...",
        "dynamic_key_2": "..."
      }},
      "itemized_data": {{
        // If the document contains lists, tables, or itemized data (like goods in an invoice, work experience in a resume, clauses in a contract), extract them here.
        // Group them logically.
        "item_1": {{ "detail_a": "...", "detail_b": "..." }}
      }}
    }}
    
    If a specific keyword is provided: "{keyword}", and it is not empty, ensure you extract any information highly relevant to that keyword and include it in a top-level key "keyword_result".
    
    Document Text:
    '''
    {text}
    '''
    
    Return ONLY valid JSON. Do not include markdown code blocks like ```json.
    """

    try:
        response = generate_with_retry(client, prompt)
    except Exception as e:
        return {"error": "LLM API request failed", "message": str(e)}
    
    try:
        data = json.loads(response.text)
        return data
    except json.JSONDecodeError:
        return {"error": "Failed to parse LLM response into JSON", "raw_response": response.text}