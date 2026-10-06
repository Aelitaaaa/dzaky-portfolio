import { useId, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";

type BookFloatProps = {
  items: string[]; label: string; sublabel?: string;
  trigger?: "hover" | "click"; closeOnSelect?: boolean; physics?: boolean;
  drift?: number; onSelect?: (value: string, index: number) => void;
  bookColor?: string; frontColor?: string; paperColor?: string;
  itemColor?: string; itemTextColor?: string; labelColor?: string;
  width?: number; height?: number; radius?: number; spread?: number; lift?: number;
  tilt?: number; flapAngle?: number; restAngle?: number; openDuration?: number;
  stagger?: number; bounce?: number; enabled?: boolean; selected?: boolean;
};

/** FolderFloat-style fan interaction, with a bound-book silhouette and real selectable pages. */
export default function BookFloat({
  items, label, sublabel, trigger = "hover", closeOnSelect = true, physics = true,
  drift = .5, onSelect, bookColor = "#252422", frontColor = "#444440",
  paperColor = "#f5f2e9", itemColor = "#faf8f1", itemTextColor = "#18181b",
  labelColor = "#f5f5f5", width = 200, height = 148, radius = 8, spread = 180,
  lift = 26, tilt = 8, flapAngle = 34, restAngle = 16, openDuration = 520,
  stagger = 45, bounce = .3, enabled = true, selected = false,
}: BookFloatProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const button = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const animate = enabled && !reduce;
  const mx = useMotionValue(0), my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 150, damping: 20 });
  const y = useSpring(my, { stiffness: 150, damping: 20 });
  const style = {
    "--book-width": `${width}px`, "--book-height": `${height}px`, "--book-radius": `${radius}px`,
    "--book-back": bookColor, "--book-front": frontColor, "--book-paper": paperColor,
    "--book-label": labelColor, "--item-color": itemColor, "--item-ink": itemTextColor,
  } as CSSProperties;
  return <div className={`book-float ${open ? "is-expanded" : ""} ${selected ? "is-current" : ""}`} style={style}
    onPointerEnter={e => { if (trigger === "hover" && e.pointerType === "mouse") setOpen(true); }}
    onPointerLeave={e => { mx.set(0); my.set(0); if (trigger === "hover" && e.pointerType === "mouse" && !e.currentTarget.contains(document.activeElement)) setOpen(false); }}
    onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false); }}
    onKeyDown={e => { if (e.key === "Escape") { setOpen(false); button.current?.focus(); } }}>
    <motion.div className="book-float-object" style={{ x: animate ? x : 0, y: animate ? y : 0 }}
      onPointerMove={e => {
        if (!animate || !physics || e.pointerType !== "mouse") return;
        const b = e.currentTarget.getBoundingClientRect();
        mx.set(Math.max(-5, Math.min(5, (e.clientX - b.left - b.width / 2) * drift * .08)));
        my.set(Math.max(-4, Math.min(4, (e.clientY - b.top - b.height / 2) * drift * .06)));
      }}>
      <div className="float-book-back" aria-hidden="true" />
      <div className="float-book-pageblock" aria-hidden="true" />
      <div className="float-book-notes" id={id} role="group" aria-label={`Kartu teknologi ${label}`}>
        {items.map((item, i) => {
          const position = items.length < 2 ? 0 : i / (items.length - 1) - .5;
          return <motion.button type="button" className="float-book-note" key={item}
            tabIndex={open ? 0 : -1} aria-hidden={!open} disabled={!open}
            style={{ zIndex: 5 + i, pointerEvents: open ? "auto" : "none", visibility: open ? "visible" : "hidden" }}
            initial={false}
            animate={{ x: open ? position * spread : position * 10, y: open ? -height * .64 - lift - (1 - Math.abs(position) * 2) * 23 : -8,
              rotate: open ? position * tilt * 2 : position * 4, scale: open ? 1 : .82, opacity: open ? 1 : 0 }}
            transition={animate ? { type: physics ? "spring" : "tween", duration: openDuration / 1000, bounce, delay: open ? i * stagger / 1000 : 0 } : { duration: 0 }}
            whileHover={animate ? { scale: 1.08, zIndex: 20 } : undefined}
            whileFocus={animate ? { scale: 1.08, zIndex: 20 } : undefined}
            onClick={() => { onSelect?.(item, i); if (closeOnSelect) { setOpen(false); button.current?.focus(); } }}>
            <small>NOTE {String(i + 1).padStart(2, "0")}</small><strong>{item}</strong><span>LIHAT CATATAN ↗</span>
          </motion.button>;
        })}
      </div>
      <motion.button type="button" ref={button} className="float-book-cover" aria-expanded={open} aria-controls={id}
        aria-label={`${open ? "Tutup" : "Buka"} buku ${label}`} onClick={() => setOpen(v => !v)}
        initial={false} animate={{ rotateX: animate ? (open ? flapAngle : restAngle) : 0, y: animate && open ? 9 : 0 }}
        transition={animate ? { type: "spring", duration: openDuration / 1000, bounce } : { duration: 0 }}>
        <span className="float-book-binding" aria-hidden="true" />
        <span className="float-book-series">CODE & STORIES / VOL.</span>
        <strong>{label}</strong><span className="float-book-subtitle">{sublabel || `${items.length} notes`}</span>
        <span className="float-book-mark" aria-hidden="true">✦</span>
        <span className="float-book-ribbon" aria-hidden="true" />
      </motion.button>
    </motion.div>
    <span className="float-book-hint">{open ? "Pilih kartu teknologi ↑" : "Sorot atau ketuk buku ↗"}</span>
  </div>;
}
