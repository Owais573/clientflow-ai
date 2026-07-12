from typing import Dict, Any

async def generate_email_content(email_type: str, client_name: str, context: Dict[str, Any] = None) -> str:
    # TODO: Implement OpenAI email generation in Phase 3
    if email_type == "welcome":
        return f"Welcome {client_name}! We are excited to work with you."
    elif email_type == "follow_up":
        return f"Hi {client_name}, just following up on our previous conversation."
    elif email_type == "reminder":
        return f"Reminder for {client_name}: Please review the latest documents."
    return "Generic email body."
