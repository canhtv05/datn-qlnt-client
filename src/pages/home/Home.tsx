import Navbar from "@/layouts/components/nav-home";
import Slider from "@/layouts/components/slider-home";
import HeroSection from "@/layouts/components/hero-section-home";
import FeaturesSection  from "@/layouts/components/features-section-home";
import HowltWorks from "@/layouts/components/how-it-works-home";
import CallToAction from "@/layouts/components/call-to-action-home";
import Footer from "@/layouts/components/footer-home";
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
