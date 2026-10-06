import { lazy, Suspense, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { InkStage } from "./InkStage";

const OrbitStage = lazy(() => import("./OrbitStage"));

function StillOrbit() {
  return <div className="orbit-placeholder" aria-hidden="true"><span>✦</span></div>;
}

export function HeroScene({ enabled }: { enabled: boolean }) {
  const [mode, setMode] = useState("orbit");
  return (
    <div className="hero-scene">
      <div className="scene-tabs" role="group" aria-label="Pilih panel interaktif">
        <button aria-pressed={mode === "orbit"} onClick={() => setMode("orbit")}>01 / ORBIT</button>
        <button aria-pressed={mode === "ink"} onClick={() => setMode("ink")}>02 / TINTA</button>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={mode} className="scene-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: enabled ? 0.2 : 0 }}>
          {mode === "orbit" ? <div className="orbit-stage">
            <div className="orbit-copy"><span>SMALL IDEAS. ENDLESS POSSIBILITIES.</span><strong>IDEAS<br />TAKE<br /><em>SHAPE.</em></strong></div>
            <Suspense fallback={<StillOrbit />}><OrbitStage enabled={enabled} /></Suspense>
            <div className="orbit-note"><span>CREATIVE CODING / 01</span><span>✦</span></div>
          </div> : <InkStage enabled={enabled} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
