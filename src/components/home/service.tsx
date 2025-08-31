import Services from "@/layouts/components/ServicesHome";
import Navbar from "@/layouts/components/nav-home";
import Footer from "@/layouts/components/FooterHome";
import Breadcrumb from "@/layouts/components/Breadcrumb";
import { useTranslation } from "react-i18next";

const ServicesPage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <Navbar />
      <main className="pt-16">
        <Breadcrumb current={t("home.service")} />
        <Services />
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
