import React, { useRef, useState, useEffect } from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import HeaderBase, {
  LogoLink as LogoLinkBase,
  NavLinks,
  NavLink as NavLinkBase,
  PrimaryLink as PrimaryLinkBase,
} from "components/headers/light.js";
import { Content2Xl } from "components/misc/Layouts.js";
import { SectionHeading } from "components/misc/Headings.js";
import Footer from "components/footers/FooterRemix.js";
import logoImageSrc from "images/logo-sopan.png";
import { ReactComponent as PlayIcon } from "feather-icons/dist/icons/play.svg";
import { ReactComponent as PauseIcon } from "feather-icons/dist/icons/pause.svg";
import { ReactComponent as MoreIcon } from "feather-icons/dist/icons/more-vertical.svg";
import { ReactComponent as DownloadIcon } from "feather-icons/dist/icons/download.svg";
import { ReactComponent as ChevronDownIcon } from "feather-icons/dist/icons/chevron-down.svg";

// ─────────────────────────────────────────────────────────────────────────────
// HALAMAN: DENGARKAN KARYA — SOPAN REMIX (/remix/karya)
//
// Self-check: Apakah ada padanan di template?
// → TIDAK ADA. Template tidak punya komponen audio player / daftar karya
//   bergaya "voice message". Disusun dari elemen dasar template (Content2Xl,
//   SectionHeading, Header/Footer Remix yang sudah ada) + tema warna
//   primary #6415FF, bukan style baru dari luar.
//
// FLOW HALAMAN INI (setelah revisi):
// 1. TIDAK ADA hero player besar lagi di atas — halaman langsung berisi
//    judul singkat + daftar SEMUA karya member.
// 2. Tiap baris: avatar bulat kiri → judul/creator → waveform (bentuk bar
//    frekuensi) → tombol play/pause kecil → menu titik tiga untuk download.
// 3. Waveform TIDAK dihitung real-time dari audio yang sedang diputar.
//    Sebagai gantinya, saat baris pertama kali tampil, audionya diambil lalu
//    di-decode sekali (Web Audio API decodeAudioData) untuk menghasilkan
//    bentuk gelombang (rata-rata amplitudo per segmen) — baru itu yang
//    ditampilkan sebagai bar-bar statis. Progres putar hanya menyalakan
//    (highlight) bar-bar itu sesuai posisi lagu, bukan menghitung ulang
//    frekuensinya tiap frame.
// 4. Elemen <audio> pemutaran TIDAK lagi disambungkan ke Web Audio API graph
//    (createMediaElementSource) dan TIDAK pakai atribut crossOrigin — ini
//    yang sebelumnya menyebabkan audio gagal/tidak bisa diputar kalau server
//    sumber audio tidak mengirim header CORS yang pas. Sekarang audio main
//    lewat elemen <audio> biasa, jadi playback tidak bergantung ke CORS.
//    Analisis waveform (fetch + decodeAudioData) tetap butuh CORS untuk bisa
//    "melihat" isi filenya, tapi kalau itu gagal, halaman otomatis pakai pola
//    waveform statis fallback dan audio TETAP BISA diputar seperti biasa.
// 5. Daftar karya tidak langsung menampilkan semuanya — hanya beberapa dulu,
//    lalu ada tombol "Tampilkan Lebih Banyak" di bawah untuk memuat sisanya.
//
// Data karya (judul, creator, cover, audioSrc) MASIH PLACEHOLDER, pakai lagu
// contoh dari internet (SoundHelix, dipakai luas untuk testing audio player)
// karena belum ada sumber audio asli dari member.
// ─────────────────────────────────────────────────────────────────────────────

// Kanvas halaman ini gelap (bg-primary-900), sedangkan wrapper animasi global
// (AnimationRevealPage) punya padding `p-8` di semua sisi. Kalau cuma
// horizontal margin yang dibatalkan, padding-top bawaan itu menyisakan garis
// putih di paling atas halaman (bug yang dilaporkan). Makanya di sini margin
// atas & kiri-kanan DUA-duanya dibatalkan (`-mt-8 -mx-8`), lalu padding
// horizontal dikembalikan (`px-8`) supaya konten tetap tidak mepet ke tepi.
const PageContainer = tw.div`-mt-8 -mx-8 px-8 bg-primary-900 text-gray-100 min-h-screen`;
const StyledHeader = tw(HeaderBase)`max-w-none pt-8 pb-4`;
const LogoLink = tw(LogoLinkBase)`text-gray-100 hocus:text-gray-300`;
const NavLink = tw(NavLinkBase)`lg:text-gray-100 lg:hocus:text-gray-300 lg:hocus:border-gray-100`;
const PrimaryLink = tw(PrimaryLinkBase)`shadow-raised lg:bg-primary-400 lg:hocus:bg-primary-500`;

const IntroSection = tw.div`flex flex-col items-center text-center pt-12 pb-8 max-w-xl mx-auto`;
const Heading = tw(SectionHeading)`text-gray-100`;
const Subheading = tw.p`mt-2 text-gray-300 text-sm max-w-md`;

// ── Daftar karya member (list) ──────────────────────────────────────────────
const ListSection = tw.div`max-w-3xl mx-auto pb-24`;
const ListHeadingRow = tw.div`flex items-center justify-between mb-6`;
const ListHeading = tw.h4`text-lg sm:text-xl font-bold text-gray-100`;
const ListCount = tw.span`text-xs text-primary-300 font-semibold`;

const KaryaRow = styled.div`
  ${tw`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl cursor-pointer transition duration-200 mb-3 bg-primary-800 hocus:bg-primary-700 border border-transparent`}
  ${props => props.$active && tw`border-primary-400 bg-primary-700`}
`;

const RowAvatar = styled.div`
  ${props => `background-image: url("${props.imageSrc}");`}
  ${tw`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex-shrink-0 bg-cover bg-center shadow-md`}
`;

const RowMiddle = tw.div`flex-1 min-w-0`;
const RowTitleRow = tw.div`flex items-center min-w-0`;
const RowTitle = tw.p`text-sm sm:text-base font-semibold text-gray-100 truncate whitespace-nowrap overflow-hidden`;
const NowPlayingBadge = tw.span`flex-shrink-0 text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-primary-300 bg-primary-900 px-2 py-1 rounded-full ml-2`;
const RowCreator = tw.p`text-xs text-primary-300 truncate whitespace-nowrap overflow-hidden mb-1`;

const RowWaveContainer = tw.div`flex items-end gap-1 h-6 w-full max-w-[240px]`;
const RowBar = styled.div`
  flex: 1 1 auto;
  min-width: 2px;
  border-radius: 9999px;
  height: ${props => props.$height}%;
  background-color: ${props => (props.$active ? "#a78bfa" : "rgba(255,255,255,0.22)")};
  transition: height 300ms ease, background-color 200ms ease;
`;

const RowPlayButton = styled.button`
  ${tw`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-500 hocus:bg-primary-400 text-gray-900 flex-shrink-0 flex items-center justify-center transition duration-200 focus:outline-none`}
`;

const RowMenuWrap = tw.div`relative flex-shrink-0`;
const RowMenuButton = styled.button`
  ${tw`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-300 hocus:text-gray-100 transition duration-200 focus:outline-none`}
`;
const DropdownMenu = tw.div`absolute right-0 top-[36px] sm:top-[40px] z-20 bg-gray-100 text-gray-900 rounded-lg shadow-raised overflow-hidden w-[180px]`;
const DropdownItem = styled.a`
  ${tw`flex items-center gap-2 px-4 py-3 text-sm hocus:bg-gray-200 transition duration-150 cursor-pointer`}
`;

const ShowMoreWrap = tw.div`flex justify-center mt-2`;
const ShowMoreButton = styled.button`
  ${tw`flex items-center gap-2 px-6 py-3 rounded-full border border-primary-400 text-primary-200 font-semibold text-sm hocus:bg-primary-700 hocus:text-gray-100 transition duration-200 focus:outline-none`}
`;

const ROW_BAR_COUNT = 18;
const INITIAL_VISIBLE = 5;
const SHOW_MORE_STEP = 5;

// Bikin pola waveform statis yang deterministik per karya, dipakai sebagai
// tampilan awal (sebelum hasil analisis frekuensi asli selesai/tersedia) atau
// sebagai fallback kalau analisis gagal (mis. sumber audio tidak izinkan CORS
// untuk di-fetch).
const staticWave = (seed, count) => {
  let s = seed * 7919 + 13;
  return Array.from({ length: count }, () => {
    s = (s * 9301 + 49297) % 233280;
    const rnd = s / 233280;
    return 18 + rnd * 65; // rentang 18%–83%
  });
};

// Analisis frekuensi/amplitudo SEKALI di awal (bukan real-time): ambil file
// audio, decode isinya, lalu ambil rata-rata amplitudo tiap segmen supaya
// bisa digambar sebagai bar-bar waveform yang mewakili bentuk audio aslinya.
const analyzeWaveform = async (url, barCount) => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) throw new Error("Web Audio API tidak didukung");

  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();

  const ctx = new AudioContext();
  let audioBuffer;
  try {
    audioBuffer = await ctx.decodeAudioData(arrayBuffer);
  } finally {
    ctx.close();
  }

  const channelData = audioBuffer.getChannelData(0);
  const samplesPerBar = Math.max(1, Math.floor(channelData.length / barCount));

  const rawHeights = Array.from({ length: barCount }, (_, i) => {
    const start = i * samplesPerBar;
    const end = Math.min(start + samplesPerBar, channelData.length);
    let sum = 0;
    for (let j = start; j < end; j++) {
      sum += Math.abs(channelData[j]);
    }
    return sum / Math.max(1, end - start);
  });

  const max = Math.max(...rawHeights) || 1;
  // Normalisasi ke rentang 14%–95% biar bar terpendek tetap kelihatan.
  return rawHeights.map((h) => 14 + (h / max) * 81);
};

// PLACEHOLDER - ganti dengan karya asli member (judul, creator, cover, link audio)
// Sudah mencakup seluruh member contoh; tinggal ganti/tambah data asli nanti.
const karyaList = [
  {
    title: "Midnight Drive (Remix)",
    creator: "Rizky Aditya",
    imageSrc: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    title: "Ocean Waves (Original)",
    creator: "Daffa Pratama",
    imageSrc: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    title: "City Lights (Mixing Demo)",
    creator: "Bagas Ari",
    imageSrc: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=600&q=80",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  {
    title: "Senja di Ujung Kota — Versi Akustik yang Belum Pernah Dirilis",
    creator: "Nadia Salsabila",
    imageSrc: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?auto=format&fit=crop&w=600&q=80",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  {
    title: "Pulang",
    creator: "Fajar Nugroho",
    imageSrc: "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=600&q=80",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  },
  {
    title: "Lo-Fi Study Session",
    creator: "Intan Permata",
    imageSrc: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  },
  {
    title: "Bassline Malam Jumat",
    creator: "Reza Firmansyah",
    imageSrc: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&fit=crop&w=600&q=80",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
  },
  {
    title: "Hujan Pertama",
    creator: "Citra Ayu Lestari",
    imageSrc: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=600&q=80",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  },
  {
    title: "Studio Session Vol. 9",
    creator: "Yoga Saputra",
    imageSrc: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
  },
];

export default () => {
  // ── Mini player per-baris (satu-satunya cara putar audio sekarang) ───────
  const [activeRowPlaying, setActiveRowPlaying] = useState(null); // index atau null
  const [rowProgress, setRowProgress] = useState(0); // 0..1

  // ── Waveform hasil analisis frekuensi (bukan real-time) ───────────────────
  const [waveforms, setWaveforms] = useState({}); // { [index]: number[] }
  const analyzedRef = useRef(new Set());

  // ── Menu titik tiga (download) ────────────────────────────────────────────
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const menuRefs = useRef({});

  // ── Daftar bertahap ("Tampilkan Lebih Banyak") ────────────────────────────
  const [visibleCount, setVisibleCount] = useState(Math.min(INITIAL_VISIBLE, karyaList.length));

  const rowAudioRefs = useRef([]); // audio per baris

  const logoLink = (
    <LogoLink href="/remix">
      <img src={logoImageSrc} alt="Logo" />
      Sopan Remix
    </LogoLink>
  );
  const navLinks = [
    <NavLinks key={1}>
      <NavLink href="/remix">Home</NavLink>
      <NavLink href="/remix/members">Member</NavLink>
      <NavLink href="/remix/login">Login</NavLink>
      <PrimaryLink href="/remix/join">Join Sekarang</PrimaryLink>
    </NavLinks>
  ];

  // Analisis frekuensi/waveform untuk karya yang sedang tampil (lazy — cuma
  // yang kelihatan/di-load, dan cuma sekali per karya). Kalau gagal (mis.
  // CORS), baris itu tetap pakai pola waveform statis fallback dan audio
  // tetap bisa diputar seperti biasa.
  useEffect(() => {
    const cancelledRef = { current: false };

    Array.from({ length: visibleCount }, (_, i) => i)
      .filter((i) => !analyzedRef.current.has(i))
      .forEach((i) => {
        analyzedRef.current.add(i);

        analyzeWaveform(karyaList[i].audioSrc, ROW_BAR_COUNT)
          .then((heights) => {
            if (!cancelledRef.current) {
              setWaveforms((prev) => ({ ...prev, [i]: heights }));
            }
          })
          .catch(() => {
            // Diamkan saja — tampilan sudah punya fallback staticWave.
          });
      });

    return () => {
      cancelledRef.current = true;
    };
  }, [visibleCount]);

  // Tutup menu titik tiga kalau klik di luar menu yang sedang terbuka
  useEffect(() => {
    if (openMenuIndex === null) return undefined;
    const handleClickOutside = (e) => {
      const el = menuRefs.current[openMenuIndex];
      if (el && !el.contains(e.target)) {
        setOpenMenuIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuIndex]);

  // ── Kontrol mini player per-baris ─────────────────────────────────────────
  const toggleRowPlay = (i, e) => {
    if (e) e.stopPropagation(); // supaya klik tombol tidak dobel-trigger klik baris
    const rowAudio = rowAudioRefs.current[i];
    if (!rowAudio) return;

    if (activeRowPlaying === i) {
      rowAudio.pause();
      setActiveRowPlaying(null);
      return;
    }

    // Hentikan baris lain kalau ada yang lagi main, biar tidak dobel suara.
    if (activeRowPlaying !== null) {
      const prevAudio = rowAudioRefs.current[activeRowPlaying];
      if (prevAudio) prevAudio.pause();
    }

    setRowProgress(0);
    rowAudio.currentTime = 0;
    rowAudio.play().catch(() => {});
    setActiveRowPlaying(i);
  };

  const handleRowTimeUpdate = (i, e) => {
    if (activeRowPlaying !== i) return;
    const a = e.target;
    if (a.duration) setRowProgress(a.currentTime / a.duration);
  };

  const handleRowEnded = (i) => {
    if (activeRowPlaying === i) {
      setActiveRowPlaying(null);
      setRowProgress(0);
    }
  };

  const toggleMenu = (i, e) => {
    e.stopPropagation();
    setOpenMenuIndex(openMenuIndex === i ? null : i);
  };

  const handleShowMore = () => {
    setVisibleCount((c) => Math.min(c + SHOW_MORE_STEP, karyaList.length));
  };

  const visibleKarya = karyaList.slice(0, visibleCount);
  const hasMore = visibleCount < karyaList.length;

  return (
    <AnimationRevealPage>
      <PageContainer>
        <Content2Xl>
          <StyledHeader logoLink={logoLink} links={navLinks} />

          <IntroSection>
            <Heading>Dengarkan Karya</Heading>
            <Subheading>
              Kumpulan karya audio dari member Sopan Remix — hasil produksi, remix, dan mixing mereka.
            </Subheading>
          </IntroSection>

          {/* ── Daftar semua karya member ──────────────────────────────── */}
          <ListSection>
            <ListHeadingRow>
              <ListHeading>Semua Karya Member</ListHeading>
              <ListCount>
                {visibleKarya.length} dari {karyaList.length} karya
              </ListCount>
            </ListHeadingRow>

            {visibleKarya.map((item, i) => {
              const isRowPlaying = activeRowPlaying === i;
              const wave = waveforms[i] || staticWave(i, ROW_BAR_COUNT);
              const playedCount = isRowPlaying ? Math.round(rowProgress * ROW_BAR_COUNT) : 0;

              return (
                <KaryaRow
                  key={i}
                  $active={isRowPlaying}
                  onClick={(e) => toggleRowPlay(i, e)}
                  role="button"
                  tabIndex={0}
                  aria-label={isRowPlaying ? `Jeda ${item.title}` : `Putar ${item.title}`}
                >
                  <RowAvatar imageSrc={item.imageSrc} />

                  <RowMiddle>
                    <RowTitleRow>
                      <RowTitle title={item.title}>{item.title}</RowTitle>
                      {isRowPlaying && <NowPlayingBadge>Sedang Diputar</NowPlayingBadge>}
                    </RowTitleRow>
                    <RowCreator>oleh {item.creator}</RowCreator>

                    <RowWaveContainer>
                      {wave.map((h, barIdx) => (
                        <RowBar
                          key={barIdx}
                          $height={h}
                          $active={isRowPlaying && barIdx <= playedCount}
                        />
                      ))}
                    </RowWaveContainer>
                  </RowMiddle>

                  <RowPlayButton
                    onClick={(e) => toggleRowPlay(i, e)}
                    aria-label={isRowPlaying ? "Pause karya ini" : "Putar karya ini"}
                  >
                    {isRowPlaying ? (
                      <PauseIcon tw="w-4 h-4 fill-current" />
                    ) : (
                      <PlayIcon tw="w-4 h-4 fill-current ml-1" />
                    )}
                  </RowPlayButton>

                  <RowMenuWrap
                    ref={(el) => (menuRefs.current[i] = el)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <RowMenuButton onClick={(e) => toggleMenu(i, e)} aria-label="Menu opsi karya">
                      <MoreIcon tw="w-5 h-5 fill-current" />
                    </RowMenuButton>
                    {openMenuIndex === i && (
                      <DropdownMenu>
                        <DropdownItem href={item.audioSrc} download target="_blank" rel="noreferrer">
                          <DownloadIcon tw="w-4 h-4" />
                          Download Karya
                        </DropdownItem>
                      </DropdownMenu>
                    )}
                  </RowMenuWrap>

                  {/* Audio elemen biasa — TIDAK disambungkan ke Web Audio API
                      graph dan TIDAK pakai crossOrigin, supaya playback tidak
                      gagal walau sumber audio tidak mengirim header CORS. */}
                  {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                  <audio
                    ref={(el) => (rowAudioRefs.current[i] = el)}
                    src={item.audioSrc}
                    onTimeUpdate={(e) => handleRowTimeUpdate(i, e)}
                    onEnded={() => handleRowEnded(i)}
                    tw="hidden"
                  />
                </KaryaRow>
              );
            })}

            {hasMore && (
              <ShowMoreWrap>
                <ShowMoreButton onClick={handleShowMore}>
                  Tampilkan Lebih Banyak
                  <ChevronDownIcon tw="w-4 h-4 fill-current" />
                </ShowMoreButton>
              </ShowMoreWrap>
            )}
          </ListSection>
        </Content2Xl>
      </PageContainer>
      <Footer />
    </AnimationRevealPage>
  );
};
