from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from core.database import get_db
from models.client import Client
from models.workflow import Workflow
from models.activity import Activity
from schemas.activity import DashboardStatsResponse

router = APIRouter()

@router.get("/stats", response_model=DashboardStatsResponse)
async def get_dashboard_stats(db: AsyncSession = Depends(get_db)):
    total_clients = await db.scalar(select(func.count(Client.id))) or 0
    active_workflows = await db.scalar(select(func.count(Workflow.id)).where(Workflow.status == "running")) or 0
    completed_workflows = await db.scalar(select(func.count(Workflow.id)).where(Workflow.status == "completed")) or 0
    failed_workflows = await db.scalar(select(func.count(Workflow.id)).where(Workflow.status == "failed")) or 0
    
    # Get recent activities
    result = await db.execute(select(Activity).order_by(Activity.created_at.desc()).limit(10))
    recent_activities = result.scalars().all()
    
    return {
        "total_clients": total_clients,
        "active_workflows": active_workflows,
        "completed_workflows": completed_workflows,
        "failed_workflows": failed_workflows,
        "recent_activities": recent_activities
    }

@router.get("/activities")
async def list_activities(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Activity).order_by(Activity.created_at.desc()).offset(skip).limit(limit))
    activities = result.scalars().all()
    return {"total": len(activities), "items": activities}
