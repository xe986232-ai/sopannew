import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import Hero from "components/hero/TwoColumnWithPrimaryBackground.js";
import Features from "components/features/ThreeColWithSideImageWithPrimaryBackground.js";
import MainFeature from "components/features/TwoColWithButton.js";
import Testimonial from "components/testimonials/AnimatedTestimonials.js";
import FAQ from "components/faqs/TwoColumnPrimaryBackground.js";
import GetStarted from "components/cta/GetStartedLight.js";
import Footer from "components/footers/FooterRemix.js";
import { NavLinks, NavLink as NavLinkBase, PrimaryLink as PrimaryLinkBase } from "components/headers/light.js";
import { getSession, clearSession } from "helpers/session.js";
import { ReactComponent as LogOutIcon } from "feather-icons/dist/icons/log-out.svg";
import { ReactComponent as ChevronDownIcon } from "feather-icons/dist/icons/chevron-down.svg";
import { ReactComponent as Edit2Icon } from "feather-icons/dist/icons/edit-2.svg";
import logoImageSrc from "images/logo-sopan.png";
import composeMusicIllustrationSrc from "images/Compose music-bro.svg";
import playingMusicIllustrationSrc from "images/Playing Music-bro.svg";
import SupportIconImage from "images/support-icon.svg";
import ShieldIconImage from "images/shield-icon.svg";
import CustomizeIconImage from "images/customize-icon.svg";
import FastIconImage from "images/fast-icon.svg";
import ReliableIconImage from "images/reliable-icon.svg";
import SimpleIconImage from "images/simple-icon.svg";

// ─────────────────────────────────────────────────────────────────────────────
// LANDING PAGE: SOPAN REMIX
// Demo basis: HostingCloudLandingPage.js
// Urutan section dasarnya TIDAK berubah dari aslinya: Hero → Features →
//   Pricing → MainFeature × 2 → Testimonial → FAQ → Footer
// Tambahan: 1 section CTA ("Dengarkan Karya", pakai GetStartedLight yang
//   sudah ada di template) disisipkan setelah MainFeature 2, sebelum
//   Testimonial — jadi alurnya: ...MainFeature 2 → CTA Dengarkan Karya →
//   Testimonial → FAQ → Footer. Tombol utamanya mengarah ke halaman daftar
//   karya member (/remix/karya).
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// NAVBAR LOGIN-AWARE — sama logic-nya kayak pages/Absensi.js: kalau user
// sudah login, Login & Join Sekarang di-hide, muncul foto profil (avatar
// bulat, fallback inisial), nama, dan tombol Logout. Warna teks nav di sini
// disamakan sama styling yang dipakai Hero aslinya (putih di atas bg ungu).
// ─────────────────────────────────────────────────────────────────────────────
const NavLink = tw(NavLinkBase)`lg:text-gray-100 lg:hocus:text-gray-300 lg:hocus:border-gray-100`;
const PrimaryLink = tw(PrimaryLinkBase)`shadow-raised lg:bg-primary-400 lg:hocus:bg-primary-500`;

// ─────────────────────────────────────────────────────────────────────────────
// NAVBAR LOGIN-AWARE — kalau user sudah login, Login & Join Sekarang di-hide,
// diganti 1 tombol "Profil" (avatar + nama + chevron) yang kalau diklik
// buka dropdown berisi "Edit Profil" (ke halaman baru /remix/profile) dan
// "Logout". Logout TIDAK lagi nongol lepas di navbar — harus buka dropdown
// dulu, sesuai permintaan.
// ─────────────────────────────────────────────────────────────────────────────
const ProfileMenuWrap = tw.div`relative flex items-center lg:ml-12! my-2 lg:my-0`;
const ProfileTrigger = styled.button`
  ${tw`flex items-center gap-2 focus:outline-none`}
`;
const AvatarCircle = tw.div`w-10 h-10 rounded-full overflow-hidden bg-primary-400 flex items-center justify-center flex-shrink-0`;
const AvatarImg = tw.img`w-full h-full object-cover`;
const AvatarInitial = tw.span`text-gray-100 text-sm font-bold select-none`;
const MemberNameNavSpan = tw.span`
  flex items-center text-lg lg:text-sm font-semibold tracking-wide text-primary-500
`;
const ProfileChevron = styled.div`
  ${tw`text-gray-100 flex-shrink-0 transition-transform duration-200`}
  ${(props) => props.open && tw`transform rotate-180`}
`;

const ProfileDropdown = styled.div`
  ${tw`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 text-left`}
  top: 100%;
`;
const ProfileDropdownLink = styled(Link)`
  ${tw`flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150 border-b-0!`}
`;
const ProfileDropdownButton = styled.button`
  ${tw`w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-100 transition duration-150 focus:outline-none`}
`;

// ─────────────────────────────────────────────────────────────────────────────
// PEMISAH HERO ↔ FEATURES — Hero ("Sopan Remix — Komunitas Musik Digital") dan
// Features ("Apa yang Kami Lakukan") sama-sama pakai bg-primary-900, jadi
// nyambung tanpa batas. Pemisah ini kasih jeda visual: garis gradient tipis +
// badge bulat berisi logo Sopan (asset yang sudah ada di repo), biar dua
// section itu kebaca sebagai dua blok yang beda, bukan satu blok panjang.
// ─────────────────────────────────────────────────────────────────────────────
const HeroFeaturesDivider = tw.div`relative bg-primary-900 -mx-8 px-8`;
const DividerInner = tw.div`relative flex items-center justify-center max-w-screen-lg mx-auto py-2`;
const DividerLine = styled.div`
  ${tw`absolute inset-x-0 top-1/2 h-px transform -translate-y-1/2`}
  background: linear-gradient(to right, transparent, rgba(247, 250, 252, 0.35) 50%, transparent);
`;
const DividerBadge = styled.div`
  ${tw`relative z-10 w-16 h-16 rounded-full bg-primary-800 border-2 border-primary-400 shadow-raised flex items-center justify-center`}
`;
const DividerLogo = tw.img`w-8 h-8 object-contain rounded-full`;

export default () => {
  // Member yang lagi login, diambil dari localStorage (diisi pas login lewat
  // LoginRemix.js). null kalau belum login sama sekali. Logic-nya sama
  // persis kayak pages/Absensi.js.
  const [currentMember, setCurrentMember] = useState(() => getSession());
  const [avatarError, setAvatarError] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    setProfileMenuOpen(false);
    clearSession();
    setCurrentMember(null);
    navigate("/remix");
  };

  // Tutup dropdown kalau klik di luar area tombol profil.
  useEffect(() => {
    if (!profileMenuOpen) return undefined;
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileMenuOpen]);

  // Navbar khusus halaman ini: Home & Member selalu tampil. Login & Join
  // Sekarang di-hide kalau sudah login, digantikan 1 tombol Profil yang
  // membuka dropdown (Edit Profil / Logout) — Logout tidak lagi lepas di
  // navbar, harus lewat dropdown ini dulu.
  const navLinks = [
    <NavLinks key={1}>
      <NavLink href="/remix">Home</NavLink>
      <NavLink href="/remix/members">Member</NavLink>

      {!currentMember && <NavLink href="/remix/login">Login</NavLink>}
      {!currentMember && <PrimaryLink href="/remix/join">Join Sekarang</PrimaryLink>}

      {currentMember && (
        <ProfileMenuWrap ref={profileMenuRef}>
          <ProfileTrigger
            type="button"
            onClick={() => setProfileMenuOpen((prev) => !prev)}
            aria-expanded={profileMenuOpen}
            aria-haspopup="true"
          >
            <AvatarCircle>
              {currentMember.profilePic && !avatarError ? (
                <AvatarImg
                  src={currentMember.profilePic}
                  alt={currentMember.username}
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <AvatarInitial>{currentMember.username.trim().charAt(0).toUpperCase()}</AvatarInitial>
              )}
            </AvatarCircle>
            <MemberNameNavSpan>{currentMember.username}</MemberNameNavSpan>
            <ProfileChevron open={profileMenuOpen}>
              <ChevronDownIcon tw="w-4 h-4" />
            </ProfileChevron>
          </ProfileTrigger>

          {profileMenuOpen && (
            <ProfileDropdown>
              <ProfileDropdownLink to="/remix/profile" onClick={() => setProfileMenuOpen(false)}>
                <Edit2Icon tw="w-4 h-4" />
                Edit Profil
              </ProfileDropdownLink>
              <ProfileDropdownButton type="button" onClick={handleLogout}>
                <LogOutIcon tw="w-4 h-4" />
                Logout
              </ProfileDropdownButton>
            </ProfileDropdown>
          )}
        </ProfileMenuWrap>
      )}
    </NavLinks>,
  ];

  return (
    <AnimationRevealPage>

      {/* ── HERO ── diedit via props di file demo ini.
          "Join Sekarang" di-hide kalau sudah login (currentMember ada),
          dan muncul lagi kalau logout / belum daftar sama sekali —
          sama logic-nya kayak navLinks di navbar atas. */}
      <Hero
        heading="Sopan Remix — Komunitas Musik Digital"
        description="Divisi musik dari Sopan Team, tempat berkumpulnya para kreator audio: producer, mixing engineer, dan sound engineer yang berkarya bersama di dunia digital."
        primaryButtonText="Join Sekarang"
        primaryButtonUrl="/remix/join"
        showPrimaryButton={!currentMember}
        links={navLinks}
      />

      {/* ── PEMISAH HERO ↔ FEATURES ── */}
      <HeroFeaturesDivider>
        <DividerInner>
          <DividerLine />
          <DividerBadge>
            <DividerLogo src={logoImageSrc} alt="Sopan Remix" />
          </DividerBadge>
        </DividerInner>
      </HeroFeaturesDivider>

      {/* ── FEATURES ── diedit via props di file demo ini */}
      <Features
        heading="Apa yang Kami Lakukan"
        description="Sopan Remix menghadirkan ekosistem kolaborasi musik digital untuk para kreator audio berbakat."
        cards={[
          {
            imageSrc: ShieldIconImage,
            title: "Produksi Musik",
            description: "Proses kreatif membuat beat, melodi, dan aransemen musik dari nol bersama tim."
          },
          {
            imageSrc: SupportIconImage,
            title: "Remix & Bootleg",
            description: "Mengolah ulang lagu atau audio trending menjadi versi baru yang segar dan unik."
          },
          {
            imageSrc: FastIconImage,
            title: "Mixing",
            description: "Proses menggabungkan dan menyeimbangkan semua elemen audio menjadi satu kesatuan yang harmonis."
          },
          {
            imageSrc: ReliableIconImage,
            title: "Mastering",
            description: "Tahap akhir produksi audio: memastikan kualitas suara optimal untuk semua platform."
          },
          {
            imageSrc: CustomizeIconImage,
            title: "Sound Engineering",
            description: "Rekayasa suara profesional — dari perekaman hingga pengelolaan frekuensi dan efek."
          },
          {
            imageSrc: SimpleIconImage,
            title: "Kolaborasi Tim",
            description: "Bekerja sama antar member untuk menciptakan karya audio yang lebih besar dan beragam."
          }
        ]}
      />

    

      {/* ── MAIN FEATURE 1 ── diedit via props di file demo ini */}
      <MainFeature
        subheading="Proses Kerja"
        heading={
          <>
            Dari Ide ke <span tw="text-primary-500">Karya Jadi.</span>
          </>
        }
        description="Di Sopan Remix, setiap karya lahir dari proses yang terstruktur. Dimulai dari produksi beat dan melodi, dilanjutkan mixing multi-track untuk keseimbangan suara, lalu mastering agar hasil akhir terdengar profesional di semua platform streaming maupun konten TikTok."
        primaryButtonText="Join Sopan Remix"
        primaryButtonUrl="/remix/join"
        imageSrc={composeMusicIllustrationSrc}
        buttonRounded={false}
        showPrimaryButton={!currentMember}
      />

      {/* ── MAIN FEATURE 2 ── diedit via props di file demo ini */}
      <MainFeature
        subheading="Sound Engineering"
        heading={
          <>
            Audio Berkualitas di <span tw="text-primary-500">Setiap Karya.</span>
          </>
        }
        description="Sound engineering adalah fondasi kualitas audio Sopan Remix. Member senior kami memastikan setiap rekaman, efek, dan lapisan suara dikelola dengan presisi — menghasilkan output yang jernih, kuat, dan siap dipublikasikan."
        primaryButtonText="Lihat Member"
        primaryButtonUrl="/remix/members"
        imageSrc={playingMusicIllustrationSrc}
        buttonRounded={false}
        textOnLeft={false}
      />

      {/* ── CTA → Dengarkan Karya ── mengarahkan ke halaman daftar karya member (/remix/karya) */}
      <GetStarted
        subheading="Karya Member"
        heading="Sudah Dengar Hasil Karya Kami?"
        primaryLinkText="Dengarkan Karya"
        primaryLinkUrl="/remix/karya"
        secondaryLinkText="Join Sekarang"
        secondaryLinkUrl="/remix/join"
        pushDownFooter={false}
        showSecondaryLink={!currentMember}
      />

      {/* ── TESTIMONIAL → Member Spotlight ── diedit via props di file demo ini */}
      <Testimonial
        subheading="Member Spotlight"
        heading="Cerita dari Tim Kami"
        description="Dengarkan langsung dari member Sopan Remix tentang pengalaman berkarya bersama."
        autoplay
        testimonials={[
          {
            // PLACEHOLDER - ganti dengan data member asli
            name: "Rizky Aditya",
            designation: "Mixing Engineer — Sopan Remix",
            src: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.85&w=512&h=512&q=80",
            quote:
              "Bergabung di Sopan Remix mengubah cara saya memandang produksi musik. Di sini saya belajar mixing dari nol, dapat feedback langsung dari senior, dan akhirnya bisa merilis karya pertama saya yang benar-benar terdengar profesional." // PLACEHOLDER
          },
          {
            // PLACEHOLDER - ganti dengan data member asli
            name: "Daffa Pratama",
            designation: "Producer & Sound Engineer — Sopan Remix",
            src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3.25&w=512&h=512&q=80",
            quote:
              "Komunitas ini memberikan ruang yang tepat untuk tumbuh. Kami saling berbagi ilmu, kolaborasi proyek remix, dan terus mendorong satu sama lain untuk menghasilkan karya terbaik." // PLACEHOLDER
          }
        ]}
      />

      {/* ── FAQ → Syarat & Ketentuan Bergabung ── diedit via props di file demo ini */}
      <FAQ
        subheading="FAQ"
        heading="Syarat & Cara Bergabung"
        description="Pertanyaan umum tentang cara masuk dan aturan di Sopan Remix."
        faqs={[
          {
            question: "Apa syarat utama untuk bergabung di Sopan Remix?",
            answer:
              "Kamu harus bisa menunjukkan minimal 1 karya audio (remix, beat, atau hasil mixing) sebagai portofolio saat mendaftar. Tidak harus sempurna — yang penting menunjukkan minat dan kemampuan dasar di bidang audio."
          },
          {
            question: "Bagaimana cara submit karya untuk seleksi?",
            answer:
              "Isi form Join di halaman daftar, sertakan link karya kamu (SoundCloud, Google Drive, atau platform audio lain). Tim admin akan meninjau dalam 3–7 hari kerja."
          },
          {
            question: "Berapa lama proses review pendaftaran?",
            answer:
              "Estimasi waktu review adalah 3–7 hari kerja. Jika diterima, kamu akan langsung dimasukkan ke grup Sopan Remix dan mendapatkan info onboarding."
          },
          {
            question: "Apakah ada biaya untuk bergabung?",
            answer:
              "Tidak ada biaya apapun. Sopan Remix adalah komunitas terbuka — semua tingkatan (Trainee, Member, Senior) tidak dipungut biaya. Komitmen dan karya adalah satu-satunya 'biaya' yang kami minta."
          },
          {
            question: "Apa perbedaan Trainee, Member, dan Senior?",
            answer:
              "Trainee adalah tingkat awal untuk yang baru belajar. Member untuk kreator yang sudah punya portofolio dan aktif. Senior untuk member berpengalaman yang memimpin proyek dan membimbing anggota baru. Kenaikan level ditentukan oleh aktivitas dan kualitas karya."
          },
          {
            question: "Apakah harus punya software tertentu?",
            answer:
              "Tidak ada ketentuan software wajib. Member Sopan Remix menggunakan berbagai DAW (FL Studio, Audacity, GarageBand, dll). Yang penting adalah hasil audio yang dihasilkan, bukan tools yang dipakai."
          }
        ]}
      />

      {/* ── FOOTER ── FooterRemix: konten & link TikTok Sopan Remix */}
      <Footer />

    </AnimationRevealPage>
  );
}
