"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import DipLogo from "./components/DipLogo";
import JoinSheet from "./components/JoinSheet";

/* ─────────────────────────────────────────
   Constants
───────────────────────────────────────── */
const EMBERS = [
  { size: 3, x: "12%", delay: 0,   dur: 7   },
  { size: 2, x: "75%", delay: 1.4, dur: 9   },
  { size: 4, x: "44%", delay: 0.6, dur: 6   },
  { size: 2, x: "88%", delay: 2.2, dur: 8   },
  { size: 3, x: "28%", delay: 1.9, dur: 10  },
  { size: 2, x: "62%", delay: 0.4, dur: 7.5 },
];

const BAKU_LINE =
  "おかえり。今日の旅の記憶、僕に食べさせてよ。最高のスパイスをかけて返すからさ。";

const TRIPS = ["京都3日間", "沖縄2泊", "箱根day trip", "富士登山", "台湾4日間", "湘南day out"];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.3 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 290, damping: 26 } },
};

function generateRoomId(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/* ─────────────────────────────────────────
   Typewriter hook
───────────────────────────────────────── */
function useTypewriter(text: string, delay = 1400) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const start = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(iv); setDone(true); }
      }, 38);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(start);
  }, [text, delay]);

  return { displayed, done };
}

/* ─────────────────────────────────────────
   BAKU character — pure CSS/Framer
───────────────────────────────────────── */
function BakuCharacter() {
  return (
    <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto" }}>

      {/* Blue outer glow ring */}
      <motion.div
        aria-hidden="true"
        animate={{ scale: [1, 1.18, 1], opacity: [0.18, 0.32, 0.18] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          inset: -20,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(56,182,255,0.22) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      {/* Floating body */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 2, -2, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", inset: 0 }}
      >
        {/* Main body — teardrop shape via border-radius */}
        <motion.div
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(135deg, rgba(56,182,255,0.25) 0%, rgba(30,80,140,0.45) 60%, rgba(15,14,13,0.8) 100%)",
            borderRadius: "55% 55% 60% 60% / 60% 60% 50% 50%",
            border: "1px solid rgba(56,182,255,0.3)",
            backdropFilter: "blur(4px)",
          }}
        />

        {/* Lens / eye — inner circle */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -52%)",
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(180,230,255,0.9) 0%, rgba(56,182,255,0.6) 40%, rgba(10,50,120,0.8) 100%)",
            border: "1.5px solid rgba(120,200,255,0.5)",
            boxShadow: "0 0 18px rgba(56,182,255,0.5), inset 0 0 10px rgba(255,255,255,0.2)",
          }}
        >
          {/* Pupil */}
          <motion.div
            animate={{ scale: [1, 0.85, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: 16, height: 16,
              borderRadius: "50%",
              background: "rgba(5,20,60,0.95)",
            }}
          />
          {/* Specular highlight */}
          <div style={{
            position: "absolute",
            top: 8, right: 9,
            width: 6, height: 6,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.9)",
          }} />
        </motion.div>

        {/* Wispy "antennae" — left */}
        <motion.div
          animate={{ rotate: [-12, 8, -12], scaleY: [1, 1.15, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: 4, left: 22,
            width: 3, height: 22,
            borderRadius: 4,
            background: "linear-gradient(to top, rgba(56,182,255,0.5), transparent)",
            transformOrigin: "bottom center",
          }}
        />
        {/* Wispy "antennae" — right */}
        <motion.div
          animate={{ rotate: [10, -6, 10], scaleY: [1, 1.12, 1] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          style={{
            position: "absolute",
            top: 2, right: 20,
            width: 3, height: 26,
            borderRadius: 4,
            background: "linear-gradient(to top, rgba(56,182,255,0.4), transparent)",
            transformOrigin: "bottom center",
          }}
        />
      </motion.div>

      {/* Orbiting blue spark */}
      <motion.div
        aria-hidden="true"
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        style={{ position: "absolute", inset: -4 }}
      >
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            position: "absolute",
            top: 0, left: "50%",
            transform: "translateX(-50%)",
            width: 6, height: 6,
            borderRadius: "50%",
            background: "#38B6FF",
            boxShadow: "0 0 8px rgba(56,182,255,0.8)",
          }}
        />
      </motion.div>

      {/* Second orbit (counter) */}
      <motion.div
        aria-hidden="true"
        animate={{ rotate: -360 }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        style={{ position: "absolute", inset: -10 }}
      >
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          style={{
            position: "absolute",
            bottom: 0, left: "50%",
            transform: "translateX(-50%)",
            width: 4, height: 4,
            borderRadius: "50%",
            background: "#FF5C2B",
            boxShadow: "0 0 6px rgba(255,92,43,0.7)",
          }}
        />
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   BAKU speech bubble + typewriter
───────────────────────────────────────── */
function BakuSpeech() {
  const { displayed, done } = useTypewriter(BAKU_LINE, 1200);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1.0, type: "spring" as const, stiffness: 260, damping: 24 }}
      style={{
        position: "relative",
        background: "rgba(20,40,80,0.55)",
        border: "1px solid rgba(56,182,255,0.2)",
        borderRadius: 18,
        padding: "16px 20px",
        marginTop: 20,
      }}
    >
      {/* Tail */}
      <div style={{
        position: "absolute",
        top: -8, left: "50%",
        transform: "translateX(-50%)",
        width: 14, height: 8,
        clipPath: "polygon(0% 100%, 50% 0%, 100% 100%)",
        background: "rgba(56,182,255,0.2)",
      }} />

      <p style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 14,
        lineHeight: 1.75,
        color: "rgba(242,237,231,0.82)",
        margin: 0,
        minHeight: "4.5em",
      }}>
        {displayed}
        {/* Cursor blink */}
        {!done && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.7, repeat: Infinity }}
            style={{ display: "inline-block", width: 2, height: "1em", background: "#38B6FF", marginLeft: 2, verticalAlign: "text-bottom" }}
          />
        )}
      </p>

      {/* BAKU name tag */}
      <div style={{
        marginTop: 10,
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#38B6FF" }} />
        <span style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: 11,
          color: "rgba(56,182,255,0.75)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}>BAKU / 記憶の精霊</span>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Main page
───────────────────────────────────────── */
export default function HomePage() {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleJoin = (code: string) => {
    setSheetOpen(false);
    router.push(`/room/${code}`);
  };

  const handleCreate = () => {
    router.push(`/room/${generateRoomId()}`);
  };

  return (
    <>
      <main style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        padding: "0 24px",
        maxWidth: 480,
        margin: "0 auto",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Ember particles (orange) */}
        {EMBERS.map((e, i) => (
          <motion.div
            key={i}
            aria-hidden="true"
            animate={{ y: [0, -180, -320], opacity: [0, 0.5, 0], scale: [1, 1.3, 0.4] }}
            transition={{ duration: e.dur, repeat: Infinity, delay: e.delay, ease: "easeOut" }}
            style={{
              position: "absolute", bottom: "10%", left: e.x,
              width: e.size, height: e.size, borderRadius: "50%",
              background: "#FF5C2B", pointerEvents: "none", zIndex: 0,
            }}
          />
        ))}

        {/* Campfire glow (orange, bottom) */}
        <div aria-hidden="true" style={{
          position: "absolute", bottom: -140, left: "50%", transform: "translateX(-50%)",
          width: 540, height: 420, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(255,92,43,0.11) 0%, transparent 70%)",
          pointerEvents: "none", zIndex: 0,
        }} />

        {/* BAKU ambient glow (blue, center-ish) */}
        <motion.div
          aria-hidden="true"
          animate={{ opacity: [0.12, 0.22, 0.12] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", top: "22%", left: "50%", transform: "translateX(-50%)",
            width: 340, height: 260, borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(56,182,255,0.18) 0%, transparent 70%)",
            pointerEvents: "none", zIndex: 0, filter: "blur(20px)",
          }}
        />

        {/* Header */}
        <header style={{ paddingTop: 52, position: "relative", zIndex: 1 }}>
          <DipLogo size={26} />
        </header>

        {/* Hero section */}
        <motion.section
          variants={stagger}
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
          {/* Eyebrow */}
          <motion.div variants={fadeUp} style={{ marginBottom: 28 }}>
            <span style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 11, fontWeight: 600, color: "#FF5C2B",
              letterSpacing: "0.14em", textTransform: "uppercase",
              padding: "5px 14px",
              border: "1px solid rgba(255,92,43,0.28)", borderRadius: 100,
              display: "inline-block",
            }}>
              写真人狼 型 記憶のスパイス
            </span>
          </motion.div>

          {/* BAKU character */}
          <motion.div variants={fadeUp} style={{ marginBottom: 4 }}>
            <BakuCharacter />
          </motion.div>

          {/* BAKU speech */}
          <motion.div variants={fadeUp} style={{ marginBottom: 36 }}>
            <BakuSpeech />
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(36px, 10vw, 50px)",
              lineHeight: 1.06,
              color: "#F2EDE7",
              letterSpacing: "-0.03em",
              marginBottom: 32,
            }}
          >
            旅の記憶を、
            <br />
            <motion.span
              initial={{ rotate: 0 }}
              animate={{ rotate: -1.6 }}
              transition={{ delay: 0.9, type: "spring" as const, stiffness: 200 }}
              style={{ color: "#FF5C2B", display: "inline-block", transformOrigin: "left center" }}
            >
              もっと面白く
            </motion.span>
            しよう。
          </motion.h1>

          {/* CTA buttons */}
          <motion.div variants={fadeUp} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <motion.button
              className="btn-ember"
              whileHover={{ scale: 1.035, rotate: "0.5deg" }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring" as const, stiffness: 420, damping: 22 }}
              onClick={() => setSheetOpen(true)}
              style={{ width: "100%", height: 62, fontSize: 17, letterSpacing: "-0.01em", gap: 10 }}
            >
              ルームに参加する
              <span style={{ fontSize: 20 }}>🎯</span>
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

          {/* Marquee */}
          <motion.div variants={fadeUp} style={{ marginTop: 48, overflow: "hidden" }}>
            <p style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 11, color: "#8A8277", marginBottom: 12,
              letterSpacing: "0.06em", textTransform: "uppercase",
            }}>
              みんなが遊んでる旅
            </p>
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              style={{ display: "flex", gap: 10, width: "max-content" }}
            >
              {[...TRIPS, ...TRIPS].map((t, i) => (
                <div key={i} style={{
                  padding: "7px 18px",
                  background: "rgba(242,237,231,0.04)",
                  border: "1px solid rgba(242,237,231,0.09)",
                  borderRadius: 100,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 13, color: "#8A8277", whiteSpace: "nowrap",
                }}>
                  {t}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.7 }}
          style={{ paddingBottom: 36, textAlign: "center", position: "relative", zIndex: 1 }}
        >
          <button style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 13, color: "#8A8277",
            background: "none", border: "none", cursor: "pointer",
            textDecoration: "underline",
            textDecorationColor: "rgba(138,130,119,0.35)",
            textUnderlineOffset: 3, padding: "8px 0",
          }}>
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
