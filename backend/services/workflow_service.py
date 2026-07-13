from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Optional

from models.workflow import Workflow
from schemas.workflow import WorkflowCreate
from models.client import Client
from models.activity import Activity
from integrations.n8n_client import trigger_workflow as trigger_n8n
from fastapi import BackgroundTasks
from core.database import async_session
import asyncio

async def start_workflow(db: AsyncSession, client_id: int, background_tasks: BackgroundTasks) -> Optional[Workflow]:
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
    
    # Schedule the AI Pipeline in the background
    background_tasks.add_task(run_pipeline, client_id, db_workflow.id)
    
    return db_workflow

async def run_pipeline(client_id: int, workflow_id: int):
    # We must import here to avoid circular imports if any, or at the top. Let's just import here.
    from services import research_service, proposal_service
    
    print(f"🚀 [Pipeline] Starting AI pipeline for client {client_id}, workflow {workflow_id}")
    
    async with async_session() as db:
        try:
            # 1. AI Research
            print(f"🔍 [Pipeline] Running AI Research for client {client_id}...")
            db_workflow = await get_workflow(db, workflow_id)
            if not db_workflow:
                return
                
            research = await research_service.perform_research(db, client_id)
            if not research:
                print("❌ [Pipeline] AI Research failed.")
                return
            
            db_workflow.current_step = "ai_research_completed"
            await db.commit()
            print("✅ [Pipeline] AI Research completed!")
            
            # 2. Generate Proposal
            print(f"📝 [Pipeline] Generating Proposal for client {client_id}...")
            proposal = await proposal_service.create_proposal(db, client_id)
            if not proposal:
                print("❌ [Pipeline] Proposal generation failed.")
                return
                
            db_workflow.current_step = "proposal_generated"
            await db.commit()
            print("✅ [Pipeline] Proposal generated!")
            
            # 3. Trigger n8n
            print(f"⚡ [Pipeline] Triggering n8n workflow...")
            # We need the client details to trigger n8n
            result = await db.execute(select(Client).where(Client.id == client_id))
            client = result.scalar_one_or_none()
            
            n8n_exec_id = await trigger_n8n(
                client_id=client_id, 
                workflow_id=workflow_id, 
                company_name=client.company_name,
                contact_email=client.email,
                research_summary=research.ai_summary
            )
            
            if n8n_exec_id:
                db_workflow.n8n_execution_id = n8n_exec_id
                await db.commit()
                print(f"✅ [Pipeline] n8n triggered successfully! Execution ID: {n8n_exec_id}")
            else:
                print(f"⚠️ [Pipeline] n8n trigger returned no execution ID.")
                
        except Exception as e:
            print(f"❌ [Pipeline] Fatal Error: {str(e)}")
            import traceback
            traceback.print_exc()

async def get_workflow(db: AsyncSession, workflow_id: int) -> Optional[Workflow]:
    result = await db.execute(select(Workflow).where(Workflow.id == workflow_id))
    return result.scalar_one_or_none()

async def get_workflow_by_client(db: AsyncSession, client_id: int) -> Optional[Workflow]:
    result = await db.execute(
        select(Workflow)
        .where(Workflow.client_id == client_id)
        .order_by(Workflow.created_at.desc())
    )
    return result.scalars().first()
