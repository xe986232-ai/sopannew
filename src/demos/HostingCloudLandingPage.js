import React from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import Hero from "components/hero/TwoColumnWithPrimaryBackground.js";
import Features from "components/features/ThreeColWithSideImageWithPrimaryBackground.js";
import MainFeature from "components/features/TwoColWithButton.js";
import Testimonial from "components/testimonials/SimplePrimaryBackground.js";
import FAQ from "components/faqs/TwoColumnPrimaryBackground.js";
import Footer from "components/footers/FooterRemix.js";
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
// Urutan section TIDAK berubah dari aslinya: Hero → Features → Pricing →
//   MainFeature × 2 → Testimonial → FAQ → Footer
// ─────────────────────────────────────────────────────────────────────────────

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
