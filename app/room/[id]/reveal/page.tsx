"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────
   Mock slide data
───────────────────────────────────────── */
interface Slide {
  id: string;
  question: string;
  photoBg: string;
  photoIcon: string;
  photoLabel: string;
  target: string;
  tags: string[];
  comment: string;
}

const SLIDES: Slide[] = [
  {
    id: "s1",
    question: "この旅行で一番暗躍していたのは？",
    photoBg: "linear-gradient(145deg, #2A1810 0%, #1A0E08 100%)",
    photoIcon: "📸",
    photoLabel: "PHOTO",
    target: "たく",
    tags: ["#謎の行動", "#実は計画してた"],
    comment: "爆睡してたくせに全部把握してた",
  },
  {
    id: "s2",
    question: "この旅行で一番暗躍していたのは？",
    photoBg: "linear-gradient(145deg, #0E1A12 0%, #081410 100%)",
    photoIcon: "🌄",
    photoLabel: "PHOTO",
    target: "まり",
    tags: ["#戦犯", "#顔がヤバい"],
    comment: "全員分の観光地を予約してたの誰？",
  },
  {
    id: "s3",
    question: "この旅行で一番暗躍していたのは？",
    photoBg: "linear-gradient(145deg, #0E1020 0%, #080A18 100%)",
    photoIcon: "🌊",
    photoLabel: "PHOTO",
    target: "ゆい",
    tags: ["#ファインプレー", "#気づいたら単独行動"],
    comment: "絶妙なタイミングで全員を救ってた",
  },
];

/* ─────────────────────────────────────────
   Reveal step enum
───────────────────────────────────────── */
type RevealStep = "photo" | "target" | "reason" | "done";

/* ─────────────────────────────────────────
   AI Loading Screen
───────────────────────────────────────── */
function AILoadingScreen() {
  const [phase, setPhase] = useState(0);
  const PHASES = [
    "提出データを解析中...",
    "行動パターンを照合中...",
    "役職データベースと照合中...",
    "役職を確定しています...",
  ];

  useEffect(() => {
    const t = setInterval(() => {
      setPhase((p) => Math.min(p + 1, PHASES.length - 1));
    }, 1400);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      key="ai-loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "#0F0E0D",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: "0 32px",
        textAlign: "center",
      }}
    >
      {/* Outer slow-spinning ring */}
      <div style={{ position: "relative", marginBottom: 40 }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          style={{
            width: 110,
            height: 110,
            borderRadius: "50%",
            border: "1.5px solid rgba(255,92,43,0.15)",
            borderTopColor: "rgba(255,92,43,0.6)",
            position: "absolute",
            inset: 0,
          }}
        />
        {/* Inner counter-spin */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          style={{
            width: 110,
            height: 110,
            borderRadius: "50%",
            border: "1px solid rgba(245,200,66,0.1)",
            borderBottomColor: "rgba(245,200,66,0.4)",
          }}
        />
        {/* Center icon */}
        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 34,
          }}
        >
          🔮
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          fontFamily: "'Bebas Neue', cursive",
          fontSize: 36,
          letterSpacing: "0.08em",
          color: "#F2EDE7",
          marginBottom: 16,
        }}
      >
        AI 判定中
      </motion.p>

      <AnimatePresence mode="wait">
        <motion.p
          key={phase}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 14,
            color: "#8A8277",
            marginBottom: 48,
          }}
        >
          {PHASES[phase]}
        </motion.p>
      </AnimatePresence>

      {/* Progress dots */}
      <div style={{ display: "flex", gap: 8 }}>
        {PHASES.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              background: i <= phase ? "#FF5C2B" : "rgba(138,130,119,0.3)",
              scale: i === phase ? 1.3 : 1,
            }}
            transition={{ duration: 0.3 }}
            style={{ width: 7, height: 7, borderRadius: "50%" }}
          />
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 12,
          color: "rgba(138,130,119,0.4)",
          marginTop: 48,
        }}
      >
        今回の全行動データを分析しています
      </motion.p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Single slide
───────────────────────────────────────── */
function RevealSlide({
  slide,
  step,
  slideIndex,
  total,
}: {
  slide: Slide;
  step: RevealStep;
  slideIndex: number;
  total: number;
}) {
  const showTarget = step === "target" || step === "reason" || step === "done";
  const showReason = step === "reason" || step === "done";

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
        background: "#0F0E0D",
      }}
    >
      {/* ── Full-bleed photo with Ken Burns ── */}
      <motion.div
        key={`photo-${slide.id}`}
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1.0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute",
          inset: 0,
          background: slide.photoBg,
          zIndex: 0,
        }}
      >
        {/* Ken Burns slow drift */}
        <motion.div
          animate={{ scale: [1.0, 1.05], x: [0, -8], y: [0, 4] }}
          transition={{ duration: 14, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          style={{
            position: "absolute",
            inset: "-5%",
            background: slide.photoBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Huge background emoji as mock photo */}
          <span
            style={{
              fontSize: "clamp(120px, 40vw, 200px)",
              opacity: 0.18,
              filter: "blur(2px)",
              userSelect: "none",
            }}
          >
            {slide.photoIcon}
          </span>
        </motion.div>

        {/* Dark vignette overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, rgba(15,14,13,0.1) 0%, rgba(15,14,13,0.75) 100%)",
          }}
        />
        {/* Bottom gradient for text legibility */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "65%",
            background:
              "linear-gradient(to top, rgba(15,14,13,0.98) 0%, rgba(15,14,13,0.7) 40%, transparent 100%)",
          }}
        />
      </motion.div>

      {/* ── Top bar ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "52px 24px 20px",
          zIndex: 10,
          background:
            "linear-gradient(to bottom, rgba(15,14,13,0.85) 0%, transparent 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 12,
              color: "rgba(242,237,231,0.5)",
              flex: 1,
              lineHeight: 1.4,
            }}
          >
            Q{slideIndex + 1}: {slide.question}
          </p>
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 12,
              color: "rgba(242,237,231,0.3)",
              flexShrink: 0,
            }}
          >
            {slideIndex + 1}/{total}
          </span>
        </div>
        {/* Thin progress bar */}
        <div
          style={{
            height: 2,
            background: "rgba(242,237,231,0.08)",
            borderRadius: 100,
            marginTop: 10,
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((slideIndex + 1) / total) * 100}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: "100%", background: "#FF5C2B", borderRadius: 100 }}
          />
        </div>
      </div>

      {/* ── Center photo label ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: "'Bebas Neue', cursive",
          fontSize: 11,
          letterSpacing: "0.4em",
          color: "#F2EDE7",
          zIndex: 5,
          pointerEvents: "none",
          marginTop: -20,
        }}
      >
        {slide.photoLabel}
      </motion.div>

      {/* ── Bottom reveal area ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "0 24px 140px",
          zIndex: 10,
        }}
      >
        {/* Step 2 — Target reveal */}
        <AnimatePresence>
          {showTarget && (
            <motion.div
              key="target"
              initial={{ y: 32, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{
                type: "spring" as const,
                stiffness: 260,
                damping: 24,
                delay: 0.05,
              }}
              style={{ marginBottom: 16 }}
            >
              {/* "指名されたのは..." pre-text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 13,
                  color: "rgba(242,237,231,0.45)",
                  marginBottom: 8,
                  letterSpacing: "0.04em",
                }}
              >
                指名されたのは...
              </motion.p>

              {/* Target name — Butter Yellow hero */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring" as const,
                    stiffness: 320,
                    damping: 20,
                    delay: 0.3,
                  }}
                  style={{
                    background: "rgba(245,200,66,0.12)",
                    border: "1.5px solid rgba(245,200,66,0.4)",
                    borderRadius: 14,
                    padding: "4px 14px",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#F5C842",
                  }}
                >
                  🎯 犯人
                </motion.div>
                <motion.p
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    type: "spring" as const,
                    stiffness: 280,
                    damping: 22,
                    delay: 0.45,
                  }}
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(36px, 10vw, 48px)",
                    color: "#F5C842",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  {slide.target}
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 3 — Reason / tags reveal */}
        <AnimatePresence>
          {showReason && (
            <motion.div
              key="reason"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                type: "spring" as const,
                stiffness: 240,
                damping: 26,
                delay: 0.1,
              }}
            >
              {/* Tags */}
              {slide.tags.length > 0 && (
                <motion.div
                  style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}
                >
                  {slide.tags.map((tag, i) => (
                    <motion.span
                      key={tag}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring" as const,
                        stiffness: 380,
                        damping: 22,
                        delay: 0.15 + i * 0.08,
                      }}
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#F5C842",
                        background: "rgba(245,200,66,0.1)",
                        border: "1px solid rgba(245,200,66,0.3)",
                        borderRadius: 100,
                        padding: "5px 13px",
                      }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>
              )}

              {/* Comment */}
              {slide.comment && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 15,
                    color: "rgba(242,237,231,0.6)",
                    lineHeight: 1.5,
                    borderLeft: "2px solid rgba(255,92,43,0.4)",
                    paddingLeft: 14,
                    marginTop: 4,
                  }}
                >
                  &ldquo;{slide.comment}&rdquo;
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tap-to-reveal hint (photo only step) */}
        <AnimatePresence>
          {step === "photo" && (
            <motion.div
              key="tap-hint"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: [0, 0.6, 0.4], y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 8,
              }}
            >
              <motion.div
                animate={{ x: [0, 6, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <span style={{ fontSize: 20 }}>👆</span>
              </motion.div>
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 13,
                  color: "rgba(242,237,231,0.4)",
                }}
              >
                タップして犯人を公開
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
export default function RevealPage() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [step, setStep] = useState<RevealStep>("photo");
  const [aiLoading, setAiLoading] = useState(false);
  const [direction, setDirection] = useState(1);

  const currentSlide = SLIDES[slideIndex];

  // Auto-advance from photo → target after 2.5s
  useEffect(() => {
    if (step !== "photo") return;
    const t = setTimeout(() => setStep("target"), 2500);
    return () => clearTimeout(t);
  }, [step, slideIndex]);

  // Auto-advance from target → reason after 2s
  useEffect(() => {
    if (step !== "target") return;
    const t = setTimeout(() => setStep("reason"), 2000);
    return () => clearTimeout(t);
  }, [step, slideIndex]);

  const handleNext = useCallback(() => {
    // If not fully revealed yet, accelerate
    if (step === "photo") { setStep("target"); return; }
    if (step === "target") { setStep("reason"); return; }

    // Advance to next slide or AI loading
    const nextIndex = slideIndex + 1;
    if (nextIndex >= SLIDES.length) {
      setAiLoading(true);
      return;
    }
    setDirection(1);
    setSlideIndex(nextIndex);
    setStep("photo");
  }, [step, slideIndex]);

  // Tap anywhere on photo area to advance steps
  const handlePhotoTap = useCallback(() => {
    if (step === "photo") setStep("target");
    else if (step === "target") setStep("reason");
  }, [step]);

  if (aiLoading) return <AILoadingScreen />;

  const isLastSlide = slideIndex === SLIDES.length - 1;
  const isFullyRevealed = step === "reason";

  return (
    <div
      style={{
        background: "#0F0E0D",
        height: "100dvh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Slide area — tappable */}
      <div
        onClick={handlePhotoTap}
        style={{ position: "absolute", inset: 0, cursor: "pointer", zIndex: 1 }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`slide-${slideIndex}`}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "absolute", inset: 0 }}
          >
            <RevealSlide
              slide={currentSlide}
              step={step}
              slideIndex={slideIndex}
              total={SLIDES.length}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Host control bar ── */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "12px 24px 44px",
          background:
            "linear-gradient(to top, rgba(15,14,13,0.98) 60%, transparent)",
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          gap: 12,
          maxWidth: 480,
          margin: "0 auto",
        }}
      >
        {/* Slide dots */}
        <div style={{ display: "flex", gap: 6, flex: 1 }}>
          {SLIDES.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i === slideIndex ? 20 : 7,
                background:
                  i < slideIndex
                    ? "#8A8277"
                    : i === slideIndex
                    ? "#FF5C2B"
                    : "rgba(138,130,119,0.25)",
              }}
              transition={{ duration: 0.35 }}
              style={{ height: 7, borderRadius: 100 }}
            />
          ))}
        </div>

        {/* Next button */}
        <motion.button
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          animate={{
            background: isFullyRevealed ? "#FF5C2B" : "rgba(242,237,231,0.08)",
            color: isFullyRevealed ? "#0F0E0D" : "rgba(242,237,231,0.4)",
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.25 }}
          style={{
            padding: "14px 24px",
            borderRadius: 14,
            border: "none",
            cursor: "pointer",
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: "-0.01em",
            flexShrink: 0,
          }}
        >
          {isLastSlide && isFullyRevealed
            ? "判定へ ✨"
            : isFullyRevealed
            ? "次へ →"
            : step === "photo"
            ? "公開する 👁"
            : "続き →"}
        </motion.button>
      </div>
    </div>
  );
}
