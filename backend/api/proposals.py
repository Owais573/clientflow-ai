from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from core.database import get_db
from schemas.proposal import ProposalResponse
from services import proposal_service

router = APIRouter()

class ProposalRequest(BaseModel):
    client_id: int

@router.post("/generate", response_model=ProposalResponse)
async def generate_proposal(request: ProposalRequest, db: AsyncSession = Depends(get_db)):
    db_proposal = await proposal_service.create_proposal(db, request.client_id)
    if not db_proposal:
        raise HTTPException(status_code=400, detail="Ensure client and research exist before generating proposal")
    return db_proposal

@router.get("/client/{client_id}", response_model=ProposalResponse)
async def get_proposal(client_id: int, db: AsyncSession = Depends(get_db)):
    db_proposal = await proposal_service.get_proposal(db, client_id)
    if not db_proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return db_proposal
