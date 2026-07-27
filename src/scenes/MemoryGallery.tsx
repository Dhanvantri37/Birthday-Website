import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import SceneShell from "../components/SceneShell";
import { config } from "../config";

export default function MemoryGallery({ onNext }: { onNext: () => void }) {
  const memories = config.memories;
  const [active, setActive] = useState<number | null>(null);

  // Deterministic rotation & offset for scattered aesthetic layout
  const getRotation = (i: number) => {
    const rotations = [-4, 3, -6, 5, -2, 4, -5, 2, -3, 6, -4, 3, -5, 4, -2, 5, -3, 4, -6, 3, -4];
    return rotations[i % rotations.length];
  };

  const getOffsetY = (i: number) => {
    const offsets = [0, 8, -6, 12, -4, 6, -10, 4, -8, 10, -5, 7, -9, 5, -3, 9, -7, 6, -4, 8, -6];
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

  return (
    <SceneShell mode="night" intensity={1.2} onContinue={onNext} continueLabel="Explore 21 Qualities">
      <div className="flex flex-col items-center text-center max-w-6xl mx-auto px-4 py-4">
        {/* Header Badge & Title */}
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-xs uppercase tracking-[0.35em] text-gold/80 mb-2 inline-block rounded-full bg-gold/10 px-4 py-1 border border-gold/30"
        >
          ✨ Golden Memory Pinboard ✨
        </motion.span>

        <h2 className="font-display text-3xl sm:text-5xl font-bold italic text-gradient-gold mb-3">
          21 Scattered Moments of Greatness
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 font-display italic max-w-xl mb-10 leading-relaxed">
          Each polaroid represents a cherished memory of Harshvardhan's journey. Tap any memory to unfold its full story!
        </p>

        {/* Scattered Polaroid Pinboard Grid */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 px-2">
          {memories.map((m, i) => {
            const rot = getRotation(i);
            const offY = getOffsetY(i);
            const isVideo = checkIsVideo(m);
            const videoUrl = getVideoSrc(m);

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: offY }}
                viewport={{ once: true }}
                transition={{ delay: (i % 5) * 0.06, duration: 0.6, ease: "easeOut" }}
                style={{ transform: `rotate(${rot}deg) translateY(${offY}px)` }}
                onClick={() => setActive(i)}
                className="group relative cursor-pointer bg-[#FDFBF7] p-3 pb-4 rounded-xl shadow-2xl border border-amber-100/40 transition-all duration-300 hover:rotate-0 hover:scale-110 hover:z-30 hover:shadow-[0_20px_50px_rgba(232,200,116,0.4)] flex flex-col items-center"
              >
                {/* Washi Tape Accent at Top */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-4 bg-amber-200/50 backdrop-blur-sm border border-amber-300/40 rotate-[-2deg] rounded-sm shadow-sm z-20" />

                {/* Polaroid Media Frame */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-slate-900 shadow-inner">
                  {isVideo ? (
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
                  )}

                  {/* Memory Badge */}
                  <div className="absolute top-2 left-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-400/30 backdrop-blur-md">
                    {isVideo ? `🎥 Video #${i + 1}` : `📸 Memory #${i + 1}`}
                  </div>
                </div>

                {/* Handwritten Style Caption */}
                <div className="mt-3 w-full text-center px-1">
                  <p className="font-serif italic text-xs font-semibold text-slate-800 tracking-tight truncate">
                    {m.title}
                  </p>
                  <p className="font-serif italic text-[10px] text-slate-500 truncate mt-0.5">
                    "{m.caption}"
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detailed Modal */}
        <AnimatePresence>
          {active !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/90 p-4 sm:p-6 backdrop-blur-xl"
              onClick={() => setActive(null)}
            >
              <motion.div
                initial={{ scale: 0.85, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="glass max-w-lg w-full rounded-3xl p-6 sm:p-8 text-center border border-gold/40 shadow-glow-gold relative overflow-hidden"
              >
                {/* Memory badge */}
                <span className="inline-block rounded-full bg-gold/10 border border-gold/40 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-gold mb-3">
                  ✨ Memory {active + 1} of {memories.length} ✨
                </span>

                <h3 className="font-display text-2xl sm:text-3xl font-bold italic text-gradient-gold mb-1">
                  {memories[active].title}
                </h3>
                <p className="text-xs font-display italic text-gold/80 mb-4">{memories[active].caption}</p>

                {/* Main Media display inside Modal */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-gold/20 shadow-inner mb-4">
                  {checkIsVideo(memories[active]) ? (
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
                  )}
                </div>

                <p className="text-sm text-slate-300 font-display italic leading-relaxed mb-6">
                  "{memories[active].description}"
                </p>

                {/* Clean Gift Navigation Controls */}
                <div className="flex items-center justify-between border-t border-gold/20 pt-4">
                  <div>
                    {active > 0 ? (
                      <button
                        onClick={() => setActive(active - 1)}
                        className="rounded-full border border-gold/40 px-4 py-1.5 text-xs text-gold hover:bg-gold/10 transition"
                      >
                        ← Prev
                      </button>
                    ) : <div />}
                  </div>

                  <button
                    onClick={() => setActive(null)}
                    className="rounded-full bg-gold px-6 py-1.5 text-xs font-semibold text-obsidian shadow-glow hover:scale-105 transition"
                  >
                    Close
                  </button>

                  <div>
                    {active < memories.length - 1 ? (
                      <button
                        onClick={() => setActive(active + 1)}
                        className="rounded-full border border-gold/40 px-4 py-1.5 text-xs text-gold hover:bg-gold/10 transition"
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
