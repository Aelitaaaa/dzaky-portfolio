import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Check, Code2, Pencil, Sparkles } from "lucide-react";

const steps = [
  { label: "Rancang", icon: Pencil, caption: "Mulai dari kebutuhan. Susun alur dan sketsa sebelum menulis kode." },
  { label: "Bangun", icon: Code2, caption: "Ubah sketsa menjadi antarmuka. Sambungkan setiap bagian agar bekerja bersama." },
  { label: "Rapikan", icon: Sparkles, caption: "Coba, perbaiki, ulangi. Detail kecil membuat pengalaman terasa lebih nyaman." },
];

/** A small interface sketch that follows the portfolio's development process. */
export function BuildStage({ enabled }: { enabled: boolean }) {
  const [step, setStep] = useState(0);
  return (
    <div className="build-stage">
      <div className="build-kicker"><span>CATATAN DEVELOPER</span><span>01 → 03</span></div>
      <h2>Dari ide,<br /><em>jadi karya.</em></h2>
      <div className="build-steps" role="group" aria-label="Coba tahap pembuatan antarmuka">
        {steps.map(({ label, icon: Icon }, index) => (
          <button key={label} aria-pressed={step === index} aria-controls="build-preview" onClick={() => setStep(index)}>
            <Icon size={14} aria-hidden="true" /><span>{label}</span>
          </button>
        ))}
      </div>
      <div id="build-preview" className="build-preview" data-step={step} role="img" aria-label={`Sketsa portofolio, tahap ${steps[step].label.toLowerCase()}`}>
        <div className="sketch-toolbar" aria-hidden="true"><span /><span /><span /><small>portfolio / draft</small></div>
        <div className="sketch-body" aria-hidden="true">
          <div className="sketch-copy">
            <span className="sketch-label">HALO, SAYA DZAKY</span>
            <strong>Code &<br />Stories.</strong>
            <span className="sketch-line" /><span className="sketch-line short" />
            <span className="sketch-cta">Lihat karya <ArrowUpRight size={11} /></span>
          </div>
          <motion.div className="sketch-card" animate={{ rotate: step === 2 ? -4 : 0, y: step === 2 ? -3 : 0 }} transition={{ duration: enabled ? 0.25 : 0 }}>
            {step === 0 ? <Pencil size={25} /> : step === 1 ? <Code2 size={29} /> : <Check size={29} />}
            <span>{step === 0 ? "SKETSA" : step === 1 ? "KODE" : "SIAP"}</span>
          </motion.div>
        </div>
      </div>
      <p className="build-caption" aria-live="polite" aria-atomic="true">{steps[step].caption}</p>
      <a className="build-link" href="#projects">Lihat hasilnya di proyek <ArrowUpRight size={15} aria-hidden="true" /></a>
    </div>
  );
}
