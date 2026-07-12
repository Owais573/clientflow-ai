import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # App Settings
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    BACKEND_HOST: str = "0.0.0.0"
    BACKEND_PORT: int = 8000
    NEXT_PUBLIC_API_URL: str = "http://localhost:8000"

    # Database
    DATABASE_URL: str
    
    # OpenAI
    OPENAI_API_KEY: str
    OPENAI_MODEL: str = "gpt-4.1"

    # Tavily
    TAVILY_API_KEY: str

    # Zoho CRM
    ZOHO_CLIENT_ID: str
    ZOHO_CLIENT_SECRET: str
    ZOHO_GRANT_TOKEN: str | None = None
    ZOHO_USER_EMAIL: str
    ZOHO_REDIRECT_URI: str
    ZOHO_DOMAIN: str = "zoho.in"
    ZOHO_API_BASE_URL: str = "https://www.zohoapis.in"
    ZOHO_ACCOUNTS_URL: str = "https://accounts.zoho.in"
    
    # Slack
    SLACK_WEBHOOK_URL: str
    SLACK_CHANNEL: str = "clientflow-alerts"

    # n8n
    N8N_WEBHOOK_URL: str
    N8N_BASE_URL: str

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
