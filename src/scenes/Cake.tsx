import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import SceneShell from "../components/SceneShell";

export default function Cake({ onNext }: { onNext: () => void }) {
  const [candlesLit, setCandlesLit] = useState(true);
  const [blownOut, setBlownOut] = useState(false);
  const [cakeSliced, setCakeSliced] = useState(false);
  const [micReady, setMicReady] = useState<"idle" | "listening" | "denied">("idle");
  const [micLevel, setMicLevel] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number>(0);
  const cakeContainerRef = useRef<HTMLDivElement>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipePath, setSwipePath] = useState<{ x: number; y: number }[]>([]);

  // Fireworks & Confetti effect
  const celebrate = () => {
    if (blownOut) return;
    setBlownOut(true);
    setCandlesLit(false);

    // Burst 1: Confetti cannons
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55, colors: ["#E5C158", "#F8FAFC"] });
    fire(0.2, { spread: 60, colors: ["#3B82F6", "#FBE697"] });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ["#E5C158", "#3B82F6", "#C9B8F5"] });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      setMicReady("listening");

      const check = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        setMicLevel(Math.min(100, Math.round((avg / 128) * 100)));

        if (avg > 35) {
          celebrate();
          stream.getTracks().forEach((t) => t.stop());
          ctx.close();
          return;
        }
        rafRef.current = requestAnimationFrame(check);
      };
      check();
    } catch {
      setMicReady("denied");
    }
  };

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      audioCtxRef.current?.close().catch(() => { });
    };
  }, []);

  // Swipe Cake Cutting Handler
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!blownOut || cakeSliced) return;
    setIsSwiping(true);
    const rect = cakeContainerRef.current?.getBoundingClientRect();
    if (rect) {
      setSwipePath([{ x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isSwiping || cakeSliced) return;
    const rect = cakeContainerRef.current?.getBoundingClientRect();
    if (rect) {
      const newPt = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      setSwipePath((prev) => {
        const updated = [...prev, newPt];
        if (updated.length > 15) {
          // Trigger slice when swipe distance is sufficient
          triggerCakeSlice();
        }
        return updated;
      });
    }
  };

  const handlePointerUp = () => {
    if (isSwiping && swipePath.length > 5 && !cakeSliced) {
      triggerCakeSlice();
    }
    setIsSwiping(false);
  };

  const triggerCakeSlice = () => {
    if (cakeSliced) return;
    setCakeSliced(true);
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 }, colors: ["#E5C158", "#FFFFFF", "#3B82F6"] });
  };

  return (
    <SceneShell
      mode="night"
      intensity={blownOut ? 0.4 : 1.2}
      onContinue={onNext}
      continueLabel="Proceed to Grand Finale"
      showContinue={cakeSliced || blownOut}
    >
      <div className="flex flex-col items-center text-center max-w-xl mx-auto px-4">
        <span className="font-display text-xs uppercase tracking-[0.35em] text-gold/80 mb-2">
          Interactive Celebration
        </span>

        <h2 className="font-display text-4xl sm:text-5xl font-bold italic text-gradient-gold">
          {!blownOut ? "Light & Blow the Candles" : !cakeSliced ? "Cut the Birthday Cake" : "A Wish Carried to the Stars"}
        </h2>

        <p className="mt-2 text-sm text-slate-300 font-display italic">
          {!blownOut
            ? "Light the 21 candles, make a wish, and blow them out using your microphone!"
            : !cakeSliced
              ? "Swipe your finger or cursor across the cake to cut a slice!"
              : "May Chapter 21 bring you endless health, wealth, success, and pure happiness."}
        </p>

        {/* Cake Container */}
        <div
          ref={cakeContainerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative mt-8 flex flex-col items-center select-none touch-none cursor-pointer p-6"
        >
          {/* 21 Candles Row */}
          <div className="relative flex items-center justify-center gap-1.5 sm:gap-2 mb-2 z-20">
            {Array.from({ length: 21 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                {/* Flame */}
                <AnimatePresence>
                  {candlesLit && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0.9, 1.15, 0.95], opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse", delay: i * 0.04 }}
                      className="h-4 w-2 sm:h-5 sm:w-2.5 rounded-full bg-gradient-to-t from-amber-500 via-yellow-300 to-white shadow-glow-gold animate-flicker"
                    />
                  )}
                </AnimatePresence>
                {/* Candle body */}
                <div className="h-7 w-1.5 sm:h-9 sm:w-2 rounded-t-sm bg-gradient-to-b from-amber-100 to-amber-300 shadow-sm border border-gold/30" />
              </div>
            ))}
          </div>

          {/* SVG 3-Tier Apple Glass Cake */}
          <div className="relative w-72 sm:w-96">
            <svg viewBox="0 0 320 220" className="w-full h-auto drop-shadow-[0_15px_35px_rgba(229,193,88,0.25)]">
              <defs>
                <linearGradient id="cakeGradTop" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E3A8A" />
                  <stop offset="50%" stopColor="#0B132B" />
                  <stop offset="100%" stopColor="#1C2541" />
                </linearGradient>
                <linearGradient id="cakeGradMid" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D4AF37" />
                  <stop offset="50%" stopColor="#E5C158" />
                  <stop offset="100%" stopColor="#B8860B" />
                </linearGradient>
                <linearGradient id="frostGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#FBE697" />
                </linearGradient>
              </defs>

              {/* Base Stand */}
              <ellipse cx="160" cy="205" rx="140" ry="12" fill="rgba(229,193,88,0.2)" stroke="#E5C158" strokeWidth="1.5" />
              <rect x="130" y="195" width="60" height="10" rx="3" fill="#E5C158" opacity="0.6" />

              {/* Tier 3 (Bottom) */}
              <rect x="40" y="135" width="240" height="60" rx="12" fill="url(#cakeGradTop)" stroke="#E5C158" strokeWidth="1.5" />
              <path d="M40 145 Q60 160 80 145 T120 145 T160 145 T200 145 T240 145 T280 145" fill="none" stroke="url(#frostGrad)" strokeWidth="4" />

              {/* Tier 2 (Middle) */}
              <rect x="70" y="85" width="180" height="50" rx="10" fill="url(#cakeGradMid)" stroke="#FFF1B5" strokeWidth="1.5" />
              <path d="M70 95 Q90 108 110 95 T150 95 T190 95 T230 95 T250 95" fill="none" stroke="#FFFFFF" strokeWidth="3" />

              {/* Tier 1 (Top) */}
              <rect x="100" y="45" width="120" height="40" rx="8" fill="url(#cakeGradTop)" stroke="#E5C158" strokeWidth="1.5" />
              <text x="160" y="70" textAnchor="middle" fill="#E5C158" fontSize="18" fontWeight="bold" fontFamily="Cormorant Garamond">
                21
              </text>
            </svg>

            {/* Cake Sliced Separator Animation */}
            {cakeSliced && (
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="h-full w-1 bg-gradient-to-b from-transparent via-gold to-transparent shadow-glow-gold transform rotate-12" />
              </motion.div>
            )}
          </div>

          {/* Swipe SVG Line overlay */}
          {isSwiping && swipePath.length > 1 && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
              <path
                d={`M ${swipePath.map((p) => `${p.x} ${p.y}`).join(" L ")}`}
                fill="none"
                stroke="#E5C158"
                strokeWidth="4"
                strokeLinecap="round"
                className="shadow-glow-gold"
              />
            </svg>
          )}
        </div>

        {/* Controls Section */}
        {!blownOut ? (
          <div className="mt-6 flex flex-col items-center gap-4 w-full">
            {micReady !== "listening" ? (
              <button
                onClick={startMic}
                className="glass-gold rounded-full px-8 py-3.5 font-display text-lg italic text-gold shadow-glow-gold transition hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                🎙️ Blow into your microphone
              </button>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-xs text-gold">
                  <span>Listening... Blow now!</span>
                </div>
                <div className="w-48 h-2 bg-obsidian-card rounded-full overflow-hidden border border-gold/30">
                  <div className="h-full bg-gold transition-all duration-75" style={{ width: `${micLevel}%` }} />
                </div>
              </div>
            )}

            {micReady === "denied" && (
              <p className="text-xs text-slate-400">Microphone permission blocked — tap below to blow!</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setCandlesLit((prev) => !prev)}
                className="rounded-full border border-gold/40 px-5 py-2 text-xs text-gold transition hover:bg-gold/10"
              >
                {candlesLit ? "Unlight Candles" : "Relight Candles"}
              </button>

              <button
                onClick={celebrate}
                className="rounded-full bg-gold/20 border border-gold px-6 py-2 text-xs font-semibold text-gold transition hover:bg-gold hover:text-obsidian shadow-glow"
              >
                💨 Blow Candles (Click)
              </button>
            </div>
          </div>
        ) : !cakeSliced ? (
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="inline-flex items-center gap-2 text-gold animate-bounce text-sm font-display italic">
              ✨ Drag your mouse/finger across the cake to slice it!
            </div>
            <button
              onClick={triggerCakeSlice}
              className="rounded-full border border-gold px-6 py-2 text-xs text-gold transition hover:bg-gold hover:text-obsidian"
            >
              🔪 Click to Slice Cake
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 glass rounded-2xl p-6 border border-gold/30 text-center"
          >
            <p className="font-display text-xl italic text-gold">
              "Happy 21st Birthday Harshvardhan! The cake has been sliced, the wish is sent to the stars, and Chapter 21 is officially open!"
            </p>
          </motion.div>
        )}
      </div>
    </SceneShell>
  );
}
