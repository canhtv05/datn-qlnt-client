import Navbar from "@/layouts/components/nav-home";
import Footer from "@/layouts/components/FooterHome";
import FeaturesSection from "@/layouts/components/FeatureSectionFullHome";
import Breadcrumb from "@/layouts/components/Breadcrumb";
const AboutPage  = () => {
  return (
    <div>
      <Navbar />
      <main className="pt-16">
        <Breadcrumb current="Tính Năng" />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
