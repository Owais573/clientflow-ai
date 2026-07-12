from fastapi import HTTPException
from typing import Any, Dict, Optional

class ClientFlowException(HTTPException):
    """Base exception for all custom ClientFlow API errors"""
    def __init__(self, status_code: int, detail: str, extra: Optional[Dict[str, Any]] = None):
        super().__init__(status_code=status_code, detail=detail)
        self.extra = extra or {}

class ZohoCRMError(ClientFlowException):
    def __init__(self, detail: str, extra: Optional[Dict[str, Any]] = None):
        super().__init__(status_code=502, detail=f"Zoho CRM Error: {detail}", extra=extra)

class OpenAIError(ClientFlowException):
    def __init__(self, detail: str, extra: Optional[Dict[str, Any]] = None):
        super().__init__(status_code=502, detail=f"OpenAI Error: {detail}", extra=extra)

class TavilyError(ClientFlowException):
    def __init__(self, detail: str, extra: Optional[Dict[str, Any]] = None):
        super().__init__(status_code=502, detail=f"Tavily Search Error: {detail}", extra=extra)

class N8nError(ClientFlowException):
    def __init__(self, detail: str, extra: Optional[Dict[str, Any]] = None):
        super().__init__(status_code=502, detail=f"n8n Workflow Error: {detail}", extra=extra)

class WorkflowError(ClientFlowException):
    def __init__(self, detail: str, extra: Optional[Dict[str, Any]] = None):
        super().__init__(status_code=400, detail=f"Workflow Error: {detail}", extra=extra)

class ResourceNotFoundError(ClientFlowException):
    def __init__(self, resource_type: str, resource_id: Any):
        super().__init__(status_code=404, detail=f"{resource_type} with ID {resource_id} not found")
