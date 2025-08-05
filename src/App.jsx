import React, { useState } from "react";
import Sender from "./components/Sender";
import Receiver from "./components/Receiver";
import Loader from "./components/Loader";
import { motion } from "framer-motion";
import clsx from "clsx";

function NeonButton({ label, onClick, color = "blue" }) {
  const colors = {
    blue: {
      border: "border-cyan-500",
      text: "text-white",
      hoverBg: "hover:bg-cyan-500",
      shadow: "shadow-[0_0_10px_cyan]",
      hoverShadow: "hover:shadow-[0_0_20px_cyan]",
    },
    green: {
      border: "border-lime-500",
      text: "text-white",
      hoverBg: "hover:bg-lime-500",
      shadow: "shadow-[0_0_10px_lime]",
      hoverShadow: "hover:shadow-[0_0_20px_lime]",
    },
  };

  const c = colors[color] || colors.blue;

  return (
    <button
      onClick={onClick}
      className={clsx(
        "relative border px-6 cursor-pointer py-3 text-lg font-semibold rounded-md uppercase transition-all duration-300 bg-transparent",
        c.text,
        c.border,
        // c.shadow,
        c.hoverBg,
        c.hoverShadow
      )}
    >
      <span className="relative z-10">{label}</span>
      <span
        className={clsx(
          "absolute inset-0 rounded-md blur-sm opacity-0 transition-opacity duration-300",
          color === "blue" ? "bg-cyan-400" : "bg-lime-400",
          "hover:opacity-20"
        )}
      ></span>
    </button>
  );
}

export default function App() {
  const [role, setRole] = useState("");

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Loader />
      {!role && (
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center h-full text-center space-y-6 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-lime-500 to-violet-400 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] animate-pulse">
            P2P File Transfer
          </h1>

          <p className="text-lg text-white/80 font-medium drop-shadow-sm">
            Share files directly with anyone – no cloud needed.
          </p>

          <div className="flex space-x-6">
            <NeonButton
              color="blue"
              label="🚀 Create Room (Sender)"
              onClick={() => setRole("sender")}
            />
            <NeonButton
              color="green"
              label="🎯 Join Room (Receiver)"
              onClick={() => setRole("receiver")}
            />
          </div>
        </motion.div>
      )}

      {role === "sender" && <Sender />}
      {role === "receiver" && <Receiver />}
    </div>
  );
}
