##
## Talkup Project, 2025
## TalkUp.AI
## File description:
## This is the main.py of the text-to-speech microservice.
##

import engine.ttsServices

def main() -> bool:
    tts = engine.ttsServices.TTS()

    tts.start_tts_process()
    with open("text-sample/sample-start-interview.txt", "r", encoding="utf-8") as f:
        text = f.read()
    tts.synthesize_input(text)
    return True

if __name__ == "__main__":
    main()
