import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SceneShell from "../components/SceneShell";
import { config } from "../config";

interface StarPoint {
  id: number;
  x: number;
  y: number;
  label: string;
}

export default function BirthdaySky({ onNext }: { onNext: () => void }) {
  const [litCount, setLitCount] = useState(0);
  const [fullyLit, setFullyLit] = useState(false);

  // Generate 21 balanced constellation star coordinates
  const stars: StarPoint[] = Array.from({ length: 21 }).map((_, i) => {
    const angle = (i / 21) * Math.PI * 2;
    const radius = 32 + (i % 3) * 8; // gentle spiral / ring distribution
    const x = 50 + radius * Math.cos(angle) * 0.9;
    const y = 48 + radius * Math.sin(angle) * 0.75;
    return {
      id: i + 1,
      x: Math.max(10, Math.min(90, x)),
      y: Math.max(15, Math.min(80, y)),
      label: `Star ${i + 1}`,
    };
  });

  useEffect(() => {
    if (litCount >= 21) {
      setFullyLit(true);
      return;
    }
    const interval = setInterval(() => {
      setLitCount((c) => c + 1);
    }, 280); // Sequentially light up 21 stars
    return () => clearInterval(interval);
  }, [litCount]);

  return (
    <SceneShell mode="night" intensity={1.4} onContinue={onNext} continueLabel="Final Celebration Summary" showContinue={fullyLit}>
      <div className="relative flex flex-col items-center text-center max-w-4xl mx-auto px-4 min-h-[75vh] justify-between py-6">
        <div>
          <span className="font-display text-xs uppercase tracking-[0.35em] text-gold/80 mb-2">
            🌟 Grand Finale Constellation
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold italic text-gradient-gold">
            21 Stars of Chapter 21
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-300 font-display italic">
            {litCount < 21
              ? `Lighting star ${litCount} of 21...`
              : "All 21 stars shine bright in your honor tonight!"}
          </p>
        </div>

        {/* Constellation Star Sky Box */}
        <div className="relative w-full max-w-2xl h-80 sm:h-96 glass rounded-3xl border border-gold/30 my-6 overflow-hidden shadow-glow-gold">
          {/* SVG Connecting Constellation Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {stars.slice(0, litCount).map((star, idx) => {
              if (idx === 0) return null;
              const prev = stars[idx - 1];
              return (
                <line
                  key={`line-${idx}`}
                  x1={`${prev.x}%`}
                  y1={`${prev.y}%`}
                  x2={`${star.x}%`}
                  y2={`${star.y}%`}
                  stroke="rgba(229, 193, 88, 0.45)"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
              );
            })}
          </svg>

          {/* 21 Star Nodes */}
          {stars.map((star, idx) => {
            const isLit = idx < litCount;
            return (
              <div
                key={star.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                style={{ left: `${star.x}%`, top: `${star.y}%` }}
              >
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isLit ? { scale: [1, 1.4, 1.1], opacity: 1 } : { scale: 0.6, opacity: 0.2 }}
                  className={`relative flex items-center justify-center rounded-full transition-all ${
                    isLit
                      ? "h-6 w-6 sm:h-7 sm:w-7 bg-gradient-to-r from-yellow-300 via-amber-400 to-amber-200 shadow-glow-gold"
                      : "h-3 w-3 bg-slate-600"
                  }`}
                >
                  {isLit && (
                    <span className="text-[10px] font-bold text-obsidian select-none">
                      {star.id}
                    </span>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Grand Finale Message Box */}
        <AnimatePresence>
          {fullyLit && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="glass-gold rounded-3xl p-6 sm:p-10 border border-gold/50 shadow-glow-gold max-w-2xl w-full"
            >
              <h3 className="font-display text-3xl sm:text-5xl font-bold italic text-gradient-gold mb-3">
                {config.finaleMessage.heading}
              </h3>
              <p className="font-display text-lg sm:text-xl italic text-amber-100 mb-4">
                "{config.finaleMessage.subheading}"
              </p>
              <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-4" />
              <p className="font-display text-xl sm:text-2xl font-semibold italic text-gold">
                ✨ {config.finaleMessage.quote} ✨
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SceneShell>
  );
}
