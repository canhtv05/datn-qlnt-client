import Services from "@/layouts/components/ServicesHome";
import Navbar from "@/layouts/components/nav-Home";
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
