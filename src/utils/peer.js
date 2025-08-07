import { Peer } from "peerjs";
export function createPeer(id) {
  return new Peer(id, {
    host: "0.peerjs.com",
    port: 443,
    path: "/",
    secure: true,
    config: {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        // {
        //   username:
        //     "CVx15pqsYzn-2znQE9nRIiWFmovI-uxDi4gFeuQIWMmrg3FT6ao9FiAsOZYsd-B4AAAAAGiRuipwYXJ0aGliYW4=",
        //   credential: "48a5c96c-71d2-11f0-8421-0242ac140004",
        //   urls: [
        //     "turn:bn-turn1.xirsys.com:80?transport=udp",
        //     "turn:bn-turn1.xirsys.com:3478?transport=udp",
        //     "turn:bn-turn1.xirsys.com:80?transport=tcp",
        //     "turn:bn-turn1.xirsys.com:3478?transport=tcp",
        //     "turns:bn-turn1.xirsys.com:443?transport=tcp",
        //     "turns:bn-turn1.xirsys.com:5349?transport=tcp",
        //   ],
        // },
      ],
      //   iceServers: [
      //     { urls: "stun:stun.l.google.com:19302" }, // Google's STUN
      //     {
      //       url: "turn:turn.anyfirewall.com:443?transport=tcp",
      //       credential: "webrtc",
      //       username: "webrtc",
      //     },
      //   ],
      iceTransportPolicy: "all", // allows relay fallback
    },
  });
}
