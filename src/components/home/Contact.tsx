import Contact from "@/layouts/components/ContactHome";
import Navbar from "@/layouts/components/nav-home";
import Footer from "@/layouts/components/FooterHome";
import Breadcrumb from "@/layouts/components/Breadcrumb";
import { useTranslation } from "react-i18next";

const ContactPage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <Navbar />
      <main className="pt-16">
        <Breadcrumb current={t("home.contract")} />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
