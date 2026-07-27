import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import SceneShell from "../components/SceneShell";
import { config } from "../config";

export default function KrishnaBlessing({ onNext }: { onNext: () => void }) {
  const [lineIndex, setLineIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const blessingLines = config.krishnaBlessing || config.openingSequence || [];

  useEffect(() => {
    if (config.krishnaVideo) {
      videoRef.current?.play().catch(() => {});
    } else {
      audioRef.current?.play().catch(() => {});
    }
    if (lineIndex >= blessingLines.length) return;
    const t = setTimeout(() => setLineIndex((i) => i + 1), 2400);
    return () => clearTimeout(t);
  }, [lineIndex, blessingLines.length]);

  return (
    <SceneShell mode="day" intensity={1.1} onContinue={onNext} continueLabel="Enter the Memory Garden">
      {!config.krishnaVideo && <audio ref={audioRef} src="/audio/krishna-blessing.mp3" />}

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
        className="relative mb-8 w-full max-w-lg aspect-[16/10] flex items-center justify-center"
      >
        {config.krishnaVideo ? (
          <div className="relative h-full w-full rounded-3xl overflow-hidden border-2 border-gold/50 shadow-glow-gold">
            <video
              ref={videoRef}
              src={config.krishnaVideo}
              className="h-full w-full object-cover"
              autoPlay
              playsInline
            />
          </div>
        ) : config.krishnaImage ? (
          <div className="relative h-full w-full rounded-3xl overflow-hidden border-2 border-gold/60 shadow-glow-gold glass-gold p-1.5">
            <img
              src={config.krishnaImage}
              className="h-full w-full object-cover rounded-2xl shadow-2xl"
              alt="Divine Krishna Blessing"
            />
          </div>
        ) : (
          <svg viewBox="0 0 300 300" className="h-full w-full">
            <defs>
              <radialGradient id="halo" cx="50%" cy="35%" r="55%">
                <stop offset="0%" stopColor="#F4D98A" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#F4D98A" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="river" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2547A3" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#2547A3" stopOpacity="0" />
              </linearGradient>
            </defs>
            <circle cx="150" cy="110" r="120" fill="url(#halo)" />
            <path d="M0 250 Q150 220 300 250 L300 300 L0 300 Z" fill="url(#river)" />
            <g>
              <ellipse cx="150" cy="205" rx="46" ry="70" fill="#2547A3" opacity="0.9" />
              <circle cx="150" cy="118" r="34" fill="#3F63C9" />
              <path d="M150 84 C150 60 168 46 176 30 C168 44 158 56 150 84Z" fill="#2FB8A6" />
              <circle cx="169" cy="40" r="4" fill="#E8C874" />
              <rect x="120" y="150" width="60" height="6" rx="3" fill="#E8C874" transform="rotate(-18 150 153)" />
            </g>
          </svg>
        )}
      </motion.div>

      <div className="min-h-[9rem] space-y-3">
        {blessingLines.slice(0, lineIndex).map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="font-display text-xl italic text-ivory sm:text-2xl"
          >
            {line}
          </motion.p>
        ))}
      </div>
    </SceneShell>
  );
}
