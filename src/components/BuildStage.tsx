import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Check, GripVertical, Menu, MousePointer2, PanelTop, RotateCcw, Type } from "lucide-react";

const pieces = [
  { id: "logo", label: "Logo", icon: PanelTop },
  { id: "menu", label: "Menu", icon: Menu },
  { id: "title", label: "Judul", icon: Type },
  { id: "button", label: "Tombol", icon: MousePointer2 },
] as const;
type PieceId = typeof pieces[number]["id"];
const designs = [
  { file: "portfolio.html", name: "Portofolio", logo: "dzaky✦", menu: "Karya / Tentang", title: "Code & Stories.", button: "Lihat karya ↗" },
  { file: "studio.html", name: "Studio kreatif", logo: "studio/01", menu: "Proyek / Kontak", title: "Ide jadi nyata.", button: "Mulai ngobrol ↗" },
  { file: "kopi.html", name: "Kedai kopi", logo: "kopi.sore", menu: "Menu / Lokasi", title: "Seduh cerita.", button: "Lihat menu ↗" },
];
const instructions = "Geser potongan, atau pilih lalu ketuk kotaknya.";

function newPuzzle(design: number) {
  const order = pieces.map(piece => piece.id);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return { design, order, placed: [] as PieceId[], selected: null as PieceId | null, moves: 0, wrong: null as PieceId | null, message: "Empat potongan menunggu tempatnya. Yuk, mulai!" };
}

/** A small, replayable interface puzzle. Drag, touch and keyboard share the same rules. */
export function BuildStage({ enabled }: { enabled: boolean }) {
  const [game, setGame] = useState(() => newPuzzle(0));
  const slotRefs = useRef<Partial<Record<PieceId, HTMLButtonElement>>>({});
  const pieceRefs = useRef<Partial<Record<PieceId, HTMLButtonElement>>>({});
  const dragged = useRef(false);
  const design = designs[game.design];
  const complete = game.placed.length === pieces.length;

  function choose(id: PieceId, keyboard = false) {
    if (game.placed.includes(id)) return;
    const selected = game.selected === id ? null : id;
    const label = pieces.find(piece => piece.id === id)!.label;
    setGame({ ...game, selected, wrong: null, message: selected ? `${label} dipilih. Cari kotak ${label.toLowerCase()} di halaman.` : "Pilihan dilepas. Coba potongan lainnya." });
    if (keyboard && selected) slotRefs.current[pieces.find(piece => !game.placed.includes(piece.id))!.id]?.focus();
  }

  function place(id: PieceId, target: PieceId, keyboard = false) {
    if (game.placed.includes(id) || game.placed.includes(target)) return;
    const moves = game.moves + 1;
    const label = pieces.find(piece => piece.id === id)!.label;
    if (id !== target) {
      setGame({ ...game, moves, selected: id, wrong: target, message: `Belum cocok. ${label} punya kotak sendiri. Coba lagi!` });
      return;
    }
    const placed = [...game.placed, id];
    const won = placed.length === pieces.length;
    setGame({ ...game, placed, selected: null, moves, wrong: null, message: won ? (moves === 4 ? "Pas semua! Website jadi dalam 4 langkah. ✦" : `Website jadi! Selesai dalam ${moves} langkah. ✦`) : `${label} terpasang! ${pieces.length - placed.length} potongan lagi.` });
    if (keyboard) {
      const next = game.order.find(piece => !placed.includes(piece));
      if (next) pieceRefs.current[next]?.focus();
    }
  }

  return (
    <div className="puzzle-stage" onKeyDown={event => {
      if (event.key === "Escape") setGame({ ...game, selected: null, wrong: null, message: "Pilihan dilepas. Pilih potongan untuk melanjutkan." });
    }}>
      <div className="puzzle-heading">
        <div className="puzzle-kicker"><span>MINI PLAYGROUND</span><span>0{game.design + 1} / 03</span></div>
        <h2>Susun <em>UI.</em><span aria-hidden="true">✦</span></h2>
      </div>
      <p className="puzzle-help" id="puzzle-help">{instructions}</p>
      <div className="puzzle-preview" data-design={game.design} data-complete={complete} role="group" aria-label={`Halaman ${design.name}, ${game.placed.length} dari 4 potongan terpasang`}>
        <div className="puzzle-toolbar"><span aria-hidden="true">● ● ●</span><span>{design.file}</span><strong>{game.placed.length}/4</strong></div>
        <div className="puzzle-page" data-selecting={game.selected !== null}>
          {pieces.map(({ id, label, icon: Icon }, index) => {
            const filled = game.placed.includes(id);
            return (
              <motion.button
                key={id}
                ref={node => { if (node) slotRefs.current[id] = node; else delete slotRefs.current[id]; }}
                className={`puzzle-slot slot-${id}`}
                data-filled={filled}
                data-wrong={game.wrong === id}
                aria-label={`Kotak ${label}${filled ? ", sudah terpasang" : ""}`}
                aria-disabled={filled}
                aria-describedby="puzzle-help"
                onClick={event => {
                  if (filled) return;
                  if (game.selected) place(game.selected, id, event.detail === 0);
                  else setGame({ ...game, wrong: null, message: "Pilih potongan di bawah dulu, lalu ketuk kotaknya." });
                }}
                animate={enabled && game.wrong === id ? { x: [0, -3, 3, 0] } : { x: 0 }}
                transition={{ duration: enabled ? 0.2 : 0 }}
              >
                {filled ? <span className="puzzle-component">{design[id]}</span> : <span className="puzzle-placeholder"><Icon size={14} aria-hidden="true" /><span>0{index + 1} / {label}</span></span>}
              </motion.button>
            );
          })}
        </div>
        {complete ? <motion.div className="puzzle-stamp" initial={enabled ? { opacity: 0, scale: 1.3, rotate: 8 } : false} animate={{ opacity: 1, scale: 1, rotate: -8 }} transition={{ duration: enabled ? 0.25 : 0 }} aria-hidden="true"><Check size={14} /> BUILT BY YOU</motion.div> : null}
      </div>
      <div className="puzzle-tray" role="group" aria-label="Potongan antarmuka">
        {game.order.map(id => {
          const { label, icon: Icon } = pieces.find(piece => piece.id === id)!;
          const used = game.placed.includes(id);
          return (
            <motion.button
              key={`${game.design}-${id}`}
              ref={node => { if (node) pieceRefs.current[id] = node; else delete pieceRefs.current[id]; }}
              className="puzzle-piece"
              aria-label={`Pilih ${label}: ${design[id]}`}
              aria-pressed={game.selected === id}
              aria-describedby="puzzle-help"
              disabled={used}
              drag={!used}
              dragSnapToOrigin
              dragMomentum={false}
              whileDrag={{ zIndex: 10, scale: 1.03, cursor: "grabbing" }}
              onPointerDownCapture={() => { dragged.current = false; }}
              onDragStart={() => {
                dragged.current = true;
                setGame({ ...game, selected: id, wrong: null, message: `Letakkan ${label.toLowerCase()} di kotak yang sesuai.` });
              }}
              onDragEnd={event => {
                if (!("clientX" in event) || event.type === "pointercancel") return;
                const target = pieces.find(piece => {
                  const rect = slotRefs.current[piece.id]?.getBoundingClientRect();
                  return rect && event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
                });
                if (target) place(id, target.id);
              }}
              onClick={event => { if (!dragged.current || event.detail === 0) choose(id, event.detail === 0); }}
            >
              <Icon size={17} aria-hidden="true" />
              <span><small>{label}</small><strong>{design[id]}</strong></span>
              {used ? <Check size={13} aria-hidden="true" /> : <GripVertical size={13} aria-hidden="true" />}
            </motion.button>
          );
        })}
      </div>
      <div className="puzzle-footer">
        <div><small>{game.moves} LANGKAH{complete ? " · SELESAI" : ""}</small><p role="status" aria-live="polite" aria-atomic="true">{game.message}</p></div>
        <button className="puzzle-restart" aria-label={complete ? "Main desain berikutnya" : "Ulangi puzzle"} onClick={() => {
          dragged.current = false;
          setGame(newPuzzle(complete ? (game.design + 1) % designs.length : game.design));
        }}><RotateCcw size={15} aria-hidden="true" /><span>{complete ? "Lagi" : "Ulangi"}</span></button>
      </div>
    </div>
  );
}
