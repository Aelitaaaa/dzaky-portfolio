import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { InkStage } from "./InkStage";
import { BuildStage } from "./BuildStage";

export function HeroScene({ enabled }: { enabled: boolean }) {
  const [mode, setMode] = useState("play");
  return (
    <div className="hero-scene">
      <div className="scene-tabs" role="group" aria-label="Pilih panel interaktif">
        <button aria-pressed={mode === "play"} onClick={() => setMode("play")}>01 / MAIN</button>
        <button aria-pressed={mode === "ink"} onClick={() => setMode("ink")}>02 / TINTA</button>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={mode} className="scene-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: enabled ? 0.2 : 0 }}>
          {mode === "play" ? <BuildStage enabled={enabled} /> : <InkStage enabled={enabled} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
