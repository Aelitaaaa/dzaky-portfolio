import { useEffect, useId, useRef, useState } from "react";
import { animate, createScope } from "animejs";
import { motion, useMotionValue, useSpring, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import type { ReactNode } from "react";

// Original implementation, inspired by the interaction ideas in React Bits.
export function Magnetic({ children, enabled }: { children: ReactNode; enabled: boolean }) {
  const mx = useMotionValue(0), my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 190, damping: 19 });
  const y = useSpring(my, { stiffness: 190, damping: 19 });
  return <motion.div className="magnetic-note" style={{ x: enabled ? x : 0, y: enabled ? y : 0 }}
    onPointerMove={e => {
      if (!enabled || e.pointerType !== "mouse") return;
      const r = e.currentTarget.getBoundingClientRect();
      mx.set(Math.max(-8, Math.min(8, (e.clientX - r.left - r.width / 2) * .1)));
      my.set(Math.max(-6, Math.min(6, (e.clientY - r.top - r.height / 2) * .1)));
    }} onPointerLeave={() => { mx.set(0); my.set(0); }}>{children}</motion.div>;
}

const chapters = [["home", "Cover"], ["about", "Tentang"], ["projects", "Proyek"], ["stack", "Teknologi"], ["activity", "Aktivitas"], ["journey", "Perjalanan"], ["contact", "Kontak"]];
export function Bookmarks({ active }: { active: string }) {
  const { scrollYProgress } = useScroll();
  const [percent, setPercent] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", v => setPercent(Math.round(v * 100)));
  return <nav className="bookmarks" aria-label="Penanda chapter">
    <span className="book-spine" aria-hidden="true">CODE & STORIES / VOL. 01</span>
    <div className="chapter-tabs">{chapters.map(([id, label], i) => <a key={id} href={`#${id}`}
      aria-label={`Chapter ${i + 1}: ${label}`} aria-current={(active || "home") === id ? "location" : undefined}>
      <span>{String(i + 1).padStart(2, "0")}</span><em>{label}</em>
    </a>)}</div>
    <span className="book-percent" aria-label={`Progres baca ${percent} persen`}>{percent}%<small>READ</small></span>
  </nav>;
}

export function Notebook({ enabled }: { enabled: boolean }) {
  const [page, setPage] = useState(0);
  const root = useRef<HTMLElement>(null);
  const id = useId();
  useEffect(() => {
    if (!enabled) return;
    const scope = createScope({ root }).add(() => {
      animate(".notebook-page", { opacity: [0, 1], y: [10, 0], duration: 420, ease: "out(3)" });
    });
    return () => scope.revert();
  }, [page, enabled]);
  const notes = [
    { label: "IDE", title: "Mulai dari rasa penasaran.", body: "Buku, game, dan hal kecil sehari-hari bisa jadi awal sebuah proyek.", stamp: "✦ EXPLORE" },
    { label: "KODE", title: "Satu ide. Banyak percobaan.", body: "React untuk antarmuka. Laravel dan NestJS untuk alur di belakang layar.", stamp: "</> BUILD" },
    { label: "CERITA", title: "Setiap proyek punya chapter.", body: "Buka kartu proyek untuk melihat teknologi dan cerita di balik pembuatannya.", stamp: "↗ KEEP GOING" },
  ];
  return <Magnetic enabled={enabled}><aside ref={root} className="manga-notebook" aria-label="Catatan kecil Dzaky">
    <div className="notebook-tabs" role="tablist" aria-label="Pilih catatan" onKeyDown={event => {
      const current = Number((event.target as HTMLElement).dataset.index);
      const next = event.key === "ArrowRight" ? (current + 1) % notes.length : event.key === "ArrowLeft" ? (current + notes.length - 1) % notes.length : event.key === "Home" ? 0 : event.key === "End" ? notes.length - 1 : null;
      if (next === null) return;
      event.preventDefault();
      setPage(next);
      root.current?.querySelector<HTMLButtonElement>(`[data-index="${next}"]`)?.focus();
    }}>{notes.map((note, i) => <button key={note.label} id={`${id}-tab-${i}`} data-index={i} role="tab" aria-selected={page === i} aria-controls={`${id}-page`} tabIndex={page === i ? 0 : -1} onClick={() => setPage(i)}><span>0{i + 1}</span>{note.label}</button>)}</div>
    <div id={`${id}-page`} className="notebook-page" role="tabpanel" aria-labelledby={`${id}-tab-${page}`} tabIndex={0}>
      <small>NOTES FROM THE MARGIN / 0{page + 1}</small><h3>{notes[page].title}</h3><p>{notes[page].body}</p><span>{notes[page].stamp}</span>
    </div>
  </aside></Magnetic>;
}

export function ChapterBreak({ enabled }: { enabled: boolean }) {
  const { scrollY } = useScroll();
  const x = useTransform(scrollY, v => -(v % 900) * .09);
  return <div className="chapter-break" aria-hidden="true"><motion.div style={{ x: enabled ? x : 0 }}>
    {Array.from({ length: 5 }, (_, i) => <span key={i}>✦ TURN THE PAGE <b>つづく</b> KEEP BUILDING ↗ </span>)}
  </motion.div></div>;
}
