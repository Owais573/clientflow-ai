from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

class ClientBase(BaseModel):
    company_name: str
    contact_name: str
    email: str
    phone: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None
    budget: Optional[str] = None
    service_interest: Optional[str] = None
    notes: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class ClientUpdate(ClientBase):
    company_name: Optional[str] = None
    contact_name: Optional[str] = None
    email: Optional[str] = None
    status: Optional[str] = None

class ClientResponse(ClientBase):
    id: int
    zoho_lead_id: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class ClientListResponse(BaseModel):
    total: int
    items: List[ClientResponse]
