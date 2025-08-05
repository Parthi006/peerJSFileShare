import { Peer } from 'peerjs';
export function createPeer(id) {
  return new Peer(id, {
    host: "0.peerjs.com",
    port: 443,
    path: '/',
    secure: true,
    config: {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" }, // Google's STUN
      {
        urls: "turn:your.turn.server:3478",
        username: "user",
        credential: "pass"
      }
    ]
  }
  });
}
