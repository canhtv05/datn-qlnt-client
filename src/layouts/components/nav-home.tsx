import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Logo from "@/components/Logo";
const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#28a745] shadow-md fixed top-0 left-0 w-full z-20">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div
          className="cursor-pointer hover:scale-105 transition-transform duration-300"
          onClick={() => navigate("/")}
        >
          <Logo />
        </div>
        <div className="flex items-center space-x-6">
          <nav className="space-x-6 hidden md:flex text-white text-sm font-medium">
            {[
              { label: "Trang chủ", to: "/" },
              { label: "Tính năng", to: "/features" },
              { label: "Dịch vụ", to: "/services" },
              { label: "Liên hệ", to: "/contact" },
            ].map((item, i) => (
              <Link
                key={i}
                to={item.to}
                className="hover:underline hover:underline-offset-4 hover:text-white/90 transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex space-x-2 items-center">
            <button
              onClick={() => navigate("/login")}
              className="text-white border border-white px-4 py-1.5 rounded-md hover:bg-white hover:text-[#28a745] transition-all duration-300 text-sm shadow-sm hover:shadow-lg"
            >
              Đăng nhập
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-white text-[#28a745] px-4 py-1.5 rounded-md hover:bg-gray-100 transition-all duration-300 text-sm font-semibold shadow-sm hover:shadow-lg"
            >
              Đăng ký
            </button>
          </div>
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#28a745] px-4 pb-4 text-white text-sm font-medium overflow-hidden"
          >
            <div className="space-y-2 py-2">
              <Link to="/" className="block hover:underline hover:underline-offset-4">
                Trang chủ
              </Link>
              <Link to="/features" className="block hover:underline hover:underline-offset-4">
                Tính năng
              </Link>
              <Link to="/services" className="block hover:underline hover:underline-offset-4">
                Dịch vụ
              </Link>
              <Link to="/contact" className="block hover:underline hover:underline-offset-4">
                Liên hệ
              </Link>
            </div>
            <div className="pt-3 border-t border-white/30 space-y-2 mt-2">
              <button
                onClick={() => navigate("/login")}
                className="w-full text-left text-white border border-white px-3 py-2 rounded-md hover:bg-white hover:text-[#28a745] transition-all duration-300 shadow-sm hover:shadow-lg"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => navigate("/register")}
                className="w-full text-left bg-white text-[#28a745] px-3 py-2 rounded-md hover:bg-gray-100 transition-all duration-300 font-semibold shadow-sm hover:shadow-lg"
              >
                Đăng ký
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
