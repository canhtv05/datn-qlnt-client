import Navbar from "@/layouts/components/nav-Home";
import Footer from "@/layouts/components/FooterHome";
import Policy from "@/layouts/components/PolicyHome";

const PolicyPage = () => {
  return (
    <div className="bg-white text-gray-900">
      <Navbar />
      <main className="pt-20">
        <Policy />
      </main>
      <Footer />
    </div>
  );
};

export default PolicyPage;
