# 🧠 Protocole de Communication WebSocket — Serveur IA ↔ Microservices
**Version 1.0 — Novembre 2025**

## 1. Introduction
Ce document définit le **protocole de communication** entre le **serveur IA** (implémenté en C++ avec **Crow**)
et différents **microservices** (implémentés en **Python** avec **FastAPI**).

L’objectif est d’assurer une communication **fiable**, **extensible** et **standardisée** pour déléguer des tâches de traitement telles que la **reconnaissance vocale** (Speech-to-Text), l’analyse de **comportement** et d’**émotion**, et d’autres fonctionnalités liées à l’intelligence artificielle.

---

## 2. Structure Générale des Messages
La communication entre le **serveur IA** et les **microservices** s’effectue via **WebSocket**.
Tous les messages sont au **format JSON** et doivent inclure les champs suivants :

---

### 🗣️ Messages de flux audio/vidéo
| Champ         | Type   | Description                                                                 |
|----------------|--------|------------------------------------------------------------------------------|
| `services`     | array  | Liste des microservices demandés (ex. : `["speech_to_text", "behavior_analyzer", "emotion_analyzer"]`) |
| `type`         | string | Type de message (ex. : `stream_chunk`, `process_request`, `error`)           |
| `timestamp`    | int    | Horodatage UNIX du message                                                  |
| `data`         | object | Contenu spécifique au message                                               |

---

### 💬 Messages de traitement textuel
| Champ         | Type   | Description                                                                 |
|----------------|--------|------------------------------------------------------------------------------|
| `services`     | array  | Liste des microservices demandés (ex. : `["verbal-analyzer", "text-to-speech"]`) |
| `type`         | string | Type de message (ex. : `process_request`, `error`)                           |
| `timestamp`    | int    | Horodatage UNIX du message                                                  |
| `data`         | object | Contenu spécifique au message                                               |