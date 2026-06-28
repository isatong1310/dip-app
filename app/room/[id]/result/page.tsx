"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

/* ─────────────────────────────────────────
   Role data
───────────────────────────────────────── */
interface Role {
  member: string;
  icon: string;
  enName: string;
  jpName: string;
  desc: string;
  color: string;        // glow / accent color
  glowRgb: string;     // for radial-gradient
  cardBg: string;      // card surface gradient
}

const ROLES: Role[] = [
  {
    member: "たく",
    icon: "⚔️",
    enName: "BERSERKER",
    jpName: "狂戦士",
    desc: "感情を燃料に最初に動く者。止まり方を知らない。場のテンションを支配し、全員が気づく前に次の展開を作っていた。",
    color: "#FF5C2B",
    glowRgb: "255,92,43",
    cardBg: "linear-gradient(160deg, #2A1410 0%, #1A0C08 100%)",
  },
  {
    member: "まり",
    icon: "🛡",
    enName: "GUARDIAN",
    jpName: "ステルス保護者",
    desc: "気づかれないまま全員を守り続ける存在。誰かが困る前にもう動いている。今回の旅を陰で支えた真の功労者。",
    color: "#7BC67E",
    glowRgb: "123,198,126",
    cardBg: "linear-gradient(160deg, #0E1E10 0%, #081408 100%)",
  },
  {
    member: "ゆい",
    icon: "🎭",
    enName: "TRICKSTER",
    jpName: "道化師",
    desc: "場の空気を読みすぎて、あえて外す天才。笑いの裏に冷静な観察眼を持つ。誰も気づかなかったが全部見ていた。",
    color: "#F5C842",
    glowRgb: "245,200,66",
    cardBg: "linear-gradient(160deg, #1E1A08 0%, #141008 100%)",
  },
];

/* ─────────────────────────────────────────
   Particle system
───────────────────────────────────────── */
interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  delay: number;
}

function generateParticles(count: number, color: string): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 45 + Math.random() * 10,           // % from left, near center
    y: 55 + Math.random() * 10,           // % from top, near card center
    vx: (Math.random() - 0.5) * 160,      // horizontal spread
    vy: -(Math.random() * 200 + 80),      // upward
    size: Math.random() * 6 + 3,
    opacity: Math.random() * 0.7 + 0.3,
    color: Math.random() > 0.5 ? color : "#F2EDE7",
    delay: Math.random() * 0.15,
  }));
}

function ParticleBurst({
  active,
  color,
}: {
  active: boolean;
  color: string;
}) {
  const particles = useRef(generateParticles(28, color));

  if (!active) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 30,
      }}
    >
      {particles.current.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
            scale: 1,
          }}
          animate={{
            left: `calc(${p.x}% + ${p.vx}px)`,
            top: `calc(${p.y}% + ${p.vy}px)`,
            opacity: 0,
            scale: 0.2,
          }}
          transition={{
            duration: 1.1 + Math.random() * 0.5,
            delay: p.delay,
            ease: [0.2, 0.8, 0.4, 1],
          }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.color,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   Single role card (Phase A)
───────────────────────────────────────── */
function RoleCard({
  role,
  revealed,
  onReveal,
}: {
  role: Role;
  revealed: boolean;
  onReveal: () => void;
}) {
  const [burst, setBurst] = useState(false);

  const handleTap = () => {
    if (revealed) return;
    onReveal();
    setBurst(true);
    setTimeout(() => setBurst(false), 1400);
  };

  return (
    <div
      style={{ position: "relative", width: "100%" }}
      onClick={handleTap}
    >
      {/* Role-tinted glow behind card */}
      <motion.div
        animate={{
          opacity: revealed ? 0.5 : 0.12,
          scale: revealed ? 1 : 0.85,
        }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "110%",
          height: 280,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(${role.glowRgb}, 0.35) 0%, transparent 70%)`,
          pointerEvents: "none",
          zIndex: 0,
          filter: "blur(20px)",
        }}
      />

      {/* Card body */}
      <motion.div
        animate={
          revealed
            ? { filter: "blur(0px)", scale: 1 }
            : { filter: "blur(18px)", scale: 0.96 }
        }
        transition={{
          filter: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
          scale: {
            type: "spring",
            stiffness: 340,
            damping: 20,
            bounce: revealed ? 0.4 : 0,
          },
        }}
        style={{
          background: role.cardBg,
          border: `1px solid rgba(${role.glowRgb}, ${revealed ? 0.35 : 0.1})`,
          borderRadius: 24,
          padding: "36px 28px 32px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
          cursor: revealed ? "default" : "pointer",
          transition: "border-color 0.5s",
        }}
      >
        {/* Grain overlay */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
            backgroundSize: "180px 180px",
            opacity: 0.04,
            borderRadius: 24,
            pointerEvents: "none",
          }}
        />

        {/* Member name (always visible) */}
        <motion.p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: `rgba(${role.glowRgb}, 0.7)`,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 20,
            position: "relative",
            zIndex: 2,
          }}
        >
          {role.member}
        </motion.p>

        {/* Icon */}
        <motion.div
          animate={{ scale: revealed ? [1, 1.18, 1] : 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
          style={{ fontSize: 64, lineHeight: 1, marginBottom: 16, position: "relative", zIndex: 2 }}
        >
          {role.icon}
        </motion.div>

        {/* EN name — Bebas Neue */}
        <motion.p
          animate={{ opacity: revealed ? 1 : 0.2 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: 44,
            letterSpacing: "0.12em",
            color: role.color,
            lineHeight: 1,
            marginBottom: 4,
            position: "relative",
            zIndex: 2,
          }}
        >
          {role.enName}
        </motion.p>

        {/* JP name — Syne */}
        <motion.p
          animate={{ opacity: revealed ? 1 : 0.15 }}
          transition={{ delay: 0.18, duration: 0.4 }}
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: 22,
            color: "#F2EDE7",
            letterSpacing: "-0.01em",
            marginBottom: 20,
            position: "relative",
            zIndex: 2,
          }}
        >
          {role.jpName}
        </motion.p>

        {/* Divider */}
        <motion.div
          animate={{ scaleX: revealed ? 1 : 0, opacity: revealed ? 1 : 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: 1,
            background: `rgba(${role.glowRgb}, 0.2)`,
            marginBottom: 18,
            transformOrigin: "left center",
            position: "relative",
            zIndex: 2,
          }}
        />

        {/* AI desc */}
        <motion.p
          animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 8 }}
          transition={{ delay: 0.38, duration: 0.5 }}
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 14,
            lineHeight: 1.72,
            color: "rgba(242,237,231,0.62)",
            position: "relative",
            zIndex: 2,
          }}
        >
          {role.desc}
        </motion.p>
      </motion.div>

      {/* Particle burst */}
      <ParticleBurst active={burst} color={role.color} />
    </div>
  );
}

/* ─────────────────────────────────────────
   Phase A — sequential reveal
───────────────────────────────────────── */
function PhaseReveal({ onComplete }: { onComplete: () => void }) {
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const role = ROLES[idx];

  const handleReveal = useCallback(() => setRevealed(true), []);

  const handleNext = () => {
    const nextIdx = idx + 1;
    if (nextIdx >= ROLES.length) {
      onComplete();
      return;
    }
    setIdx(nextIdx);
    setRevealed(false);
  };

  return (
    <motion.div
      key="reveal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        background: "#0F0E0D",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "52px 24px 0",
          position: "relative",
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 11,
            fontWeight: 600,
            color: "#8A8277",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          {idx + 1} / {ROLES.length}
        </p>
        <motion.h1
          key={`title-${idx}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: 32,
            letterSpacing: "0.06em",
            color: "#F2EDE7",
            marginBottom: 0,
          }}
        >
          今回の旅の真実
        </motion.h1>
      </div>

      {/* Card area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "28px 24px",
          position: "relative",
        }}
      >
        {/* Ambient bg glow */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(${role.glowRgb}, 0.06) 0%, transparent 70%)`,
            pointerEvents: "none",
            transition: "background 0.8s ease",
          }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={`card-${idx}`}
            initial={{ opacity: 0, y: 32, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.96 }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 26,
            }}
          >
            <RoleCard
              role={role}
              revealed={revealed}
              onReveal={handleReveal}
            />
          </motion.div>
        </AnimatePresence>

        {/* Tap hint (before reveal) */}
        <AnimatePresence>
          {!revealed && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginTop: 24,
              }}
            >
              <motion.span
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                style={{ fontSize: 20 }}
              >
                👆
              </motion.span>
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 14,
                  color: "rgba(242,237,231,0.35)",
                }}
              >
                タップして開封
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fixed CTA */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          padding: "14px 24px 44px",
          background: "linear-gradient(to top, #0F0E0D 65%, transparent)",
          zIndex: 20,
          flexShrink: 0,
        }}
      >
        <motion.button
          onClick={handleNext}
          disabled={!revealed}
          animate={{
            opacity: revealed ? 1 : 0.3,
            scale: revealed ? 1 : 0.99,
          }}
          whileHover={revealed ? { scale: 1.03, rotate: "0.4deg" } : {}}
          whileTap={revealed ? { scale: 0.97 } : {}}
          transition={{ type: "spring" as const, stiffness: 420, damping: 22 }}
          style={{
            width: "100%",
            height: 62,
            borderRadius: 16,
            background: "#FF5C2B",
            color: "#0F0E0D",
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: 17,
            border: "none",
            cursor: revealed ? "pointer" : "not-allowed",
            letterSpacing: "-0.01em",
          }}
        >
          {idx < ROLES.length - 1 ? "次のメンバーへ →" : "全員分を見る 🎊"}
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Mini card for Party view
───────────────────────────────────────── */
function MiniRoleCard({ role, index }: { role: Role; index: number }) {
  const isLeft = index % 2 === 0;
  const heightOffset = isLeft ? 0 : 24;   // stagger height for masonry feel

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: heightOffset }}
      transition={{
        type: "spring" as const,
        stiffness: 260,
        damping: 24,
        delay: index * 0.1,
      }}
      style={{
        background: role.cardBg,
        border: `1px solid rgba(${role.glowRgb}, 0.25)`,
        borderRadius: 20,
        padding: "22px 18px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Mini glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: -30,
          left: "50%",
          transform: "translateX(-50%)",
          width: 140,
          height: 100,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(${role.glowRgb}, 0.25) 0%, transparent 70%)`,
          pointerEvents: "none",
          filter: "blur(10px)",
        }}
      />
      <div style={{ fontSize: 36, marginBottom: 10 }}>{role.icon}</div>
      <p
        style={{
          fontFamily: "'Bebas Neue', cursive",
          fontSize: 22,
          letterSpacing: "0.1em",
          color: role.color,
          marginBottom: 2,
        }}
      >
        {role.enName}
      </p>
      <p
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: 14,
          color: "#F2EDE7",
          marginBottom: 10,
        }}
      >
        {role.jpName}
      </p>
      <div
        style={{
          height: 1,
          background: `rgba(${role.glowRgb}, 0.2)`,
          marginBottom: 10,
        }}
      />
      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 13,
          fontWeight: 600,
          color: `rgba(${role.glowRgb}, 0.8)`,
        }}
      >
        {role.member}
      </p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Phase B — Party view
───────────────────────────────────────── */
function PhaseParty() {
  return (
    <motion.div
      key="party"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        minHeight: "100dvh",
        background: "#0F0E0D",
        padding: "52px 24px 120px",
        position: "relative",
      }}
    >
      {/* Ambient multi-glow from all roles */}
      {ROLES.map((r, i) => (
        <div
          key={r.member}
          aria-hidden="true"
          style={{
            position: "fixed",
            top: `${30 + i * 20}%`,
            left: `${20 + i * 30}%`,
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(${r.glowRgb}, 0.07) 0%, transparent 70%)`,
            pointerEvents: "none",
            filter: "blur(30px)",
          }}
        />
      ))}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        style={{ marginBottom: 32, position: "relative", zIndex: 1 }}
      >
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 11,
            fontWeight: 600,
            color: "#8A8277",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          役職発表完了
        </p>
        <h1
          style={{
            fontFamily: "'Bebas Neue', cursive",
            fontSize: 40,
            letterSpacing: "0.06em",
            color: "#F2EDE7",
          }}
        >
          今回のパーティ
        </h1>
      </motion.div>

      {/* Masonry grid (2-col, height offset) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          position: "relative",
          zIndex: 1,
          alignItems: "start",
        }}
      >
        {ROLES.map((role, i) => (
          <MiniRoleCard key={role.member} role={role} index={i} />
        ))}
      </div>

      {/* Roles summary note */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        style={{
          marginTop: 56,
          padding: "16px 18px",
          background: "rgba(255,92,43,0.05)",
          border: "1px solid rgba(255,92,43,0.14)",
          borderRadius: 14,
          position: "relative",
          zIndex: 1,
        }}
      >
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 13,
            color: "rgba(242,237,231,0.45)",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          🔥 このデータはあなたの
          <strong style={{ color: "rgba(242,237,231,0.72)" }}>プロフィールに蓄積</strong>
          されます。旅を重ねるごとに「あなたの軸」が見えてくるよ。
        </p>
      </motion.div>

      {/* Fixed CTAs */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "14px 24px 44px",
          background: "linear-gradient(to top, #0F0E0D 65%, transparent)",
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxWidth: 480,
          margin: "0 auto",
        }}
      >
        {/* Primary */}
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring" as const, stiffness: 300, damping: 26 }}
          whileHover={{ scale: 1.03, rotate: "0.4deg" }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: "100%",
            height: 60,
            borderRadius: 16,
            background: "#FF5C2B",
            color: "#0F0E0D",
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: 16,
            border: "none",
            cursor: "pointer",
            letterSpacing: "-0.01em",
          }}
        >
          💾 プロフィールに保存
        </motion.button>

        {/* Secondary */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: "spring" as const, stiffness: 300, damping: 26 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: "100%",
            height: 54,
            borderRadius: 16,
            background: "transparent",
            color: "#F2EDE7",
            fontFamily: "'Syne', sans-serif",
            fontWeight: 600,
            fontSize: 15,
            border: "1px solid rgba(242,237,231,0.2)",
            cursor: "pointer",
          }}
        >
          📸 画像としてシェア
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Main
───────────────────────────────────────── */
type Phase = "reveal" | "party";

export default function ResultPage() {
  const [phase, setPhase] = useState<Phase>("reveal");

  return (
    <div style={{ background: "#0F0E0D", minHeight: "100dvh" }}>
      <AnimatePresence mode="wait">
        {phase === "reveal" ? (
          <PhaseReveal key="reveal" onComplete={() => setPhase("party")} />
        ) : (
          <PhaseParty key="party" />
        )}
      </AnimatePresence>
    </div>
  );
}
