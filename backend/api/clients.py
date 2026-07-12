from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from core.database import get_db
from schemas.client import ClientCreate, ClientUpdate, ClientResponse, ClientListResponse
from services import client_service
from services import workflow_service

router = APIRouter()

@router.post("", response_model=ClientResponse, status_code=status.HTTP_201_CREATED)
async def create_client(client_in: ClientCreate, db: AsyncSession = Depends(get_db)):
    db_client = await client_service.create_client(db, client_in)
    # Start onboarding workflow automatically
    await workflow_service.start_workflow(db, db_client.id)
    return db_client

@router.get("", response_model=ClientListResponse)
async def list_clients(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    clients = await client_service.list_clients(db, skip=skip, limit=limit)
    return {"total": len(clients), "items": clients}

@router.get("/{client_id}", response_model=ClientResponse)
async def get_client(client_id: int, db: AsyncSession = Depends(get_db)):
    db_client = await client_service.get_client(db, client_id)
    if not db_client:
        raise HTTPException(status_code=404, detail="Client not found")
    return db_client

@router.put("/{client_id}", response_model=ClientResponse)
async def update_client(client_id: int, client_in: ClientUpdate, db: AsyncSession = Depends(get_db)):
    db_client = await client_service.update_client(db, client_id, client_in)
    if not db_client:
        raise HTTPException(status_code=404, detail="Client not found")
    return db_client

@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_client(client_id: int, db: AsyncSession = Depends(get_db)):
    success = await client_service.delete_client(db, client_id)
    if not success:
        raise HTTPException(status_code=404, detail="Client not found")
