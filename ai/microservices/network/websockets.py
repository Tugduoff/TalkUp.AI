##
## Talkup Project, 2025
## TalkUp.AI
## File description:
## This is the websockets.py of the microservices network.
##

from pydantic import ValidationError
from network.protocol import Message, create_message
from fastapi import WebSocket

import json

class WebSocketMicroservice:
    def __init__(self, name: str, websocket: WebSocket):
        """
        Initialize a WebSocketMicroservice instance.
        """
        self.service_name = name
        self.websocket = websocket

    async def send(self, ws: WebSocket, service, msg_type, data):
        msg = create_message(service, msg_type, data)
        await ws.send_text(msg.model_dump_json())

    async def on_stream_chunk(self, ws: WebSocket, msg: Message):
        """Override for processing stream chunks."""
        pass

    async def on_process_request(self, ws: WebSocket, msg: Message):
        """Override for processing requests."""
        pass

    async def handle_incoming_message(self) -> Message:
        """
        Handle an incoming message from the WebSocket connection.
        """
        await self.websocket.accept()
        print(f"[{self.service_name}] Client connected")

        while True:
            try:
                raw = await self.websocket.receive_text()

                try:
                    payload = json.loads(raw)
                except json.JSONDecodeError as e:
                    await self.send(self.websocket, ["internal"], "error", {"message": f"invalid json: {str(e)}"})
                    continue
                if not isinstance(payload, dict):
                    await self.send(self.websocket, ["internal"], "error", {"message": "payload must be a JSON object"})
                    continue
                try:
                    if hasattr(Message, 'parse_obj'):
                        msg = Message.parse_obj(payload)
                    else:
                        msg = Message(**payload)
                except ValidationError as e:
                    await self.send(self.websocket, ["internal"], "error", {"message": f"invalid message format: {e}"})
                    continue
                except TypeError as e:
                    await self.send(self.websocket, ["internal"], "error", {"message": f"invalid message fields: {e}"})
                    continue

                # Handle different message types
                if msg.type == "ping":
                    await self.send(self.websocket, msg.services, "pong", {"status": "active"})
                    continue

                if msg.type == "stream_chunk":
                    await self.on_stream_chunk(self.websocket, msg)
                    continue

                if msg.type == "process_request":
                    await self.on_process_request(self.websocket, msg)
                    continue

                await self.send(self.websocket, msg.services, "error",
                    {"message": f"Unknown message type: {msg.type}"})

            except Exception as e:
                try:
                    await self.send(self.websocket, ["internal"], "error", {"message": str(e)})
                except Exception:
                    pass
                break
