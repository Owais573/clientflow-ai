from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Optional, Dict, Any

from models.research import Research
from schemas.research import ResearchCreate
from models.client import Client

from integrations.tavily_client import search_company
from integrations.openai_client import analyze_company

async def perform_research(db: AsyncSession, client_id: int) -> Optional[Research]:
    result = await db.execute(select(Client).where(Client.id == client_id))
    client = result.scalar_one_or_none()
    if not client:
        return None
        
    # Check if research already exists
    res_query = await db.execute(select(Research).where(Research.client_id == client_id))
    existing_research = res_query.scalar_one_or_none()
    if existing_research:
        return existing_research
        
    # Run integration
    raw_results = await search_company(client.company_name, client.website)
    analysis = await analyze_company(client.company_name, raw_results)
    
    research_in = ResearchCreate(
        client_id=client_id,
        tavily_raw_results=raw_results,
        ai_summary=analysis.get("summary"),
        ai_opportunities=analysis.get("opportunities"),
        ai_pain_points=analysis.get("pain_points"),
        ai_recommendations=analysis.get("recommendations"),
        tokens_used=analysis.get("tokens_used", 0)
    )
    
    db_research = Research(**research_in.model_dump())
    db.add(db_research)
    await db.commit()
    await db.refresh(db_research)
    return db_research

async def get_research(db: AsyncSession, client_id: int) -> Optional[Research]:
    result = await db.execute(select(Research).where(Research.client_id == client_id))
    return result.scalar_one_or_none()
