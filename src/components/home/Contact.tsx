import React from "react";
import Contact from "@/layouts/components/contact-home";
import Navbar from "@/layouts/components/nav-home";
import Footer from "@/layouts/components/footer-home";
const contactPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Contact />
      <Footer />
    </div>
  );
};

export default contactPage;
