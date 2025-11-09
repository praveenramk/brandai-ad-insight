from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from PIL import Image
import io
import json
import os
from dotenv import load_dotenv
from fastapi.openapi.utils import JSONResponse

# Load environment variables
load_dotenv()

# Get API key with validation
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is not set")

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple brand profiles
BRAND_PROFILES = {
    "nike": {
        "name": "Nike",
        "colors": ["black", "white", "orange"],
        "tone": "Bold, empowering, athletic, motivational",
        "logo": "Swoosh symbol",
        "tagline": "Just Do It"
    },
    "apple": {
        "name": "Apple",
        "colors": ["white", "black", "silver", "minimalist colors"],
        "tone": "Clean, minimalist, innovative, premium",
        "logo": "Apple symbol",
        "tagline": "Think Different"
    },
    "cocacola": {
        "name": "Coca-Cola",
        "colors": ["red", "white"],
        "tone": "Joyful, nostalgic, refreshing, friendly",
        "logo": "Coca-Cola script logo",
        "tagline": "Open Happiness"
    }
}

def create_critique_prompt(brand_profile):
    """Generate the master critique prompt"""
    return f"""You are an expert Creative Director and Brand Compliance Officer.

Analyze this advertisement image for the brand: {brand_profile['name']}

BRAND GUIDELINES:
- Brand Colors: {', '.join(brand_profile['colors'])}
- Brand Tone: {brand_profile['tone']}
- Brand Logo: {brand_profile['logo']}
- Tagline: {brand_profile['tagline']}

EVALUATION CRITERIA:
Evaluate the ad on these 4 dimensions and give each a score from 0-100:

1. BRAND ALIGNMENT (0-100)
   - Are the brand colors present and used correctly?
   - Is the logo visible and properly placed?
   - Does the visual style match the brand tone?
   - Does it feel authentic to this brand?

2. VISUAL QUALITY (0-100)
   - Is the image sharp and clear?
   - Is the composition professional and balanced?
   - Is the lighting good?
   - Are there any distracting artifacts or watermarks?

3. MESSAGE CLARITY (0-100)
   - Is the product clearly visible?
   - Is there a clear value proposition or benefit?
   - Is there a call-to-action?
   - Can you immediately understand what's being advertised?

4. SAFETY & ETHICS (0-100)
   - Is the content appropriate and brand-safe?
   - Are there any stereotypes or biases?
   - Is it truthful and not misleading?
   - Does it avoid controversial or offensive content?

OUTPUT FORMAT:
You MUST respond with ONLY a valid JSON object, no other text. Use this exact structure:

{{
  "overall_score": <average of all 4 scores>,
  "brand_alignment": {{
    "score": <0-100>,
    "feedback": "<2-3 sentences explaining the score>"
  }},
  "visual_quality": {{
    "score": <0-100>,
    "feedback": "<2-3 sentences explaining the score>"
  }},
  "message_clarity": {{
    "score": <0-100>,
    "feedback": "<2-3 sentences explaining the score>"
  }},
  "safety_ethics": {{
    "score": <0-100>,
    "feedback": "<2-3 sentences explaining the score>"
  }},
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "issues": ["<issue 1>", "<issue 2>"],
  "suggestions": ["<actionable suggestion 1>", "<actionable suggestion 2>", "<actionable suggestion 3>"]
}}

Analyze the image now and return ONLY the JSON response."""

@app.get("/")
def read_root():
    return {"message": "BrandAI Critique API is running"}

@app.get("/brands")
def get_brands():
    """Return available brand profiles"""
    return {"brands": list(BRAND_PROFILES.keys())}

@app.post("/critique")
async def critique_ad(file: UploadFile = File(...), brand: str = Form(...)):
    """
    Main critique endpoint
    Takes an image and brand name, returns critique results
    """
    try:
        # 1. Load brand profile
        if brand.lower() not in BRAND_PROFILES:
            return {"error": f"Brand '{brand}' not found. Available: {list(BRAND_PROFILES.keys())}"}
        
        brand_profile = BRAND_PROFILES[brand.lower()]
        
        # 2. Load and process image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        
        # 3. Create prompt
        prompt = create_critique_prompt(brand_profile)
        
        # 4. Call Gemini Vision
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        response = model.generate_content([prompt, image])
        
        # 5. Parse JSON response
        response_text = response.text.strip()
        
        # Remove markdown code blocks if present
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        
        response_text = response_text.strip()
        
        # Parse JSON
        critique_result = json.loads(response_text)
        print("Debug - Sending response:", json.dumps(critique_result, indent=2))
        return critique_result
        
    except json.JSONDecodeError as e:
        return {
            "error": "Failed to parse AI response",
            "raw_response": response.text,
            "details": str(e)
        }
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)