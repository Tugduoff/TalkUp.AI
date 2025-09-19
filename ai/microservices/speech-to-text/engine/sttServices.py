##
## Talkup Project, 2025
## TalkUp.AI
## File description:
## This module handles the speech-to-text microservice.
##

import queue
import sys
import json
import sounddevice as sd
import engine.enumMcs as enumMcs

from .notifications import Notifications
from vosk import Model, KaldiRecognizer

class STT():
    def __init__(self, model_type: str):
        """
        Class constructor
        """
        self.q: queue = queue.Queue()
        self.model: str = Model(lang=model_type)
        self.samplerate: int = None
        self.n: Notifications = Notifications()
        self.running: bool = True

    def callback(self, indata, frames, time, status) -> None:
        """
        This is called (from a separate thread) for each audio block.
        """
        if status:
            print(status, file=sys.stderr)
        self.q.put(bytes(indata))

    def stop_stt_process(self) -> None:
        """
        Stop the speech-to-text process.
        """
        self.running = False
        self.q.put(None)
        self.n.send_notification(enumMcs.MicroservicesNames.STT, 0,
            "Service stopped successfully!")

    def start_stt_process(self) -> None:
        """
        Process:
        Start the speech-to-text process.
        This function initializes the audio input stream and processes the audio data
        using the Vosk speech recognition model.
        It listens for audio input, converts it to text, and prints the recognized text (as token).

        Exeptions:
        If an error occurs, it prints the error message.
        """
        try:
            device_info = sd.query_devices(None, "input")
            self.samplerate = int(device_info["default_samplerate"])

            with sd.RawInputStream(samplerate=self.samplerate, blocksize = 8000, device=None,
                dtype="int16", channels=1, callback=self.callback):
                    self.n.send_notification(enumMcs.MicroservicesNames.STT, 0,
                        "Service started successfully!")
                    rec = KaldiRecognizer(self.model, self.samplerate)
                    while self.running:
                        data = self.q.get()
                        if rec.AcceptWaveform(data):
                            token = json.loads(rec.FinalResult())
                            print(token['text'])

        except Exception as e:
            self.n.send_notification(enumMcs.MicroservicesNames.STT, 2, {e})
