import os
import asyncio
from typing import Optional, Dict, Any

from zohocrmsdk.src.com.zoho.crm.api.dc import INDataCenter
from zohocrmsdk.src.com.zoho.api.authenticator import OAuthToken
from zohocrmsdk.src.com.zoho.api.authenticator.store import FileStore
from zohocrmsdk.src.com.zoho.crm.api import SDKConfig, Initializer
from zohocrmsdk.src.com.zoho.api.logger import Logger
from zohocrmsdk.src.com.zoho.crm.api.record import RecordOperations, BodyWrapper, Record

from core.config import settings

def init_zoho():
    """
    Initializes the Zoho CRM SDK.
    Should be called during FastAPI lifespan startup.
    """
    if not settings.ZOHO_CLIENT_ID or not settings.ZOHO_CLIENT_SECRET:
        print("Zoho credentials missing, skipping initialization.")
        return

    logger = Logger.get_instance(level=Logger.Levels.INFO, file_path="zoho_sdk.log")
    
    # Store tokens in a file to persist across restarts
    store = FileStore(file_path="zoho_tokens.txt")
    
    # If the file exists and has content, we might not need the grant token
    # But Initializer requires it if it's the first time
    token = OAuthToken(
        client_id=settings.ZOHO_CLIENT_ID,
        client_secret=settings.ZOHO_CLIENT_SECRET,
        grant_token=settings.ZOHO_GRANT_TOKEN,
        redirect_url=settings.ZOHO_REDIRECT_URI
    )
    
    environment = INDataCenter.PRODUCTION()
    
    try:
        Initializer.initialize(
            environment=environment,
            token=token,
            store=store,
            sdk_config=SDKConfig(auto_refresh_fields=True),
            resource_path="./",
            logger=logger
        )
        print("Zoho CRM SDK initialized successfully.")
    except Exception as e:
        print(f"Failed to initialize Zoho CRM SDK: {e}")

def _sync_create_lead(client_data: Dict[str, Any]) -> Optional[str]:
    try:
        record_operations = RecordOperations()
        request = BodyWrapper()
        lead = Record()
        
        # Split name (assuming "First Last")
        name_parts = client_data.get("contact_name", "Unknown").split(" ", 1)
        last_name = name_parts[-1]
        first_name = name_parts[0] if len(name_parts) > 1 else ""
        
        lead.add_field_value("Last_Name", last_name)
        if first_name:
            lead.add_field_value("First_Name", first_name)
            
        lead.add_field_value("Company", client_data.get("company_name", "Unknown"))
        lead.add_field_value("Email", client_data.get("email", ""))
        
        if client_data.get("phone"):
            lead.add_field_value("Phone", client_data["phone"])
        if client_data.get("website"):
            lead.add_field_value("Website", client_data["website"])
        
        request.set_data([lead])
        
        response = record_operations.create_records("Leads", request)
        if response is not None:
            if response.get_status_code() in [200, 201]:
                action_responses = response.get_object().get_data()
                if action_responses and len(action_responses) > 0:
                    success_response = action_responses[0]
                    return str(success_response.get_details().get("id"))
    except Exception as e:
        print(f"Error creating Zoho lead: {e}")
    
    return None

async def create_lead(client_data: Dict[str, Any]) -> Optional[str]:
    """
    Creates a Lead in Zoho CRM and returns the Zoho Lead ID.
    Runs the synchronous SDK call in a thread pool.
    """
    return await asyncio.to_thread(_sync_create_lead, client_data)
