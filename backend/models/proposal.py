from datetime import datetime
from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from core.database import Base

class Proposal(Base):
    __tablename__ = "proposals"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id", ondelete="CASCADE"), nullable=False, unique=True)
    
    executive_summary = Column(Text, nullable=True)
    scope = Column(Text, nullable=True)
    timeline = Column(Text, nullable=True)
    deliverables = Column(JSONB, nullable=True)
    pricing_template = Column(JSONB, nullable=True)
    
    google_doc_url = Column(String(500), nullable=True)
    google_drive_folder_url = Column(String(500), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    client = relationship("Client", back_populates="proposal")
