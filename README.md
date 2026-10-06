# Dzaky Portfolio — Code & Stories

Personal portfolio milik **Muhamad Dzaky Putra Fardian** yang menampilkan proyek, teknologi, aktivitas pengembangan, serta perjalanan belajar dalam satu website interaktif.

Website ini dibangun dengan fokus pada pengalaman pengguna, animasi yang halus, tampilan editorial, responsivitas, serta interaksi visual menggunakan React, Anime.js, GSAP, AOS, Motion, dan Canvas.

---

## Tentang Project

**Dzaky Portfolio** merupakan website portofolio pribadi yang dirancang untuk menampilkan lebih dari sekadar daftar project.

Setiap bagian menyajikan perjalanan sebagai developer, mulai dari pengenalan singkat, project yang pernah dikerjakan, teknologi yang digunakan, aktivitas GitHub, hingga perkembangan belajar.

Desain menggunakan pendekatan minimal, editorial, dan interaktif dengan kombinasi warna netral, hitam, serta aksen merah.

---

## Tech Stack

| Technology | Kegunaan |
| --- | --- |
| React | Membangun antarmuka berbasis komponen |
| TypeScript | Type safety dan maintainability |
| Vite | Development server dan build tool |
| Tailwind CSS | Utility styling |
| Motion | Interaksi, drag, spring, dialog, dan pergantian panel |
| GSAP | Timeline pembukaan chapter dan kemunculan hero |
| Anime.js | Perpindahan konten pada kartu catatan |
| AOS | Kemunculan bagian halaman saat scroll |
| Lenis | Smooth scrolling |
| HTML5 Canvas | Efek visual interaktif |
| Lucide Icons | Ikon antarmuka |

---

## Fitur Utama

### Chapter Opening

Intro tipografi **Code & Stories** diputar sekali per sesi dan dapat dilewati dengan tombol **Langsung masuk** atau tombol **Escape**. Tombol **Putar ulang intro** di hero membuka kembali intro. Fokus keyboard dan scroll dibatasi selama intro terbuka. Intro otomatis dilewati jika preferensi reduced motion aktif.

### Plain Paper Notes

Kartu **Ide / Kode / Cerita**, halaman detail teknologi, dan kartu teknologi menggunakan kertas polos tanpa pola garis di belakang teks. Tab catatan mendukung keyboard Arrow Left, Arrow Right, Home, dan End.

### Mini Playground

Panel hero menyediakan dua pilihan: **Main** untuk mini game **Susun UI** dan **Tinta** untuk interaksi Canvas. Dalam permainan, pengunjung memasangkan empat potongan (logo, menu, judul, dan tombol) dengan kotaknya untuk membangun halaman kecil. Potongan diacak, langkah dihitung, dan penempatan yang salah memberikan petunjuk. Setelah selesai, tombol **Lagi** membuka desain berikutnya: portofolio, studio kreatif, atau kedai kopi.

Potongan bisa di-drag dengan mouse atau sentuhan, atau dipilih lalu dipasangkan dengan tap dan keyboard. Tombol **Ulangi** mereset puzzle, dan **Escape** melepas pilihan. Permainan tetap berfungsi dalam mode tenang; animasi feedback dan stempel penyelesaian mengikuti preferensi gerak. Motion menangani drag dan pergantian panel, tanpa membutuhkan WebGL.

Scrollbar dibuat tipis dengan thumb merah berbentuk penanda, track kertas polos, serta warna yang mengikuti tema terang dan gelap. Firefox memakai scrollbar tipis native; browser dengan dukungan WebKit menggunakan styling khusus.

### Focus & Workflow

Hero menampilkan jumlah proyek pilihan berdasarkan data, fokus pengembangan, serta status mahasiswa. Bagian proyek dilengkapi ringkasan proses: memahami kebutuhan, membangun alur, dan memperbaiki pengalaman penggunaan. Metadata canonical, Open Graph, serta Twitter tersedia untuk tautan halaman.

### Interactive Hero

Bagian utama memiliki beberapa elemen interaktif seperti huruf, sticker, dan speech bubble yang dapat digerakkan.

### BookFloat

Bagian teknologi menggunakan komponen **BookFloat** yang dapat terbuka ketika di-hover atau ditekan.

Kartu teknologi ditampilkan menggunakan kombinasi:

- Spring animation
- Tilt
- Drift
- Dynamic positioning

Memilih salah satu kartu akan memperbarui informasi teknologi yang sedang ditampilkan.

### Interactive Canvas

Canvas 2D digunakan untuk menghasilkan berbagai interaksi visual langsung melalui kode, seperti:

- Ripple
- Particle effect
- Interactive drawing
- Paper boat interaction
- Click impact

### Project Showcase

Project ditampilkan melalui kartu interaktif yang berisi:

- Nama project
- Deskripsi
- Tech stack
- Repository
- Status project
- Detail pengembangan

### GitHub Activity

Website dapat menampilkan aktivitas kontribusi GitHub berdasarkan akun yang dikonfigurasi.

Data kontribusi diperoleh melalui:

```text
github-contributions-api.jogruber.de
```

Jika data tidak tersedia, website menampilkan status error serta opsi untuk mencoba kembali.

### Developer Journey

Bagian perjalanan menampilkan perkembangan belajar dan pengembangan project dalam bentuk timeline.

### Theme & Accessibility

Website menyediakan:

- Light mode
- Dark mode
- Reduced motion dan preferensi animasi yang disimpan
- Responsive layout
- Keyboard navigation
- Focus state
- Native touch scrolling

---

## Featured Projects

| Project | Repository |
| --- | --- |
| OfficeFlow | [office-management](https://github.com/Aelitaaaa/office-management) |
| Penjualan Obat | [penjualan_obat_fix](https://github.com/Aelitaaaa/penjualan_obat_fix) |
| Perpus Masamba | [perpusMasamba](https://github.com/Aelitaaaa/perpusMasamba) |
| Portofolio Dzaky | [PortofolioDzaky](https://github.com/Aelitaaaa/PortofolioDzaky) |

Project lainnya dapat ditemukan melalui profil GitHub:

[github.com/Aelitaaaa](https://github.com/Aelitaaaa)

---

## Menjalankan Project

Clone repository:

```bash
git clone https://github.com/Aelitaaaa/dzaky-portfolio.git
```

Masuk ke directory project:

```bash
cd dzaky-portfolio
```

Install dependency:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Buka alamat yang muncul pada terminal.

Secara default Vite biasanya menggunakan:

```text
http://localhost:5173
```

---

## Production Build

Untuk membuat production build:

```bash
npm run build
```

Untuk melihat hasil build secara lokal:

```bash
npm run preview
```

Hasil build akan disimpan pada:

```text
dist/
```

---

## Struktur Project

```text
dzaky-portfolio/
│
├── public/
│   ├── dzaky-portrait.jpeg
│   └── favicon.svg
│
├── src/
│   ├── components/
│   │   ├── BookFloat.tsx
│   │   ├── InkStage.tsx
│   │   ├── MangaDetails.tsx
│   │   └── PhotoPanel.tsx
│   │
│   ├── data/
│   │   └── mangaData.ts
│   │
│   ├── hooks/
│   │   └── useLenisSmoothScroll.ts
│   │
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── index.html
├── package.json
├── vite.config.ts
├── vercel.json
└── README.md
```

---

## Konfigurasi Konten

Sebagian besar informasi website dapat diubah melalui:

```text
src/data/mangaData.ts
```

File tersebut menyimpan data seperti:

- Profil
- Project
- Teknologi
- Perjalanan
- GitHub
- Kontak
- Social link

Beberapa komponen utama berada pada:

| File | Fungsi |
| --- | --- |
| `src/components/BookFloat.tsx` | Interaksi buku teknologi |
| `src/components/InkStage.tsx` | Efek visual berbasis Canvas |
| `src/components/MangaDetails.tsx` | Notebook dan navigasi chapter |
| `src/components/PhotoPanel.tsx` | Foto profil interaktif |
| `src/hooks/useLenisSmoothScroll.ts` | Smooth scrolling |
| `src/index.css` | Layout, tema, responsive design, dan visual |

---

## Deployment

Project sudah memiliki konfigurasi:

```text
vercel.json
```

Untuk deploy menggunakan Vercel:

1. Import repository `Aelitaaaa/dzaky-portfolio`.
2. Gunakan branch `main`.
3. Pilih framework preset `Vite`.
4. Gunakan build command:

```bash
npm run build
```

5. Gunakan output directory:

```text
dist
```

Project tidak membutuhkan database atau environment variable untuk menjalankan fitur utama.

---

## Accessibility

Website memperhatikan beberapa aspek aksesibilitas seperti:

- Keyboard navigation
- Focus state
- Reduced motion
- Responsive interface
- Semantic HTML
- Accessible button label
- Dark mode
- Native touch scrolling

Website juga menghormati preferensi sistem:

```css
prefers-reduced-motion
```

---

## Development

Project ini terus dikembangkan sebagai tempat untuk mempelajari dan mencoba berbagai hal seperti:

- Frontend interaction
- Animation
- UI engineering
- Canvas experiment
- Responsive layout
- Component architecture
- Accessibility
- Performance optimization

Tujuan utama project ini bukan hanya sebagai halaman profil, tetapi juga sebagai ruang untuk bereksperimen dan mendokumentasikan perkembangan sebagai developer.

## Mengembangkan Animasi

Setiap engine memiliki area sendiri agar transform tidak saling bertabrakan:

| File | Tanggung jawab |
| --- | --- |
| `src/components/OpeningIntro.tsx` | Timeline intro GSAP dan aksesibilitas intro |
| `src/hooks/usePortfolioAnimations.ts` | AOS untuk section dan GSAP untuk hero |
| `src/components/MangaDetails.tsx` | Anime.js untuk catatan, Motion untuk magnet dan bookmark |
| `src/components/HeroScene.tsx` | Pilihan Main / Tinta dan transisi Motion |
| `src/components/BuildStage.tsx` | Mini game Susun UI: drag, tap, keyboard, dan tiga desain |

Jalankan `npm run lint` dan `npm run build` sebelum menerbitkan perubahan. Periksa intro, tab catatan, pergantian panel, filter proyek, dialog, tema, serta reduced motion pada desktop dan mobile.

---


Beberapa konsep interaksi terinspirasi dari:

[React Bits](https://github.com/DavidHDev/react-bits)

Komponen dan implementasi interaktif pada portfolio ini dikembangkan serta disesuaikan khusus untuk project Dzaky Portfolio.
