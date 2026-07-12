from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, ConfigDict

class ResearchBase(BaseModel):
    client_id: int
    tavily_raw_results: Optional[Any] = None
    ai_summary: Optional[str] = None
    ai_opportunities: Optional[Any] = None
    ai_pain_points: Optional[Any] = None
    ai_recommendations: Optional[Any] = None
    tokens_used: int = 0

class ResearchCreate(ResearchBase):
    pass

class ResearchResponse(ResearchBase):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
