"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface NumPadProps {
  onComplete: (code: string) => void;
}

const keys = [
  "1", "2", "3",
  "4", "5", "6",
  "7", "8", "9",
  "⌫", "0", "→",
];

export default function NumPad({ onComplete }: NumPadProps) {
  const [digits, setDigits] = useState<string[]>([]);
  const MAX = 6;

  const handleKey = (k: string) => {
    if (k === "⌫") {
      setDigits((d) => d.slice(0, -1));
      return;
    }
    if (k === "→") {
      if (digits.length === MAX) onComplete(digits.join(""));
      return;
    }
    if (digits.length >= MAX) return;
    const next = [...digits, k];
    setDigits(next);
    if (next.length === MAX) {
      // auto-submit after brief visual pause
      setTimeout(() => onComplete(next.join("")), 220);
    }
  };

  return (
    <div style={{ width: "100%", paddingTop: 8 }}>
      {/* Code display */}
      <div
        style={{
          display: "flex",
          gap: 10,
          justifyContent: "center",
          marginBottom: 28,
        }}
      >
        {Array.from({ length: MAX }).map((_, i) => {
          const filled = digits[i] !== undefined;
          return (
            <motion.div
              key={i}
              animate={{
                scale: filled ? [1, 1.18, 1] : 1,
                borderColor: filled
                  ? "rgba(255,92,43,0.7)"
                  : "rgba(242,237,231,0.15)",
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{
                width: 44,
                height: 52,
                border: "1.5px solid",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: 22,
                color: "#F2EDE7",
                background: filled
                  ? "rgba(255,92,43,0.1)"
                  : "rgba(242,237,231,0.04)",
              }}
            >
              <AnimatePresence mode="wait">
                {filled && (
                  <motion.span
                    key={digits[i]}
                    initial={{ y: 8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -8, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {digits[i]}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Numpad grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10,
        }}
      >
        {keys.map((k) => {
          const isSubmit = k === "→";
          const isActive = digits.length === MAX;
          return (
            <motion.button
              key={k}
              className="numpad-key"
              whileTap={{ scale: 0.92 }}
              onClick={() => handleKey(k)}
              style={{
                ...(isSubmit && isActive
                  ? {
                      background: "#FF5C2B",
                      borderColor: "#FF5C2B",
                      color: "#0F0E0D",
                    }
                  : {}),
                ...(isSubmit && !isActive
                  ? { opacity: 0.35, cursor: "not-allowed" }
                  : {}),
              }}
              aria-label={k === "⌫" ? "Delete" : k === "→" ? "Submit" : k}
            >
              {k}
            </motion.button>
          );
        })}
      </div>

      <p
        style={{
          textAlign: "center",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 13,
          color: "#8A8277",
          marginTop: 20,
        }}
      >
        ルームコードは6桁の数字だよ
      </p>
    </div>
  );
}
