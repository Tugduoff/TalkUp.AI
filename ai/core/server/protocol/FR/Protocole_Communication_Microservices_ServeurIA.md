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
| `timestamp`    | uint_64    | Horodatage UNIX du message                                                  |
| `data`         | object | Contenu spécifique au message                                               |

---

### 💬 Messages de traitement textuel
| Champ         | Type   | Description                                                                 |
|----------------|--------|------------------------------------------------------------------------------|
| `services`     | array  | Liste des microservices demandés (ex. : `["verbal-analyzer", "text-to-speech"]`) |
| `type`         | string | Type de message (ex. : `process_request`, `error`)                           |
| `timestamp`    | uint_64    | Horodatage UNIX du message                                                  |
| `data`         | object | Contenu spécifique au message                                               |

##  3. Logique du Serveur
Le serveur IA est responsable du routage des messages vers les microservices appropriés en fonction du champ `services`.
Il doit gérer les réponses des microservices et agréger les résultats lorsque plusieurs services sont demandés.

Le serveur commencera par envoyer un message `ping` à chaque microservice pour vérifier la connectivité. Les microservices doivent répondre avec un message `pong`.
Après la vérification réussie de la connexion, le serveur peut envoyer des demandes de traitement.

Voici la logique étape par étape pour l’audio :
1. **Vérification de la connexion** :
    - Le serveur IA envoie un `ping` à chaque microservice.
    - Les microservices répondent avec un `pong`.

2. **Demandes de traitement** :
    - D’abord, le serveur IA envoie une demande au microservice STT avec les données audio.
    - Le microservice STT traite l’audio et renvoie la transcription.
    - Ensuite, le serveur IA envoie la transcription au microservice Verbal Analyzer pour une analyse plus approfondie.
    - Le Verbal Analyzer traite le texte et renvoie les résultats d’analyse.
    - Le serveur enverra le texte au LLM pour générer des réponses.
    - Enfin, le serveur envoie la réponse générée au microservice TTS pour la convertir en parole.

3. **Gestion des réponses** :
    - Le serveur IA collecte les réponses de chaque microservice et les agrège en une réponse finale destinée au Frontend.

Voici une représentation schématique du processus :

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
Réponse Finale au Frontend
```

## 4. Gestion des Erreurs
Le serveur IA doit gérer les erreurs de communication et de traitement de manière robuste.
En cas d’erreur, le serveur doit envoyer un message `error` au microservice concerné avec un message descriptif dans le champ `data`.

Si une erreur survient pendant le traitement, le serveur doit également informer le Frontend.
