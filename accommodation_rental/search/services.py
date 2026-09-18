import json
from google import genai
from decouple import config

client = genai.Client(api_key=config('GEMINI_API_KEY'))

PROMPT_TEMPLATE = """Extract search filters from the following property search query.
Respond with ONLY a JSON object, no other text, no markdown formatting, using this exact schema:
{{
  "city": string or null,
  "property_type": string or null,
  "bedrooms": number or null,
  "min_bedrooms": number or null,
  "max_price": number or null,
  "amenities": array of strings (empty array if none mentioned)
}}

Rules for bedrooms:
- If the query specifies an exact bedroom count (e.g. "1bhk", "2 bedroom", "3bhk apartment"), put that number in "bedrooms" and leave "min_bedrooms" null.
- If the query specifies a minimum (e.g. "3+ bedrooms", "at least 3 bedrooms", "minimum 2 bedrooms"), put that number in "min_bedrooms" and leave "bedrooms" null.
- If bedrooms aren't mentioned at all, both should be null.

If a field is not mentioned in the query, use null (or empty array for amenities).

Query: "{query}"
"""


import logging

logger = logging.getLogger(__name__)

def extract_filters_with_ai(query):
    """Returns a dict of filters, or None if the AI call/parsing failed."""
    try:
        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=PROMPT_TEMPLATE.format(query=query),
        )
        text = response.text.strip()

        if text.startswith('```'):
            text = text.strip('`')
            if text.startswith('json'):
                text = text[4:]
            text = text.strip()

        data = json.loads(text)
        return data
    except Exception as e:
        logger.warning(f"AI extraction failed: {type(e).__name__}: {e}")
        return None