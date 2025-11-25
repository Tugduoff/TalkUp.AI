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
| `timestamp` | uint_64    | UNIX timestamp of the message                        |
| `data`      | object | Message-specific content                             |

### 💬 For the text-based processing messages, the structure is as follows:
| Field       | Type   | Description                                         |
|-------------|--------|-----------------------------------------------------|
| `services` | array  | List of requested microservices (e.g., `["verbal-analyzer", "text-to-speech"]`) |
| `type`      | string | Message type (e.g., `process_request`, `error`) |
| `timestamp` | uint_64    | UNIX timestamp of the message                        |
| `data`      | object | Message-specific content                             |

##  3. Server logic
The AI server is responsible for routing messages to the appropriate microservices based on the `services` field.
It must handle responses from microservices and aggregate results when multiple services are requested.

The server will start by sending a `ping` message to each microservice to verify connectivity. Microservices must respond with a `pong` message.
After successful connection verification, the server can send processing requests.

Here is the step-by-step logic for the audio:
1. **Connection Verification**:
    - AI Server sends `ping` to each microservice.
    - Microservices respond with `pong`.

2. **Processing Requests**:
    - First, AI Server sends a request to the STT microservice with audio data.
    - STT microservice processes the audio and returns the transcription.
    - Next, AI Server sends the transcription to the Verbal Analyzer microservice for further analysis.
    - Verbal Analyzer processes the text and returns the analysis results.
    - The server will send the text to the LLM for generating responses.
    - Finally, the server sends the generated response to the TTS microservice to convert it to speech.

3. **Response Handling**:
    - The AI Server collects responses from each microservice and aggregates them into a final response to the Frontend.

Here is a schematic representation of the process:

```
Frontend
   |
   v
AI Server
   |
   +--> STT Microservice
   |        |
   +<-------+
   |
   +--> Verbal Analyzer Microservice
   |        |
   +<-------+
   |
   +--> LLM Microservice
   |        |
   +<-------+
   |
   +--> TTS Microservice
            |
   +<-------+
   |
Final Response to Frontend
```

## 4. Error Handling
Both the AI Server and Microservices must implement robust error handling. In case of errors, messages should include an `error` type with a descriptive message in the `data` field.

If an error occurs during processing, the AI Server should notify the Frontend with an appropriate error message.
