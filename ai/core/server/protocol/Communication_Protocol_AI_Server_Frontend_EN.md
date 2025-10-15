# 🧠 WebSocket Communication Protocol — AI Server ↔ Frontend
**Version 1.0 — October 2025**

## 1. Introduction
This document defines the communication protocol between the **AI Server** (implemented in C++ using Crow)
and the application's **Frontend**: Talkup.AI. The goal is to ensure reliable and extensible communication,
particularly for real-time audio/video data transmission and for delegating processing tasks
to Python microservices (e.g., Speech-to-Text, Vision, etc.).

---

## 2. General Message Structure
Communication between the Frontend and the AI Server occurs via **WebSocket**.
All messages are in **JSON** format and must include the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | Message type (e.g., `ping`, `stream_chunk`, `error`) |
| `timestamp` | int | UNIX timestamp of the message |
| `data` | object | Message-specific content |

---

## 3. Basic Level — Connection and Testing
The server must handle simple commands for connection and availability testing.

**Supported messages:**
- `ping` → used by the client to test the connection.
- `status` → returns information about the AI Server state.
- `error` → returned in case of protocol or message error.

---

## 4. Application Level — Audio/Video Transmission
The Frontend can send audio and video streams for processing.

**Message types:**
- `stream_start`: indicates the start of a stream (type: audio, video, etc.)
- `stream_chunk`: sends a fragment (binary encoded as Base64 or WebSocket binary frame)
- `stream_end`: indicates the end of the stream.

The server may respond with:
- `transcript_update`
- `analysis_result`

### Example: Frontend → AI Server
```json
{
  "type": "stream_chunk",
  "stream_id": "abc123",
  "format": "audio/opus",
  "sequence": 12,
  "timestamp": 1739592334,
  "data": "<base64 encoded chunk>"
}
```

### Example: AI Server → Frontend
```json
{
  "type": "transcript_update",
  "stream_id": "abc123",
  "text": "Hello, how can I help you?",
  "confidence": 0.94
}
```

---

## 5. Advanced Level — AI Server ↔ Microservices
The protocol is designed to evolve into a modular architecture where the AI Server delegates tasks to Python microservices.

**Internal messages:**
- `task_request`: sends a task to a microservice
- `task_result`: returns the result to the AI Server

Each message is associated with a `session_id` and a `service_type`.

---

## 6. Security and Versioning
- Use **WSS (secure WebSocket)**
- Authentication via **token** or **API key**
- The `protocol_version` field ensures compatibility between versions

---

## 7. Conclusion
This protocol provides a solid foundation for real-time communication between a Frontend and an AI Server,
while being extensible toward a microservice-based architecture. It is designed to be **simple**, **robust**, and **scalable**.
