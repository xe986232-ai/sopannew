import React from "react";
import tw from "twin.macro";
import { css } from "styled-components/macro"; //eslint-disable-line
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import Hero from "components/hero/TwoColumnWithInput.js";
import { NavLink, NavLinks, PrimaryLink } from "components/headers/light.js";
import Features from "components/features/ThreeColWithSideImage.js";
import MainFeature from "components/features/TwoColWithButton.js";
import MainFeature2 from "components/features/TwoColWithTwoHorizontalFeaturesAndButton.js";
import FeatureWithSteps from "components/features/TwoColWithSteps.js";
import Testimonial from "components/testimonials/TwoColumnWithImageAndRating.js";
import FAQ from "components/faqs/SingleCol.js";
import GetStarted from "components/cta/GetStarted";
import Footer from "components/footers/FooterCreator.js";
import teamIllustrationSrc from "images/team-illustration.svg";
import professionalIllustrationSrc from "images/professional-illustration.svg";
import prototypeIllustrationImageSrc from "images/prototype-illustration.svg";
import { ReactComponent as BriefcaseIcon } from "feather-icons/dist/icons/briefcase.svg";
import { ReactComponent as MoneyIcon } from "feather-icons/dist/icons/dollar-sign.svg";

// ─────────────────────────────────────────────────────────────────────────────
// LANDING PAGE: SOPAN CREATOR
// Demo basis: SaaSProductLandingPage.js
// Urutan section TIDAK berubah dari aslinya: Hero → Features → MainFeature →
//   FeatureWithSteps → MainFeature2 → Pricing → Testimonial → FAQ →
//   GetStarted (CTA) → Footer
// ─────────────────────────────────────────────────────────────────────────────

export default () => {
  const Subheading = tw.span`uppercase tracking-widest font-bold text-primary-500`;
  const HighlightedText = tw.span`text-primary-500`;

  return (
    <AnimationRevealPage>

    {/* ── HERO ── diedit via props (Hero TwoColumnWithInput sudah diupdate untuk
    menerima props heading/description/tombol/links, default tetap sama
    seperti aslinya jika dipanggil tanpa props) */}
<Hero
  roundedHeaderButton={true}
  links={[
    <NavLinks key={1}>
      <NavLink href="/creator">Features</NavLink>
      <NavLink href="/creator/members">Members</NavLink>
      <NavLink href="/creator/login">Login</NavLink>
      <PrimaryLink href="/creator/join">Signup</PrimaryLink>
    </NavLinks>
  ]}
  heading={
    <>
      Sopan Creator — Editing Video <span tw="text-primary-500">Jedag-Jedug.</span>
    </>
  }
  description="Komunitas kreator video di Sopan Team. Belajar dan berkarya bersama menggunakan Alight Motion, dari transisi kreatif hingga sinkronisasi beat."
  showEmailForm={false}
  primaryActionText="Join Sekarang"
  primaryActionUrl="/creator/join"
  secondaryActionText="Sign In"
  secondaryActionUrl="/creator/login"
  showCustomers={false}
/>

      {/* ── FEATURES ── diedit via props di file demo ini */}
      <Features
        subheading={<Subheading>Keahlian Kami</Subheading>}
        heading={
          <>
            Editing Video <HighlightedText>Jedag-Jedug</HighlightedText> Profesional.
          </>
        }
        cards={[
          {
            title: "Alight Motion",
            description: "Kuasai aplikasi editing video Alight Motion untuk membuat konten jedag-jedug yang memukau."
          },
          {
            title: "Sinkronisasi Beat",
            description: "Teknik sinkronisasi video dengan musik — kunci utama konten jedag-jedug yang viral."
          },
          {
            title: "Transisi Kreatif",
            description: "Ratusan preset transisi dan efek visual yang membuat video terasa dinamis dan profesional."
          },
          {
            title: "Color Grading",
            description: "Teknik pewarnaan video agar tampilan konsisten dan sesuai estetika konten TikTok."
          },
          {
            title: "Motion Graphics",
            description: "Tambahkan elemen animasi dan teks bergerak untuk memperkaya visual konten."
          },
          {
            title: "Export & Distribusi",
            description: "Pengaturan render dan distribusi konten optimal untuk TikTok dan platform lainnya."
          }
        ]}
      />

      {/* ── MAIN FEATURE ── diedit via props di file demo ini */}
      <MainFeature
        subheading={<Subheading>Cara Kerja</Subheading>}
        heading={
          <>
            Edit Video Berkualitas <HighlightedText>Bersama Tim.</HighlightedText>
          </>
        }
        description="Di Sopan Creator, setiap video melalui proses edit yang teliti menggunakan Alight Motion. Mulai dari pemilihan audio jedag-jedug, pemotongan adegan, penambahan transisi, hingga color grading — semua dikerjakan dengan standar estetika yang konsisten."
        primaryButtonText="Join Sopan Creator"
        primaryButtonUrl="/creator/join"
        imageSrc={teamIllustrationSrc}
        imageBorder={true}
        imageDecoratorBlob={true}
      />

      {/* ── FEATURE WITH STEPS ── diedit via props di file demo ini */}
      <FeatureWithSteps
        subheading={<Subheading>Langkah-Langkah</Subheading>}
        heading={
          <>
            Mudah untuk <HighlightedText>Bergabung & Berkarya.</HighlightedText>
          </>
        }
        textOnLeft={false}
       imageSrc={professionalIllustrationSrc}
        imageDecoratorBlob={true}
        decoratorBlobCss={tw`xl:w-40 xl:h-40 opacity-15 -translate-x-1/2 left-1/2`}
        steps={[
          {
            heading: "Daftar & Submit Karya",
            description: "Isi form Join dan lampirkan 1 contoh video edit kamu sebagai portofolio pendaftaran."
          },
          {
            heading: "Review oleh Admin",
            description: "Tim admin Sopan Creator akan meninjau karyamu dalam 3–7 hari kerja."
          },
          {
            heading: "Bergabung & Mulai Berkarya",
            description: "Setelah diterima, kamu langsung bergabung di grup dan mulai kolaborasi bareng tim Sopan Creator."
          }
        ]}
      />

      {/* ── MAIN FEATURE 2 ── diedit via props di file demo ini */}
      <MainFeature2
        subheading={<Subheading>Nilai-Nilai Kami</Subheading>}
        heading={
          <>
            Kami Selalu Menjunjung <HighlightedText>Nilai-Nilai Ini.</HighlightedText>
          </>
        }
        imageSrc={prototypeIllustrationImageSrc}
        showDecoratorBlob={false}
        features={[
          {
            Icon: MoneyIcon,
            title: "Kreativitas Tanpa Batas",
            description: "Kami mendorong setiap member untuk bereksperimen dengan gaya dan teknik editing yang unik.",
            iconContainerCss: tw`bg-green-300 text-green-800`
          },
          {
            Icon: BriefcaseIcon,
            title: "Konsistensi & Dedikasi",
            description: "Konten berkualitas lahir dari konsistensi. Kami saling mengingatkan untuk terus produktif.",
            iconContainerCss: tw`bg-red-300 text-red-800`
          }
        ]}
      />

      

      {/* ── TESTIMONIAL → Member Spotlight ── diedit via props di file demo ini */}
      <Testimonial
        subheading={<Subheading>Member Spotlight</Subheading>}
        heading={
          <>
            Member Kami <HighlightedText>Bercerita.</HighlightedText>
          </>
        }
        testimonials={[
          {
            stars: 5,
            // PLACEHOLDER - ganti dengan foto & data member asli
            profileImageSrc:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3.25&w=512&h=512&q=80",
            heading: "Editing Makin Cepat & Efisien!",
            quote:
              "Gabung di Sopan Creator bener-bener ngebuka mata aku soal dunia editing video. Belajar Alight Motion dari nol, sekarang udah bisa bikin konten jedag-jedug yang tembus ribuan view di TikTok!", // PLACEHOLDER
            customerName: "Aulia Rahmawati", // PLACEHOLDER
            customerTitle: "Video Editor — Sopan Creator" // PLACEHOLDER
          },
          {
            stars: 5,
            // PLACEHOLDER - ganti dengan foto & data member asli
            profileImageSrc:
              "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=512&h=512&q=80",
            heading: "Komunitas yang Supportif Banget",
            quote:
              "Yang bikin aku betah di Sopan Creator adalah komunitasnya. Senior-senior di sini selalu mau ngajarin dan share ilmu. Progress aku naik drastis cuma dalam 2 bulan bergabung.", // PLACEHOLDER
            customerName: "Fauzan Ardiansyah", // PLACEHOLDER
            customerTitle: "Video Editor — Sopan Creator" // PLACEHOLDER
          }
        ]}
      />

      {/* ── FAQ → Syarat Bergabung ── diedit via props di file demo ini */}
      <FAQ
        subheading={<Subheading>FAQ</Subheading>}
        heading={
          <>
            Pertanyaan <HighlightedText>Umum?</HighlightedText>
          </>
        }
        faqs={[
          {
            question: "Apa syarat bergabung di Sopan Creator?",
            answer:
              "Kamu harus melampirkan minimal 1 video edit (jedag-jedug atau gaya lain) sebagai portofolio. Video bisa diupload ke TikTok, Google Drive, atau platform video lain. Skill awal tidak harus sempurna — yang penting ada semangat belajar."
          },
          {
            question: "Harus menggunakan Alight Motion?",
            answer:
              "Tidak wajib, tapi Alight Motion adalah tools utama yang digunakan di Sopan Creator. Banyak tutorial dan resource yang kami bagikan spesifik untuk Alight Motion. Boleh pakai tools lain, tapi untuk kolaborasi tim biasanya kita pakai Alight Motion."
          },
          {
            question: "Bagaimana proses review pendaftaran?",
            answer:
              "Setelah kamu submit form Join beserta link video, tim admin akan meninjau dalam 3–7 hari kerja. Jika diterima, kamu akan dapat notifikasi dan langsung dimasukkan ke grup Sopan Creator."
          },
          {
            question: "Apakah ada biaya untuk bergabung?",
            answer:
              "Tidak ada biaya sama sekali. Sopan Creator adalah komunitas belajar dan berkarya yang sepenuhnya gratis. Modal yang dibutuhkan hanya semangat dan konsistensi."
          },
          {
            question: "Seberapa sering harus upload konten?",
            answer:
              "Tidak ada kewajiban upload dengan frekuensi tertentu untuk Trainee. Namun untuk naik ke level Member, konsistensi berkarya menjadi salah satu penilaian utama dari tim admin."
          },
          {
            question: "Apakah bisa bergabung kalau belum punya akun TikTok?",
            answer:
              "Sangat disarankan untuk punya akun TikTok karena platform utama distribusi karya Sopan Creator adalah TikTok. Namun untuk tahap awal pendaftaran, yang terpenting adalah portofolio video editmu."
          }
        ]}
      />

      {/* ── CTA (GetStarted) ── diarahkan ke /creator/join */}
      <GetStarted
        text="Siap bergabung dengan Sopan Creator?"
        primaryLinkText="Daftar Sekarang"
        primaryLinkUrl="/creator/join"
        secondaryLinkText="Lihat Member"
        secondaryLinkUrl="/creator/members"
      />

      {/* ── FOOTER ── FooterCreator: konten & link TikTok Sopan Creator */}
      <Footer />

    </AnimationRevealPage>
  );
}
