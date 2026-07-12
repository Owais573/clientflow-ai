from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, ConfigDict

class ProposalBase(BaseModel):
    client_id: int
    executive_summary: Optional[str] = None
    scope: Optional[str] = None
    timeline: Optional[str] = None
    deliverables: Optional[Any] = None
    pricing_template: Optional[Any] = None
    google_doc_url: Optional[str] = None
    google_drive_folder_url: Optional[str] = None

class ProposalCreate(ProposalBase):
    pass

class ProposalResponse(ProposalBase):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
