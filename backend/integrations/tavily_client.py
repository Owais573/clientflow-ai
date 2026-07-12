from typing import Dict, Any
from tavily import AsyncTavilyClient
import asyncio

from core.config import settings

# Initialize client
tavily_client = AsyncTavilyClient(api_key=settings.TAVILY_API_KEY)

async def search_company(company_name: str, website: str = None) -> Dict[str, Any]:
    """
    Search for information about a company using Tavily API.
    Provides structured data for AI analysis.
    """
    query = f"Provide comprehensive business intelligence on {company_name}"
    if website:
        query += f" (Website: {website})"
    query += ". Include recent news, target audience, key competitors, industry trends, and business challenges."
    
    try:
        # We use advanced search to get more detailed results suitable for AI analysis
        response = await tavily_client.search(
            query=query, 
            search_depth="advanced", 
            include_answer=True,
            include_images=False,
            max_results=5
        )
        return response
    except Exception as e:
        # In a real app we'd log this properly
        print(f"Error during Tavily search: {e}")
        return {"error": str(e), "query": query, "results": []}
