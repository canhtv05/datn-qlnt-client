import Navbar from "@/layouts/components/NavHome";
import Slider from "@/layouts/components/SliderHome";
import HeroSection from "@/layouts/components/HeroSectionHome";
import FeaturesSection  from "@/layouts/components/FeatureSectionHome";
import HowltWorks from "@/layouts/components/HowItWorksHome";
import CallToAction from "@/layouts/components/CallToActionHome";
import Footer from "@/layouts/components/FooterHome";
import MotionFadeIn from "@/components/ui/MotionFadeIn";

const Home  = () => {
  return (
    <div >
      <Navbar />
        <HeroSection />
     <MotionFadeIn>
        <Slider />
      </MotionFadeIn>

      <MotionFadeIn>
        <FeaturesSection />
      </MotionFadeIn>

      <MotionFadeIn>
        <HowltWorks />
      </MotionFadeIn>

      <MotionFadeIn delay={0.4} y={100}>
        <CallToAction />
      </MotionFadeIn>
      <Footer />
    </div>
  );
};

export default Home;
