import React, { useRef, useState, useEffect, useCallback } from "react";
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
import { ReactComponent as SkipBackIcon } from "feather-icons/dist/icons/skip-back.svg";
import { ReactComponent as SkipForwardIcon } from "feather-icons/dist/icons/skip-forward.svg";
import { ReactComponent as MoreIcon } from "feather-icons/dist/icons/more-vertical.svg";
import { ReactComponent as DownloadIcon } from "feather-icons/dist/icons/download.svg";

// ─────────────────────────────────────────────────────────────────────────────
// HALAMAN: DENGARKAN KARYA — SOPAN REMIX (/remix/karya)
//
// Self-check: Apakah ada padanan di template?
// → TIDAK ADA. Template tidak punya komponen audio player / daftar karya
//   bergaya "voice message". Disusun dari elemen dasar template (Content2Xl,
//   SectionHeading, Header/Footer Remix yang sudah ada) + tema warna
//   primary #6415FF, bukan style baru dari luar.
//
// FLOW HALAMAN INI:
// 1. Bagian atas ("hero player") menampilkan karya yang sedang aktif —
//    avatar besar, judul, creator, tombol prev/play-pause/next, dan bar
//    frequency besar.
// 2. Di bawahnya ada daftar SEMUA karya member. Tiap baris: avatar bulat
//    kiri → progress bar bergaya frequency audio → tombol play/pause kecil
//    → menu titik tiga untuk download.
// 3. Klik tombol play/pause KECIL di baris = audio langsung main di situ
//    saja (mini player mandiri), TIDAK memindahkan tampilan hero di atas.
// 4. Klik area baris/box lagunya (di luar tombol play & menu titik tiga)
//    = karya itu yang tampil & diputar di hero player atas ("berpindah ke
//    tampilan pemutar utama").
// 5. Judul selalu satu baris (truncate + ellipsis) walau judulnya panjang.
//
// Data karya (judul, creator, cover, audioSrc) MASIH PLACEHOLDER, pakai lagu
// contoh dari internet (SoundHelix, dipakai luas untuk testing audio player)
// karena belum ada sumber audio asli dari member.
// ─────────────────────────────────────────────────────────────────────────────

const PageContainer = tw.div`-mx-8 px-8 bg-primary-900 text-gray-100 min-h-screen`;
const StyledHeader = tw(HeaderBase)`max-w-none pt-8 pb-4`;
const LogoLink = tw(LogoLinkBase)`text-gray-100 hocus:text-gray-300`;
const NavLink = tw(NavLinkBase)`lg:text-gray-100 lg:hocus:text-gray-300 lg:hocus:border-gray-100`;
const PrimaryLink = tw(PrimaryLinkBase)`shadow-raised lg:bg-primary-400 lg:hocus:bg-primary-500`;

const PlayerWrapper = tw.div`flex flex-col items-center text-center py-16 max-w-xl mx-auto`;
const Heading = tw(SectionHeading)`text-gray-100`;
const Subheading = tw.p`mt-2 text-gray-300 text-sm max-w-md`;

const AvatarRing = styled.div`
  ${tw`mt-12 w-56 h-56 rounded-full p-2 border-4 border-primary-400`}
`;
const Avatar = styled.div`
  ${props => `background-image: url("${props.imageSrc}");`}
  ${tw`w-full h-full rounded-full bg-cover bg-center shadow-lg`}
`;

const TrackTitle = tw.h3`mt-8 text-2xl font-bold max-w-full truncate whitespace-nowrap overflow-hidden px-4`;
const TrackCreator = tw.p`mt-1 text-primary-300 text-sm uppercase tracking-wider font-semibold`;

const ControlsRow = tw.div`mt-10 flex items-center justify-center gap-8`;
const SideButton = styled.button`
  ${tw`text-gray-300 hocus:text-gray-100 transition duration-300 focus:outline-none`}
`;
const PlayButton = styled.button`
  ${tw`w-16 h-16 rounded-full bg-primary-400 hocus:bg-primary-500 text-gray-900 flex items-center justify-center shadow-raised transition duration-300 focus:outline-none`}
`;

const BarsContainer = tw.div`mt-12 w-full h-20 flex items-end justify-center gap-1`;
const Bar = styled.div`
  width: 4px;
  border-radius: 9999px;
  background-color: ${props => (props.$active ? "#a78bfa" : "rgba(255,255,255,0.25)")};
  height: ${props => props.$height}%;
  transition: height 100ms ease;
`;

// ── Daftar karya member (list) ──────────────────────────────────────────────
const ListSection = tw.div`mt-16 max-w-3xl mx-auto pb-24`;
const ListHeadingRow = tw.div`flex items-center justify-between mb-6`;
const ListHeading = tw.h4`text-lg sm:text-xl font-bold text-gray-100`;
const ListCount = tw.span`text-xs text-primary-300 font-semibold`;

const KaryaRow = styled.div`
  ${tw`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl cursor-pointer transition duration-200 mb-3 bg-primary-800 hocus:bg-primary-700 border border-transparent`}
  ${props => props.$active && tw`border-primary-400 bg-primary-700`}
`;

const RowAvatar = styled.div`
  ${props => `background-image: url("${props.imageSrc}");`}
  ${tw`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex-shrink-0 bg-cover bg-center shadow-md`}
`;

const RowMiddle = tw.div`flex-1 min-w-0`;
const RowTitleRow = tw.div`flex items-center min-w-0`;
const RowTitle = tw.p`text-sm sm:text-base font-semibold text-gray-100 truncate whitespace-nowrap overflow-hidden`;
const NowPlayingBadge = tw.span`flex-shrink-0 text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-primary-300 bg-primary-900 px-2 py-0.5 rounded-full ml-2`;
const RowCreator = tw.p`text-xs text-primary-300 truncate whitespace-nowrap overflow-hidden mb-1.5`;

const RowWaveContainer = tw.div`flex items-end gap-0.5 h-6 w-full max-w-[240px]`;
const RowBar = styled.div`
  flex: 1 1 auto;
  min-width: 2px;
  border-radius: 9999px;
  height: ${props => props.$height}%;
  background-color: ${props => (props.$active ? "#a78bfa" : "rgba(255,255,255,0.22)")};
  transition: height 100ms ease, background-color 200ms ease;
`;

const RowPlayButton = styled.button`
  ${tw`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary-500 hocus:bg-primary-400 text-gray-900 flex-shrink-0 flex items-center justify-center transition duration-200 focus:outline-none`}
`;

const RowMenuWrap = tw.div`relative flex-shrink-0`;
const RowMenuButton = styled.button`
  ${tw`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-gray-300 hocus:text-gray-100 transition duration-200 focus:outline-none`}
`;
const DropdownMenu = tw.div`absolute right-0 top-9 sm:top-10 z-20 bg-gray-100 text-gray-900 rounded-lg shadow-raised overflow-hidden w-44`;
const DropdownItem = styled.a`
  ${tw`flex items-center gap-2 px-4 py-3 text-sm hocus:bg-gray-200 transition duration-150 cursor-pointer`}
`;

const BAR_COUNT = 40;
const ROW_BAR_COUNT = 18;

// Bikin pola waveform statis yang deterministik per karya (biar tiap baris
// punya "bentuk" bar berbeda walau belum diputar), pakai seed sederhana.
const staticWave = (seed, count) => {
  let s = seed * 7919 + 13;
  return Array.from({ length: count }, () => {
    s = (s * 9301 + 49297) % 233280;
    const rnd = s / 233280;
    return 18 + rnd * 65; // rentang 18%–83%
  });
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
  // ── Hero player (karya yang sedang aktif ditampilkan besar) ──────────────
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [barHeights, setBarHeights] = useState(Array(BAR_COUNT).fill(6));

  // ── Mini player per-baris (independen dari hero) ──────────────────────────
  const [activeRowPlaying, setActiveRowPlaying] = useState(null); // index atau null
  const [rowBarHeights, setRowBarHeights] = useState(Array(ROW_BAR_COUNT).fill(6));
  const [rowProgress, setRowProgress] = useState(0); // 0..1

  // ── Menu titik tiga (download) ────────────────────────────────────────────
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const menuRefs = useRef({});

  const audioRef = useRef(null); // audio hero
  const rowAudioRefs = useRef([]); // audio per baris

  const audioCtxRef = useRef(null);
  const analysersRef = useRef({}); // key: "hero" | `row-${i}` -> { analyser, source }
  const rafRef = useRef(null);
  const fallbackTickRef = useRef(0);

  const track = karyaList[index];

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

  // Setup Web Audio analyser untuk sebuah <audio> tertentu, dipicu oleh
  // interaksi user (autoplay policy). Satu AudioContext dipakai bersama
  // untuk hero maupun semua baris, tiap elemen audio dapat analyser sendiri.
  const ensureGraph = useCallback((key, audioEl) => {
    if (!audioEl || analysersRef.current[key] !== undefined) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      const source = ctx.createMediaElementSource(audioEl);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      analysersRef.current[key] = { analyser, source };
    } catch (e) {
      // Kalau gagal (misal restriksi CORS dari sumber audio), biarkan saja —
      // visualizer akan pakai animasi fallback di bawah.
      analysersRef.current[key] = null;
    }
  }, []);

  // Loop animasi tunggal — mengurus bar besar hero (kalau isPlaying) DAN bar
  // kecil di baris yang sedang mini-play (kalau activeRowPlaying terisi).
  useEffect(() => {
    const animate = () => {
      fallbackTickRef.current += 1;
      const t = fallbackTickRef.current;

      // Hero bars
      if (isPlaying) {
        const heroGraph = analysersRef.current.hero;
        if (heroGraph) {
          const data = new Uint8Array(heroGraph.analyser.frequencyBinCount);
          heroGraph.analyser.getByteFrequencyData(data);
          const step = Math.floor(data.length / BAR_COUNT) || 1;
          setBarHeights(
            Array.from({ length: BAR_COUNT }, (_, i) => {
              const v = data[i * step] || 0;
              return Math.max(6, (v / 255) * 100);
            })
          );
        } else {
          setBarHeights(
            Array.from({ length: BAR_COUNT }, (_, i) =>
              Math.max(6, 20 + 45 * Math.abs(Math.sin(t * 0.15 + i * 0.4)))
            )
          );
        }
      } else {
        setBarHeights(Array(BAR_COUNT).fill(6));
      }

      // Row (mini player) bars + progress
      if (activeRowPlaying !== null) {
        const rowGraph = analysersRef.current[`row-${activeRowPlaying}`];
        const rowAudio = rowAudioRefs.current[activeRowPlaying];
        if (rowGraph) {
          const data = new Uint8Array(rowGraph.analyser.frequencyBinCount);
          rowGraph.analyser.getByteFrequencyData(data);
          const step = Math.floor(data.length / ROW_BAR_COUNT) || 1;
          setRowBarHeights(
            Array.from({ length: ROW_BAR_COUNT }, (_, i) => {
              const v = data[i * step] || 0;
              return Math.max(10, (v / 255) * 100);
            })
          );
        } else {
          setRowBarHeights(
            Array.from({ length: ROW_BAR_COUNT }, (_, i) =>
              Math.max(10, 20 + 45 * Math.abs(Math.sin(t * 0.2 + i * 0.5)))
            )
          );
        }
        if (rowAudio && rowAudio.duration) {
          setRowProgress(rowAudio.currentTime / rowAudio.duration);
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, activeRowPlaying]);

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

  // ── Kontrol hero player ────────────────────────────────────────────────
  const stopActiveRow = () => {
    if (activeRowPlaying !== null) {
      const prevAudio = rowAudioRefs.current[activeRowPlaying];
      if (prevAudio) prevAudio.pause();
      setActiveRowPlaying(null);
      setRowProgress(0);
    }
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    stopActiveRow(); // pastikan mini player baris berhenti, hindari 2 suara
    ensureGraph("hero", audioRef.current);
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const goTo = (newIndex) => {
    stopActiveRow();
    setIndex(newIndex);
    setIsPlaying(false);
    // Beri waktu satu tick supaya <audio src> sempat berganti sebelum diputar
    setTimeout(() => {
      const audio = audioRef.current;
      if (!audio) return;
      ensureGraph("hero", audio);
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }, 50);
  };

  const handlePrev = () => goTo((index - 1 + karyaList.length) % karyaList.length);
  const handleNext = () => goTo((index + 1) % karyaList.length);

  // Klik BOX/baris lagu (di luar tombol play & menu) → tampilkan & putar di hero
  const selectHero = (i) => {
    if (i === index) {
      // Sudah jadi hero, klik box lagi cukup toggle play/pause hero
      handlePlayPause();
      return;
    }
    goTo(i);
  };

  // ── Kontrol mini player per-baris (independen, tidak mengubah hero) ──────
  const toggleRowPlay = (i, e) => {
    e.stopPropagation(); // supaya tidak ikut memicu selectHero (klik box)
    const rowAudio = rowAudioRefs.current[i];
    if (!rowAudio) return;

    if (activeRowPlaying === i) {
      rowAudio.pause();
      setActiveRowPlaying(null);
      return;
    }

    // Hentikan hero kalau lagi main, dan baris lain kalau ada yang main
    if (isPlaying) {
      audioRef.current && audioRef.current.pause();
      setIsPlaying(false);
    }
    if (activeRowPlaying !== null) {
      const prevAudio = rowAudioRefs.current[activeRowPlaying];
      if (prevAudio) prevAudio.pause();
    }

    ensureGraph(`row-${i}`, rowAudio);
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    setRowProgress(0);
    rowAudio.currentTime = 0;
    rowAudio.play().catch(() => {});
    setActiveRowPlaying(i);
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

  return (
    <AnimationRevealPage>
      <PageContainer>
        <Content2Xl>
          <StyledHeader logoLink={logoLink} links={navLinks} />

          <PlayerWrapper>
            <Heading>Dengarkan Karya</Heading>
            <Subheading>
              Kumpulan karya audio dari member Sopan Remix — hasil produksi, remix, dan mixing mereka.
            </Subheading>

            <AvatarRing>
              <Avatar imageSrc={track.imageSrc} />
            </AvatarRing>

            <TrackTitle title={track.title}>{track.title}</TrackTitle>
            <TrackCreator>oleh {track.creator}</TrackCreator>

            <ControlsRow>
              <SideButton onClick={handlePrev} aria-label="Lagu sebelumnya">
                <SkipBackIcon tw="w-6 h-6 fill-current" />
              </SideButton>
              <PlayButton onClick={handlePlayPause} aria-label={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? (
                  <PauseIcon tw="w-6 h-6 fill-current" />
                ) : (
                  <PlayIcon tw="w-6 h-6 fill-current ml-1" />
                )}
              </PlayButton>
              <SideButton onClick={handleNext} aria-label="Lagu berikutnya">
                <SkipForwardIcon tw="w-6 h-6 fill-current" />
              </SideButton>
            </ControlsRow>

            <BarsContainer>
              {barHeights.map((h, i) => (
                <Bar key={i} $height={h} $active={isPlaying} />
              ))}
            </BarsContainer>

            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <audio
              ref={audioRef}
              src={track.audioSrc}
              crossOrigin="anonymous"
              onEnded={handleNext}
              tw="hidden"
            />
          </PlayerWrapper>

          {/* ── Daftar semua karya member ──────────────────────────────── */}
          <ListSection>
            <ListHeadingRow>
              <ListHeading>Semua Karya Member</ListHeading>
              <ListCount>{karyaList.length} karya</ListCount>
            </ListHeadingRow>

            {karyaList.map((item, i) => {
              const isHeroActive = i === index;
              const isRowPlaying = activeRowPlaying === i;
              const wave = isRowPlaying ? rowBarHeights : staticWave(i, ROW_BAR_COUNT);
              const playedCount = isRowPlaying
                ? Math.round(rowProgress * ROW_BAR_COUNT)
                : 0;

              return (
                <KaryaRow
                  key={i}
                  $active={isHeroActive}
                  onClick={() => selectHero(i)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Putar ${item.title} di pemutar utama`}
                >
                  <RowAvatar imageSrc={item.imageSrc} />

                  <RowMiddle>
                    <RowTitleRow>
                      <RowTitle title={item.title}>{item.title}</RowTitle>
                      {isHeroActive && <NowPlayingBadge>Sedang Diputar</NowPlayingBadge>}
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
                      <PlayIcon tw="w-4 h-4 fill-current ml-0.5" />
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

                  {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                  <audio
                    ref={(el) => (rowAudioRefs.current[i] = el)}
                    src={item.audioSrc}
                    crossOrigin="anonymous"
                    onEnded={() => handleRowEnded(i)}
                    tw="hidden"
                  />
                </KaryaRow>
              );
            })}
          </ListSection>
        </Content2Xl>
      </PageContainer>
      <Footer />
    </AnimationRevealPage>
  );
};
