import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import FeatherProgress from "./components/FeatherProgress";
import MusicPlayer from "./components/MusicPlayer";
import PinLock from "./components/PinLock";
import Landing from "./scenes/Landing";
import KrishnaBlessing from "./scenes/KrishnaBlessing";
import MemoryGallery from "./scenes/MemoryGallery";
import GiftBoxes from "./scenes/GiftBoxes";
import Blessings from "./scenes/Blessings";
import Letter from "./scenes/Letter";
import BirthdaySky from "./scenes/BirthdaySky";
import Cake from "./scenes/Cake";
import FinalGift from "./scenes/FinalGift";

const journey = ["krishna", "memories", "gifts", "blessings", "letter", "sky", "cake", "final"] as const;

type SceneName = (typeof journey)[number];

function App() {
  const [isPinUnlocked, setIsPinUnlocked] = useState(false);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => Math.min(i + 1, journey.length - 1));
  const scene: SceneName = journey[index];

  const renderScene = (s: SceneName) => {
    switch (s) {
      case "krishna":
        return <KrishnaBlessing onNext={next} />;
      case "memories":
        return <MemoryGallery onNext={next} />;
      case "gifts":
        return <GiftBoxes onNext={next} />;
      case "blessings":
        return <Blessings onNext={next} />;
      case "letter":
        return <Letter onNext={next} />;
      case "sky":
        return <BirthdaySky onNext={next} />;
      case "cake":
        return <Cake onNext={next} />;
      case "final":
        return <FinalGift />;
    }
  };

  return (
    <div className="relative bg-midnight-deep">
      {!isPinUnlocked && (
        <PinLock onSuccess={() => setIsPinUnlocked(true)} correctPin="2807" />
      )}
      <MusicPlayer started={started} />
      {started && <FeatherProgress index={index} total={journey.length} />}

      <AnimatePresence mode="wait">
        {!started ? (
          <motion.div key="landing" exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            <Landing onBegin={() => setStarted(true)} />
          </motion.div>
        ) : (
          <motion.div
            key={scene}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          >
            {renderScene(scene)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
