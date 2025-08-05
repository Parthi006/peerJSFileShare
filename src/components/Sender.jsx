import React, { useEffect, useRef, useState } from "react";
import { createPeer } from "../utils/peer";

export default function Sender() {
  const [peerId, setPeerId] = useState("");
  const [conn, setConn] = useState(null);
  const [receiverReady, setReceiverReady] = useState(false);
  const fileInput = useRef();
  const peerRef = useRef(null);
  useEffect(() => {
    // if (peerRef.current) return;
    const newRoomId = Math.random().toString(36).substring(2, 8);
    const peer = createPeer(newRoomId);
    // peerRef.current = peer;

    peer.on("connection", (c) => {
      console.log({ c });
      c.on("open", () => {
        console.log("🔓 DataConnection is open");

        setConn(c); // Now it's safe to store and use // Or send something to confirm readiness
      });

      c.on("data", (data) => {
        if (data === "receiver_ready") {
          console.log("Receiver Ready!");
          setReceiverReady(true);
        }
      });
    });

    peer.on("open", (id) => {
      setPeerId(id);
    });

    // return () => {
    //   setTimeout(() => {
    //     peer.destroy();
    //     peerRef.current = null;
    //   }, 5000);
    // };
  }, []);

  const sendFile = () => {
    const file = fileInput.current.files[0];
    if (!file || !conn) return;

    // const encoder = new TextEncoder();
    // const metaBuffer = encoder.encode(
    //   "_meta_" +
    // );
    // const metaComplete = encoder.encode("_complete_");
    conn.send(JSON.stringify({ name: file.name, size: file.size }));

    const stream = file.stream();
    const reader = stream.getReader();

    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          conn.send("_complete_");
          break;
        }

        while (conn.bufferSize > 16 * 1024 * 1024) {
          await new Promise((r) => setTimeout(r, 10));
        }

        conn.send(value);
      }
    };
    pump();

    // const chunkSize = 128 * 1024;
    // let offset = 0;
    // const reader = new FileReader();

    // reader.onload = (e) => {
    //   conn.send(e.target.result);
    //   offset += chunkSize;
    //   if (offset < file.size) {
    //     readSlice(offset);
    //   } else {
    //     conn.send(metaComplete);
    //   }
    // };

    // const readSlice = (o) => {
    //   const slice = file.slice(o, o + chunkSize);
    //   reader.readAsArrayBuffer(slice);
    // };

    // readSlice(0);
  };

  return (
    <div>
      <p>
        <b>Room ID:</b> {peerId}
      </p>
      {receiverReady ? (
        <div>
          <input ref={fileInput} type="file" />
          <button onClick={sendFile}>Send File</button>
        </div>
      ) : (
        <p>Waiting for receiver to join and click "Receive & Download"</p>
      )}
    </div>
  );
}
