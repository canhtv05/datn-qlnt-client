import React from "react";
import Navbar from "@/layouts/components/nav-home";
import Footer from "@/layouts/components/footer-home";
import FeaturesSection from "@/layouts/components/features-section-home";
const AboutPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default AboutPage;
