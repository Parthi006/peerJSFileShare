import React, { useState } from "react";
import Sender from "./components/Sender";
import Receiver from "./components/Receiver";

export default function App() {
  const [role, setRole] = useState("");

  return (
    <div style={{ padding: 20 }}>
      {!role && (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
          <h1>P2P File Transfer</h1>
          <p>Select your role:</p>
          <button onClick={() => setRole("sender")}>
            Create Room (Sender)
          </button>
          <button onClick={() => setRole("receiver")}>
            Join Room (Receiver)
          </button>
        </div>
      )}

      {role === "sender" && <Sender />}
      {role === "receiver" && <Receiver />}
    </div>
  );
}
