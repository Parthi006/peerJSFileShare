import { Peer } from 'peerjs';
export function createPeer(id) {
  return new Peer(id, {
    host: "0.peerjs.com",
    port: 443,
    path: '/',
    // secure: true,
  });
}
