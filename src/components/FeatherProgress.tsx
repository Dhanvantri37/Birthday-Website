interface Props {
  index: number;
  total: number;
}

export default function FeatherProgress({ index, total }: Props) {
  const dots = Array.from({ length: total });

  return (
    <div className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 sm:block md:right-6">
      <div className="glass rounded-full px-2.5 py-4 border border-gold/30 flex flex-col items-center gap-3 backdrop-blur-md shadow-glass">
        {dots.map((_, i) => (
          <div key={i} className="relative group flex items-center justify-center">
            <span
              className={`h-2.5 w-2.5 rounded-full transition-all duration-500 cursor-pointer ${
                i <= index
                  ? "bg-gold shadow-glow-gold scale-125"
                  : "bg-slate-700 hover:bg-slate-500"
              }`}
            />
            {/* Tooltip */}
            <span className="absolute right-8 rounded-md bg-obsidian px-2.5 py-1 text-[10px] font-display text-gold opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap border border-gold/30">
              Stage {i + 1}
            </span>
          </div>
        ))}
        <div className="text-[10px] font-display text-gold/80 font-bold mt-1">
          {index + 1}/{total}
        </div>
      </div>
    </div>
  );
}
