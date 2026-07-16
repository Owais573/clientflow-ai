from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from core.database import get_db
from models.workflow import Workflow
from models.activity import Activity

router = APIRouter()

@router.post("/n8n")
async def n8n_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    data = await request.json()
    
    workflow_id = data.get("workflow_id")
    status = data.get("status")
    step = data.get("step")
    message = data.get("message", "Status updated from n8n")
    
    if workflow_id:
        result = await db.execute(select(Workflow).where(Workflow.id == workflow_id))
        workflow = result.scalar_one_or_none()
        
        if workflow:
            if status:
                workflow.status = status
                if status == "completed":
                    from datetime import datetime
                    workflow.completed_at = datetime.utcnow()
            if step:
                workflow.current_step = step
            await db.commit()
            
            activity = Activity(
                client_id=workflow.client_id,
                workflow_id=workflow.id,
                event_type=f"n8n_{step or status or 'update'}",
                message=message,
                level="info",
                metadata_info=data
            )
            db.add(activity)
            await db.commit()
            
    return {"status": "received"}
