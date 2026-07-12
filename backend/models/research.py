from datetime import datetime
from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from core.database import Base

class Research(Base):
    __tablename__ = "research"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id", ondelete="CASCADE"), nullable=False, unique=True)
    
    tavily_raw_results = Column(JSONB, nullable=True)
    ai_summary = Column(Text, nullable=True)
    ai_opportunities = Column(JSONB, nullable=True)
    ai_pain_points = Column(JSONB, nullable=True)
    ai_recommendations = Column(JSONB, nullable=True)
    tokens_used = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    client = relationship("Client", back_populates="research")
