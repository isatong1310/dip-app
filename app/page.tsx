"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import DipLogo from "./components/DipLogo";
import JoinSheet from "./components/JoinSheet";

const EMBERS = [
  { size: 3, x: "15%", delay: 0,   dur: 7   },
  { size: 2, x: "72%", delay: 1.2, dur: 9   },
  { size: 4, x: "42%", delay: 0.5, dur: 6   },
  { size: 2, x: "88%", delay: 2.1, dur: 8   },
  { size: 3, x: "28%", delay: 1.8, dur: 10  },
  { size: 2, x: "60%", delay: 0.3, dur: 7.5 },
];

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 28 },
  },
};

const TRIPS = ["京都3日間", "沖縄2泊", "箱根day trip", "富士登山", "台湾4日間", "湘南day out"];

export default function HomePage() {
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleJoin = (code: string) => {
    console.log("Joining room:", code);
    setSheetOpen(false);
    alert(`ルーム ${code} に参加中... (Step 3 - 画面3で実装予定)`);
  };

  const handleCreate = () => {
    alert("ルーム作成画面 (Step 3 - 画面3で実装予定)");
  };

  return (
    <>
      <main
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          padding: "0 24px",
          maxWidth: 480,
          margin: "0 auto",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Floating ember particles */}
        {EMBERS.map((e, i) => (
          <motion.div
            key={i}
            aria-hidden="true"
            animate={{ y: [0, -160, -300], opacity: [0, 0.55, 0], scale: [1, 1.3, 0.5] }}
            transition={{ duration: e.dur, repeat: Infinity, delay: e.delay, ease: "easeOut" }}
            style={{
              position: "absolute",
              bottom: "12%",
              left: e.x,
              width: e.size,
              height: e.size,
              borderRadius: "50%",
              background: "#FF5C2B",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        ))}

        {/* Campfire radial glow */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: -140,
            left: "50%",
            transform: "translateX(-50%)",
            width: 520,
            height: 420,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(255,92,43,0.13) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Header */}
        <header style={{ paddingTop: 52, position: "relative", zIndex: 1 }}>
          <DipLogo size={28} />
        </header>

        {/* Hero */}
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingBottom: 24,
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Eyebrow pill */}
          <motion.div variants={fadeUp} style={{ marginBottom: 22 }}>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: "#FF5C2B",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                padding: "5px 14px",
                border: "1px solid rgba(255,92,43,0.28)",
                borderRadius: 100,
                display: "inline-block",
              }}
            >
              写真人狼 型 記憶のスパイス
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            variants={fadeUp}
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(42px, 12vw, 58px)",
              lineHeight: 1.04,
              color: "#F2EDE7",
              letterSpacing: "-0.03em",
              marginBottom: 10,
            }}
          >
            旅の
            <br />
            <motion.span
              initial={{ rotate: 0 }}
              animate={{ rotate: -1.8 }}
              transition={{ delay: 0.8, type: "spring" as const, stiffness: 200 }}
              style={{
                color: "#FF5C2B",
                display: "inline-block",
                transformOrigin: "left center",
              }}
            >
              &ldquo;裏側&rdquo;
            </motion.span>
            を、
            <br />
            暴きあえ。
          </motion.h1>

          {/* Sub copy */}
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 15,
              lineHeight: 1.72,
              color: "#8A8277",
              marginBottom: 48,
            }}
          >
            帰り道に写真を出し合い、
            <br />
            AIが全員の「裏の役職」を暴く。
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <motion.button
              className="btn-ember"
              whileHover={{ scale: 1.035, rotate: "0.6deg" }}
              whileTap={{ scale: 0.96, rotate: "0deg" }}
              transition={{ type: "spring" as const, stiffness: 420, damping: 22 }}
              onClick={() => setSheetOpen(true)}
              style={{ width: "100%", height: 62, fontSize: 17, letterSpacing: "-0.01em", gap: 10 }}
            >
              ルームに参加する
              <span style={{ fontSize: 21 }}>🎯</span>
            </motion.button>

            <motion.button
              className="btn-outline"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring" as const, stiffness: 420, damping: 22 }}
              onClick={handleCreate}
              style={{ width: "100%", height: 56, fontSize: 16 }}
            >
              ルームを作る
            </motion.button>
          </motion.div>

          {/* Scrolling trips marquee */}
          <motion.div variants={fadeUp} style={{ marginTop: 56, overflow: "hidden" }}>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 11,
                color: "#8A8277",
                marginBottom: 12,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              みんなが遊んでる旅
            </p>
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              style={{ display: "flex", gap: 10, width: "max-content" }}
            >
              {[...TRIPS, ...TRIPS].map((t, i) => (
                <div
                  key={i}
                  style={{
                    padding: "7px 18px",
                    background: "rgba(242,237,231,0.04)",
                    border: "1px solid rgba(242,237,231,0.1)",
                    borderRadius: 100,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 13,
                    color: "#8A8277",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Footer hint */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.7 }}
          style={{ paddingBottom: 36, textAlign: "center", position: "relative", zIndex: 1 }}
        >
          <button
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 13,
              color: "#8A8277",
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
              textDecorationColor: "rgba(138,130,119,0.35)",
              textUnderlineOffset: 3,
              padding: "8px 0",
            }}
          >
            はじめての人へ →
          </button>
        </motion.footer>
      </main>

      <JoinSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onJoin={handleJoin}
      />
    </>
  );
}
