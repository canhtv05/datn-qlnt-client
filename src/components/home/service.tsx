import React from "react";
import Services from "@/layouts/components/services-home";
import Navbar from "@/layouts/components/nav-home";
import Footer from "@/layouts/components/footer-home";
const ServicesPage: React.FC = () => {
  return (
    <div>
      <Navbar />
        <Services />
      <Footer />
    </div>
  );
};

export default ServicesPage;
