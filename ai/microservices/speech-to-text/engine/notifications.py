##
## Talkup Project, 2025
## TalkUp.AI
## File description:
## Handles notifications for the TalkUp AI microservices.
##

import engine.enumMcs as enumMcs

class Notifications():
    def __init__(self):
        """
        Class constructor
        """
        pass

    def send_notification(self, service: enumMcs.MicroservicesNames, msg: str,
            type: enumMcs.NotificationTypes) -> None:
        """
        Send a notification to the console.
        """
        print(f"[{type.name}|{service.name}] 💡 {msg}", end='\n')

    def send_start_notification(self, service: enumMcs.MicroservicesNames, successful: bool)-> None:
        """
        Send a start notification to the console with the status of the service.
        """
        if (successful):
            print (f"[SERVICES] 💡 {service.name} started successfully!")
        else:
            print (f"[SERVICES] 💡 Failed to start {service.name}")
