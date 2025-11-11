# 🧠 WebSocket Communication Protocol — AI Server ↔ Microservices
**Version 1.0 — November 2025**

## 1. Introduction
This document defines the communication protocol between the **AI Server** (implemented in C++ using Crow)
and various **Microservices** (implemented in Python using FastAPI). The goal is to ensure reliable and extensible communication
for delegating processing tasks such as Speech-to-Text, Vision, and other AI-related functionalities.

---

## 2. General Message Structure
Communication between the AI Server and Microservices occurs via **WebSocket**.
All messages are in **JSON** format and must include the following fields:

### 🗣️ For the audio/video streaming messages, the structure is as follows:
| Field       | Type   | Description                                         |
|-------------|--------|-----------------------------------------------------|
| `services` | array  | List of requested microservices (e.g., `["speech_to_text", "behavior_analyzer", "emotion_analyzer"]`) |
| `type`      | string | Message type (e.g., `stream_chunk`, `process_request`, `error`) |
| `timestamp` | int    | UNIX timestamp of the message                        |
| `data`      | object | Message-specific content                             |

### 💬 For the text-based processing messages, the structure is as follows:
| Field       | Type   | Description                                         |
|-------------|--------|-----------------------------------------------------|
| `services` | array  | List of requested microservices (e.g., `["verbal-analyzer", "text-to-speech"]`) |
| `type`      | string | Message type (e.g., `process_request`, `error`) |
| `timestamp` | int    | UNIX timestamp of the message                        |
| `data`      | object | Message-specific content                             |