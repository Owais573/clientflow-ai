from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from core.database import get_db
from schemas.workflow import WorkflowResponse, WorkflowListResponse
from models.workflow import Workflow
from services import workflow_service

router = APIRouter()

@router.post("/start", response_model=WorkflowResponse)
async def start_workflow(client_id: int, db: AsyncSession = Depends(get_db)):
    db_workflow = await workflow_service.start_workflow(db, client_id)
    if not db_workflow:
        raise HTTPException(status_code=404, detail="Client not found")
    return db_workflow

@router.get("", response_model=WorkflowListResponse)
async def list_workflows(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Workflow).offset(skip).limit(limit))
    workflows = result.scalars().all()
    return {"total": len(workflows), "items": workflows}

@router.get("/{workflow_id}", response_model=WorkflowResponse)
async def get_workflow(workflow_id: int, db: AsyncSession = Depends(get_db)):
    db_workflow = await workflow_service.get_workflow(db, workflow_id)
    if not db_workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return db_workflow
