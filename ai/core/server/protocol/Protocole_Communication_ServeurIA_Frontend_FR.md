# 🧠 Protocole de Communication WebSocket — Serveur IA ↔ Frontend
**Version 1.0 — Octobre 2025**

## 1. Introduction
Ce document définit le protocole de communication entre le **Serveur IA** (implémenté en C++ avec Crow)
et le **Frontend** de l'application: Talkup.AI. Il vise à assurer une communication fiable et extensible
entre le client et le serveur, notamment pour la transmission en temps réel de données audio/vidéo
et la délégation de traitements à des microservices Python (ex: Speech-to-Text, Vision, etc.).

---

## 2. Structure générale des messages
Les communications entre le Frontend et le Serveur IA se font via **WebSocket**.
Tous les messages sont au format **JSON** et doivent contenir les champs suivants :

| Champ | Type | Description |
|-------|------|-------------|
| `type` | string | Type du message (ex: `ping`, `stream_chunk`, `error`) |
| `timestamp` | int | Horodatage UNIX du message |
| `data` | object | Contenu spécifique au message |

---

## 3. Niveau basique — Tests et connexion
Le serveur doit gérer des commandes simples pour tester la disponibilité et l’état de la connexion.

**Messages pris en charge :**
- `ping` → utilisé par le client pour tester la connexion.
- `status` → permet d’obtenir des informations sur l’état du serveur IA.
- `error` → message retourné en cas d’erreur de protocole.

---

## 4. Niveau applicatif — Transmission audio/vidéo
Le Frontend peut envoyer des flux audio et vidéo pour traitement.

**Types de messages :**
- `stream_start` : début de flux (type : audio, vidéo, etc.)
- `stream_chunk` : envoi d’un fragment (binaire encodé en Base64 ou frame WebSocket binaire)
- `stream_end` : fin du flux.

Le serveur peut répondre avec :
- `transcript_update`
- `analysis_result`

### Exemple : Frontend → Serveur IA
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

### Exemple : Serveur IA → Frontend
```json
{
  "type": "transcript_update",
  "stream_id": "abc123",
  "text": "Bonjour, comment puis-je t’aider ?",
  "confidence": 0.94
}
```

---

## 5. Niveau avancé — Serveur IA ↔ Microservices
Le protocole est conçu pour évoluer vers une architecture modulaire où le Serveur IA délègue certaines tâches à des microservices Python.

**Messages internes :**
- `task_request` : envoi d’une tâche à un microservice
- `task_result` : retour du résultat au Serveur IA

Chaque message est lié à un `session_id` et un `service_type`.

---

## 6. Sécurité et versioning
- Utiliser **WSS (WebSocket sécurisé)**
- Authentification via **token** ou **clé API**
- Un champ `protocol_version` permet de gérer la compatibilité entre versions

---

## 7. Conclusion
Ce protocole fournit une base solide pour la communication en temps réel entre un Frontend et un Serveur IA,
tout en restant extensible vers une architecture microservices. Il est conçu pour être **simple**, **robuste** et **évolutif**.
