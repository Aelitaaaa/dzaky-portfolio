import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";

export function PhotoPanel({ enabled }: { enabled: boolean }) {
  const [comic, setComic] = useState(true);
  const [shot, setShot] = useState(0);
  const x = useMotionValue(0), y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 180, damping: 18 });
  const rotateY = useSpring(y, { stiffness: 180, damping: 18 });
  return <motion.div className={`photo-panel ${comic ? "is-comic" : ""}`}
    style={{ rotateX: enabled ? rotateX : 0, rotateY: enabled ? rotateY : 0 }}
    onPointerMove={event => {
      if (!enabled || event.pointerType !== "mouse") return;
      const bounds = event.currentTarget.getBoundingClientRect();
      x.set((.5 - (event.clientY - bounds.top) / bounds.height) * 12);
      y.set(((event.clientX - bounds.left) / bounds.width - .5) * 12);
    }}
    onPointerLeave={() => { x.set(0); y.set(0); }}>
    <img src="/dzaky-portrait.jpeg" alt="Foto Muhamad Dzaky Putra Fardian" width="1085" height="1449" loading="lazy" />
    <span className="photo-label">DZAKY / CHAPTER 01</span>
    <AnimatePresence>
      {shot > 0 && enabled && <motion.span key={shot} className="photo-impact" aria-hidden="true"
        initial={{ opacity: 0, scale: .3, rotate: -20 }} animate={{ opacity: [0, 1, 1, 0], scale: [.3, 1.2, 1, 1.1], rotate: -10 }}
        transition={{ duration: .7 }} onAnimationComplete={() => setShot(0)}>パシャ!</motion.span>}
    </AnimatePresence>
    <button className="photo-switch" aria-pressed={comic} onClick={() => { setComic(v => !v); setShot(v => v + 1); }}>
      {comic ? "LIHAT FOTO ASLI ↗" : "MODE MANGA ✦"}
    </button>
  </motion.div>;
}
