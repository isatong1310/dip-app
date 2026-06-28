"use client";

import { motion, AnimatePresence } from "framer-motion";
import NumPad from "./NumPad";

interface JoinSheetProps {
  open: boolean;
  onClose: () => void;
  onJoin: (code: string) => void;
}

export default function JoinSheet({ open, onClose, onJoin }: JoinSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="bottom-sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring" as const,
              stiffness: 340,
              damping: 32,
              mass: 0.9,
            }}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 60,
              background: "#1C1A17",
              borderRadius: "24px 24px 0 0",
              padding: "20px 24px 44px",
              border: "1px solid rgba(242,237,231,0.1)",
              borderBottom: "none",
            }}
          >
            {/* Handle bar */}
            <div
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                background: "rgba(242,237,231,0.2)",
                margin: "0 auto 28px",
              }}
            />

            {/* Title */}
            <h2
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: 22,
                color: "#F2EDE7",
                marginBottom: 6,
                textAlign: "center",
              }}
            >
              コードを入力
            </h2>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 14,
                color: "#8A8277",
                textAlign: "center",
                marginBottom: 28,
              }}
            >
              ホストから教えてもらったやつ
            </p>

            <NumPad onComplete={onJoin} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
