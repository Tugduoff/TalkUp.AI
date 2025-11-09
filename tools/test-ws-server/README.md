# Test WebSocket Server (updated)

This folder contains a small test WebSocket server used by the web app's "Simulations" page. It accepts plain text and JSON messages, handles simple ping/pong, and collects base64-encoded audio packets which are reconstructed into audio files in `recordings/` when a client disconnects.

This README is updated to reflect the current file placement and how to run the server from the repository root.

---

## Where files live

- Server entry: `tools/test-ws-server/server.js`
- Package manifest: `tools/test-ws-server/package.json`
- Recordings output dir: `tools/test-ws-server/recordings/`

> Note: the package.json `start` script references `index.js` (legacy). Run the server directly with `node server.js` (instructions below) or update the package.json script if you prefer `npm start`.

---

## Quick start (recommended)

From the repository root run:

```bash
# install dependencies for the test server
cd tools/test-ws-server
npm ci

# start the server on the default port (8080)
node server.js

# or specify a custom port, e.g. 3000
node server.js 3000
```

You should see output similar to:

```
📁 Created recordings directory: /path/to/TalkUp.AI/tools/test-ws-server/recordings

� WebSocket server started on ws://localhost:8080
📡 Waiting for connections...
```

If you prefer to run it from the repository root without changing directories:

```bash
npx node tools/test-ws-server/server.js
```

---

## How it works (short)

- Accepts WebSocket connections and assigns a client id.
- If a client sends a JSON message with `type: 'audio'`, the server records the base64 `data` along with `sequenceNumber` and `timestamp`. It also stores `mimeType` from the first packet.
- On client disconnect, the server sorts packets by `sequenceNumber`, concatenates the decoded buffers and writes a raw file under `recordings/`.
- The server attempts to remux the raw file with `ffmpeg` (if available) to improve playback compatibility; if `ffmpeg` fails, the raw file is kept.
- For other JSON messages the server echoes a wrapped `type: 'echo'` response. Text messages are echoed prefixed with `Echo:`. Ping messages (`type: 'ping'`) get a `type: 'pong'` reply.

---

## Recordings

- Files are saved to `tools/test-ws-server/recordings/` with names like:
  `client-{id}_{timestamp}.{ext}` (and a `_raw` intermediate file)
- Common extensions: `.webm`, `.ogg`, `.mp4`, `.mp3`, `.wav` depending on the MIME type reported by the client.

Play the saved file with `ffplay`, `vlc` or your platform default player.

```bash
# play with ffplay
ffplay tools/test-ws-server/recordings/client-*.webm
```

---

## Testing from the web app

- The web app's simulation page expects a local test WebSocket at `ws://localhost:8080` by default. If you changed the port, update the UI or environment accordingly.
- Start the server, open the web app, go to the Simulations page, and use the controls to start a call / send messages. The server console prints connection and packet logs.

---

## Troubleshooting

- If you see `EADDRINUSE`: port already in use. Either stop the process using the port or run with a different port:

  ```bash
  node server.js 3001
  ```

- If `ffmpeg`/`ffprobe` are not installed the server will still save the raw concatenated file, but remuxing will be skipped and you'll see an ffmpeg error message in the console.

- If you get `MODULE_NOT_FOUND` for `ws`, run `npm ci` in `tools/test-ws-server`.

---

## Examples (server console)

```
✅ Client #1 connected from ::1
💬 Client #1 | Text message #1: "Hello WebSocket!"
🏓 Client #1 | Ping received: {message: 'Ping from client'}
🎤 Client #1 | Audio packet #0 | 523 bytes | audio/webm;codecs=opus | Total: 0.51 KB
❌ Client #1 disconnected | Code: 1000 | Reason: Call ended | Messages: 12 | Audio packets: 2 | Total audio: 1.00 KB
```

---

If you want, I can also update the `tools/test-ws-server/package.json` `start` script to point to `server.js` so `npm start` works as expected. Would you like me to apply that change?
