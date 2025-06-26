import Navbar from "@/layouts/components/nav-home";
import Slider from "@/layouts/components/SliderHome";
import HeroSection from "@/layouts/components/HeroSectionHome";
import FeaturesSection from "@/layouts/components/FeatureSectionHome";
import HowItWorks from "@/layouts/components/HowItWorksHome";
import CallToAction from "@/layouts/components/CallToActionHome";
import Footer from "@/layouts/components/FooterHome";
import MotionFadeIn from "@/components/ui/MotionFadeIn";

const Home = () => {
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <HeroSection />
        <Slider />
        <FeaturesSection />
      <HowItWorks />
      <MotionFadeIn delay={0.4} y={100}>
        <CallToAction />
      </MotionFadeIn>
      <Footer />
    </div>
  );
};

export default Home;
