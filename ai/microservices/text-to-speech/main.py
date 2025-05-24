##
## Talkup Project, 2025
## TalkUp.AI
## File description:
## This is the main.py of the text-to-speech microservice.
##

import time

def main() -> bool:
    while True:
        print("Text to speech microservice is runing", end="\n")
        time.sleep(5)
    return True

if __name__ == "__main__":
    main()
