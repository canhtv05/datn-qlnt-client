import Navbar from "@/layouts/components/nav-home";
import Footer from "@/layouts/components/FooterHome";
import Policy from "@/layouts/components/PolicyHome";
import Breadcrumb from "@/layouts/components/Breadcrumb";
import PolicyBanner from "@/layouts/components/BannerPolicy";
import { useTranslation } from "react-i18next";
const PolicyPage = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-white text-gray-900">
      <Navbar />
      <main className="pt-16">
        <Breadcrumb current={t("home.policy")} />
        <PolicyBanner />
        <Policy />
      </main>
      <Footer />
    </div>
  );
};

export default PolicyPage;
