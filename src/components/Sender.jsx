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
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 rounded-xl bg-gradient-to-br from-black via-gray-900 to-black shadow-[0_0_20px_rgba(0,255,255,0.2)] text-white max-w-md w-full text-center space-y-6">
        <p className="text-lg font-semibold tracking-wide">
          <b className="text-cyan-400">Room ID:</b>{" "}
          <span className="text-pink-400">{peerId}</span>
        </p>

        {receiverReady ? (
          <div className="space-y-4">
            <input
              ref={fileInput}
              type="file"
              className="file:bg-gradient-to-r file:from-purple-600 file:to-pink-600 file:border-none file:text-white file:px-4 file:py-2 file:rounded-md file:cursor-pointer text-white bg-gray-800 rounded-md p-2 w-full"
            />

            <button
              onClick={sendFile}
              className="bg-gradient-to-r cursor-pointer from-cyan-500 to-blue-600 hover:from-pink-600 hover:to-purple-500 text-white font-bold py-2 px-6 rounded-md shadow-[0_0_10px_rgba(0,255,255,0.5)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,0,255,0.7)]"
            >
              🚀 Send File
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-300 animate-pulse">
            <span className="inline-block animate-spin">⏳</span>{" "}
            Waiting for receiver to join and click{" "}
            <span className="text-cyan-400 font-semibold">
              "Receive & Download"
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
