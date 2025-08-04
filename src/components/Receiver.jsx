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
    const c = peer.current.connect(inputId);
    conn.current = c;

    c.on("open", () => {
      c.send("receiver_ready");
    });

    c.on("data", (data) => {


      //   const decoder = new TextDecoder("utf-8");
      //   const text = decoder.decode(data);
      if (typeof data === "string") {
            console.log( 'dattatatata',{ data });
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
        console.log( 'tatatata',{ data });
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
    <div>
      <input
        type="text"
        value={inputId}
        onChange={(e) => setInputId(e.target.value)}
        placeholder="Enter Sender Room ID"
      />
      {progress !=="0" && <progress value={progress} max='100'></progress>}
      <button onClick={connectToSender}>Receive & Download</button>
    </div>
  );
}
