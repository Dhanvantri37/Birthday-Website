import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import SceneShell from "../components/SceneShell";
import { config } from "../config";

export default function MemoryGallery({ onNext }: { onNext: () => void }) {
  const memories = config.memories;
  const [active, setActive] = useState<number | null>(null);

  // Deterministic rotation & offset for scattered aesthetic layout
  const getRotation = (i: number) => {
    const rotations = [-2, 2, -4, 3, -2, 3, -3, 2, -2, 4, -3, 2, -4, 3, -2, 3, -3, 3, -4, 2, -3];
    return rotations[i % rotations.length];
  };

  const getOffsetY = (i: number) => {
    const offsets = [0, 6, -5, 8, -4, 5, -8, 4, -6, 8, -4, 5, -7, 4, -3, 7, -5, 5, -4, 6, -5];
    return offsets[i % offsets.length];
  };

  // Check if item is video
  const checkIsVideo = (m: (typeof memories)[number]) => {
    const item = m as any;
    if (item.isVideo || item.videoSrc) return true;
    const src = m.src || "";
    return /\.(mp4|webm|mov|m4v)($|\?)/i.test(src);
  };

  const getVideoSrc = (m: (typeof memories)[number]) => {
    const item = m as any;
    return item.videoSrc || m.src;
  };

  // Keyboard navigation for lightbox modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (active === null) return;
      if (e.key === "ArrowLeft" && active > 0) {
        setActive(active - 1);
      } else if (e.key === "ArrowRight" && active < memories.length - 1) {
        setActive(active + 1);
      } else if (e.key === "Escape") {
        setActive(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, memories.length]);

  return (
    <SceneShell
      mode="night"
      intensity={1.2}
      onContinue={onNext}
      continueLabel="Explore 21 Qualities"
      maxWidth="max-w-[1400px]"
    >
      <div className="flex flex-col items-center text-center w-full px-1 sm:px-6 py-2 sm:py-4">
        {/* Header Badge & Title */}
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gold/80 mb-2 inline-block rounded-full bg-gold/10 px-3 py-1 border border-gold/30 shadow-glow"
        >
          ✨ Golden Memory Pinboard ✨
        </motion.span>

        <h2 className="font-display text-2xl sm:text-6xl font-bold italic text-gradient-gold mb-2 sm:mb-3">
          21 Scattered Moments of Greatness
        </h2>

        <p className="text-xs sm:text-base text-slate-300 font-display italic max-w-2xl mb-6 sm:mb-12 leading-relaxed px-2">
          Each polaroid represents a cherished memory of Harshvardhan's journey. Tap any memory to expand its full story!
        </p>

        {/* Mobile Optimized 2-Column Grid (Up to 5 Columns on Large Screens) */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-6 lg:gap-8 px-1">
          {memories.map((m, i) => {
            const rot = getRotation(i);
            const offY = getOffsetY(i);
            const isVideo = checkIsVideo(m);
            const videoUrl = getVideoSrc(m);
            const hasMedia = Boolean(m.src || (m as any).videoSrc);

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: offY }}
                viewport={{ once: true }}
                transition={{ delay: (i % 4) * 0.05, duration: 0.5, ease: "easeOut" }}
                style={{ transform: `rotate(${rot}deg) translateY(${offY}px)` }}
                onClick={() => setActive(i)}
                className="group relative cursor-pointer bg-[#FAF8F3] p-2.5 pb-4 sm:p-4 sm:pb-6 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl border border-amber-200/50 transition-all duration-300 hover:rotate-0 hover:scale-105 hover:z-30 hover:shadow-[0_20px_50px_rgba(232,200,116,0.45)] flex flex-col items-center w-full"
              >
                {/* Washi Tape Accent at Top */}
                <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 w-12 sm:w-16 h-4 sm:h-5 bg-amber-200/60 backdrop-blur-sm border border-amber-300/50 rotate-[-2deg] rounded-sm shadow-sm z-20 flex items-center justify-center">
                  <span className="text-[8px] sm:text-[10px] opacity-40">📌</span>
                </div>

                {/* Polaroid Media Frame */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg sm:rounded-xl bg-slate-900 shadow-inner border border-amber-900/10">
                  {hasMedia ? (
                    isVideo ? (
                      <video
                        src={videoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <img
                        src={m.src}
                        alt={m.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />
                    )
                  ) : (
                    /* Aesthetic Placeholder when photo is not added yet */
                    <div className="h-full w-full bg-gradient-to-br from-amber-900/40 via-amber-950/60 to-slate-950 flex flex-col items-center justify-center p-2 text-center">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center text-lg sm:text-2xl mb-1 animate-pulse">
                        📷
                      </div>
                      <span className="font-display text-[10px] sm:text-xs italic text-gold/80">
                        Memory #{i + 1}
                      </span>
                    </div>
                  )}

                  {/* Memory Badge */}
                  <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 rounded-full bg-black/75 px-2 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-xs font-bold text-amber-300 border border-amber-400/40 backdrop-blur-md shadow-md">
                    {isVideo ? `🎥 #${i + 1}` : `📸 #${i + 1}`}
                  </div>
                </div>

                {/* Handwritten Style Caption */}
                <div className="mt-2 sm:mt-4 w-full text-center px-1">
                  <p className="font-serif italic text-xs sm:text-base font-bold text-slate-800 tracking-tight truncate">
                    {m.title}
                  </p>
                  <p className="font-serif italic text-[10px] sm:text-xs text-slate-500 truncate mt-0.5 sm:mt-1">
                    "{m.caption}"
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detailed Modal Lightbox */}
        <AnimatePresence>
          {active !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/95 p-3 sm:p-6 backdrop-blur-2xl overflow-y-auto"
              onClick={() => setActive(null)}
            >
              <motion.div
                initial={{ scale: 0.85, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="glass max-w-2xl w-full rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-center border border-gold/50 shadow-glow-gold relative overflow-hidden my-auto max-h-[92vh] flex flex-col justify-between"
              >
                <div>
                  {/* Memory badge */}
                  <span className="inline-block rounded-full bg-gold/10 border border-gold/40 px-3 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-gold mb-2 sm:mb-3">
                    ✨ Memory {active + 1} of {memories.length} ✨
                  </span>

                  <h3 className="font-display text-xl sm:text-4xl font-bold italic text-gradient-gold mb-1">
                    {memories[active].title}
                  </h3>
                  <p className="text-[11px] sm:text-sm font-display italic text-gold/80 mb-3 sm:mb-5">
                    "{memories[active].caption}"
                  </p>

                  {/* Main Media display inside Modal */}
                  <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden rounded-xl sm:rounded-2xl border border-gold/30 shadow-2xl mb-3 sm:mb-5 bg-slate-950">
                    {Boolean(memories[active].src || (memories[active] as any).videoSrc) ? (
                      checkIsVideo(memories[active]) ? (
                        <video
                          src={getVideoSrc(memories[active])}
                          controls
                          autoPlay
                          playsInline
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <img
                          src={memories[active].src}
                          alt={memories[active].title}
                          className="h-full w-full object-cover"
                        />
                      )
                    ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-obsidian via-midnight to-obsidian">
                        <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center text-2xl mb-2">
                          📷
                        </div>
                        <p className="font-display text-xs sm:text-base italic text-gold/90">
                          Add photo inside <span className="font-mono text-[10px] sm:text-xs text-amber-200">public/photos/</span>
                        </p>
                      </div>
                    )}
                  </div>

                  <p className="text-xs sm:text-base text-slate-200 font-display italic leading-relaxed mb-4 sm:mb-6 px-1">
                    "{memories[active].description}"
                  </p>
                </div>

                {/* Clean Gift Navigation Controls */}
                <div className="flex items-center justify-between border-t border-gold/20 pt-3 sm:pt-4">
                  <div>
                    {active > 0 ? (
                      <button
                        onClick={() => setActive(active - 1)}
                        className="rounded-full border border-gold/40 px-3.5 py-1.5 sm:px-5 sm:py-2 text-xs font-medium text-gold hover:bg-gold/10 transition"
                      >
                        ← Prev
                      </button>
                    ) : <div />}
                  </div>

                  <button
                    onClick={() => setActive(null)}
                    className="rounded-full bg-gold px-6 py-1.5 sm:px-8 sm:py-2 text-xs font-semibold text-obsidian shadow-glow hover:scale-105 transition"
                  >
                    Close
                  </button>

                  <div>
                    {active < memories.length - 1 ? (
                      <button
                        onClick={() => setActive(active + 1)}
                        className="rounded-full border border-gold/40 px-3.5 py-1.5 sm:px-5 sm:py-2 text-xs font-medium text-gold hover:bg-gold/10 transition"
                      >
                        Next →
                      </button>
                    ) : <div />}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SceneShell>
  );
}
