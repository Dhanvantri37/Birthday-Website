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

    const count = 220;
    const defaults = { origin: { y: 0.65 } };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 35, startVelocity: 60, colors: ["#E5C158", "#F8FAFC"] });
    fire(0.2, { spread: 70, colors: ["#3B82F6", "#FBE697"] });
    fire(0.35, { spread: 110, decay: 0.91, scalar: 0.9, colors: ["#E5C158", "#3B82F6", "#C9B8F5"] });
    fire(0.1, { spread: 130, startVelocity: 30, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 130, startVelocity: 50 });
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
      audioCtxRef.current?.close().catch(() => {});
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
        if (updated.length > 12) {
          triggerCakeSlice();
        }
        return updated;
      });
    }
  };

  const handlePointerUp = () => {
    if (isSwiping && swipePath.length > 4 && !cakeSliced) {
      triggerCakeSlice();
    }
    setIsSwiping(false);
  };

  const triggerCakeSlice = () => {
    if (cakeSliced) return;
    setCakeSliced(true);
    confetti({ particleCount: 100, spread: 90, origin: { y: 0.6 }, colors: ["#E5C158", "#FFFFFF", "#3B82F6"] });
  };

  return (
    <SceneShell
      mode="night"
      intensity={blownOut ? 0.5 : 1.3}
      onContinue={onNext}
      continueLabel="Proceed to Grand Finale"
      showContinue={cakeSliced || blownOut}
    >
      <div className="flex flex-col items-center text-center max-w-xl mx-auto px-4">
        <span className="font-display text-xs uppercase tracking-[0.35em] text-gold/80 mb-2">
          ✨ Interactive Celebration ✨
        </span>

        <h2 className="font-display text-3xl sm:text-5xl font-bold italic text-gradient-gold">
          {!blownOut ? "Blow the 21 Candles" : !cakeSliced ? "Slice the Birthday Cake" : "Chapter 21 Wish Sent to the Stars"}
        </h2>

        <p className="mt-2 text-xs sm:text-sm text-slate-300 font-display italic max-w-lg">
          {!blownOut
            ? "Blow into your microphone (or tap the button) to extinguish the 21 candles and make your wish!"
            : !cakeSliced
            ? "Swipe your finger or mouse across the cake to slice it!"
            : "May your 21st year bring you endless happiness, health, and monumental success!"}
        </p>

        {/* Cake Container */}
        <div
          ref={cakeContainerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative mt-6 flex flex-col items-center select-none touch-none cursor-pointer p-4 w-full max-w-md"
        >
          {/* 21 Arched Golden Candles arranged neatly over top tier */}
          <div className="relative w-full max-w-xs flex justify-center items-end gap-1.5 sm:gap-2 mb-[-12px] z-20 px-4">
            {Array.from({ length: 21 }).map((_, i) => {
              // Arc offset for natural curved placement
              const arcOffset = Math.sin((i / 20) * Math.PI) * 12;

              return (
                <div
                  key={i}
                  style={{ marginBottom: `${arcOffset}px` }}
                  className="flex flex-col items-center group transition-transform"
                >
                  {/* Flame */}
                  <AnimatePresence>
                    {candlesLit && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                          scale: [0.85, 1.2, 0.9],
                          opacity: [0.85, 1, 0.9],
                        }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                          duration: 0.5 + (i % 3) * 0.1,
                          repeat: Infinity,
                          repeatType: "reverse",
                          delay: i * 0.03,
                        }}
                        className="relative flex flex-col items-center mb-[1px]"
                      >
                        {/* Glow halo */}
                        <div className="absolute -inset-1 rounded-full bg-gold/40 blur-sm animate-pulse" />
                        {/* Core flame */}
                        <div className="h-4 w-2 sm:h-5 sm:w-2.5 rounded-full bg-gradient-to-t from-amber-600 via-amber-300 to-white shadow-[0_0_12px_#E8C874]" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Candle Wick */}
                  <div className="w-0.5 h-1 bg-slate-800" />

                  {/* Candle Body */}
                  <div className="h-7 w-1.5 sm:h-9 sm:w-2 rounded-t-sm bg-gradient-to-b from-amber-100 via-amber-200 to-amber-400 border border-gold/40 shadow-sm" />
                </div>
              );
            })}
          </div>

          {/* SVG 3-Tier Luxury Royal Gold Cake */}
          <div className="relative w-80 sm:w-96">
            <svg viewBox="0 0 340 230" className="w-full h-auto drop-shadow-[0_20px_40px_rgba(229,193,88,0.3)]">
              <defs>
                <linearGradient id="tier1Grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="50%" stopColor="#0F172A" />
                  <stop offset="100%" stopColor="#020617" />
                </linearGradient>

                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF1B5" />
                  <stop offset="50%" stopColor="#E5C158" />
                  <stop offset="100%" stopColor="#996515" />
                </linearGradient>

                <linearGradient id="frostingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="50%" stopColor="#FFF3C4" />
                  <stop offset="100%" stopColor="#E5C158" />
                </linearGradient>

                <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Crystal Glass Pedestal Plate */}
              <ellipse cx="170" cy="212" rx="155" ry="14" fill="rgba(229,193,88,0.15)" stroke="#E5C158" strokeWidth="1.5" />
              <ellipse cx="170" cy="210" rx="145" ry="10" fill="rgba(255,255,255,0.05)" stroke="rgba(229,193,88,0.4)" strokeWidth="1" />
              <rect x="140" y="202" width="60" height="8" rx="3" fill="url(#goldGrad)" opacity="0.8" />

              {/* Tier 3 (Bottom) */}
              <rect x="35" y="140" width="270" height="65" rx="14" fill="url(#tier1Grad)" stroke="#E5C158" strokeWidth="1.5" />
              {/* Bottom Frosting & Pearls */}
              <path d="M35 150 Q52 166 69 150 T103 150 T137 150 T170 150 T204 150 T238 150 T272 150 T305 150" fill="none" stroke="url(#frostingGrad)" strokeWidth="4.5" strokeLinecap="round" />
              {[50, 85, 120, 155, 190, 225, 260, 295].map((cx, i) => (
                <circle key={i} cx={cx} cy="195" r="3" fill="#FFF1B5" />
              ))}

              {/* Tier 2 (Middle) */}
              <rect x="70" y="85" width="200" height="55" rx="12" fill="url(#goldGrad)" stroke="#FFF1B5" strokeWidth="1.5" />
              <path d="M70 95 Q90 110 110 95 T150 95 T190 95 T230 95 T270 95" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
              {/* Gold Lattice Deco Lines */}
              <path d="M85 110 L255 110" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="4 4" />

              {/* Tier 1 (Top) */}
              <rect x="105" y="40" width="130" height="45" rx="10" fill="url(#tier1Grad)" stroke="#E5C158" strokeWidth="1.5" />
              <path d="M105 48 Q121 60 137 48 T169 48 T201 48 T235 48" fill="none" stroke="url(#frostingGrad)" strokeWidth="3.5" />

              {/* Gold "21" Emblem Badge */}
              <g filter="url(#goldGlow)">
                <circle cx="170" cy="62" r="16" fill="url(#goldGrad)" stroke="#FFFFFF" strokeWidth="1" />
                <text x="170" y="68" textAnchor="middle" fill="#0F172A" fontSize="16" fontWeight="bold" fontFamily="Cormorant Garamond">
                  21
                </text>
              </g>
            </svg>

            {/* Cake Sliced Separator Animation */}
            {cakeSliced && (
              <motion.div
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
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
          <div className="mt-4 flex flex-col items-center gap-3 w-full">
            {micReady !== "listening" ? (
              <button
                onClick={startMic}
                className="glass-gold rounded-full px-8 py-3.5 font-display text-base sm:text-lg italic text-gold shadow-glow-gold transition hover:scale-105 active:scale-95 flex items-center gap-2"
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
              <p className="text-xs text-slate-400">Microphone blocked — tap below to blow out!</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setCandlesLit((prev) => !prev)}
                className="rounded-full border border-gold/40 px-4 py-1.5 text-xs text-gold transition hover:bg-gold/10"
              >
                {candlesLit ? "Unlight" : "Relight"}
              </button>

              <button
                onClick={celebrate}
                className="rounded-full bg-gold/20 border border-gold px-6 py-1.5 text-xs font-semibold text-gold transition hover:bg-gold hover:text-obsidian shadow-glow"
              >
                💨 Blow Candles (Click)
              </button>
            </div>
          </div>
        ) : !cakeSliced ? (
          <div className="mt-4 flex flex-col items-center gap-3">
            <div className="inline-flex items-center gap-2 text-gold animate-bounce text-sm font-display italic">
              ✨ Swipe your finger or mouse across the cake to cut a slice!
            </div>
            <button
              onClick={triggerCakeSlice}
              className="rounded-full border border-gold px-6 py-2 text-xs text-gold transition hover:bg-gold hover:text-obsidian shadow-glow"
            >
              🔪 Click to Slice Cake
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 glass rounded-2xl p-5 border border-gold/30 text-center"
          >
            <p className="font-display text-lg italic text-gold">
              "Happy 21st Birthday Harshvardhan! The candles are blown, the cake is sliced, and all 21 wishes are sent to the stars!"
            </p>
          </motion.div>
        )}
      </div>
    </SceneShell>
  );
}
