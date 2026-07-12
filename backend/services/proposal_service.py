from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Optional, Dict, Any

from models.proposal import Proposal
from schemas.proposal import ProposalCreate
from models.client import Client
from models.research import Research

from integrations.openai_client import generate_proposal as generate_proposal_ai

async def create_proposal(db: AsyncSession, client_id: int) -> Optional[Proposal]:
    # Need client and research
    client_res = await db.execute(select(Client).where(Client.id == client_id))
    client = client_res.scalar_one_or_none()
    
    research_res = await db.execute(select(Research).where(Research.client_id == client_id))
    research = research_res.scalar_one_or_none()
    
    if not client or not research:
        return None
        
    # Check if proposal exists
    prop_res = await db.execute(select(Proposal).where(Proposal.client_id == client_id))
    existing_proposal = prop_res.scalar_one_or_none()
    if existing_proposal:
        return existing_proposal
        
    analysis_data = {
        "summary": research.ai_summary,
        "opportunities": research.ai_opportunities,
        "pain_points": research.ai_pain_points,
        "recommendations": research.ai_recommendations
    }
    
    proposal_data = await generate_proposal_ai(client.company_name, analysis_data)
    
    prop_in = ProposalCreate(
        client_id=client_id,
        executive_summary=proposal_data.get("executive_summary"),
        scope=proposal_data.get("scope"),
        timeline=proposal_data.get("timeline"),
        deliverables=proposal_data.get("deliverables"),
        pricing_template=proposal_data.get("pricing_template")
    )
    
    db_proposal = Proposal(**prop_in.model_dump())
    db.add(db_proposal)
    await db.commit()
    await db.refresh(db_proposal)
    return db_proposal

async def get_proposal(db: AsyncSession, client_id: int) -> Optional[Proposal]:
    result = await db.execute(select(Proposal).where(Proposal.client_id == client_id))
    return result.scalar_one_or_none()
