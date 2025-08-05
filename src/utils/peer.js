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
      { url: "relay1.expressturn.com:3480", username: "000000002069734054", credential: 'cBRqCyW/nnXXTUu8vpRXGC16XT4=' }
    ]
  }
  });
}
