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

// ─────────────────────────────────────────────────────────────────────────────
// HALAMAN: DENGARKAN KARYA — SOPAN REMIX (/remix/karya)
//
// Self-check: Apakah ada padanan di template?
// → TIDAK ADA. Template tidak punya komponen audio player. Disusun dari elemen
//   dasar template (Content2Xl, SectionHeading, Header/Footer Remix yang sudah
//   ada) + tema warna primary #6415FF, bukan style baru dari luar.
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

const TrackTitle = tw.h3`mt-8 text-2xl font-bold`;
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

const BAR_COUNT = 40;

// PLACEHOLDER - ganti dengan karya asli member (judul, creator, cover, link audio)
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
];

export default () => {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [barHeights, setBarHeights] = useState(Array(BAR_COUNT).fill(6));

  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
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

  // Setup Web Audio analyser sekali saja, dipicu oleh interaksi user (autoplay policy)
  const ensureAudioGraph = useCallback(() => {
    if (audioCtxRef.current || !audioRef.current) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      sourceRef.current = source;
    } catch (e) {
      // Kalau gagal (misal restriksi CORS dari sumber audio), biarkan saja —
      // visualizer akan pakai animasi fallback di bawah.
      audioCtxRef.current = null;
      analyserRef.current = null;
    }
  }, []);

  // Loop animasi bar — pakai data frequency asli kalau ada, fallback animasi ringan kalau tidak.
  useEffect(() => {
    const animate = () => {
      if (isPlaying) {
        const analyser = analyserRef.current;
        if (analyser) {
          const data = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(data);
          const step = Math.floor(data.length / BAR_COUNT) || 1;
          const next = Array.from({ length: BAR_COUNT }, (_, i) => {
            const v = data[i * step] || 0;
            return Math.max(6, (v / 255) * 100);
          });
          setBarHeights(next);
        } else {
          fallbackTickRef.current += 1;
          const t = fallbackTickRef.current;
          const next = Array.from({ length: BAR_COUNT }, (_, i) =>
            Math.max(6, 20 + 45 * Math.abs(Math.sin(t * 0.15 + i * 0.4)))
          );
          setBarHeights(next);
        }
      } else {
        setBarHeights(Array(BAR_COUNT).fill(6));
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    ensureAudioGraph();
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
    setIndex(newIndex);
    setIsPlaying(false);
    // Beri waktu satu tick supaya <audio src> sempat berganti sebelum diputar
    setTimeout(() => {
      const audio = audioRef.current;
      if (!audio) return;
      ensureAudioGraph();
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }, 50);
  };

  const handlePrev = () => goTo((index - 1 + karyaList.length) % karyaList.length);
  const handleNext = () => goTo((index + 1) % karyaList.length);

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

            <TrackTitle>{track.title}</TrackTitle>
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
        </Content2Xl>
      </PageContainer>
      <Footer />
    </AnimationRevealPage>
  );
};
