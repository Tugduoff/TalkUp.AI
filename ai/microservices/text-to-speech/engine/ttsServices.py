##
## Talkup Project, 2025
## TalkUp.AI
## File description:
## This module handles the text-to-speech microservice.
##

import engine.enumMcs as enumMcs

from TTS.api import TTS as C_TTS
from .notifications import Notifications

class TTS:
    def __init__(self):
        """
        Class constructor
        """
        self.n: Notifications = Notifications()
        self.language: str = "fr"
        self.tts_model: str = "css10/vits"
        self.tts = None

    def synthesize_input(self, input) -> None:
        """
        Process:
        This function will synthesize the input text to speech.
        It will use the TTS model to generate speech from text.

        Exeptions:
        If an error occurs, it prints the error message.
        """
        try:
            self.tts.tts_to_file(text=input, file_path="tmp/output_fr.wav")
        except Exception as e:
            self.n.send_notification(enumMcs.MicroservicesNames.TTS, 2, {e})

    def start_tts_process(self) -> None:
        """
        Process:
        Start the text-to-speech process.
        This function initializes the TTS system (tts object).

        Exeptions:
        If an error occurs, it prints the error message.
        """
        try:
            self.tts = C_TTS(model_name="tts_models/" + self.language + "/" + self.tts_model, progress_bar=True, gpu=False)
        except Exception as e:
            self.n.send_notification(enumMcs.MicroservicesNames.TTS, 2, {e})


