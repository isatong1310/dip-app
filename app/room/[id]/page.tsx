"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DipLogo from "../../components/DipLogo";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
type Phase = "create" | "lobby";

interface QuestionSet {
  id: string;
  emoji: string;
  label: string;
  desc: string;
  color: string;
  borderColor: string;
}

interface Member {
  id: string;
  name: string;
  isHost: boolean;
}

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */
const QUESTION_SETS: QuestionSet[] = [
  {
    id: "gachi",
    emoji: "🔥",
    label: "ガチ勢",
    desc: "本音で暴く\n容赦なし",
    color: "rgba(255,92,43,0.08)",
    borderColor: "#FF5C2B",
  },
  {
    id: "yuru",
    emoji: "🎭",
    label: "ゆるめ",
    desc: "笑えるネタ\n全員参加型",
    color: "rgba(245,200,66,0.08)",
    borderColor: "#F5C842",
  },
  {
    id: "egu",
    emoji: "💀",
    label: "えぐめ",
    desc: "深掘り系\n覚悟が要る",
    color: "rgba(123,198,126,0.08)",
    borderColor: "#7BC67E",
  },
  {
    id: "love",
    emoji: "💕",
    label: "恋愛縛り",
    desc: "カップル向け\nドキドキ枠",
    color: "rgba(255,92,43,0.06)",
    borderColor: "#FF9AB2",
  },
];

const MOCK_MEMBERS_POOL = ["まり", "たく", "ゆい", "けん", "そら", "あおい", "りん"];

/* ─────────────────────────────────────────
   Subcomponents
───────────────────────────────────────── */

// Toast notification
function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 60, opacity: 0 }}
      transition={{ type: "spring" as const, stiffness: 380, damping: 30 }}
      style={{
        position: "fixed",
        bottom: 40,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#1C1A17",
        border: "1px solid rgba(245,200,66,0.4)",
        borderRadius: 100,
        padding: "12px 24px",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 14,
        fontWeight: 600,
        color: "#F5C842",
        whiteSpace: "nowrap",
        zIndex: 200,
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      {message}
    </motion.div>
  );
}

// Member list item
function MemberItem({ member, index }: { member: Member; index: number }) {
  const AVATARS = ["🦊", "🐺", "🦁", "🐯", "🦅", "🐉", "🦋"];
  const avatar = AVATARS[index % AVATARS.length];

  return (
    <motion.div
      initial={{ x: -28, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring" as const, stiffness: 340, damping: 28, delay: index * 0.04 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "13px 0",
        borderBottom: "1px solid rgba(242,237,231,0.06)",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "rgba(242,237,231,0.06)",
          border: "1px solid rgba(242,237,231,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          flexShrink: 0,
        }}
      >
        {avatar}
      </div>
      <div style={{ flex: 1 }}>
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 600,
            fontSize: 15,
            color: "#F2EDE7",
            margin: 0,
          }}
        >
          {member.name}
          {member.isHost && (
            <span
              style={{
                marginLeft: 8,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#FF5C2B",
                background: "rgba(255,92,43,0.12)",
                border: "1px solid rgba(255,92,43,0.25)",
                borderRadius: 100,
                padding: "2px 8px",
                verticalAlign: "middle",
              }}
            >
              HOST
            </span>
          )}
        </p>
      </div>
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#7BC67E",
          flexShrink: 0,
        }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Phase A — Create Room
───────────────────────────────────────── */
function PhaseCreate({ onCreated }: { onCreated: (tripName: string) => void }) {
  const [tripName, setTripName] = useState("");
  const [focused, setFocused] = useState(false);
  const [selected, setSelected] = useState<string>("gachi");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!tripName.trim()) return;
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 900));
    onCreated(tripName.trim());
  };

  return (
    <motion.div
      key="create"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh",
        padding: "0 24px",
        maxWidth: 480,
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* Header */}
      <header style={{ paddingTop: 52, paddingBottom: 0 }}>
        <DipLogo size={24} />
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 28,
            color: "#F2EDE7",
            letterSpacing: "-0.02em",
            marginTop: 20,
            marginBottom: 6,
          }}
        >
          ルームを建てる
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18, duration: 0.4 }}
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 14,
            color: "#8A8277",
          }}
        >
          友達にコードを共有して、一緒に暴き合おう
        </motion.p>
      </header>

      {/* Form */}
      <div style={{ flex: 1, paddingTop: 36, paddingBottom: 120 }}>
        {/* Trip name input */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring" as const, stiffness: 280, damping: 26 }}
        >
          <label
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              color: "#8A8277",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: 12,
            }}
          >
            旅の名前
          </label>
          <div style={{ position: "relative" }}>
            <motion.div
              animate={{
                boxShadow: focused
                  ? "0 0 0 2px rgba(255,92,43,0.5)"
                  : "0 0 0 1px rgba(242,237,231,0.1)",
              }}
              transition={{ duration: 0.2 }}
              style={{ borderRadius: 16 }}
            >
              <input
                type="text"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="例：京都2泊3日"
                maxLength={30}
                style={{
                  width: "100%",
                  padding: "18px 20px",
                  background: "#1C1A17",
                  border: "none",
                  borderRadius: 16,
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 20,
                  color: "#F2EDE7",
                  outline: "none",
                  caretColor: "#FF5C2B",
                  letterSpacing: "-0.01em",
                }}
              />
            </motion.div>
            {/* Char count */}
            <span
              style={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 12,
                color: "rgba(138,130,119,0.6)",
              }}
            >
              {tripName.length}/30
            </span>
          </div>
        </motion.div>

        {/* Question set selector */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, type: "spring" as const, stiffness: 280, damping: 26 }}
          style={{ marginTop: 36 }}
        >
          <label
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              color: "#8A8277",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: 14,
            }}
          >
            お題のセット
          </label>

          {/* Horizontal scroll container */}
          <div
            className="no-scrollbar"
            style={{
              display: "flex",
              gap: 12,
              overflowX: "auto",
              paddingBottom: 4,
              marginLeft: -24,
              marginRight: -24,
              paddingLeft: 24,
              paddingRight: 24,
            }}
          >
            {QUESTION_SETS.map((qs) => {
              const isSelected = selected === qs.id;
              return (
                <motion.button
                  key={qs.id}
                  onClick={() => setSelected(qs.id)}
                  animate={{
                    scale: isSelected ? 1.04 : 1,
                    borderColor: isSelected
                      ? qs.borderColor
                      : "rgba(242,237,231,0.1)",
                    background: isSelected ? qs.color : "rgba(242,237,231,0.02)",
                  }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring" as const, stiffness: 400, damping: 22 }}
                  style={{
                    flexShrink: 0,
                    width: 120,
                    padding: "20px 16px",
                    borderRadius: 18,
                    border: "1.5px solid",
                    cursor: "pointer",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 32 }}>{qs.emoji}</span>
                  <span
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 700,
                      fontSize: 15,
                      color: isSelected ? "#F2EDE7" : "#8A8277",
                      transition: "color 0.2s",
                    }}
                  >
                    {qs.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 11,
                      color: isSelected ? "rgba(242,237,231,0.6)" : "rgba(138,130,119,0.6)",
                      lineHeight: 1.5,
                      whiteSpace: "pre-line",
                      transition: "color 0.2s",
                    }}
                  >
                    {qs.desc}
                  </span>

                  {/* Selection indicator dot */}
                  <motion.div
                    animate={{ scale: isSelected ? 1 : 0, opacity: isSelected ? 1 : 0 }}
                    transition={{ type: "spring" as const, stiffness: 500, damping: 30 }}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: qs.borderColor,
                    }}
                  />
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Tips section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            marginTop: 32,
            padding: "16px 18px",
            background: "rgba(255,92,43,0.05)",
            border: "1px solid rgba(255,92,43,0.15)",
            borderRadius: 14,
          }}
        >
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 13,
              color: "rgba(242,237,231,0.5)",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            💡 参加人数は<strong style={{ color: "rgba(242,237,231,0.75)" }}>2〜8人</strong>がベスト。帰り道の車内や、二次会のノリで始めよう。
          </p>
        </motion.div>
      </div>

      {/* Fixed CTA */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "16px 24px 40px",
          background: "linear-gradient(to top, #0F0E0D 70%, transparent)",
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <motion.button
            className="btn-ember"
            onClick={handleCreate}
            disabled={!tripName.trim() || loading}
            whileHover={tripName.trim() && !loading ? { scale: 1.03, rotate: "0.4deg" } : {}}
            whileTap={tripName.trim() && !loading ? { scale: 0.97 } : {}}
            transition={{ type: "spring" as const, stiffness: 420, damping: 22 }}
            animate={{
              opacity: tripName.trim() ? 1 : 0.4,
            }}
            style={{
              width: "100%",
              height: 62,
              fontSize: 17,
              letterSpacing: "-0.01em",
              cursor: tripName.trim() && !loading ? "pointer" : "not-allowed",
            }}
          >
            {loading ? (
              <motion.span
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                建設中...🏕️
              </motion.span>
            ) : (
              <>ルームを建てる 🏕️</>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Phase B — Lobby
───────────────────────────────────────── */
function PhaseLobby({ tripName, roomCode }: { tripName: string; roomCode: string }) {
  const [members, setMembers] = useState<Member[]>([
    { id: "host", name: "あなた（ホスト）", isHost: true },
  ]);
  const [toast, setToast] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const memberIndexRef = useRef(0);

  // Mock: add members every few seconds
  useEffect(() => {
    const addMember = () => {
      if (memberIndexRef.current >= MOCK_MEMBERS_POOL.length) return;
      const name = MOCK_MEMBERS_POOL[memberIndexRef.current];
      memberIndexRef.current += 1;
      setMembers((prev) => [
        ...prev,
        { id: name + Date.now(), name, isHost: false },
      ]);
    };

    const timings = [2200, 4800, 7400, 10500, 14000, 18000];
    const timers = timings.map((delay) => setTimeout(addMember, delay));
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
    } catch {
      // fallback: no-op in demo
    }
    setCopied(true);
    setToast("コピーしたよ！✓");
    setTimeout(() => setCopied(false), 2000);
  };

  const memberCount = members.length;
  const maxMembers = 8;

  return (
    <motion.div
      key="lobby"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh",
        maxWidth: 480,
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: -80,
          left: "50%",
          transform: "translateX(-50%)",
          width: 400,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(255,92,43,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ padding: "52px 24px 0", position: "relative", zIndex: 1 }}>
        <DipLogo size={22} />

        {/* Trip name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          style={{ marginTop: 22, marginBottom: 32 }}
        >
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 12,
              color: "#8A8277",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            今日の旅
          </p>
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 26,
              color: "#F2EDE7",
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            🏕️ {tripName}
          </h2>
        </motion.div>

        {/* Room code block */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.22, type: "spring" as const, stiffness: 260, damping: 24 }}
          onClick={handleCopy}
          style={{
            background: "#1C1A17",
            border: `1.5px solid ${copied ? "rgba(245,200,66,0.5)" : "rgba(242,237,231,0.1)"}`,
            borderRadius: 20,
            padding: "24px 20px",
            textAlign: "center",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            transition: "border-color 0.3s",
            marginBottom: 32,
          }}
        >
          {/* Label */}
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              color: "#8A8277",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            参加コード
          </p>

          {/* BIG CODE */}
          <motion.p
            animate={{ scale: copied ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 0.25 }}
            style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: 72,
              letterSpacing: "0.18em",
              color: copied ? "#F5C842" : "#F2EDE7",
              lineHeight: 1,
              marginBottom: 14,
              transition: "color 0.25s",
            }}
          >
            {roomCode}
          </motion.p>

          {/* Copy hint */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 13,
              color: copied ? "#F5C842" : "#8A8277",
              transition: "color 0.25s",
            }}
          >
            <span style={{ fontSize: 15 }}>{copied ? "✓" : "📋"}</span>
            {copied ? "コピーしたよ！" : "タップでコピー"}
          </div>

          {/* Shimmer overlay on copy */}
          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ x: "-100%", opacity: 0.6 }}
                animate={{ x: "100%", opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(90deg, transparent, rgba(245,200,66,0.12), transparent)",
                  pointerEvents: "none",
                }}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Member count bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              color: "#8A8277",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            集まってる人
          </p>
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              color: memberCount >= 2 ? "#7BC67E" : "#8A8277",
            }}
          >
            <motion.span
              key={memberCount}
              initial={{ scale: 1.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring" as const, stiffness: 500, damping: 28 }}
              style={{ display: "inline-block" }}
            >
              {memberCount}
            </motion.span>
            /{maxMembers}人
          </div>
        </motion.div>

        {/* Member list */}
        <div
          style={{
            background: "#1C1A17",
            border: "1px solid rgba(242,237,231,0.08)",
            borderRadius: 18,
            padding: "4px 18px",
            marginBottom: 100,
          }}
        >
          <AnimatePresence initial={false}>
            {members.map((m, i) => (
              <MemberItem key={m.id} member={m} index={i} />
            ))}
          </AnimatePresence>

          {/* Waiting dots when few members */}
          {memberCount < 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                padding: "14px 0",
                display: "flex",
                gap: 5,
                justifyContent: "center",
              }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.2, 0.7, 0.2] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.22 }}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#8A8277",
                  }}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "16px 24px 40px",
          background: "linear-gradient(to top, #0F0E0D 65%, transparent)",
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 13,
              color: "#8A8277",
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            {memberCount < 2
              ? "あと1人以上集めよう"
              : `${memberCount}人が集合！いつでもスタートできるよ 🔥`}
          </motion.p>

          <motion.button
            className="btn-ember"
            animate={{
              opacity: memberCount >= 2 ? 1 : 0.35,
              scale: memberCount >= 2 ? 1 : 0.98,
            }}
            whileHover={memberCount >= 2 ? { scale: 1.03, rotate: "0.4deg" } : {}}
            whileTap={memberCount >= 2 ? { scale: 0.97 } : {}}
            transition={{ type: "spring" as const, stiffness: 420, damping: 22 }}
            style={{
              width: "100%",
              height: 62,
              fontSize: 17,
              cursor: memberCount >= 2 ? "pointer" : "not-allowed",
              letterSpacing: "-0.01em",
            }}
            onClick={() => {
              if (memberCount >= 2) alert("お題・写真入力画面へ（Step 3 - 画面4で実装予定）");
            }}
          >
            全員揃った、スタート！🎯
          </motion.button>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast message={toast} onDone={() => setToast(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Main Page — orchestrates phases
───────────────────────────────────────── */
function generateRoomCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export default function RoomPage() {
  const [phase, setPhase] = useState<Phase>("create");
  const [tripName, setTripName] = useState("");
  const [roomCode] = useState(generateRoomCode);

  const handleCreated = (name: string) => {
    setTripName(name);
    setPhase("lobby");
  };

  return (
    <div style={{ background: "#0F0E0D", minHeight: "100dvh", position: "relative" }}>
      <AnimatePresence mode="wait">
        {phase === "create" ? (
          <PhaseCreate key="create" onCreated={handleCreated} />
        ) : (
          <PhaseLobby key="lobby" tripName={tripName} roomCode={roomCode} />
        )}
      </AnimatePresence>
    </div>
  );
}
