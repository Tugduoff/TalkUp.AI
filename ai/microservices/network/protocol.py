##
## Talkup Project, 2025
## TalkUp.AI
## File description:
## This is the protocol.py of the microservices network.
##

from pydantic import BaseModel
from typing import List, Any

import time

class Message(BaseModel):
    """
    Message structure for microservices communication.
    """
    services: List[str]
    type: str
    timestamp: int
    data: Any

def create_message(services, msg_type, data):
    """
    Create a Message instance.
    """
    return Message(
        services=services,
        type=msg_type,
        timestamp=int(time.time()),
        data=data
    )
