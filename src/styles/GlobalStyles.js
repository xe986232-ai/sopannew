import { createGlobalStyle } from 'styled-components'
import  { globalStyles } from 'twin.macro'

const GlobalStyles = createGlobalStyle(globalStyles, `
   /* Hilangkan highlight biru/abu-abu bawaan browser saat elemen di-tap
      (paling kelihatan di Chrome/Safari Android & iOS) untuk semua tombol,
      link, dan elemen interaktif di seluruh halaman. */
   * {
     -webkit-tap-highlight-color: transparent;
   }

   /* Hilangkan juga cincin/outline biru yang muncul setelah mouse-klik atau
      tap, TAPI tetap tampilkan outline-nya untuk navigasi keyboard (Tab)
      supaya aksesibilitas tidak rusak. */
   a, button, [role="button"], input, textarea, select {
     -webkit-tap-highlight-color: transparent;
   }
   a:focus:not(:focus-visible),
   button:focus:not(:focus-visible),
   [role="button"]:focus:not(:focus-visible),
   input:focus:not(:focus-visible),
   textarea:focus:not(:focus-visible),
   select:focus:not(:focus-visible) {
     outline: none;
   }

   /* Below animations are for modal created using React-Modal */
     .ReactModal__Overlay {
     transition: transform 300ms ease-in-out;
     transition-delay: 100ms;
     transform: scale(0);
   }
   .ReactModal__Overlay--after-open{
     transform: scale(1);
   }
   .ReactModal__Overlay--before-close{
     transform: scale(0);
   }
`)

export default GlobalStyles
