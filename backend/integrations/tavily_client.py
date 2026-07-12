from typing import Dict, Any

async def search_company(company_name: str, website: str = None) -> Dict[str, Any]:
    # TODO: Implement Tavily search in Phase 3
    return {
        "query": company_name,
        "results": [{"title": "Stub result", "url": "https://example.com"}]
    }
