##
## Talkup Project, 2025
## TalkUp.AI
## File description:
## Handles notifications for the TalkUp AI microservices.
##

from .enumMcs import MicroservicesNames

class Notifications():
    def __init__(self):
        """
        Class constructor
        """
        pass

    def send_notification(self, service: MicroservicesNames, msg: str) -> None:
        """
        Send a notification to the console.
        """
        print(f"[{service.name}] 💡 {msg}", end='\n')

    def send_start_notification(self, service: MicroservicesNames, successful: bool)-> None:
        """
        Send a start notification to the console with the status of the service.
        """
        if (successful):
            print (f"[SERVICES] 💡 {service.name} started successfully!")
        else:
            print (f"[SERVICES] 💡 Failed to start {service.name}")
