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

from .notifications import Notifications
from .enumMcs import MicroservicesNames
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

    def callback(self, indata, frames, time, status) -> None:
        """
        This is called (from a separate thread) for each audio block.
        """
        if status:
            print(status, file=sys.stderr)
        self.q.put(bytes(indata))

    def start_stt_process(self) -> None:
        """
        Start the speech-to-text process.
        """
        try:
            device_info = sd.query_devices(None, "input")
            self.samplerate = int(device_info["default_samplerate"])

            with sd.RawInputStream(samplerate=self.samplerate, blocksize = 8000, device=None,
                dtype="int16", channels=1, callback=self.callback):
                    self.n.send_notification(MicroservicesNames.STT, "Service started successfuly!")
                    rec = KaldiRecognizer(self.model, self.samplerate)
                    while True:
                        data = self.q.get()
                        if rec.AcceptWaveform(data):
                            token = json.loads(rec.FinalResult())
                            print(token['text'])
                        #if dump_fn is not None:
                            #dump_fn.write(data)

        except Exception as e:
            print(sd.query_devices())
            print(f"[ERROR] ❌ : {e}")
