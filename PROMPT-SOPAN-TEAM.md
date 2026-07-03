# PROMPT PROYEK: WEBSITE "SOPAN TEAM" (Treact Template)

Saya punya template Treact (React + TailwindCSS + twin.macro), sudah saya upload sebagai `treact-ui.zip`. Baca instruksi ini SAMPAI SELESAI sebelum membuka atau mengubah file apa pun.

## PERINGATAN KERAS — BACA INI DULU
Tugas kamu adalah MEMODIFIKASI project yang sudah ada, BUKAN membangun project baru. Kalau kamu mendapati dirimu berpikir untuk membuat `App.js` dari nol, menulis ulang struktur folder, atau membuat sistem styling/komponen sendiri di luar yang sudah ada di zip — STOP, itu tandanya kamu salah jalan. Larangan ini berlaku bahkan jika menurutmu hasilnya akan "lebih rapi" atau "lebih mudah" — efisiensi bukan alasan untuk mengabaikan instruksi. Project akhir HARUS tetap bisa ditelusuri baris demi baris ke file-file asli di `treact-ui.zip` (import path komponen tetap merujuk ke file yang sama, cuma isi teks/data yang berubah). Kalau di titik mana pun kamu ragu apakah suatu tindakan termasuk "modifikasi" atau "membangun ulang", berhenti dan tanya saya dulu — jangan ambil keputusan sendiri.

## ATURAN MUTLAK — TIDAK BOLEH DILANGGAR
1. **Prioritaskan komponen yang sudah ada.** Untuk section yang punya padanan jelas di `src/components/`, `src/demos/`, `src/pages/`, WAJIB pakai komponen tsb apa adanya (cuma isi ulang teks/data), jangan bikin ulang dari nol.
2. **Komponen baru HANYA boleh dibuat kalau memang tidak ada padanannya sama sekali di template** (contoh: halaman View Profile Member di bagian E). Kalau bikin komponen baru:
   - WAJIB menyusun dari elemen/token desain yang sudah ada di template — pakai ulang `src/components/misc/Layouts.js`, `Headings.js`, `Typography.js`, `Buttons.js`, `Links.js` sebagai fondasi (bukan menulis CSS/style baru dari nol)
   - WAJIB visual identik dengan tema template: warna primary `#6415FF`, font, spacing, border-radius, gaya card/button/shadow yang PERSIS sama dengan section lain
   - DILARANG memasukkan gaya visual asing (font baru, warna baru, ikon set baru, layout pattern yang tidak ada preseden di template)
   - Sebelum membuat, sebutkan dulu ke saya: section apa, kenapa tidak ada padanan, dan komponen template mana yang jadi basis penyusunannya
3. **Dilarang mengubah:** warna primary `#6415FF`, palet warna dasar (putih/terang), ilustrasi SVG bawaan di `src/images/`, struktur layout/spacing/border-style komponen yang dipakai. Dilarang membuat tema gelap.
4. **Assets wajib dipakai maksimal.** Gunakan ilustrasi, ikon, dan gambar yang sudah ada di `src/images/` semaksimal mungkin (jangan generate/download gambar baru) — pilih ilustrasi yang tema visualnya paling masuk akal untuk tiap section.
5. Kalau ragu suatu section mau diisi konten apa, TANYA saya dulu — jangan mengarang bebas di luar brief di bawah.
6. React Router BELUM terpasang di `App.js` bawaan template ini. Tahap pertama kerja WAJIB memasang `react-router-dom` dan struktur routing sebelum mengisi konten.

---

## BRAND PAYUNG: "SOPAN TEAM"
Satu website menaungi 3 divisi independen (visual identik antar-divisi mengikuti template masing-masing, konten beda), plus 1 halaman Hub utama untuk berpindah antar divisi.

| Divisi | Demo dasar (WAJIB, literal, tidak boleh diganti) | Konsep konten |
|---|---|---|
| **Sopan Remix** | `src/demos/HostingCloudLandingPage.js` | Musik: produksi, remix, mixing, mastering, sound engineering |
| **Sopan Creator** | `src/demos/SaaSProductLandingPage.js` | Editing video gaya "jedag-jedug" pakai aplikasi Alight Motion |
| **Sopan Leadies** | `src/demos/ServiceLandingPage.js` | Sama seperti Sopan Creator (editing video jedag-jedug, Alight Motion), tapi member khusus perempuan |

Tiap divisi TETAP menggunakan susunan section asli demo dasarnya sebagai kerangka (Hero → Features → MainFeature → dst sesuai urutan aslinya di file demo tsb); yang berubah adalah TEKS dan DATA-nya, bukan struktur/urutan komponennya, kecuali disebutkan lain di bagian B di bawah.

Link TikTok per divisi (pasang sebagai href biasa `target="_blank"` di footer masing-masing divisi, tidak perlu embed/integrasi API):
- Remix: https://www.tiktok.com/@team.sopan.remix
- Creator: https://www.tiktok.com/@teamsopanofficial
- Leadies: https://www.tiktok.com/@teamsopanleadiss

---

## STRUKTUR ROUTING — WAJIB PERSIS SEPERTI INI
Gunakan `react-router-dom` (pasang dengan `npm install react-router-dom`, gunakan versi yang kompatibel dengan React yang dipakai template ini — cek `package.json` dulu).

```
/                     → Hub utama (pengenalan Sopan Team + 3 kartu pilihan divisi)
/remix                → Landing page Sopan Remix (basis: HostingCloudLandingPage.js)
/remix/login          → Sign In Sopan Remix
/remix/join           → Join/Signup Sopan Remix
/remix/members        → Member roster Sopan Remix
/remix/members/:id    → View Profile satu member Sopan Remix
/creator              → Landing page Sopan Creator (basis: SaaSProductLandingPage.js)
/creator/login        → Sign In Sopan Creator
/creator/join         → Join/Signup Sopan Creator
/creator/members      → Member roster Sopan Creator
/creator/members/:id  → View Profile satu member Sopan Creator
/leadies              → Landing page Sopan Leadies (basis: ServiceLandingPage.js)
/leadies/login        → Sign In Sopan Leadies
/leadies/join         → Join/Signup Sopan Leadies
/leadies/members      → Member roster Sopan Leadies
/leadies/members/:id  → View Profile satu member Sopan Leadies
```

---

## CARA MENGEDIT KONTEN — WAJIB DIPAHAMI SEBELUM MULAI
Setiap section (`<Hero />`, `<Features />`, dst) di file demo bisa berisi teks dengan salah satu dari 2 cara, dan caranya menentukan DI FILE MANA kamu harus edit:

1. **Kalau section dipanggil dengan props** (contoh: `<MainFeature subheading="Reliable" heading="..." />`) → EDIT teksnya LANGSUNG DI FILE DEMO (`src/demos/...`), lewat isi props tsb. Jangan sentuh file komponennya di `src/components/`.
2. **Kalau section dipanggil TANPA props** (contoh: `<Hero />` polos tanpa isi apa pun) → section itu memakai teks default yang tertulis di dalam file komponennya sendiri (`src/components/hero/NamaFile.js`). Untuk kasus ini, EDIT teksnya DI FILE KOMPONEN tsb, ATAU (lebih disarankan) tambahkan props baru di file demo supaya nilai default di file komponen tetap utuh — pakai cara mana pun boleh, tapi WAJIB konsisten, dan sebelum mengedit file di `src/components/`, konfirmasi dulu ke saya karena file itu dipakai bersama oleh divisi lain juga (mengedit default-nya bisa mempengaruhi divisi lain yang mungkin memakai komponen yang sama).

Untuk tiap section yang kamu kerjakan, sebutkan di ringkasanmu: section ini diedit lewat props di file demo, atau lewat default di file komponen — supaya saya bisa cek konsistensinya.

---

## A) HALAMAN HUB ("/")
- Struktur sederhana: satu Hero + satu grid 3 kartu.
- Hero: pilih SATU komponen hero yang paling netral dari `src/components/hero/` (bukan salah satu dari 3 hero yang sudah dipakai divisi, supaya hub punya identitas visual sendiri tapi tetap 1 keluarga desain) — **sebutkan dulu ke saya komponen mana yang dipilih sebelum dipakai**, isi: nama "Sopan Team", tagline singkat, deskripsi 1-2 kalimat tentang 3 divisi.
- Grid 3 kartu: pakai komponen dari `src/components/cards/` yang sudah ada (misal `TabCardGrid.js` atau `PortfolioTwoCardsWithImage.js` — pilih yang paling pas untuk 3 item, jangan bikin baru). Tiap kartu: nama divisi, 1 kalimat deskripsi konsep divisi, tombol "Lihat Divisi" yang link ke `/remix`, `/creator`, `/leadies`.
- Footer: pakai footer sederhana dari `src/components/footers/` (misal `MiniCenteredFooter.js`), isi nama "Sopan Team" + link ke 3 divisi.

---

## B) LANDING PAGE PER DIVISI
Untuk KETIGA divisi, section di dalam demo dasarnya WAJIB dipetakan seperti ini (section yang tidak disebut tetap dibiarkan strukturnya seperti asli, teks generik diganti seperlunya):

- **Hero** → nama divisi + tagline pendek + 1-2 kalimat deskripsi + 2 tombol: "Join" (ke `/divisi/join`) dan "Sign In" (ke `/divisi/login`)
- **Features** → isi sesuai konsep tabel di atas (contoh Remix: produksi/mixing/mastering; Creator & Leadies: editing jedag-jedug pakai Alight Motion)
- **MainFeature** (dan MainFeature2/FeatureWithSteps kalau ada di demo tsb, khusus Creator & Leadies) → penjelasan proses/tools/alur kerja divisi
- **Section stats** (FeatureStats, hanya ada di Leadies/ServiceLandingPage) → jumlah member aktif, jumlah karya dibuat, tahun berdiri. Tandai dengan komentar `// PLACEHOLDER`
- **Section pricing** (ThreePlansWithHalfPrimaryBackground / ThreePlans / TwoPlansWithDurationSwitcher — sesuai apa yang ada di demo masing-masing) → JANGAN dipakai sebagai harga jual produk. Ganti label "$", "Monthly", "Buy Now" menjadi 3 tingkatan member (contoh: Trainee, Member, Senior) dengan syarat singkat per tingkat, tombol jadi "Daftar" yang link ke `/divisi/join`
- **Testimonial** → ganti jadi "Member Spotlight", tampilkan 1-2 member unggulan (nama, karya, kutipan singkat) — semua PLACEHOLDER, ditandai komentar
- **FAQ** → isi 4-6 poin peraturan/syarat bergabung divisi tsb (realistis, tidak berlebihan): syarat karya, cara submit, estimasi waktu review, dll
- **Blog** (HANYA ada di ServiceLandingPage/Leadies) → ganti jadi "Update & Aktivitas Divisi", isi 3 post placeholder
- **CTA terakhir sebelum footer** → arahkan ke `/divisi/join`
- **Footer** → nama divisi, link TikTok divisi tsb (sesuai tabel di atas), 1 link balik ke `/` (Hub Sopan Team)

---

## C) SIGN IN & JOIN — PER DIVISI
Duplikat `src/pages/Login.js` menjadi 3 file (satu per divisi: `LoginRemix.js`, `LoginCreator.js`, `LoginLeadies.js`), dan `src/pages/Signup.js` menjadi 3 file serupa. Styling, layout, ilustrasi bawaan **TIDAK diubah sama sekali**. Yang diubah HANYA:
- Teks heading (contoh: "Sign In to Sopan Remix", "Join Sopan Creator")
- Link "sudah punya akun? / belum punya akun?" diarahkan ke pasangan route yang benar sesuai tabel routing

Khusus form Join, tambahkan 1 field baru di bawah field yang sudah ada (styling input ikut gaya input lain di form yang sama, jangan bikin style baru): "Akun TikTok / Instagram" — placeholder teks "@username". Field ini yang datanya nanti ditampilkan di halaman View Profile Member (lihat bagian E).

Catatan: form ini SEBATAS TAMPILAN, tidak ada autentikasi/backend nyata dan input tidak benar-benar tersimpan (lihat bagian "Di Luar Cakupan"). Untuk kebutuhan tampilan sekarang, data View Profile Member tetap pakai placeholder yang ditulis manual di kode, bukan hasil input form sungguhan.

---

## D) MEMBER ROSTER — PER DIVISI
WAJIB pakai `src/components/cards/ProfileThreeColGrid.js` sebagai basis (sudah mendukung foto, nama, posisi/role, link sosial media). Untuk tiap divisi:
- Tampilkan minimal 6 kartu member placeholder (nama, role sesuai konsep divisi — misal "Producer"/"Mixing Engineer" untuk Remix, "Video Editor" untuk Creator/Leadies), link sosial pakai ikon yang sudah tersedia di komponen ini (twitter/linkedin/github ikon dipakai sebagai ikon link generik, karena template tidak punya ikon TikTok bawaan)
- Di atas grid roster, tambahkan 1 blok teks singkat: nama pendiri (placeholder), nama admin/pengelola (placeholder), tahun divisi berdiri (placeholder). Tandai semua dengan komentar `// PLACEHOLDER - ganti dengan data asli`

---

## E) VIEW PROFILE MEMBER — PER DIVISI
Ini section yang TIDAK ADA padanannya di template, jadi mengikuti ATURAN #2 di atas (komponen baru, tapi visual identik dengan tema).

- Setiap kartu member di grid `ProfileThreeColGrid.js` (bagian D) dibuat clickable, klik nama/foto/kartu → navigasi ke `/divisi/members/:id`
- Halaman ini disusun dari elemen dasar template (`Container`, `ContentWithPaddingXl` dari `Layouts.js`, `SectionHeading`/`Subheading` dari `Headings.js`, style card yang sama seperti kartu roster) — bukan style baru. Boleh mencontoh tata letak dari `ThreeColContactDetails.js` sebagai referensi struktur (foto besar + info di sampingnya), tapi datanya diganti total.
- Isi halaman per member (semua PLACEHOLDER, ditandai komentar `// PLACEHOLDER`):
  - Foto (pakai foto placeholder yang sama seperti di roster)
  - Nama & role/posisi
  - Bio singkat 1-2 kalimat (placeholder, sesuai konsep divisi — misal untuk Remix: "Fokus di mixing & mastering sejak 2023")
  - Tanggal/tahun bergabung
  - Akun sosmed (TikTok/Instagram) — field ini yang merepresentasikan data field baru di form Join (bagian C), meski secara teknis tetap hardcoded placeholder, bukan hasil input real
  - Opsional: 1-2 contoh "karya" placeholder (judul konten/project, tanpa file asli — cukup teks/label)
- Tombol "Kembali ke Member Roster" mengarah balik ke `/divisi/members`
- Data 6 member placeholder di roster (bagian D) dan data di halaman profile ini HARUS konsisten (nama, role, foto yang sama), supaya klik dari roster ke profile terasa nyambung — bukan data acak yang beda.

---

## BATASAN KONTEN
- Ini komunitas/tim, BUKAN toko. Jangan arahkan ke jualan produk seperti sample pack, preset, template berbayar, jasa berbayar, dll.
- Jangan generate konten di luar konsep 3 divisi di atas.
- Semua data placeholder (nama orang, angka statistik, judul karya) harus terlihat wajar/realistis tapi ditandai jelas di kode sebagai placeholder.

---

## DI LUAR CAKUPAN — JANGAN DIKERJAKAN, CUKUP DICATAT DI RINGKASAN AKHIR
- Backend/database untuk autentikasi (form Sign In/Join baru sebatas tampilan)
- Upload & penyimpanan file (foto profil, demo audio/video)
- Sistem review admin
- Integrasi otomatis API TikTok (Trending Content, dll)

---

## URUTAN KERJA — WAJIB DIIKUTI PERSIS
Di SETIAP langkah bertanda ⛔, kamu WAJIB berhenti total dan menunggu balasan saya sebelum lanjut — jangan asumsikan persetujuan, jangan lanjut jalan sambil menunggu.

1. Ekstrak `treact-ui.zip`, cek `package.json` (versi React, dependency yang sudah ada).
2. Pasang `react-router-dom`, siapkan struktur routing sesuai tabel di atas (boleh pakai file router terpisah, misal `src/App.js` + `src/routes.js`).
3. Buka dan pelajari isi `src/demos/HostingCloudLandingPage.js`, `src/demos/SaaSProductLandingPage.js`, `src/demos/ServiceLandingPage.js`, `src/pages/Login.js`, `src/pages/Signup.js`, `src/components/cards/ProfileThreeColGrid.js`, `src/components/cards/ThreeColContactDetails.js`, `src/components/misc/Layouts.js`, `Headings.js`.
4. Tulis rencana pemetaan section (section demo → jadi konten apa, komponen apa dipakai untuk Hub, dan rancangan komponen baru untuk View Profile Member sesuai ATURAN #2) untuk KETIGA divisi + Hub dalam bentuk tabel/list, **TAMPILKAN ke saya, JANGAN mulai coding dulu**.
   ⛔ BERHENTI — tunggu konfirmasi saya sebelum lanjut ke langkah 5.
5. Setelah dikonfirmasi, kerjakan SATU DIVISI DULU sampai selesai (landing page + login + join + roster + view profile member).
   ⛔ BERHENTI — tampilkan ringkasan file apa saja yang dibuat/diubah untuk divisi ini, lalu tunggu konfirmasi saya sebelum lanjut ke divisi berikutnya. Ulangi pola ini untuk tiap divisi. Urutan: **Remix → Creator → Leadies → Hub → routing final**.
6. Setelah semua selesai, jalankan `npm install` lalu `npm run build`, pastikan tidak ada error compile — kalau ada error, perbaiki sampai build sukses.
7. Zip project final, berikan ke saya beserta ringkasan: daftar halaman & routing final, dan daftar semua bagian placeholder yang perlu saya ganti dengan data asli.

## SELF-CHECK SEBELUM SETIAP KALI MENULIS FILE BARU
Sebelum membuat file baru (bukan mengedit file existing), jawab dulu di dalam responsmu: "Apakah ini section yang sudah ada padanannya di template? Kalau ya, kenapa saya tidak mengedit file yang sudah ada saja?" Kalau jawabannya menunjukkan ada file existing yang seharusnya dipakai, batalkan rencana buat file baru dan edit file yang ada.
