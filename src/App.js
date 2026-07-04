import React from "react";
import GlobalStyles from 'styles/GlobalStyles';
import { css } from "styled-components/macro"; //eslint-disable-line

/*
 * This is the entry point component of this project. You can change the below exported default App component to any of
 * the prebuilt landing page components by uncommenting their import and export lines respectively.
 * See one of the landing page components to better understand how to import and render different components (Always
 * make sure if you are building your own page, the root component should be the AnimationRevealPage component. You can
 * disable the animation by using the disabled prop.
 *
 * The App component below is using React router to render the landing page that you see on the live demo website
 * and the component previews.
 *
 */

/* Use AnimationRevealPage as a wrapper component for your pages if you are building a custom one yourself */
// import AnimationRevealPage from "helpers/AnimationRevealPage.js";

/*
 * Hero section is the top most section on the page. It contains the header as well.
 * So you dont need to import headers
 * separately
 */

// import Hero from "components/hero/TwoColumnWithVideo.js";
// import Hero from "components/hero/TwoColumnWithInput.js";
// import Hero from "components/hero/TwoColumnWithFeaturesAndTestimonial.js";
// import Hero from "components/hero/TwoColumnWithPrimaryBackground.js";
// import Hero from "components/hero/FullWidthWithImage.js";
// import Hero from "components/hero/BackgroundAsImage.js";
// import Hero from "components/hero/BackgroundAsImageWithCenteredContent.js";

// import Features from "components/features/ThreeColSimple.js";
// import Features from "components/features/ThreeColWithSideImage.js";
// import Features from "components/features/ThreeColWithSideImageWithPrimaryBackground.js";
// import Features from "components/features/VerticalWithAlternateImageAndText.js";
// import Features from "components/features/DashedBorderSixFeatures";
// import MainFeature from "components/features/TwoColWithButton.js";
// import MainFeature from "components/features/TwoColSingleFeatureWithStats.js";
// import MainFeature2 from "components/features/TwoColSingleFeatureWithStats2.js";
// import MainFeature from "components/features/TwoColWithTwoHorizontalFeaturesAndButton.js";
// import FeatureWithSteps from "components/features/TwoColWithSteps.js";
// import FeatureStats from "components/features/ThreeColCenteredStatsPrimaryBackground.js";

// import Pricing from "components/pricing/ThreePlans.js";
// import Pricing from "components/pricing/ThreePlansWithHalfPrimaryBackground.js";
// import Pricing from "components/pricing/TwoPlansWithDurationSwitcher.js";

// import SliderCard from "components/cards/ThreeColSlider.js";
// import TrendingCard from "components/cards/TwoTrendingPreviewCardsWithImage.js";
// import Portfolio from "components/cards/PortfolioTwoCardsWithImage.js";
// import TabGrid from "components/cards/TabCardGrid.js";

// import Blog from "components/blogs/ThreeColSimpleWithImage.js";
// import Blog from "components/blogs/ThreeColSimpleWithImageAndDashedBorder.js";
// import Blog from "components/blogs/PopularAndRecentBlogPosts.js";
// import Blog from "components/blogs/GridWithFeaturedPost.js";

// import Testimonial from "components/testimonials/TwoColumnWithImage.js";
// import Testimonial from "components/testimonials/TwoColumnWithImageAndProfilePictureReview.js";
// import Testimonial from "components/testimonials/TwoColumnWithImageAndRating.js";
// import Testimonial from "components/testimonials/ThreeColumnWithProfileImage.js";
// import Testimonial from "components/testimonials/SimplePrimaryBackground.js";

// import FAQ from "components/faqs/SimpleWithSideImage.js";
// import FAQ from "components/faqs/SingleCol.js";
// import FAQ from "components/faqs/TwoColumnPrimaryBackground.js";

// import ContactUsForm from "components/forms/SimpleContactUs.js";
// import ContactUsForm from "components/forms/TwoColContactUsWithIllustration.js";
// import SubscribeNewsLetterForm from "components/forms/SimpleSubscribeNewsletter.js";
//
// import GetStarted from "components/cta/GetStarted.js";
// import GetStarted from "components/cta/GetStartedLight.js";
// import DownloadApp from "components/cta/DownloadApp.js";

// import Footer from "components/footers/SimpleFiveColumn.js";
// import Footer from "components/footers/FiveColumnWithInputForm.js";
// import Footer from "components/footers/FiveColumnWithBackground.js";
// import Footer from "components/footers/FiveColumnDark.js";
// import Footer from "components/footers/MiniCenteredFooter.js";

/* Ready Made Pages (from demos folder) */
// import EventLandingPage from "demos/EventLandingPage.js";
// import HotelTravelLandingPage from "demos/HotelTravelLandingPage.js";
// import AgencyLandingPage from "demos/AgencyLandingPage.js";
// import SaaSProductLandingPage from "demos/SaaSProductLandingPage.js";
// import RestaurantLandingPage from "demos/RestaurantLandingPage.js";
// import ServiceLandingPage from "demos/ServiceLandingPage.js";
// import HostingCloudLandingPage from "demos/HostingCloudLandingPage.js";

/* Inner Pages */
// import LoginPage from "pages/Login.js";
// import SignupPage from "pages/Signup.js";
// import PricingPage from "pages/Pricing.js";
// import AboutUsPage from "pages/AboutUs.js";
// import ContactUsPage from "pages/ContactUs.js";
// import BlogIndexPage from "pages/BlogIndex.js";
// import TermsOfServicePage from "pages/TermsOfService.js";
// import PrivacyPolicyPage from "pages/PrivacyPolicy.js";

import ComponentRenderer from "ComponentRenderer.js";
import MainLandingPage from "MainLandingPage.js";
import ThankYouPage from "ThankYouPage.js";

// ── Sopan Team: Absensi ──
import Absensi from "pages/Absensi.js";
import AbsensiAdmin from "pages/AbsensiAdmin.js";

// ── Sopan Team: Hub ──
// TEMP: belum dibuat Antigravity, dikomentari dulu supaya build tidak error.
import HubPage from "pages/HubPage.js";

// ── Sopan Remix ──
import SopanRemixPage from "demos/HostingCloudLandingPage.js";
import LoginRemix from "pages/LoginRemix.js";
import SignupRemix from "pages/SignupRemix.js";
import MembersRemix from "pages/MembersRemix.js";
import MemberProfileRemix from "pages/MemberProfileRemix.js";

// ── Sopan Creator ──
import SopanCreatorPage from "demos/SaaSProductLandingPage.js";
import LoginCreator from "pages/LoginCreator.js";
import SignupCreator from "pages/SignupCreator.js";
import MembersCreator from "pages/MembersCreator.js";
import MemberProfileCreator from "pages/MemberProfileCreator.js";
import KaryaRemix from "pages/KaryaRemix.js";


// ── Sopan Leadies ──
// TEMP: belum dibuat Antigravity, dikomentari dulu supaya build tidak error.
// import SopanLeadiesPage from "demos/ServiceLandingPage.js";
// import LoginLeadies from "pages/LoginLeadies.js";
// import SignupLeadies from "pages/SignupLeadies.js";
// import MembersLeadies from "pages/MembersLeadies.js";
// import MemberProfileLeadies from "pages/MemberProfileLeadies.js";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  // If you want to disable the animation just use the disabled `prop` like below on your page's component
  // return <AnimationRevealPage disabled>xxxxxxxxxx</AnimationRevealPage>;


  return (
    <>
      <GlobalStyles />
      <Router>
        <Routes>
          {/* ── Template existing routes (dipertahankan) ── */}
          <Route path="/components/:type/:subtype/:name" element={<ComponentRenderer />} />
          <Route path="/components/:type/:name" element={<ComponentRenderer />} />
          <Route path="/thank-you" element={<ThankYouPage />} />

          {/* ── Sopan Team: Hub ── */}
          {/* TEMP: sementara arahkan "/" ke landing Remix dulu, sambil nunggu HubPage.js dibuat */}
          {/* <Route path="/" element={<SopanRemixPage />} /> */}
          <Route path="/" element={<HubPage />} />

          {/* ── Sopan Team: Absensi ── */}
          <Route path="/absensi" element={<Absensi />} />
          <Route path="/absensi/admin" element={<AbsensiAdmin />} />

          {/* ── Sopan Remix ── */}
          <Route path="/remix" element={<SopanRemixPage />} />
          <Route path="/remix/login" element={<LoginRemix />} />
          <Route path="/remix/join" element={<SignupRemix />} />
          <Route path="/remix/members" element={<MembersRemix />} />
          <Route path="/remix/members/:id" element={<MemberProfileRemix />} />

          {/* ── Sopan Creator ── */}
          <Route path="/creator" element={<SopanCreatorPage />} />
          <Route path="/creator/login" element={<LoginCreator />} />
          <Route path="/creator/join" element={<SignupCreator />} />
          <Route path="/creator/members" element={<MembersCreator />} />
          <Route path="/creator/members/:id" element={<MemberProfileCreator />} />
          <Route path="/remix/karya" element={<KaryaRemix />} />

          {/* ── Sopan Leadies ── */}
          {/* TEMP: belum ada file-nya, route ini dinonaktifkan dulu supaya tidak error.
              Aktifkan lagi (uncomment import di atas + route di bawah) setelah Antigravity
              selesai bikin LoginLeadies.js, SignupLeadies.js, MembersLeadies.js, MemberProfileLeadies.js */}
          {/*
          <Route path="/leadies" element={<SopanLeadiesPage />} />
          <Route path="/leadies/login" element={<LoginLeadies />} />
          <Route path="/leadies/join" element={<SignupLeadies />} />
          <Route path="/leadies/members" element={<MembersLeadies />} />
          <Route path="/leadies/members/:id" element={<MemberProfileLeadies />} />
          */}
        </Routes>
      </Router>
    </>
  );
}

// export default EventLandingPage;
// export default HotelTravelLandingPage;
// export default AgencyLandingPage;
// export default SaaSProductLandingPage;
// export default RestaurantLandingPage;
// export default ServiceLandingPage;
// export default HostingCloudLandingPage;

// export default LoginPage;
// export default SignupPage;
// export default PricingPage;
// export default AboutUsPage;
// export default ContactUsPage;
// export default BlogIndexPage;
// export default TermsOfServicePage;
// export default PrivacyPolicyPage;

// export default MainLandingPage;
