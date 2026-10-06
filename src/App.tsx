import BookFloat from "./components/BookFloat";
import { Bookmarks, Notebook, ChapterBreak } from "./components/MangaDetails";
import { PhotoPanel } from "./components/PhotoPanel";
import { HeroScene } from "./components/HeroScene";
import { OpeningIntro } from "./components/OpeningIntro";
import { usePortfolioAnimations } from "./hooks/usePortfolioAnimations";
import {
  useLenisSmoothScroll,
  stopLenisScroll,
  startLenisScroll,
} from "./hooks/useLenisSmoothScroll";
import { SiGithub as Github } from "@icons-pack/react-simple-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Check,
  Code2,
  Copy,
  Download,
  Mail,
  Menu,
  Moon,
  RotateCcw,
  Sparkles,
  Sun,
  X,
  Zap,
} from "lucide-react";
import { profile, projects, layers, journey } from "./data/mangaData";
import type { MangaProject } from "./data/mangaData";

const nav = [
  ["about", "Tentang"],
  ["projects", "Proyek"],
  ["stack", "Teknologi"],
  ["activity", "Aktivitas"],
  ["journey", "Perjalanan"],
];
function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className} data-aos="fade-up">
      {children}
    </div>
  );
}
function Heading({
  number,
  title,
  note,
}: {
  number: string;
  title: string;
  note: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">
          CHAPTER {number} / {note}
        </span>
        <h2>
          {title}
          <span className="accent">.</span>
        </h2>
      </div>
      <span className="chapter-number" aria-hidden="true">
        {number}
      </span>
    </div>
  );
}
function InkCanvas({ enabled }: { enabled: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!enabled || !canvas.current) return;
    const el = canvas.current,
      ctx = el.getContext("2d");
    if (!ctx) return;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      r: number;
    }[] = [];
    const impacts: { x: number; y: number; life: number; word: string }[] = [];
    let frame = 0;
    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      el.width = innerWidth * dpr;
      el.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    let lastBurst = 0;
    const burst = (e: PointerEvent) => {
      if (performance.now() - lastBurst < 180) return;
      lastBurst = performance.now();
      if ((e.target as Element)?.closest("input, select, textarea")) return;
      impacts.push({ x: Math.max(65, Math.min(innerWidth - 65, e.clientX)), y: Math.max(60, e.clientY), life: 1, word: ["TAP!", "POW!", "ドン!", "CLICK!"][Math.floor(Math.random() * 4)] });
      if (impacts.length > 4) impacts.shift();
      for (let i = 0; i < 10; i++)
        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.7) * 5,
          life: 1,
          r: Math.random() * 3 + 1,
        });
      if (!frame) frame = requestAnimationFrame(draw);
    };
    function draw() {
      ctx!.clearRect(0, 0, innerWidth, innerHeight);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.life -= 0.025;
        ctx!.globalAlpha = Math.max(0, p.life);
        ctx!.fillStyle = "#ac201c";
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
        if (p.life <= 0) particles.splice(i, 1);
      }
      for (let i = impacts.length - 1; i >= 0; i--) {
        const p = impacts[i];
        p.life -= .028;
        if (p.life <= 0) { impacts.splice(i, 1); continue; }
        ctx!.save(); ctx!.translate(p.x, p.y - (1 - p.life) * 38); ctx!.rotate(-.14);
        ctx!.globalAlpha = Math.min(1, p.life * 3); ctx!.textAlign = "center";
        ctx!.font = "italic 900 25px sans-serif"; ctx!.lineWidth = 4;
        ctx!.strokeStyle = "#faf8f1"; ctx!.strokeText(p.word, 0, -15);
        ctx!.fillStyle = "#ac201c"; ctx!.fillText(p.word, 0, -15);
        for (let j = 0; j < 8; j++) {
          const a = j / 8 * Math.PI * 2;
          ctx!.beginPath(); ctx!.moveTo(Math.cos(a) * 40, Math.sin(a) * 28);
          ctx!.lineTo(Math.cos(a) * (60 - p.life * 8), Math.sin(a) * (42 - p.life * 8));
          ctx!.strokeStyle = "#242321"; ctx!.lineWidth = 1.5; ctx!.stroke();
        }
        ctx!.restore();
      }
      frame = particles.length || impacts.length ? requestAnimationFrame(draw) : 0;
    }
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointerdown", burst);
    return () => {
      cancelAnimationFrame(frame);
      ctx.clearRect(0, 0, el.width, el.height);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", burst);
    };
  }, [enabled]);
  return <canvas ref={canvas} className="ink-canvas" aria-hidden="true" />;
}
function ProjectDialog({
  project,
  onClose,
}: {
  project: MangaProject | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (project) {
      ref.current?.showModal();
      const old = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = old;
      };
    }
    ref.current?.close();
  }, [project]);
  return (
    <dialog
      data-lenis-prevent
      ref={ref}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-labelledby="dialog-title"
    >
      <div className="dialog-inner">
        {project && (
          <>
            <button
              className="icon-button close"
              onClick={onClose}
              aria-label="Tutup detail proyek"
            >
              <X />
            </button>
            <span className="eyebrow">PROJECT FILE / {project.symbol}</span>
            <h2 id="dialog-title">{project.title}</h2>
            <span className="tag">{project.status}</span>
            <p>{project.description}</p>
            <h3>Di balik proyek</h3>
            <ul>
              {project.details.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <div className="tags">
              {project.stack.map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
            <p className="muted">Fokus: {project.role}</p>
            <div className="button-row">
              {project.github && (
                <a
                  className="button"
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  Repository <Github size={16} />
                </a>
              )}
              {project.demo && (
                <a
                  className="button primary"
                  href={project.demo}
                  target="_blank"
                  rel="noreferrer"
                >
                  Live demo <ArrowUpRight size={16} />
                </a>
              )}
            </div>
            {!project.github && !project.demo && (
              <p className="small muted">
                Tautan publik proyek belum tersedia.
              </p>
            )}
          </>
        )}
      </div>
    </dialog>
  );
}
function Activity() {
  const [username, setUsername] = useState(profile.githubUsername),
    [input, setInput] = useState(profile.githubUsername),
    [year, setYear] = useState("last"),
    [retry, setRetry] = useState(0);
  const [data, setData] = useState<
      { date: string; count: number; level: number }[] | null
    >(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!username) return;
    const abort = new AbortController();
    let live = true;
    async function load() {
      setLoading(true);
      setError("");
      setData(null);
      try {
        const response = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=${year}`,
          {
            signal: AbortSignal.any([abort.signal, AbortSignal.timeout(12000)]),
          },
        );
        if (!response.ok)
          throw Error(
            "Data belum dapat dimuat. Periksa username atau coba lagi.",
          );
        const json = await response.json();
        if (!Array.isArray(json.contributions))
          throw Error("Data kontribusi tidak tersedia.");
        if (live) setData(json.contributions);
      } catch {
        if (live)
          setError(
            "Aktivitas GitHub belum dapat dimuat. Silakan coba lagi sebentar.",
          );
      } finally {
        if (live) setLoading(false);
      }
    }
    void load();
    return () => {
      live = false;
      abort.abort();
    };
  }, [username, year, retry]);
  const total = data?.reduce((a, d) => a + d.count, 0),
    active = data?.filter((d) => d.count > 0).length;
  return (
    <div className="activity-panel panel">
      <div className="activity-top">
        <div className="inline">
          <Github />
          <strong>
            {username ? `@${username}` : "Cerita di balik setiap commit"}
          </strong>
        </div>
        <label className="small">
          Periode{" "}
          <select
            aria-label="Periode kontribusi"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="last">12 bulan terakhir</option>
            {[0, 1, 2].map((offset) => {
              const y = new Date().getFullYear() - offset;
              return (
                <option key={y} value={y}>
                  {y}
                </option>
              );
            })}
          </select>
        </label>
      </div>
      {!profile.githubUsername && (
        <form
          className="github-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(input.trim())) {
              setUsername(input.trim());
              setRetry((n) => n + 1);
            } else setError("Masukkan username GitHub yang valid.");
          }}
        >
          <label htmlFor="github-user">Lihat aktivitas akun GitHub</label>
          <div className="input-row">
            <input
              id="github-user"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Username GitHub"
              maxLength={39}
              required
            />
            <button className="button primary" type="submit">
              Tampilkan <ArrowUpRight size={16} />
            </button>
          </div>
        </form>
      )}
      <div className="activity-body" aria-live="polite">
        {loading ? (
          <p className="loading">Memuat halaman kontribusi…</p>
        ) : error ? (
          <div>
            <p>{error}</p>
            {username && (
              <button className="button" onClick={() => setRetry((n) => n + 1)}>
                Coba lagi <RotateCcw size={16} />
              </button>
            )}
          </div>
        ) : data ? (
          <>
            <div className="heatmap" aria-label="Kalender kontribusi GitHub">
              {Array.from(
                {
                  length:
                    new Date(`${data[0]?.date}T00:00:00Z`).getUTCDay() || 0,
                },
                (_, i) => (
                  <span key={`empty-${i}`} />
                ),
              )}
              {data.map((d) => (
                <span
                  className={`heat-cell level-${Math.max(0, Math.min(4, d.level))}`}
                  key={d.date}
                  tabIndex={0}
                  title={`${d.date}: ${d.count} kontribusi`}
                  aria-label={`${d.date}: ${d.count} kontribusi`}
                />
              ))}
            </div>
            <div className="activity-stats">
              <span>
                <strong>{total}</strong> kontribusi
              </span>
              <span>
                <strong>{active}</strong> hari aktif
              </span>
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noreferrer"
              >
                Lihat profil <ArrowUpRight size={15} />
              </a>
            </div>
            <p className="small muted">
              Data kontribusi GitHub melalui
              github-contributions-api.jogruber.de.
            </p>
          </>
        ) : (
          <div className="empty-activity">
            <Code2 size={32} />
            <p>Setiap proyek dimulai dari satu commit.</p>
            <span className="small muted">
              Akun GitHub Dzaky belum dicantumkan. Kalender akan tampil setelah
              username diisi.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
export default function App() {
  const reduced = useReducedMotion();
  const [intro, setIntro] = useState(() => {
      try {
        return !sessionStorage.getItem("manga-intro") && !window.matchMedia("(prefers-reduced-motion: reduce)").matches && localStorage.getItem("manga-motion") !== "off";
      } catch {
        return true;
      }
    }),
    [menu, setMenu] = useState(false),
    [dark, setDark] = useState(() => {
      try {
        return localStorage.getItem("manga-theme") === "dark";
      } catch {
        return false;
      }
    }),
    [motionOn, setMotionOn] = useState(() => {
      try { return localStorage.getItem("manga-motion") !== "off"; } catch { return true; }
    }),
    [filter, setFilter] = useState("Semua"),
    [project, setProject] = useState<MangaProject | null>(null),
    [inked, setInked] = useState(false),
    [layer, setLayer] = useState(0),
    [tech, setTech] = useState(0),
    [copied, setCopied] = useState(false);
  const effects = motionOn && !reduced;
  useLenisSmoothScroll(effects);
  useEffect(() => {
    if (project || intro) stopLenisScroll();
    else startLenisScroll();
  }, [project, intro, effects]);
  const [reset, setReset] = useState(0),
    [activeSection, setActiveSection] = useState("");
  const hero = useRef<HTMLDivElement>(null),
    copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  usePortfolioAnimations(hero, effects && !intro);
  const { scrollYProgress } = useScroll(),
    progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 }),
    heroY = useTransform(scrollYProgress, [0, 0.2], [0, 70]);
  const finishIntro = useCallback(() => {
    setIntro(false);
    try { sessionStorage.setItem("manga-intro", "1"); } catch { /* storage optional */ }
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#222124" : "#f7f4ed");
    try {
      localStorage.setItem("manga-theme", dark ? "dark" : "light");
    } catch {
      /* storage optional */
    }
  }, [dark]);
  useEffect(() => {
    document.documentElement.dataset.motion = effects ? "on" : "off";
    try { localStorage.setItem("manga-motion", motionOn ? "on" : "off"); } catch { /* storage optional */ }
  }, [effects, motionOn]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-15% 0px -65% 0px" },
    );
    document
      .querySelectorAll("section[id]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );
  const selectedTech = layers[layer].items[tech];
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  }
  return (
    <MotionConfig reducedMotion={effects ? "never" : "always"}>
      <AnimatePresence>
        {intro && <OpeningIntro enabled={effects} onComplete={finishIntro} />}
      </AnimatePresence>
      <div className="site" inert={intro || undefined}>
        <a className="skip-link" href="#main">
          Langsung ke konten
        </a>
        <InkCanvas enabled={effects && !intro} />
        {!project && <Bookmarks active={activeSection} />}
        <motion.div className="reading-progress" style={{ scaleX: progress }} />
        <header className="header">
          <a href="#home" className="brand" aria-label="Dzaky Putra, beranda">
            dzaky<span>✦</span>
            <small>THE DEVELOPER'S JOURNAL</small>
          </a>
          <nav
            aria-label="Navigasi utama"
            className={menu ? "nav open" : "nav"}
          >
            {nav.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={activeSection === id ? "location" : undefined}
                onClick={() => setMenu(false)}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="icon-button"
              onClick={() => setMotionOn((v) => !v)}
              aria-label={motionOn ? "Kurangi animasi" : "Aktifkan animasi"}
              aria-pressed={motionOn}
              title="Animasi"
            >
              <Zap size={17} />
            </button>
            <button
              className="icon-button"
              onClick={() => setDark((v) => !v)}
              aria-label={dark ? "Mode terang" : "Mode malam"}
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <a className="contact-nav" href="#contact">
              Say hello <ArrowUpRight size={16} />
            </a>
            <button
              className="icon-button mobile-menu"
              aria-label="Buka navigasi"
              aria-expanded={menu}
              onClick={() => setMenu((v) => !v)}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </header>
        <main id="main">
          <section id="home" className="hero section-wrap" ref={hero}>
            <div className="hero-copy">
              <div className="eyebrow hero-eyebrow" data-hero-reveal>
                <span className="status-dot" /> PERSONAL PORTFOLIO · VOL. 01
              </div>
              <p className="hello" data-hero-reveal>Developer, pembelajar, dan pengumpul ide.</p>
              <h1 aria-label="Dzaky Putra." data-hero-reveal>
                <span className="name-line">
                  {Array.from("DZAKY").map((c, i) => (
                    <motion.span
                      key={`${reset}-${i}`}
                      drag={effects}
                      dragConstraints={{
                        left: -30,
                        right: 30,
                        top: -35,
                        bottom: 35,
                      }}
                      dragSnapToOrigin
                      whileHover={
                        effects ? { y: -9, rotate: i % 2 ? 5 : -5 } : undefined
                      }
                      className="drag-letter"
                      aria-hidden="true"
                    >
                      {c}
                    </motion.span>
                  ))}
                </span>
                <span className="name-outline">
                  PUTRA<span className="accent">.</span>
                </span>
              </h1>
              <div className="role-line" data-hero-reveal>
                <span /> {profile.role} <span />
              </div>
              <p className="hero-description" data-hero-reveal>
                Dari ide sederhana ke aplikasi yang berguna.
                Saya merangkai antarmuka, alur, dan data—dengan sedikit rasa penasaran di setiap baris kode.
              </p>
              <div className="button-row" data-hero-reveal>
                <a className="button primary" href="#projects">
                  Jelajahi karya <ArrowUpRight size={18} />
                </a>
                <a className="button" href="#about">
                  Kenalan dulu <BookOpen size={17} />
                </a>
                {profile.cvUrl && (
                  <a className="button" href={profile.cvUrl} download>
                    CV <Download size={16} />
                  </a>
                )}
              </div>
              <dl className="hero-facts" data-hero-reveal>
                <div><dt>KARYA PILIHAN</dt><dd>{String(projects.length).padStart(2, "0")} proyek</dd></div>
                <div><dt>FOKUS</dt><dd>Aplikasi web</dd></div>
                <div><dt>SAAT INI</dt><dd>Mahasiswa TI</dd></div>
              </dl>
              <Notebook enabled={effects} />
              <div className="hero-footnote">
                <span>BASED IN INDONESIA</span>
                <button onClick={() => setIntro(true)}><RotateCcw size={12} /> Putar ulang intro</button>
              </div>
            </div>
            <motion.div
              className="hero-art"
              style={effects ? { y: heroY } : undefined}
            >
              <div className="art-offset" />
              <div className="art-frame">
                <HeroScene enabled={effects && !intro} />
              </div>
              <motion.div
                className="speech-bubble"
                drag={effects}
                dragConstraints={hero}
                dragSnapToOrigin
                whileHover={effects ? { rotate: -6, scale: 1.06 } : undefined}
              >
                Let's build
                <br />
                <strong>something cool!</strong>
                <span>✧</span>
              </motion.div>
              <motion.button
                key={reset}
                className="sticker"
                drag={effects}
                dragConstraints={hero}
                dragSnapToOrigin
                whileTap={{ scale: 0.9 }}
                onClick={() => setReset((n) => n + 1)}
                aria-label="Mainkan ulang stiker manga"
              >
                ✦
                <small>
                  CREATE
                  <br />
                  EXPLORE
                  <br />
                  REPEAT
                </small>
              </motion.button>
              <span className="vertical-note">
                MANGA EDITION / CODE & STORIES
              </span>
            </motion.div>
            <a className="scroll-cue" href="#about">
              <ArrowDown size={17} /> SCROLL TO READ THE STORY{" "}
              <span>001 — 007</span>
            </a>
          </section>
          <div className="ticker" aria-hidden="true">
            <div>
              {Array.from({ length: 4 }, (_, i) => (
                <span key={i}>
                  CODE WITH PURPOSE ✦ BUILD WITH CURIOSITY ✦ A STORY IN EVERY
                  PIXEL ✦{" "}
                </span>
              ))}
            </div>
          </div>
          <section id="about" className="section-wrap section-space">
            <Reveal>
              <Heading number="01" title="Di balik layar" note="TENTANG SAYA" />
            </Reveal>
            <div className={`about-grid ${inked ? "is-inked" : ""}`}>
              <Reveal className="about-card panel">
                <span className="eyebrow">THE MAIN CHARACTER</span>
                <div className="portrait-crop">
                  <PhotoPanel enabled={effects} />
                </div>
                <h3>{profile.fullName}</h3>
                <p>{profile.education}</p>
                <div className="tags">
                  <span className="tag">Web development</span>
                  <span className="tag">Creative coding</span>
                </div>
              </Reveal>
              <Reveal className="about-story">
                <span className="handwritten">Sedikit tentang saya ↙</span>
                <h3>
                  Ide sederhana.
                  <br />
                  Kemungkinan <em>tak terbatas.</em>
                </h3>
                <p>{profile.bio}</p>
                <p>
                  Saya terus belajar lewat proyek nyata dan eksperimen kecil.
                  Bagi saya, proses mencoba, memperbaiki, lalu mencoba lagi
                  adalah bagian paling seru dari membuat sesuatu.
                </p>
                <div className="mini-panels">
                  <div>
                    <Code2 />
                    <strong>Build</strong>
                    <span>Dari ide ke aplikasi</span>
                  </div>
                  <div>
                    <BookOpen />
                    <strong>Learn</strong>
                    <span>Satu langkah setiap hari</span>
                  </div>
                  <div>
                    <Sparkles />
                    <strong>Explore</strong>
                    <span>Selalu ada hal baru</span>
                  </div>
                </div>
                <button
                  className="button ink-button"
                  onClick={() => setInked((v) => !v)}
                >
                  {inked ? <RotateCcw size={16} /> : <Zap size={16} />}{" "}
                  {inked ? "Gambar ulang panel" : "Tumpahkan tinta!"}
                </button>
                <span className="small muted interactive-note">
                  Psst… panel ini bisa diajak bermain.
                </span>
              </Reveal>
              <AnimatePresence>
                {inked && (
                  <motion.div
                    className="ink-spill"
                    aria-hidden="true"
                    initial={{ clipPath: "circle(0% at 85% 80%)" }}
                    animate={{ clipPath: "circle(150% at 85% 80%)" }}
                    exit={{ clipPath: "circle(0% at 85% 80%)" }}
                    transition={{ duration: effects ? 0.7 : 0 }}
                  >
                    <strong>SPLASH!</strong>
                    <span>Every mistake is a new beginning.</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
          <section id="projects" className="projects-section">
            <div className="section-wrap section-space">
              <Reveal>
                <Heading
                  number="02"
                  title="Cerita dalam karya"
                  note="SELECTED PROJECTS"
                />
                <div className="section-intro">
                  <p>
                    Beberapa ide yang saya wujudkan menjadi proyek.
                    <br />
                    Buka panelnya untuk melihat cerita di balik prosesnya.
                  </p>
                  <div className="filter" aria-label="Filter proyek">
                    {["Semua", "Full-stack", "Frontend"].map((f) => (
                      <button
                        key={f}
                        aria-pressed={filter === f}
                        className={filter === f ? "selected" : ""}
                        onClick={() => setFilter(f)}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </Reveal>
              <motion.div layout className="project-grid">
                <AnimatePresence mode="popLayout">
                  {projects
                    .filter((p) => filter === "Semua" || p.category === filter)
                    .map((p) => (
                      <motion.button
                        layout
                        key={p.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        whileHover={effects ? { y: -8, rotate: -1 } : undefined}
                        className={`project-card ${p.color}`}
                        onClick={() => setProject(p)}
                      >
                        <div className="project-visual">
                          <span className="project-topline">
                            {p.label}
                            <span>/{p.year}</span>
                          </span>
                          <span className="project-symbol">{p.symbol}</span>
                          <span className="project-art-title">
                            {p.artTitle.split("\n").map((line, i) => (
                              <span key={line}>
                                {i > 0 && <br />}
                                {line}
                              </span>
                            ))}
                          </span>
                          <span className="project-open">
                            <ArrowUpRight />
                          </span>
                          <span className="visual-label">
                            {p.category === "Frontend"
                              ? "INTERFACE EXPLORATION"
                              : "WEB APPLICATION"}
                          </span>
                        </div>
                        <div className="project-info">
                          <span className="small muted">{p.status}</span>
                          <h3>{p.title}</h3>
                          <p>{p.description}</p>
                          <div className="tags">
                            {p.stack.map((t) => (
                              <span className="tag" key={t}>
                                {t}
                              </span>
                            ))}
                          </div>
                          <span className="read-story">
                            Baca cerita proyek <ArrowUpRight size={17} />
                          </span>
                        </div>
                      </motion.button>
                    ))}
                </AnimatePresence>
              </motion.div>
              <a
                className="all-repos text-button"
                href="https://github.com/Aelitaaaa?tab=repositories"
                target="_blank"
                rel="noreferrer"
              >
                Lihat semua repository di GitHub <ArrowUpRight size={16} />
              </a>
              <Reveal className="workflow-note">
                <div className="workflow-heading"><span className="eyebrow">FROM IDEA TO SOMETHING USEFUL</span><h3>Cara saya membangun.</h3></div>
                <div className="workflow-grid">
                  <div><span>01 / PAHAMI</span><h4>Mulai dari kebutuhan.</h4><p>Kenali siapa yang memakai aplikasi dan masalah yang ingin diselesaikan.</p></div>
                  <div><span>02 / BANGUN</span><h4>Susun alurnya.</h4><p>Hubungkan antarmuka, logika, dan data agar setiap bagian bekerja bersama.</p></div>
                  <div><span>03 / PERBAIKI</span><h4>Coba, lalu rapikan.</h4><p>Periksa tampilan di berbagai layar dan perbaiki pengalaman pemakaiannya.</p></div>
                </div>
              </Reveal>
            </div>
          </section>
          <ChapterBreak enabled={effects} />
          <section id="stack" className="section-wrap section-space">
            <Reveal>
              <Heading
                number="03"
                title="Rak di balik karya"
                note="TECH STACK"
              />
              <p className="section-description">
                Sorot atau ketuk buku untuk mengeluarkan kartu-kartu teknologi.
                Pilih satu kartu untuk membaca catatan dan proyek terkait.
              </p>
              <div className="float-bookshelf" role="group" aria-label="Buku teknologi dengan kartu melayang">
                {layers.map((l, i) => (
                  <BookFloat key={l.name}
                    items={l.items.map(item => item.name)} label={l.name} sublabel={`${l.items.length} catatan teknologi`}
                    trigger="hover" closeOnSelect physics drift={0.5} enabled={effects} selected={layer === i}
                    onSelect={(_, index) => { setLayer(i); setTech(index); }}
                    bookColor="#252422" frontColor={i === 1 ? "#92251f" : i === 3 ? "#3d4943" : "#3f3f3c"}
                    paperColor="#f5f2e9" itemColor="#faf8f1" itemTextColor="#18181b" labelColor="#f5f5f5"
                    width={200} height={148} radius={8} spread={180} lift={26} tilt={8}
                    flapAngle={34} restAngle={16} openDuration={520} stagger={45} bounce={0.3}
                  />
                ))}
              </div>
              <div className="shelf-caption" aria-hidden="true"><span>THE DEVELOPER'S SHELF</span><span>COLLECTION 01—04</span></div>
              <div id="technology-pages" className="tech-workbench panel open-notebook" aria-label={`Isi buku ${layers[layer].name}`}>
                <div className="tech-list" aria-label="Daftar teknologi">
                  {layers[layer].items.map((t, i) => (
                    <button
                      key={t.name}
                      className={tech === i ? "selected" : ""}
                      aria-pressed={tech === i}
                      onClick={() => setTech(i)}
                    >
                      <Code2 size={19} />
                      {t.name}
                      <ArrowUpRight size={15} />
                    </button>
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedTech.name}
                    className="tech-inspector"
                    initial={{ opacity: 0, x: effects ? 15 : 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <span className="eyebrow">
                      VOLUME {layers[layer].icon} / {layers[layer].name}
                    </span>
                    <h3>
                      {selectedTech.name}
                      <span className="accent">_</span>
                    </h3>
                    <p>{selectedTech.detail}</p>
                    {selectedTech.project && (
                      <button
                        className="text-button"
                        onClick={() =>
                          setProject(
                            projects.find(
                              (p) => p.id === selectedTech.project,
                            )!,
                          )
                        }
                      >
                        Lihat proyek terkait <ArrowUpRight size={16} />
                      </button>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </Reveal>
          </section>
          <section id="activity" className="activity-section">
            <div className="section-wrap section-space">
              <Reveal>
                <Heading
                  number="04"
                  title="Sedikit, setiap hari"
                  note="GITHUB ACTIVITY"
                />
                <p className="section-description">
                  Konsistensi kecil, perjalanan panjang. Jejak belajar dan
                  membangun lewat kode.
                </p>
                <Activity />
              </Reveal>
            </div>
          </section>
          <ChapterBreak enabled={effects} />
          <section id="journey" className="section-wrap section-space">
            <Reveal>
              <Heading
                number="05"
                title="Chapter demi chapter"
                note="PERJALANAN"
              />
            </Reveal>
            <div className="timeline">
              {journey.map((j, i) => (
                <Reveal key={j.year} className="timeline-row">
                  <div className="timeline-year">
                    {j.year}
                    <span>0{i + 1}</span>
                  </div>
                  <div className="timeline-copy">
                    <span className="eyebrow">{j.tag}</span>
                    <h3>{j.title}</h3>
                    <p>{j.text}</p>
                  </div>
                  <span className="timeline-star" aria-hidden="true">
                    ✦
                  </span>
                </Reveal>
              ))}
            </div>
            <p className="to-be-continued">
              To be continued <span>→</span>
            </p>
          </section>
          <section id="contact" className="contact-section">
            <div className="section-wrap">
              <div className="contact-top">
                <span className="eyebrow">CHAPTER 06 / LET'S CONNECT</span>
                <span>THE NEXT CHAPTER IS OURS.</span>
              </div>
              <Reveal>
                <h2>
                  Punya ide?
                  <br />
                  Mari <em>bercerita.</em>
                  <span className="contact-star">✦</span>
                </h2>
                <p>
                  Untuk obrolan tentang web, ide proyek,
                  <br />
                  atau sekadar bertukar cerita.
                </p>
                <div className="button-row">
                  {profile.email ? (
                    <>
                      <a
                        className="button pink-button"
                        href={`mailto:${profile.email}`}
                      >
                        Kirim pesan <Mail size={18} />
                      </a>
                      <button
                        className="button dark-outline"
                        onClick={copyEmail}
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}{" "}
                        {copied ? "Email tersalin" : "Salin email"}
                      </button>
                    </>
                  ) : (
                    <span className="contact-pending">
                      Alamat kontak akan segera ditambahkan.
                    </span>
                  )}
                  {profile.githubUsername && (
                    <a
                      className="button dark-outline"
                      href={`https://github.com/${profile.githubUsername}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub <Github size={17} />
                    </a>
                  )}
                  {profile.linkedin && (
                    <a
                      className="button dark-outline"
                      href={profile.linkedin}
                      target="_blank"
                      rel="noreferrer"
                    >
                      LinkedIn <ArrowUpRight size={17} />
                    </a>
                  )}
                </div>
              </Reveal>
              <footer>
                <a className="brand" href="#home">
                  dzaky<span>✦</span>
                </a>
                <span>
                  © {new Date().getFullYear()} Dzaky Putra. Made of code &
                  curiosity.
                </span>
                <a href="#home">Kembali ke atas ↑</a>
              </footer>
            </div>
          </section>
        </main>
        <ProjectDialog project={project} onClose={() => setProject(null)} />
      </div>
    </MotionConfig>
  );
}
