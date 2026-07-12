from datetime import datetime
from typing import Optional, Any, List
from pydantic import BaseModel, ConfigDict

class ActivityBase(BaseModel):
    client_id: int
    workflow_id: Optional[int] = None
    event_type: str
    message: str
    metadata_info: Optional[Any] = None
    level: str = "info"

class ActivityCreate(ActivityBase):
    pass

class ActivityResponse(ActivityBase):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class DashboardStatsResponse(BaseModel):
    total_clients: int
    active_workflows: int
    completed_workflows: int
    failed_workflows: int
    recent_activities: List[ActivityResponse]
