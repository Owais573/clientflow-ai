from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class WorkflowBase(BaseModel):
    client_id: int
    status: str = "pending"
    current_step: Optional[str] = None
    n8n_execution_id: Optional[str] = None

class WorkflowCreate(WorkflowBase):
    pass

class WorkflowResponse(WorkflowBase):
    id: int
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

class WorkflowListResponse(BaseModel):
    total: int
    items: List[WorkflowResponse]
