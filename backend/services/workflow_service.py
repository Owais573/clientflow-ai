from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Optional

from models.workflow import Workflow
from schemas.workflow import WorkflowCreate
from models.client import Client
from models.activity import Activity
from integrations.n8n_client import trigger_workflow as trigger_n8n

async def start_workflow(db: AsyncSession, client_id: int) -> Optional[Workflow]:
    result = await db.execute(select(Client).where(Client.id == client_id))
    client = result.scalar_one_or_none()
    if not client:
        return None
        
    wf_in = WorkflowCreate(client_id=client_id, status="running", current_step="initialized")
    db_workflow = Workflow(**wf_in.model_dump())
    db.add(db_workflow)
    await db.commit()
    await db.refresh(db_workflow)
    
    # Log activity
    activity = Activity(
        client_id=client_id, 
        workflow_id=db_workflow.id, 
        event_type="workflow_started",
        message="Client onboarding workflow started",
        level="info"
    )
    db.add(activity)
    await db.commit()
    
    # Trigger n8n
    # n8n_exec_id = await trigger_n8n(client_id, db_workflow.id, {"company_name": client.company_name})
    # if n8n_exec_id:
    #     db_workflow.n8n_execution_id = n8n_exec_id
    #     await db.commit()
        
    return db_workflow

async def get_workflow(db: AsyncSession, workflow_id: int) -> Optional[Workflow]:
    result = await db.execute(select(Workflow).where(Workflow.id == workflow_id))
    return result.scalar_one_or_none()
