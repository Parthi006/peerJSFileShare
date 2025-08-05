import React, { useEffect, useRef, useState } from "react";
import { createPeer } from "../utils/peer";

export default function Receiver() {
  const [inputId, setInputId] = useState("");
  const [progress, setProgress] = useState("0");
  const fileMeta = useRef(null);
  const fileRef = useRef([]);
  const peer = useRef();
  const conn = useRef();

  useEffect(() => {
    peer.current = createPeer();
    peer.current.on("open", (id) => {
      console.log("Receiver ID:", id);
    });
  }, []);

  const connectToSender = () => {
    const c = peer.current.connect(inputId, { reliable: true });
    conn.current = c;

    c.on("open", () => {
      c.send("receiver_ready");
    });

    c.on("data", (data) => {
      //   const decoder = new TextDecoder("utf-8");
      //   const text = decoder.decode(data);
      if (typeof data === "string") {
        console.log("dattatatata", { data });
        if (data === "_complete_") {
          const blob = new Blob(fileRef.current);
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = fileMeta.current.name;
          a.click();
          URL.revokeObjectURL(url);
        } else if (JSON.parse(data).hasOwnProperty("name")) {
          fileMeta.current = JSON.parse(data);
          fileRef.current = [];
        }
      } else {
        console.log("tatatata", { data });
        fileRef.current.push(data);
        setProgress(
          (fileRef.current.reduce((acc, buffer) => acc + buffer.byteLength, 0) /
            fileMeta.current.size) *
            100
        );
      }
    });
  };

  return (
<div className="min-h-screen flex items-center justify-center px-4">
  <div className="p-6 rounded-xl bg-gradient-to-br from-black via-gray-900 to-black shadow-[0_0_20px_rgba(0,255,255,0.2)] text-white max-w-md w-full text-center space-y-6">

    <h2 className="text-xl font-bold text-cyan-400 tracking-wide">🔗 Join a Room</h2>

    <input
      type="text"
      autoFocus
      value={inputId}
      onChange={(e) => setInputId(e.target.value)}
      placeholder="Enter Sender Room ID"
      className="w-full p-2 bg-gray-800 rounded-md text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder:text-gray-400"
    />

    {progress !== "0" ? (
      <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
        <div
          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    ) : (
      <button
        onClick={connectToSender}
        className="bg-gradient-to-r cursor-pointer from-pink-600 to-purple-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2 px-6 rounded-md shadow-[0_0_10px_rgba(255,0,255,0.6)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.7)]"
      >
        ⚡ Receive & Download
      </button>
    )}
  </div>
</div>

  );
}
