import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import Hero from "components/hero/TwoColumnWithPrimaryBackground.js";
import Features from "components/features/ThreeColWithSideImageWithPrimaryBackground.js";
import MainFeature from "components/features/TwoColWithButton.js";
import Testimonial from "components/testimonials/SimplePrimaryBackground.js";
import FAQ from "components/faqs/TwoColumnPrimaryBackground.js";
import GetStarted from "components/cta/GetStartedLight.js";
import Footer from "components/footers/FooterRemix.js";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts.js";
import { SectionHeading, Subheading } from "components/misc/Headings.js";
import serverillustration2ImageSrc from "images/server-illustration-2.svg"
import serverSecureIllustrationImageSrc from "images/server-secure-illustration.svg"
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
// TIM SOPAN REMIX — 3 blob shapes (di bawah section "Lihat Member")
// CATATAN: `clip-path: shape(...)` masih CSS eksperimental (baru didukung
// browser Chromium terbaru). Di browser yang belum support, elemen otomatis
// tampil sebagai kotak biasa (graceful fallback, bukan error/hilang).
// ─────────────────────────────────────────────────────────────────────────────
const TeamHeadingContainer = tw.div`text-center mb-10`;
const BlobsRow = tw.div`flex flex-col sm:flex-row items-center sm:items-start justify-center gap-16 sm:gap-8 md:gap-16 mt-4`;
const BlobCard = tw.div`flex flex-col items-center max-w-xs`;
const BlobBase = styled.div`
  ${tw`w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 flex items-center justify-center shadow-xl flex-shrink-0`}
  aspect-ratio: 1;
`;
// 1. Pendiri Team
const BlobFounder1 = styled(BlobBase)`
  background: linear-gradient(135deg, #935bff 0%, #5a13e6 100%);
  clip-path: shape(from 89.69% 38.40%,curve to 89.79% 61.67% with 97.46% 50.00%,smooth to 72.56% 81.67%,smooth to 49.32% 92.09%,smooth to 25.57% 84.63%,smooth to 11.60% 62.54%,smooth to 9.74% 36.12%,smooth to 23.74% 14.09%,smooth to 49.98% 6.02%,smooth to 73.10% 16.44%,smooth to 89.69% 38.40%);
`;
// 2. Pendiri Team 2
const BlobFounder2 = styled(BlobBase)`
  background: linear-gradient(135deg, #8344ff 0%, #460fb3 100%);
  clip-path: shape(from 87.55% 38.41%,curve to 88.26% 62.10% with 93.20% 50.00%,smooth to 72.73% 80.80%,smooth to 49.03% 90.38%,smooth to 23.93% 85.50%,smooth to 8.80% 63.82%,smooth to 11.44% 38.09%,smooth to 25.98% 14.60%,smooth to 49.63% 4.14%,smooth to 73.21% 16.05%,smooth to 87.55% 38.41%);
`;
// 3. Admin Team
const BlobAdmin = styled(BlobBase)`
  background: linear-gradient(135deg, #742cff 0%, #3c0d99 100%);
  clip-path: shape(from 28.85% 13.04%,curve to 56.06% 7.86% with 42.06% 8.35%,smooth to 79.70% 17.87%,smooth to 90.81% 41.85%,smooth to 85.69% 66.34%,smooth to 68.21% 82.83%,smooth to 43.97% 89.74%,smooth to 22.24% 80.52%,smooth to 12.80% 57.52%,smooth to 13.70% 31.45%,smooth to 28.85% 13.04%);
`;
const BlobInitial = tw.span`text-white text-4xl sm:text-5xl font-black select-none`;
const BlobLabel = tw.p`mt-6 text-lg font-bold text-gray-900 text-center`;

export default () => {
  return (
    <AnimationRevealPage>

      {/* ── HERO ── diedit via props di file demo ini */}
      <Hero
        heading="Sopan Remix — Komunitas Musik Digital"
        description="Divisi musik dari Sopan Team, tempat berkumpulnya para kreator audio: producer, mixing engineer, dan sound engineer yang berkarya bersama di dunia digital."
        primaryButtonText="Join Sekarang"
        primaryButtonUrl="/remix/join"
      />

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
        imageSrc={serverillustration2ImageSrc}
        buttonRounded={false}
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
        imageSrc={serverSecureIllustrationImageSrc}
        buttonRounded={false}
        textOnLeft={false}
      />

      {/* ── TIM SOPAN REMIX ── 3 blob shapes custom, ditaruh di bawah section "Lihat Member" ── */}
      <Container>
        <ContentWithPaddingXl>
          <TeamHeadingContainer>
            <Subheading>Tim Sopan Remix</Subheading>
            <SectionHeading>Orang-Orang di Balik Sopan Remix</SectionHeading>
          </TeamHeadingContainer>
          <BlobsRow>
            <BlobCard>
              <BlobFounder1>
                <BlobInitial>P</BlobInitial>
              </BlobFounder1>
              <BlobLabel>Pendiri Team</BlobLabel>
            </BlobCard>
            <BlobCard>
              <BlobFounder2>
                <BlobInitial>P</BlobInitial>
              </BlobFounder2>
              <BlobLabel>Pendiri Team 2</BlobLabel>
            </BlobCard>
            <BlobCard>
              <BlobAdmin>
                <BlobInitial>A</BlobInitial>
              </BlobAdmin>
              <BlobLabel>Admin Team</BlobLabel>
            </BlobCard>
          </BlobsRow>
        </ContentWithPaddingXl>
      </Container>

      {/* ── CTA → Dengarkan Karya ── mengarahkan ke halaman daftar karya member (/remix/karya) */}
      <GetStarted
        subheading="Karya Member"
        heading="Sudah Dengar Hasil Karya Kami?"
        primaryLinkText="Dengarkan Karya"
        primaryLinkUrl="/remix/karya"
        secondaryLinkText="Join Sekarang"
        secondaryLinkUrl="/remix/join"
        pushDownFooter={false}
      />

      {/* ── TESTIMONIAL → Member Spotlight ── diedit via props di file demo ini */}
      <Testimonial
        subheading="Member Spotlight"
        heading="Cerita dari Tim Kami"
        description="Dengarkan langsung dari member Sopan Remix tentang pengalaman berkarya bersama."
        testimonials={[
          {
            // PLACEHOLDER - ganti dengan data member asli
            customerName: "Rizky Aditya",
            customerProfile: "Mixing Engineer — Sopan Remix",
            imageSrc: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.85&w=256&h=256&q=80",
            quote:
              "Bergabung di Sopan Remix mengubah cara saya memandang produksi musik. Di sini saya belajar mixing dari nol, dapat feedback langsung dari senior, dan akhirnya bisa merilis karya pertama saya yang benar-benar terdengar profesional." // PLACEHOLDER
          },
          {
            // PLACEHOLDER - ganti dengan data member asli
            customerName: "Daffa Pratama",
            customerProfile: "Producer & Sound Engineer — Sopan Remix",
            imageSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3.25&w=256&h=256&q=80",
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
