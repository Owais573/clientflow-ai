import asyncio
from functools import wraps
from core.logging import logger

def async_retry(retries: int = 3, backoff: float = 2.0, exceptions=(Exception,)):
    """
    Retry decorator with exponential backoff for async functions.
    Useful for flaky external APIs (Tavily, OpenAI, Zoho, n8n).
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            attempt = 0
            while attempt < retries:
                try:
                    return await func(*args, **kwargs)
                except exceptions as e:
                    attempt += 1
                    if attempt == retries:
                        logger.error(f"Function {func.__name__} failed after {retries} attempts.", extra_info={"error": str(e)})
                        raise e
                    
                    sleep_time = backoff ** attempt
                    logger.warning(f"Function {func.__name__} failed (attempt {attempt}/{retries}). Retrying in {sleep_time}s...", extra_info={"error": str(e)})
                    await asyncio.sleep(sleep_time)
        return wrapper
    return decorator
