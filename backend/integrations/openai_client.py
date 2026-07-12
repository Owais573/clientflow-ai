import json
from typing import Dict, Any
from openai import AsyncOpenAI

from core.config import settings

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
model = settings.OPENAI_MODEL

async def analyze_company(company_name: str, raw_research: Dict[str, Any]) -> Dict[str, Any]:
    """
    Use OpenAI to analyze Tavily research and extract opportunities and pain points.
    Returns a dictionary matching the Research model JSONB schemas.
    """
    prompt = f"""
    You are an expert business analyst and strategic consultant.
    Analyze the following research data for the company '{company_name}'.
    
    RESEARCH DATA:
    {json.dumps(raw_research, indent=2)}
    
    Extract the following information and format your response EXACTLY as a JSON object with these keys:
    - "summary": A concise, 2-paragraph professional summary of the company.
    - "opportunities": A list of 3-5 strings detailing business opportunities for us to offer them our services (e.g., "Outdated website UI needs modernizing").
    - "pain_points": A list of 3-5 strings detailing their likely current pain points or challenges.
    - "recommendations": A list of 3-5 strings detailing strategic recommendations to include in a proposal.
    
    Return ONLY valid JSON.
    """
    
    try:
        response = await client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.3
        )
        
        content = response.choices[0].message.content
        tokens_used = response.usage.total_tokens if response.usage else 0
        
        parsed_data = json.loads(content)
        parsed_data["tokens_used"] = tokens_used
        return parsed_data
    except Exception as e:
        print(f"Error during OpenAI analysis: {e}")
        return {
            "summary": f"Failed to generate analysis. Error: {str(e)}",
            "opportunities": [],
            "pain_points": [],
            "recommendations": [],
            "tokens_used": 0
        }


async def generate_proposal(company_name: str, analysis: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate a full project proposal using OpenAI, based on the previous analysis.
    Returns a dictionary matching the Proposal model JSONB schemas.
    """
    prompt = f"""
    You are an expert sales executive writing a highly converting proposal.
    Write a project proposal for the company '{company_name}'.
    
    PREVIOUS ANALYSIS TO BASE THIS ON:
    {json.dumps(analysis, indent=2)}
    
    Create a compelling proposal and format your response EXACTLY as a JSON object with these keys:
    - "executive_summary": A strong, persuasive 2-3 paragraph executive summary addressed to the client.
    - "scope": A detailed description of the proposed project scope (1-2 paragraphs).
    - "timeline": A string describing the estimated timeline (e.g., "Week 1: Discovery, Week 2-4: Development, Week 5: Launch").
    - "deliverables": A list of 4-6 specific strings of what will be delivered.
    - "pricing_template": A JSON object containing an itemized breakdown of costs, e.g., {{"Phase 1": 2500, "Phase 2": 4000, "Total": 6500}}. Keep prices realistic for a premium agency.
    
    Return ONLY valid JSON.
    """
    
    try:
        response = await client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.4
        )
        
        content = response.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        print(f"Error during OpenAI proposal generation: {e}")
        return {
            "executive_summary": "Error generating proposal",
            "scope": "Error generating scope",
            "timeline": "TBD",
            "deliverables": [],
            "pricing_template": {}
        }
