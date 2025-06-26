import Services from "@/layouts/components/ServicesHome";
import Navbar from "@/layouts/components/nav-home";
import Footer from "@/layouts/components/FooterHome";
import Breadcrumb from "@/layouts/components/Breadcrumb";

const ServicesPage  = () => {
  return (
    <div>
      <Navbar />
       <main className="pt-16">
        <Breadcrumb current="Dịch vụ" />
        <Services />
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
