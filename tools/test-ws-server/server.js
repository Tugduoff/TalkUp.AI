#!/usr/bin/env node

/**
 * Simple WebSocket Echo Server for Testing
 *
 * Usage:
 *   node test-ws-server.js [port]
 *
 * Example:
 *   node test-ws-server.js 8080
 */

import { WebSocketServer } from 'ws';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.argv[2] || 8080;

// Create recordings directory if it doesn't exist
const recordingsDir = path.join(__dirname, 'recordings');
if (!fs.existsSync(recordingsDir)) {
  fs.mkdirSync(recordingsDir);
  console.log(`📁 Created recordings directory: ${recordingsDir}`);
}

const wss = new WebSocketServer({ port });

console.log(`\n🚀 WebSocket server started on ws://localhost:${port}`);
console.log(`📡 Waiting for connections...\n`);

let connectionCount = 0;

wss.on('connection', (ws, req) => {
  connectionCount++;
  const clientId = connectionCount;
  const clientIp = req.socket.remoteAddress;

  console.log(`✅ Client #${clientId} connected from ${clientIp}`);

  let messageCount = 0;
  let audioPacketCount = 0;
  let totalAudioBytes = 0;
  let audioPackets = []; // Store audio packets for reconstruction
  let audioMimeType = null;
  let recordingStartTime = Date.now();

  ws.on('message', (data) => {
    messageCount++;

    try {
      // Try to parse as JSON
      const message = JSON.parse(data.toString());

      if (message.type === 'audio') {
        audioPacketCount++;
        const audioSize = message.data ? Buffer.from(message.data, 'base64').length : 0;
        totalAudioBytes += audioSize;

        // Store the packet for reconstruction
        audioPackets.push({
          sequenceNumber: message.sequenceNumber,
          data: message.data,
          timestamp: message.timestamp,
        });

        // Store mime type from first packet
        if (!audioMimeType && message.mimeType) {
          audioMimeType = message.mimeType;
        }

        console.log(
          `🎤 Client #${clientId} | Audio packet #${message.sequenceNumber} | ` +
          `${audioSize} bytes | ${message.mimeType} | ` +
          `Total: ${(totalAudioBytes / 1024).toFixed(2)} KB`
        );

        // Echo back confirmation
        ws.send(JSON.stringify({
          type: 'audio_ack',
          sequenceNumber: message.sequenceNumber,
          received: true,
          timestamp: Date.now(),
        }));
      } else if (message.type === 'ping') {
        console.log(`🏓 Client #${clientId} | Ping received:`, message.payload || 'no payload');

        // Send pong response
        ws.send(JSON.stringify({
          type: 'pong',
          timestamp: Date.now(),
          originalTimestamp: message.timestamp,
        }));
      } else {
        console.log(`📨 Client #${clientId} | JSON message #${messageCount}:`, message);

        // Echo back the message
        ws.send(JSON.stringify({
          type: 'echo',
          originalMessage: message,
          timestamp: Date.now(),
        }));
      }
    } catch (e) {
      // Not JSON, treat as plain text
      const text = data.toString();
      console.log(`💬 Client #${clientId} | Text message #${messageCount}: "${text}"`);

      // Echo back
      ws.send(`Echo: ${text}`);
    }
  });

  ws.on('close', (code, reason) => {
    console.log(
      `❌ Client #${clientId} disconnected | Code: ${code} | ` +
      `Reason: ${reason || 'None'} | ` +
      `Messages: ${messageCount} | ` +
      `Audio packets: ${audioPacketCount} | ` +
      `Total audio: ${(totalAudioBytes / 1024).toFixed(2)} KB`
    );

    // Reconstruct audio file if we received audio packets
    if (audioPackets.length > 0) {
      reconstructAudioFile(clientId, audioPackets, audioMimeType, recordingStartTime);
    }
  });

  ws.on('error', (error) => {
    console.error(`⚠️  Client #${clientId} error:`, error.message);
  });

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Connected to test WebSocket server',
    clientId: clientId,
    timestamp: Date.now(),
  }));
});

/**
 * Reconstruct audio file from packets
 */
function reconstructAudioFile(clientId, packets, mimeType, startTime) {
  try {
    console.log(`\n🎬 Reconstructing audio file for Client #${clientId}...`);

    // Sort packets by sequence number
    packets.sort((a, b) => a.sequenceNumber - b.sequenceNumber);

    // Determine file extension from mime type
    const extension = getFileExtension(mimeType);
    const timestamp = new Date(startTime).toISOString().replace(/[:.]/g, '-');
    const rawFilename = `client-${clientId}_${timestamp}_raw.${extension}`;
    const rawFilepath = path.join(recordingsDir, rawFilename);
    const finalFilename = `client-${clientId}_${timestamp}.${extension}`;
    const finalFilepath = path.join(recordingsDir, finalFilename);

    // Decode base64 and write to temporary raw file
    const buffers = packets.map(packet => Buffer.from(packet.data, 'base64'));
    const audioBuffer = Buffer.concat(buffers);

    fs.writeFileSync(rawFilepath, audioBuffer);

    console.log(`✅ Raw audio file saved: ${rawFilename}`);
    console.log(`   📍 Location: ${rawFilepath}`);
    console.log(`   📦 Size: ${(audioBuffer.length / 1024).toFixed(2)} KB`);
    console.log(`   🎵 Format: ${mimeType || 'unknown'}`);
    console.log(`   📊 Packets: ${packets.length}`);

    // Try to remux with ffmpeg for better playback compatibility
    console.log(`\n🔧 Attempting to remux with ffmpeg for better compatibility...`);

    try {
      // First, check the input file's audio channel configuration
      const probeChannels = execSync(
        `ffprobe -v error -select_streams a:0 -show_entries stream=channels -of default=noprint_wrappers=1:nokey=1 "${rawFilepath}"`,
        { encoding: 'utf-8' }
      ).trim();

      console.log(`   🔍 Input channels: ${probeChannels}`);

      // Convert to proper stereo: take first channel (if stereo) or duplicate (if mono) to both L+R
      const ffmpegOutput = execSync(
        `ffmpeg -i "${rawFilepath}" -af "pan=stereo|c0=c0|c1=c0" -c:a libopus -b:a 64k -y "${finalFilepath}" 2>&1`,
        { encoding: 'utf-8' }
      );

      console.log(`✅ Remuxed file saved: ${finalFilename}`);
      console.log(`   📍 Location: ${finalFilepath}`);

      // Get duration from the remuxed file
      const ffprobeOutput = execSync(
        `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${finalFilepath}"`,
        { encoding: 'utf-8' }
      ).trim();

      const duration = parseFloat(ffprobeOutput);
      console.log(`   ⏱️  Duration: ${duration.toFixed(2)}s`);
      console.log(`\n💡 Play with: ffplay "${finalFilepath}" or vlc "${finalFilepath}"\n`);

      console.log(`   (Raw file kept for debugging: ${rawFilename})\n`);
    } catch (ffmpegError) {
      console.log(`⚠️  ffmpeg error occurred:`);
      console.log(`   ${ffmpegError.message}`);
      if (ffmpegError.stderr) {
        console.log(`   stderr: ${ffmpegError.stderr}`);
      }
      if (ffmpegError.stdout) {
        console.log(`   stdout: ${ffmpegError.stdout}`);
      }
      console.log(`   Using raw concatenated file instead: ${rawFilepath}`);
      console.log(`   The raw file may have playback issues (stereo with one channel)`);
      console.log(`\n💡 Try playing anyway: ffplay "${rawFilepath}"\n`);
    }
  } catch (error) {
    console.error(`❌ Error reconstructing audio file:`, error.message);
  }
}

/**
 * Get file extension from MIME type
 */
function getFileExtension(mimeType) {
  if (!mimeType) return 'bin';

  const mimeToExt = {
    'audio/webm': 'webm',
    'audio/ogg': 'ogg',
    'audio/mp4': 'mp4',
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
  };

  // Check for exact match first
  if (mimeToExt[mimeType]) {
    return mimeToExt[mimeType];
  }

  // Check for partial match (e.g., "audio/webm;codecs=opus")
  for (const [mime, ext] of Object.entries(mimeToExt)) {
    if (mimeType.startsWith(mime)) {
      return ext;
    }
  }

  return 'bin';
}

wss.on('error', (error) => {
  console.error('❌ WebSocket server error:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down server...');
  wss.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

console.log('💡 Tips:');
console.log('  - Messages are automatically echoed back');
console.log('  - Audio packets are logged with size and format');
console.log('  - Audio files are saved to ./recordings/ when client disconnects');
console.log('  - Ping messages receive pong responses');
console.log('  - Press Ctrl+C to stop\n');
