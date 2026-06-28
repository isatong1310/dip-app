"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import DipLogo from "../../components/DipLogo";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
type Phase = "create" | "lobby";

interface Situation {
  id: string;
  emoji: string;
  label: string;
  sub: string;
  color: string;
  rgb: string;
}

interface Member {
  id: string;
  name: string;
  isHost: boolean;
}

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */
const SITUATIONS: Situation[] = [
  { id: "drive",  emoji: "🚗", label: "ドライブ帰り", sub: "車内向け",             color: "#FF5C2B", rgb: "255,92,43"  },
  { id: "train",  emoji: "🚃", label: "電車帰り",     sub: "無言で遊べる写真重視", color: "#F5C842", rgb: "245,200,66" },
  { id: "party",  emoji: "🍻", label: "飲み会明け",   sub: "昨夜の暴露",           color: "#7BC67E", rgb: "123,198,126"},
  { id: "love",   emoji: "💕", label: "恋愛縛り",     sub: "カップル・ドキドキ枠", color: "#FF9AB2", rgb: "255,154,178"},
  { id: "custom", emoji: "✏️", label: "カスタム",     sub: "自分たちで作る",        color: "#38B6FF", rgb: "56,182,255" },
];

const Q_COUNT_OPTIONS = [
  { value: 1, label: "1問",  sub: "サクッと" },
  { value: 3, label: "3問",  sub: "標準"     },
  { value: 5, label: "5問",  sub: "がっつり" },
];

const TIME_OPTIONS = [
  { value: 60,  label: "サクサク", sub: "60秒" },
  { value: 180, label: "じっくり", sub: "3分"  },
];

const MOCK_MEMBERS_POOL = ["まり", "たく", "ゆい", "けん", "そら", "あおい"];

/* ─────────────────────────────────────────
   Shared sub-components
───────────────────────────────────────── */
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
        position: "fixed", bottom: 40, left: "50%", transform: "translateX(-50%)",
        background: "#1C1A17", border: "1px solid rgba(245,200,66,0.4)", borderRadius: 100,
        padding: "12px 24px", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14,
        fontWeight: 600, color: "#F5C842", whiteSpace: "nowrap", zIndex: 200,
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      {message}
    </motion.div>
  );
}

function MemberItem({ member, index }: { member: Member; index: number }) {
  const AVATARS = ["🦊", "🐺", "🦁", "🐯", "🦅", "🐉", "🦋"];
  return (
    <motion.div
      initial={{ x: -28, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring" as const, stiffness: 340, damping: 28, delay: index * 0.04 }}
      style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 0", borderBottom: "1px solid rgba(242,237,231,0.06)" }}
    >
      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(242,237,231,0.06)", border: "1px solid rgba(242,237,231,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
        {AVATARS[index % AVATARS.length]}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: 15, color: "#F2EDE7", margin: 0 }}>
          {member.name}
          {member.isHost && (
            <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#FF5C2B", background: "rgba(255,92,43,0.12)", border: "1px solid rgba(255,92,43,0.25)", borderRadius: 100, padding: "2px 8px", verticalAlign: "middle" }}>HOST</span>
          )}
        </p>
      </div>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#7BC67E", flexShrink: 0 }} />
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Segment control (reusable)
───────────────────────────────────────── */
function SegmentControl<T extends number>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; sub: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div style={{
      display: "flex",
      background: "rgba(242,237,231,0.04)",
      border: "1px solid rgba(242,237,231,0.1)",
      borderRadius: 14,
      padding: 4,
      gap: 4,
    }}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <motion.button
            key={String(opt.value)}
            onClick={() => onChange(opt.value)}
            animate={{
              background: active ? "#FF5C2B" : "transparent",
              color: active ? "#0F0E0D" : "#8A8277",
            }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.18 }}
            style={{
              flex: 1,
              padding: "10px 6px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: "-0.01em" }}>{opt.label}</span>
            <span style={{ fontSize: 10, opacity: 0.75 }}>{opt.sub}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────
   Phase A — Create
───────────────────────────────────────── */
function PhaseCreate({ onCreated }: { onCreated: (tripName: string) => void }) {
  const [tripName, setTripName]     = useState("");
  const [focused, setFocused]       = useState(false);
  const [situation, setSituation]   = useState("drive");
  const [customQ, setCustomQ]       = useState("");
  const [customFocus, setCustomFocus] = useState(false);
  const [qCount, setQCount]         = useState<1 | 3 | 5>(3);
  const [timeLimit, setTimeLimit]   = useState<60 | 180>(180);
  const [loading, setLoading]       = useState(false);

  const handleCreate = async () => {
    if (!tripName.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    onCreated(tripName.trim());
  };

  const currentSit = SITUATIONS.find((s) => s.id === situation)!;

  return (
    <motion.div
      key="create"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: "flex", flexDirection: "column", minHeight: "100dvh", padding: "0 24px", maxWidth: 480, margin: "0 auto" }}
    >
      <header style={{ paddingTop: 52, flexShrink: 0 }}>
        <DipLogo size={24} />
        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, color: "#F2EDE7", letterSpacing: "-0.02em", marginTop: 20, marginBottom: 6 }}
        >ルームを建てる</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: "#8A8277" }}
        >設定してBAKUを呼び覚まそう</motion.p>
      </header>

      <div style={{ flex: 1, paddingTop: 32, paddingBottom: 120, overflowY: "auto" }} className="no-scrollbar">

        {/* ── 旅の名前 ── */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, type: "spring" as const, stiffness: 280, damping: 26 }} style={{ marginBottom: 28 }}>
          <label style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 600, color: "#8A8277", letterSpacing: "0.1em", textTransform: "uppercase" as const, display: "block", marginBottom: 12 }}>旅の名前</label>
          <div style={{ position: "relative" }}>
            <motion.div animate={{ boxShadow: focused ? "0 0 0 2px rgba(255,92,43,0.5)" : "0 0 0 1px rgba(242,237,231,0.1)" }} transition={{ duration: 0.2 }} style={{ borderRadius: 16 }}>
              <input type="text" value={tripName} onChange={(e) => setTripName(e.target.value)}
                onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                placeholder="例：京都2泊3日" maxLength={30}
                style={{ width: "100%", padding: "18px 52px 18px 20px", background: "#1C1A17", border: "none", borderRadius: 16, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, color: "#F2EDE7", outline: "none", caretColor: "#FF5C2B" }}
              />
            </motion.div>
            <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: "rgba(138,130,119,0.6)" }}>{tripName.length}/30</span>
          </div>
        </motion.div>

        {/* ── シチュエーション ── */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, type: "spring" as const, stiffness: 280, damping: 26 }} style={{ marginBottom: 16 }}>
          <label style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 600, color: "#8A8277", letterSpacing: "0.1em", textTransform: "uppercase" as const, display: "block", marginBottom: 14 }}>シチュエーション</label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {SITUATIONS.map((sit) => {
              const isSel = situation === sit.id;
              return (
                <motion.button key={sit.id} onClick={() => setSituation(sit.id)}
                  animate={{
                    borderColor: isSel ? `rgba(${sit.rgb},0.65)` : "rgba(242,237,231,0.1)",
                    background: isSel ? `rgba(${sit.rgb},0.1)` : "rgba(242,237,231,0.02)",
                    scale: isSel ? 1.03 : 1,
                  }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring" as const, stiffness: 400, damping: 22 }}
                  style={{ padding: "16px 14px", borderRadius: 16, border: "1.5px solid", cursor: "pointer", textAlign: "left" as const, display: "flex", flexDirection: "column" as const, gap: 6, gridColumn: sit.id === "custom" ? "1 / -1" : undefined }}
                >
                  <span style={{ fontSize: 24 }}>{sit.emoji}</span>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: isSel ? "#F2EDE7" : "#8A8277", transition: "color 0.18s", lineHeight: 1.2 }}>{sit.label}</span>
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, color: "rgba(138,130,119,0.7)", lineHeight: 1.4 }}>{sit.sub}</span>
                  <AnimatePresence>
                    {isSel && (
                      <motion.div
                        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ scaleX: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        style={{ height: 2, borderRadius: 2, background: sit.color, transformOrigin: "left center", marginTop: 2 }}
                      />
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* ── カスタムお題アコーディオン ── */}
        <AnimatePresence>
          {situation === "custom" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: "hidden", marginBottom: 8 }}
            >
              <div style={{ paddingTop: 4, paddingBottom: 16 }}>
                <motion.div animate={{ boxShadow: customFocus ? "0 0 0 2px rgba(56,182,255,0.5)" : "0 0 0 1px rgba(56,182,255,0.2)" }} transition={{ duration: 0.2 }} style={{ borderRadius: 14 }}>
                  <input
                    type="text" value={customQ} onChange={(e) => setCustomQ(e.target.value)}
                    onFocus={() => setCustomFocus(true)} onBlur={() => setCustomFocus(false)}
                    placeholder="例：一番金使ったのは？"
                    maxLength={40}
                    style={{ width: "100%", padding: "15px 18px", background: "rgba(56,182,255,0.06)", border: "none", borderRadius: 14, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, color: "#F2EDE7", outline: "none", caretColor: "#38B6FF" }}
                  />
                </motion.div>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, color: "rgba(56,182,255,0.5)", marginTop: 8, marginLeft: 4 }}>✏️ BAKUがこのお題でゲームを進行します</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── ゲーム設定 ── */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, type: "spring" as const, stiffness: 280, damping: 26 }}
          style={{ background: "#1C1A17", border: "1px solid rgba(242,237,231,0.08)", borderRadius: 20, padding: "20px 18px", marginTop: 8, marginBottom: 24 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF5C2B" }} />
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 600, color: "#8A8277", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>ゲーム設定</span>
          </div>

          {/* 問題数 */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: "#8A8277", display: "block", marginBottom: 10 }}>問題数</label>
            <SegmentControl
              options={Q_COUNT_OPTIONS as { value: 1 | 3 | 5; label: string; sub: string }[]}
              value={qCount}
              onChange={(v) => setQCount(v as 1 | 3 | 5)}
            />
          </div>

          {/* 制限時間 */}
          <div>
            <label style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: "#8A8277", display: "block", marginBottom: 10 }}>制限時間</label>
            <SegmentControl
              options={TIME_OPTIONS as { value: 60 | 180; label: string; sub: string }[]}
              value={timeLimit}
              onChange={(v) => setTimeLimit(v as 60 | 180)}
            />
          </div>
        </motion.div>

        {/* Tip */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.42 }}
          style={{ padding: "14px 17px", background: "rgba(56,182,255,0.04)", border: "1px solid rgba(56,182,255,0.12)", borderRadius: 14, marginBottom: 8 }}
        >
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: "rgba(242,237,231,0.45)", lineHeight: 1.6, margin: 0 }}>
            💡 参加人数は<strong style={{ color: "rgba(242,237,231,0.72)" }}>2〜8人</strong>がベスト。BAKUが全員の記憶を食べて、役職を暴き出す。
          </p>
        </motion.div>
      </div>

      {/* Fixed CTA */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "16px 24px 40px", background: "linear-gradient(to top, #0F0E0D 70%, transparent)", zIndex: 10 }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <motion.button
            className="btn-ember"
            onClick={handleCreate}
            disabled={!tripName.trim() || loading}
            whileHover={tripName.trim() && !loading ? { scale: 1.03, rotate: "0.4deg" } : {}}
            whileTap={tripName.trim() && !loading ? { scale: 0.97 } : {}}
            transition={{ type: "spring" as const, stiffness: 420, damping: 22 }}
            animate={{ opacity: tripName.trim() ? 1 : 0.38 }}
            style={{ width: "100%", height: 62, fontSize: 17, letterSpacing: "-0.01em", cursor: tripName.trim() && !loading ? "pointer" : "not-allowed" }}
          >
            {loading
              ? <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>BAKUを呼び覚ます...✨</motion.span>
              : <>ルームを建てる 🏕️</>
            }
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
  const router = useRouter();
  const params = useParams();
  const roomId = params.id as string;

  const [members, setMembers]   = useState<Member[]>([{ id: "host", name: "あなた（ホスト）", isHost: true }]);
  const [toast, setToast]       = useState<string | null>(null);
  const [copied, setCopied]     = useState(false);
  const memberIndexRef          = useRef(0);

  useEffect(() => {
    const timings = [2200, 4800, 7400, 10500, 14000, 18000];
    const timers = timings.map((delay) =>
      setTimeout(() => {
        if (memberIndexRef.current >= MOCK_MEMBERS_POOL.length) return;
        const name = MOCK_MEMBERS_POOL[memberIndexRef.current++];
        setMembers((prev) => [...prev, { id: name + Date.now(), name, isHost: false }]);
      }, delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(roomCode); } catch {}
    setCopied(true);
    setToast("コピーしたよ！✓");
    setTimeout(() => setCopied(false), 2000);
  };

  const memberCount = members.length;

  return (
    <motion.div
      key="lobby"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: "flex", flexDirection: "column", minHeight: "100dvh", maxWidth: 480, margin: "0 auto" }}
    >
      <div aria-hidden="true" style={{ position: "fixed", top: -80, left: "50%", transform: "translateX(-50%)", width: 400, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,92,43,0.08) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ padding: "52px 24px 0", position: "relative", zIndex: 1 }}>
        <DipLogo size={22} />

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ marginTop: 22, marginBottom: 32 }}>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: "#8A8277", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 4 }}>今日の旅</p>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, color: "#F2EDE7", letterSpacing: "-0.02em", margin: 0 }}>🏕️ {tripName}</h2>
        </motion.div>

        {/* Code block */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.22, type: "spring" as const, stiffness: 260, damping: 24 }}
          onClick={handleCopy}
          style={{ background: "#1C1A17", border: `1.5px solid ${copied ? "rgba(245,200,66,0.5)" : "rgba(242,237,231,0.1)"}`, borderRadius: 20, padding: "24px 20px", textAlign: "center" as const, cursor: "pointer", position: "relative", overflow: "hidden", transition: "border-color 0.3s", marginBottom: 32 }}
        >
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 600, color: "#8A8277", letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 10 }}>参加コード</p>
          <motion.p animate={{ scale: copied ? [1, 1.05, 1] : 1 }} transition={{ duration: 0.25 }}
            style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 72, letterSpacing: "0.18em", color: copied ? "#F5C842" : "#F2EDE7", lineHeight: 1, marginBottom: 14, transition: "color 0.25s" }}
          >{roomCode}</motion.p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: copied ? "#F5C842" : "#8A8277", transition: "color 0.25s" }}>
            <span>{copied ? "✓" : "📋"}</span>
            {copied ? "コピーしたよ！" : "タップでコピー"}
          </div>
          <AnimatePresence>
            {copied && (
              <motion.div initial={{ x: "-100%", opacity: 0.6 }} animate={{ x: "100%", opacity: 0 }} transition={{ duration: 0.5 }}
                style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent, rgba(245,200,66,0.12), transparent)", pointerEvents: "none" }}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Member count */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}
        >
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 600, color: "#8A8277", letterSpacing: "0.1em", textTransform: "uppercase" as const, margin: 0 }}>集まってる人</p>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: memberCount >= 2 ? "#7BC67E" : "#8A8277" }}>
            <motion.span key={memberCount} initial={{ scale: 1.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring" as const, stiffness: 500, damping: 28 }} style={{ display: "inline-block" }}>{memberCount}</motion.span>/8人
          </div>
        </motion.div>

        <div style={{ background: "#1C1A17", border: "1px solid rgba(242,237,231,0.08)", borderRadius: 18, padding: "4px 18px", marginBottom: 100 }}>
          <AnimatePresence initial={false}>
            {members.map((m, i) => <MemberItem key={m.id} member={m} index={i} />)}
          </AnimatePresence>
          {memberCount < 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: "14px 0", display: "flex", gap: 5, justifyContent: "center" }}>
              {[0, 1, 2].map((i) => (
                <motion.div key={i} animate={{ opacity: [0.2, 0.7, 0.2] }} transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.22 }} style={{ width: 6, height: 6, borderRadius: "50%", background: "#8A8277" }} />
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "16px 24px 40px", background: "linear-gradient(to top, #0F0E0D 65%, transparent)", zIndex: 10 }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: memberCount >= 2 ? "#7BC67E" : "#8A8277", textAlign: "center" as const, marginBottom: 12 }}
          >
            {memberCount < 2 ? "あと1人以上集めよう" : `${memberCount}人が集合！いつでもスタートできるよ 🔥`}
          </motion.p>
          <motion.button
            className="btn-ember"
            animate={{ opacity: memberCount >= 2 ? 1 : 0.35, scale: memberCount >= 2 ? 1 : 0.98 }}
            whileHover={memberCount >= 2 ? { scale: 1.03, rotate: "0.4deg" } : {}}
            whileTap={memberCount >= 2 ? { scale: 0.97 } : {}}
            transition={{ type: "spring" as const, stiffness: 420, damping: 22 }}
            style={{ width: "100%", height: 62, fontSize: 17, cursor: memberCount >= 2 ? "pointer" : "not-allowed", letterSpacing: "-0.01em" }}
            onClick={() => memberCount >= 2 && router.push(`/room/${roomId}/submit`)}
          >
            全員揃った、スタート！🎯
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Main
───────────────────────────────────────── */
export default function RoomPage() {
  const params = useParams();
  const roomId = params.id as string;
  const [phase, setPhase]     = useState<Phase>("create");
  const [tripName, setTripName] = useState("");

  return (
    <div style={{ background: "#0F0E0D", minHeight: "100dvh" }}>
      <AnimatePresence mode="wait">
        {phase === "create"
          ? <PhaseCreate key="create" onCreated={(name) => { setTripName(name); setPhase("lobby"); }} />
          : <PhaseLobby key="lobby" tripName={tripName} roomCode={roomId} />
        }
      </AnimatePresence>
    </div>
  );
}
