from datetime import datetime
from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from core.database import Base

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id", ondelete="CASCADE"), nullable=False)
    workflow_id = Column(Integer, ForeignKey("workflows.id", ondelete="CASCADE"), nullable=True)
    
    event_type = Column(String(100), nullable=False)
    message = Column(Text, nullable=False)
    metadata_info = Column("metadata", JSONB, nullable=True)
    level = Column(String(20), default="info") # info, warning, error
    
    created_at = Column(DateTime, default=datetime.utcnow)

    client = relationship("Client", back_populates="activities")
    workflow = relationship("Workflow", back_populates="activities")
