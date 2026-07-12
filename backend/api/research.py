from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from core.database import get_db
from schemas.research import ResearchResponse
from services import research_service

router = APIRouter()

class ResearchRequest(BaseModel):
    client_id: int

@router.post("/company", response_model=ResearchResponse)
async def perform_research(request: ResearchRequest, db: AsyncSession = Depends(get_db)):
    db_research = await research_service.perform_research(db, request.client_id)
    if not db_research:
        raise HTTPException(status_code=404, detail="Client not found")
    return db_research

@router.get("/client/{client_id}", response_model=ResearchResponse)
async def get_research(client_id: int, db: AsyncSession = Depends(get_db)):
    db_research = await research_service.get_research(db, client_id)
    if not db_research:
        raise HTTPException(status_code=404, detail="Research not found")
    return db_research
