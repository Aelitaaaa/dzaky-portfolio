import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

export function OpeningIntro({
  enabled,
  onComplete,
}: {
  enabled: boolean;
  onComplete: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const skip = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    skip.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = overflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const fallback = window.setTimeout(onComplete, enabled ? 3300 : 100);
    if (!enabled) return () => window.clearTimeout(fallback);

    const context = gsap.context(() => {
      gsap.timeline({ onComplete })
        .from(".intro-kicker", { opacity: 0, y: 12, duration: 0.35 })
        .from(".intro-word", { yPercent: 110, rotate: 3, stagger: 0.12, duration: 0.8, ease: "power3.out" }, 0.12)
        .from(".intro-star", { scale: 0, rotate: -90, duration: 0.8, ease: "back.out(1.7)" }, 0.35)
        .from(".intro-caption", { opacity: 0, y: 12, duration: 0.5 }, 0.75)
        .fromTo(".intro-track span", { scaleX: 0 }, { scaleX: 1, duration: 2.2, ease: "power2.inOut" }, 0)
        .to({}, { duration: 0.35 });
    }, root);
    return () => {
      window.clearTimeout(fallback);
      context.revert();
    };
  }, [enabled, onComplete]);

  return (
    <motion.div
      ref={root}
      className="opening-intro"
      role="dialog"
      aria-modal="true"
      aria-label="Pembukaan portofolio Dzaky Putra"
      initial={{ opacity: 1 }}
      exit={enabled ? { clipPath: "inset(0 0 100% 0)" } : { opacity: 0 }}
      transition={{ duration: enabled ? 0.6 : 0 }}
      onKeyDown={(event) => {
        if (event.key === "Escape") onComplete();
        if (event.key === "Tab") { event.preventDefault(); skip.current?.focus(); }
      }}
    >
      <div className="opening-top">
        <span className="opening-brand">dzaky<span>✦</span></span>
        <span className="opening-edition">A DEVELOPER'S JOURNAL / VOL. 01</span>
        <button ref={skip} onClick={onComplete}>Langsung masuk <ArrowUpRight size={16} /></button>
      </div>
      <div className="opening-center">
        <p className="intro-kicker">RASA PENASARAN ADALAH AWALNYA.</p>
        <h2 className="opening-title">
          <span className="intro-line"><span className="intro-word">CODE &</span></span>
          <span className="intro-line outline"><span className="intro-word">STORIES<span className="opening-period">.</span></span></span>
        </h2>
        <span className="intro-star" aria-hidden="true">✦</span>
        <p className="intro-caption">Satu ide. Satu percobaan. Chapter berikutnya.</p>
      </div>
      <div className="opening-bottom">
        <span>MUHAMAD DZAKY PUTRA FARDIAN</span>
        <div className="intro-track" aria-hidden="true"><span /></div>
        <span>WEB DEVELOPER · INDONESIA</span>
      </div>
    </motion.div>
  );
}
