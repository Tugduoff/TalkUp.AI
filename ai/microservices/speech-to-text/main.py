##
## Talkup Project, 2025
## TalkUp.AI
## File description:
## This is the main.py of the speech-to-text microservice.
##

import engine.sttServices

def main() -> bool:
    stt = engine.sttServices.STT("fr")

    stt.start_stt_process()
    return True

if __name__ == "__main__":
    main()
