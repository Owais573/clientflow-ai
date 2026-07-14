from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional

from models.client import Client
from schemas.client import ClientCreate, ClientUpdate
from integrations.zoho_crm import create_lead, delete_lead

async def create_client(db: AsyncSession, client_in: ClientCreate) -> Client:
    client_data = client_in.model_dump()
    db_client = Client(**client_data)
    db.add(db_client)
    await db.commit()
    await db.refresh(db_client)
    
    # Sync with Zoho CRM
    zoho_id = await create_lead({
        "company_name": db_client.company_name,
        "contact_name": db_client.contact_name,
        "email": db_client.email,
        "phone": db_client.phone,
        "website": db_client.website
    })
    if zoho_id:
        db_client.zoho_lead_id = zoho_id
        await db.commit()
        await db.refresh(db_client)
        
    return db_client

async def get_client(db: AsyncSession, client_id: int) -> Optional[Client]:
    result = await db.execute(select(Client).where(Client.id == client_id))
    return result.scalar_one_or_none()

async def list_clients(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Client]:
    result = await db.execute(select(Client).offset(skip).limit(limit))
    return result.scalars().all()

async def update_client(db: AsyncSession, client_id: int, client_in: ClientUpdate) -> Optional[Client]:
    db_client = await get_client(db, client_id)
    if not db_client:
        return None
        
    update_data = client_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_client, field, value)
        
    await db.commit()
    await db.refresh(db_client)
    return db_client

async def delete_client(db: AsyncSession, client_id: int) -> bool:
    db_client = await get_client(db, client_id)
    if not db_client:
        return False
        
    # Cascade delete to Zoho CRM if lead exists
    if db_client.zoho_lead_id:
        await delete_lead(db_client.zoho_lead_id)
        
    await db.delete(db_client)
    await db.commit()
    return True

async def sync_client_to_zoho(db: AsyncSession, client_id: int) -> Optional[Client]:
    db_client = await get_client(db, client_id)
    if not db_client or db_client.zoho_lead_id:
        return db_client # Already synced or not found
        
    zoho_id = await create_lead({
        "company_name": db_client.company_name,
        "contact_name": db_client.contact_name,
        "email": db_client.email,
        "phone": db_client.phone,
        "website": db_client.website
    })
    if zoho_id:
        db_client.zoho_lead_id = zoho_id
        await db.commit()
        await db.refresh(db_client)
        
    return db_client
