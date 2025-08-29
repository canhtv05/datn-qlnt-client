import Navbar from "@/layouts/components/nav-home";
import Footer from "@/layouts/components/FooterHome";
import FeaturesSection from "@/layouts/components/FeatureSectionFullHome";
import Breadcrumb from "@/layouts/components/Breadcrumb";
import { useTranslation } from "react-i18next";
const AboutPage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <Navbar />
      <main className="pt-16">
        <Breadcrumb current={t("home.feature")} />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
