from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, Integer
from sqlalchemy.orm import relationship

from core.database import Base

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(255), nullable=False)
    contact_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    website = Column(String(255), nullable=True)
    industry = Column(String(255), nullable=True)
    budget = Column(String(100), nullable=True)
    service_interest = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)
    zoho_lead_id = Column(String(100), nullable=True, unique=True)
    status = Column(String(50), default="new")
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    workflows = relationship("Workflow", back_populates="client", cascade="all, delete-orphan")
    research = relationship("Research", back_populates="client", uselist=False, cascade="all, delete-orphan")
    proposal = relationship("Proposal", back_populates="client", uselist=False, cascade="all, delete-orphan")
    activities = relationship("Activity", back_populates="client", cascade="all, delete-orphan")
