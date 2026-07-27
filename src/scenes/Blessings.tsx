import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import SceneShell from "../components/SceneShell";
import { config } from "../config";

function Lotus({ bloomed }: { bloomed: boolean }) {
  return (
    <svg viewBox="0 0 60 60" className="h-14 w-14 drop-shadow-md">
      <motion.g
        animate={{ scale: bloomed ? 1.15 : 0.65, opacity: bloomed ? 1 : 0.6 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ transformOrigin: "30px 34px" }}
      >
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <ellipse
            key={angle}
            cx="30"
            cy="20"
            rx="8"
            ry="16"
            fill={bloomed ? "#E4DBFF" : "#C9B8F5"}
            opacity={bloomed ? 0.95 : 0.55}
            transform={`rotate(${angle} 30 34)`}
          />
        ))}
        <circle cx="30" cy="34" r="6" fill="#E8C874" />
      </motion.g>
    </svg>
  );
}

export default function Blessings({ onNext }: { onNext: () => void }) {
  const list = config.blessings || [];
  const [selected, setSelected] = useState<number | null>(null);
  const [bloomedSet, setBloomedSet] = useState<Set<number>>(new Set());

  const handleSelect = (index: number) => {
    setSelected(index);
    setBloomedSet((prev) => new Set(prev).add(index));
  };

  const allBloomed = bloomedSet.size === list.length;

  return (
    <SceneShell mode="day" intensity={0.6} onContinue={onNext} continueLabel="Read Personal Messages">
      <div className="flex flex-col items-center text-center max-w-4xl mx-auto px-4 py-4">
        {/* Header */}
        <span className="font-display text-xs uppercase tracking-[0.35em] text-gold/80 mb-2">
          🌸 Sacred Wishes
        </span>

        <h2 className="font-display text-3xl sm:text-5xl font-bold italic text-gradient-gold mb-2">
          🌿 10 Blessings for Chapter 21
        </h2>

        <p className="mt-1 text-xs sm:text-sm text-ivory/80 font-display italic max-w-lg mb-8">
          {allBloomed
            ? "✨ All 10 divine blessings have bloomed for your journey! ✨"
            : "Tap each sacred lotus to unfold a divine blessing for Harshvardhan."}
        </p>

        {/* 10 Lotus Grid */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-6 mb-8">
          {list.map((item, i) => {
            const isBloomed = bloomedSet.has(i);
            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                onClick={() => handleSelect(i)}
                className={`glass-gold rounded-2xl p-4 flex flex-col items-center justify-between border transition-all duration-300 shadow-glass hover:scale-105 min-h-[140px] cursor-pointer ${
                  isBloomed
                    ? "border-gold bg-gold/15 shadow-[0_0_25px_rgba(232,200,116,0.3)]"
                    : "border-gold/30 hover:border-gold/60"
                }`}
              >
                <div className="relative flex items-center justify-center mb-1">
                  <Lotus bloomed={isBloomed} />
                  <span className="absolute text-xl pointer-events-none">{item.icon}</span>
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-widest text-gold/70">
                  #{i + 1}
                </span>

                <h3 className="font-display text-xs font-bold text-ivory text-center mt-1">
                  {item.title}
                </h3>
              </motion.button>
            );
          })}
        </div>

        {/* End Line Quote Box */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="glass-gold rounded-3xl p-6 sm:p-8 border border-gold/40 shadow-glow-gold max-w-2xl w-full text-center"
        >
          <div className="text-gold text-xs uppercase tracking-[0.3em] font-semibold mb-2">
            🙏 Divine Blessing for Chapter 21
          </div>
          <p className="font-display text-base sm:text-lg italic text-slate-200 leading-relaxed">
            "{config.blessingsEndLine}"
          </p>
        </motion.div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selected !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/90 p-4 sm:p-6 backdrop-blur-xl"
              onClick={() => setSelected(null)}
            >
              <motion.div
                initial={{ scale: 0.85, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="glass max-w-md w-full rounded-3xl p-8 text-center border border-gold/50 shadow-glow-gold relative overflow-hidden"
              >
                <div className="flex justify-center mb-3">
                  <div className="relative flex items-center justify-center">
                    <Lotus bloomed={true} />
                    <span className="absolute text-3xl pointer-events-none">{list[selected].icon}</span>
                  </div>
                </div>

                <span className="inline-block rounded-full bg-gold/10 border border-gold/40 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gold mb-2">
                  Blessing #{selected + 1} of 10
                </span>

                <h3 className="font-display text-3xl font-bold italic text-gradient-gold mb-3">
                  {list[selected].title} {list[selected].icon}
                </h3>

                <p className="text-base text-slate-200 font-display italic leading-relaxed mb-6">
                  "{list[selected].desc}"
                </p>

                <div className="flex items-center justify-between border-t border-gold/20 pt-4">
                  {selected > 0 ? (
                    <button
                      onClick={() => handleSelect(selected - 1)}
                      className="rounded-full border border-gold/40 px-4 py-1.5 text-xs text-gold hover:bg-gold/10 transition"
                    >
                      ← Previous
                    </button>
                  ) : <div />}

                  <button
                    onClick={() => setSelected(null)}
                    className="rounded-full bg-gold px-6 py-1.5 text-xs font-semibold text-obsidian shadow-glow"
                  >
                    Close
                  </button>

                  {selected < list.length - 1 ? (
                    <button
                      onClick={() => handleSelect(selected + 1)}
                      className="rounded-full border border-gold/40 px-4 py-1.5 text-xs text-gold hover:bg-gold/10 transition"
                    >
                      Next →
                    </button>
                  ) : <div />}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SceneShell>
  );
}
