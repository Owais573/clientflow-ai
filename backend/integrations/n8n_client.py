import httpx
from typing import Dict, Any, Optional

from core.config import settings

async def trigger_workflow(
    client_id: int, 
    workflow_id: int, 
    company_name: str, 
    contact_email: str,
    research_summary: Optional[str] = None,
    proposal_draft: Optional[str] = None
) -> Optional[str]:
    """
    Triggers the n8n client onboarding workflow via webhook.
    Returns the execution ID if available.
    """
    if not settings.N8N_WEBHOOK_URL:
        print("N8N_WEBHOOK_URL is not set. Skipping n8n workflow trigger.")
        return None
        
    payload = {
        "client_id": client_id,
        "workflow_id": workflow_id,
        "company_name": company_name,
        "contact_email": contact_email,
        "research_summary": research_summary or "",
        "proposal_draft": proposal_draft or ""
    }
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                settings.N8N_WEBHOOK_URL,
                json=payload
            )
            response.raise_for_status()
            
            # n8n might return the execution ID depending on the webhook configuration
            # Assuming n8n returns something like {"execution_id": "123", ...}
            data = response.json()
            return str(data.get("execution_id", "triggered"))
            
    except httpx.HTTPStatusError as e:
        print(f"n8n webhook returned error status {e.response.status_code}: {e.response.text}")
        return None
    except Exception as e:
        print(f"Failed to trigger n8n workflow: {e}")
        return None
