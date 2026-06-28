"use client";

import { motion } from "framer-motion";

export default function DipLogo({ size = 32 }: { size?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, rotate: -4 }}
      animate={{ opacity: 1, rotate: -2 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: "inline-block" }}
    >
      <span
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: size,
          color: "#F2EDE7",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        DIP
        <span style={{ color: "#FF5C2B" }}>.</span>
      </span>
    </motion.div>
  );
}
