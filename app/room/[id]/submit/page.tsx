"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DipLogo from "../../../components/DipLogo";

/* ─────────────────────────────────────────
   Constants
───────────────────────────────────────── */
const TOTAL_QUESTIONS = 3;
const CURRENT_Q = 1;
const TIMER_START = 3 * 60; // 3 minutes

const MEMBERS = ["まり", "たく", "ゆい", "けん", "そら", "あおい"];

const PROMPTS = [
  "この旅行で一番\n暗躍していたのは？",
  "最もテンションの\n差が激しかったのは？",
  "裏で全部\n仕切っていたのは？",
];

const TAGS = [
  { id: "face",    label: "#顔がヤバい" },
  { id: "guilty",  label: "#戦犯"       },
  { id: "play",    label: "#ファインプレー" },
  { id: "weird",   label: "#謎の行動"   },
  { id: "sleep",   label: "#爆睡"       },
  { id: "eat",     label: "#食欲モンスター" },
  { id: "plan",    label: "#実は計画してた" },
  { id: "solo",    label: "#気づいたら単独行動" },
];

// Dummy image placeholders (colored squares as mock photos)
const DUMMY_PHOTOS = [
  { bg: "#2D1F1A", label: "📸" },
  { bg: "#1A2D1F", label: "🌄" },
  { bg: "#1A1F2D", label: "🌊" },
];

/* ─────────────────────────────────────────
   Subcomponents
───────────────────────────────────────── */

// Progress bar + timer header
function SubmitHeader({
  current,
  total,
  seconds,
}: {
  current: number;
  total: number;
  seconds: number;
}) {
  const progress = (current - 1) / total;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const isUrgent = seconds <= 60;

  return (
    <div style={{ paddingTop: 52, paddingBottom: 0 }}>
      {/* Top row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <DipLogo size={20} />

        {/* Timer */}
        <motion.div
          animate={
            isUrgent
              ? { scale: [1, 1.06, 1], color: ["#FF5C2B", "#FF5C2B"] }
              : { color: "#8A8277" }
          }
          transition={isUrgent ? { duration: 0.9, repeat: Infinity } : {}}
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: "0.04em",
            color: isUrgent ? "#FF5C2B" : "#8A8277",
          }}
        >
          {mins}:{String(secs).padStart(2, "0")}
        </motion.div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 6,
        }}
      >
        <div
          style={{
            flex: 1,
            height: 3,
            background: "rgba(242,237,231,0.08)",
            borderRadius: 100,
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(current / total) * 100}%` }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              height: "100%",
              background: "#FF5C2B",
              borderRadius: 100,
            }}
          />
        </div>
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 600,
            fontSize: 12,
            color: "#8A8277",
            flexShrink: 0,
          }}
        >
          Q{current}/{total}
        </span>
      </div>
    </div>
  );
}

// Prompt card with grain texture
function PromptCard({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.12, type: "spring" as const, stiffness: 280, damping: 26 }}
      style={{
        position: "relative",
        background: "#1C1A17",
        border: "1px solid rgba(242,237,231,0.1)",
        borderRadius: 22,
        padding: "28px 24px",
        marginBottom: 32,
        overflow: "hidden",
      }}
    >
      {/* Grain overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "180px 180px",
          opacity: 0.045,
          borderRadius: 22,
          pointerEvents: "none",
        }}
      />
      {/* Ember corner glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: -40,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,92,43,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 11,
          fontWeight: 600,
          color: "#FF5C2B",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: 14,
        }}
      >
        今回のお題
      </p>
      <p
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: 26,
          color: "#F2EDE7",
          lineHeight: 1.25,
          letterSpacing: "-0.02em",
          margin: 0,
          whiteSpace: "pre-line",
          position: "relative",
          zIndex: 1,
        }}
      >
        {text}
      </p>
    </motion.div>
  );
}

// Member chip
function MemberChip({
  name,
  selected,
  index,
  onClick,
}: {
  name: string;
  selected: boolean;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: 0.18 + index * 0.05,
        type: "spring" as const,
        stiffness: 320,
        damping: 26,
      }}
      onClick={onClick}
      whileTap={{ scale: 0.93 }}
      style={{
        flexShrink: 0,
        padding: "10px 18px",
        borderRadius: 100,
        border: `1.5px solid ${selected ? "#FF5C2B" : "rgba(242,237,231,0.12)"}`,
        background: selected ? "rgba(255,92,43,0.1)" : "rgba(242,237,231,0.03)",
        cursor: "pointer",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: selected ? 600 : 500,
        fontSize: 15,
        color: selected ? "#F2EDE7" : "#8A8277",
        transform: selected ? "scale(1.06)" : "scale(1)",
        transition:
          "border-color 0.18s, background 0.18s, color 0.18s, transform 0.18s",
        display: "flex",
        alignItems: "center",
        gap: 7,
      }}
    >
      <motion.span
        animate={{ scale: selected ? [1, 1.4, 1] : 1 }}
        transition={{ duration: 0.25 }}
      >
        {selected ? "🎯" : "👤"}
      </motion.span>
      {name}
    </motion.button>
  );
}

// Photo upload area
function PhotoUpload({
  photo,
  onSelect,
}: {
  photo: { bg: string; label: string } | null;
  onSelect: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, type: "spring" as const, stiffness: 280, damping: 26 }}
      style={{ marginBottom: 30 }}
    >
      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 11,
          fontWeight: 600,
          color: "#8A8277",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        証拠写真を叩きつけろ
      </p>

      <AnimatePresence mode="wait">
        {!photo ? (
          /* Empty state */
          <motion.button
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            onClick={onSelect}
            whileTap={{ scale: 0.97 }}
            style={{
              width: "100%",
              height: 180,
              borderRadius: 20,
              border: "1.5px dashed rgba(242,237,231,0.18)",
              background: "rgba(242,237,231,0.02)",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              transition: "border-color 0.2s",
            }}
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ fontSize: 36 }}
            >
              📷
            </motion.div>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 15,
                color: "#8A8277",
                margin: 0,
              }}
            >
              タップして写真を選ぶ
            </p>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 12,
                color: "rgba(138,130,119,0.5)",
                margin: 0,
              }}
            >
              カメラロールから選択
            </p>
          </motion.button>
        ) : (
          /* Photo selected */
          <motion.div
            key="filled"
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring" as const, stiffness: 320, damping: 26 }}
            style={{ position: "relative", borderRadius: 20, overflow: "hidden" }}
          >
            {/* Dummy photo display */}
            <div
              style={{
                width: "100%",
                height: 200,
                background: photo.bg,
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 52,
                border: "1px solid rgba(242,237,231,0.1)",
                position: "relative",
              }}
            >
              <span>{photo.label}</span>
              {/* Subtle vignette */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(ellipse at center, transparent 50%, rgba(15,14,13,0.5) 100%)",
                  borderRadius: 20,
                }}
              />
            </div>

            {/* Reselect button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring" as const, stiffness: 400 }}
              onClick={onSelect}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "rgba(15,14,13,0.75)",
                border: "1px solid rgba(242,237,231,0.2)",
                borderRadius: 100,
                padding: "6px 14px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 12,
                fontWeight: 600,
                color: "#F2EDE7",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
              }}
            >
              再選択
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Tag chip
function TagChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      animate={{
        borderColor: selected ? "rgba(245,200,66,0.6)" : "rgba(242,237,231,0.12)",
        background: selected ? "rgba(245,200,66,0.1)" : "rgba(242,237,231,0.03)",
        color: selected ? "#F5C842" : "#8A8277",
      }}
      transition={{ duration: 0.16 }}
      style={{
        padding: "8px 14px",
        borderRadius: 100,
        border: "1.5px solid",
        cursor: "pointer",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: selected ? 600 : 500,
        fontSize: 13,
      }}
    >
      {label}
    </motion.button>
  );
}

/* ─────────────────────────────────────────
   Waiting State
───────────────────────────────────────── */
function WaitingScreen() {
  const [dots, setDots] = useState(".");
  useEffect(() => {
    const t = setInterval(
      () => setDots((d) => (d.length >= 3 ? "." : d + ".")),
      500
    );
    return () => clearInterval(t);
  }, []);

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 280, damping: 26 },
    },
  };

  return (
    <motion.div
      key="waiting"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 32px",
        textAlign: "center",
        position: "relative",
        background: "#0F0E0D",
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,92,43,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* Spinning ember icon */}
        <motion.div
          variants={item}
          style={{ marginBottom: 28 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              border: "2px solid rgba(255,92,43,0.2)",
              borderTopColor: "#FF5C2B",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
            }}
          >
            🔥
          </motion.div>
        </motion.div>

        <motion.p
          variants={item}
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 24,
            color: "#F2EDE7",
            letterSpacing: "-0.02em",
            marginBottom: 12,
          }}
        >
          送信完了！
        </motion.p>

        <motion.p
          variants={item}
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 15,
            color: "#8A8277",
            lineHeight: 1.7,
            marginBottom: 40,
          }}
        >
          全員の入力を待ってるよ{dots}
          <br />
          あとで答え合わせしよう
        </motion.p>

        {/* Member submission status (mock) */}
        <motion.div variants={item} style={{ width: "100%" }}>
          <div
            style={{
              background: "#1C1A17",
              border: "1px solid rgba(242,237,231,0.08)",
              borderRadius: 18,
              padding: "6px 18px",
              textAlign: "left",
            }}
          >
            {[
              { name: "あなた", done: true },
              { name: "まり",   done: true },
              { name: "たく",   done: false },
              { name: "ゆい",   done: false },
            ].map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.4 + i * 0.1,
                  type: "spring" as const,
                  stiffness: 300,
                  damping: 28,
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 0",
                  borderBottom:
                    i < 3
                      ? "1px solid rgba(242,237,231,0.06)"
                      : "none",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: m.done ? "#7BC67E" : "rgba(138,130,119,0.3)",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 14,
                    color: m.done ? "#F2EDE7" : "#8A8277",
                    flex: 1,
                  }}
                >
                  {m.name}
                </span>
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 12,
                    color: m.done ? "#7BC67E" : "#8A8277",
                  }}
                >
                  {m.done ? "提出済み ✓" : "入力中..."}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.p
          variants={item}
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 12,
            color: "rgba(138,130,119,0.5)",
            marginTop: 24,
          }}
        >
          全員が提出したら自動的に次へ進むよ
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
export default function SubmitPage() {
  const [timeLeft, setTimeLeft] = useState(TIMER_START);
  const [target, setTarget] = useState<string | null>(null);
  const [photo, setPhoto] = useState<{ bg: string; label: string } | null>(null);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [freeText, setFreeText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const photoIndex = useRef(0);

  // Countdown
  useEffect(() => {
    if (submitted) return;
    const t = setInterval(() => {
      setTimeLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [submitted]);

  const handlePhotoSelect = useCallback(() => {
    setPhoto(DUMMY_PHOTOS[photoIndex.current % DUMMY_PHOTOS.length]);
    photoIndex.current += 1;
  }, []);

  const toggleTag = useCallback((id: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const canSubmit = !!target && !!photo;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
  };

  if (submitted) return <WaitingScreen />;

  return (
    <div
      style={{
        background: "#0F0E0D",
        minHeight: "100dvh",
        position: "relative",
      }}
    >
      {/* Scrollable content */}
      <div
        style={{
          padding: "0 24px",
          maxWidth: 480,
          margin: "0 auto",
          paddingBottom: 120,
        }}
      >
        {/* Header */}
        <SubmitHeader
          current={CURRENT_Q}
          total={TOTAL_QUESTIONS}
          seconds={timeLeft}
        />

        {/* Prompt card */}
        <div style={{ marginTop: 22 }}>
          <PromptCard text={PROMPTS[CURRENT_Q - 1]} />
        </div>

        {/* ── Target selection ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, type: "spring" as const, stiffness: 280, damping: 26 }}
          style={{ marginBottom: 30 }}
        >
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              color: "#8A8277",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            犯人はこいつだ
          </p>

          <div
            className="no-scrollbar"
            style={{
              display: "flex",
              gap: 10,
              overflowX: "auto",
              marginLeft: -24,
              marginRight: -24,
              paddingLeft: 24,
              paddingRight: 24,
              paddingBottom: 4,
            }}
          >
            {MEMBERS.map((name, i) => (
              <MemberChip
                key={name}
                name={name}
                selected={target === name}
                index={i}
                onClick={() => setTarget(target === name ? null : name)}
              />
            ))}
          </div>

          {/* Selection confirmation */}
          <AnimatePresence>
            {target && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 13,
                  color: "#FF5C2B",
                  marginTop: 12,
                  fontWeight: 600,
                }}
              >
                🎯 {target} を指名中
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Photo upload ── */}
        <PhotoUpload photo={photo} onSelect={handlePhotoSelect} />

        {/* ── Tags ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, type: "spring" as const, stiffness: 280, damping: 26 }}
          style={{ marginBottom: 24 }}
        >
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              color: "#8A8277",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            理由のタグ
            <span
              style={{
                marginLeft: 8,
                fontSize: 10,
                color: "rgba(138,130,119,0.5)",
                fontWeight: 400,
                textTransform: "none",
                letterSpacing: 0,
              }}
            >
              複数選択OK
            </span>
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 18,
            }}
          >
            {TAGS.map((tag) => (
              <TagChip
                key={tag.id}
                label={tag.label}
                selected={selectedTags.has(tag.id)}
                onClick={() => toggleTag(tag.id)}
              />
            ))}
          </div>

          {/* Free text */}
          <div style={{ position: "relative" }}>
            <input
              type="text"
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              placeholder="どうしても言いたいこと（任意）"
              maxLength={60}
              style={{
                width: "100%",
                padding: "14px 18px",
                background: "#1C1A17",
                border: "1px solid rgba(242,237,231,0.1)",
                borderRadius: 14,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 14,
                color: "#F2EDE7",
                outline: "none",
                caretColor: "#FF5C2B",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,92,43,0.45)";
                e.currentTarget.style.boxShadow =
                  "0 0 0 2px rgba(255,92,43,0.15)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(242,237,231,0.1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* ── Fixed CTA ── */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "16px 24px 44px",
          background: "linear-gradient(to top, #0F0E0D 65%, transparent)",
          zIndex: 20,
        }}
      >
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          {/* Validation hint */}
          <AnimatePresence>
            {!canSubmit && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 12,
                  color: "#8A8277",
                  textAlign: "center",
                  marginBottom: 10,
                }}
              >
                {!target && !photo
                  ? "犯人と写真を選ぼう"
                  : !target
                  ? "犯人を指名しよう"
                  : "証拠写真を選ぼう"}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            className="btn-ember"
            onClick={handleSubmit}
            animate={{
              opacity: canSubmit ? 1 : 0.35,
              scale: canSubmit ? 1 : 0.99,
            }}
            whileHover={canSubmit ? { scale: 1.03, rotate: "0.4deg" } : {}}
            whileTap={canSubmit ? { scale: 0.97 } : {}}
            transition={{ type: "spring" as const, stiffness: 420, damping: 22 }}
            style={{
              width: "100%",
              height: 62,
              fontSize: 17,
              letterSpacing: "-0.01em",
              cursor: canSubmit ? "pointer" : "not-allowed",
            }}
          >
            次の質問へ →
          </motion.button>
        </div>
      </div>
    </div>
  );
}
