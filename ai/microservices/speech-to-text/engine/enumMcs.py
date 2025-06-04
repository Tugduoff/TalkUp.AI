##
## Talkup Project, 2025
## TalkUp.AI
## File description:
## This module defines the enumeration for microservices.
##

from enum import Enum

class MicroservicesNames(Enum):
    BA = 0
    EA = 1
    STT = 2
    TTS = 3
    VA = 4

class NotificationTypes(Enum):
    LOG = 0
    ERROR = 1
    INFO = 2
