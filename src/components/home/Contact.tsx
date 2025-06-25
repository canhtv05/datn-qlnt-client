import Contact from "@/layouts/components/ContactHome";
import Navbar from "@/layouts/components/nav-home";
import Footer from "@/layouts/components/FooterHome";
import Breadcrumb from "@/layouts/components/Breadcrumb";
const contactPage = () => {
  return (
    <div>
      <Navbar />
      <main className="pt-16">
        <Breadcrumb current="Thông tin liên hệ" />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default contactPage;
