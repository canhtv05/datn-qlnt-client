import Services from "@/layouts/components/ServicesHome";
import Navbar from "@/layouts/components/NavHome";
import Footer from "@/layouts/components/FooterHome";
const ServicesPage  = () => {
  return (
    <div>
      <Navbar />
        <Services />
      <Footer />
    </div>
  );
};

export default ServicesPage;
