import React, { useEffect } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  animate,
  AnimatePresence,
} from "framer-motion";
import "../Loader.css";
import StarsCanvas from "./StarCanvas";

const COLORS = ["#1E67C6", "#CE84CF", "#DD335C", "#13FFAA"];

const Loader = () => {
  const color = useMotionValue(COLORS[0]);
  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;

  useEffect(() => {
    animate(color, COLORS, {
      ease: "easeInOut",
      duration: 3,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  return (
    <AnimatePresence mode="wait">
        <motion.div
          style={{
            backgroundImage,
            height: "100vh",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 -z-10"
        >
          <div className="body">
            <span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </span>
            <div className="base">
              <span></span>
              <div className="face"></div>
            </div>
          </div>
          <div className="longfazers">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="absolute inset-0 z-0">
            <StarsCanvas />
          </div>
        </motion.div>
    </AnimatePresence>
  );
};

export default Loader;
