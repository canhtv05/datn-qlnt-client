import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#28a745] shadow-md fixed top-0 left-0 w-full z-20">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="cursor-pointer" onClick={() => navigate("/")}>
          <Logo />
        </div>
        <div className="flex items-center space-x-6">
          <nav className="space-x-6 hidden md:flex text-white text-sm font-medium">
            <Link to="/" className="block hover:text-gray-100">
              Trang chủ
            </Link>
            <Link to="/features" className="block hover:text-gray-100">
              Tính năng
            </Link>
            <Link to="/services" className="block hover:text-gray-100">
              Dịch vụ
            </Link>
            <Link to="/contact" className="block hover:text-gray-100">
              Liên hệ
            </Link>
          </nav>

          <div className="hidden md:flex space-x-2 items-center">
            <button
              onClick={() => navigate("/login")}
              className="text-white border border-white px-3 py-1.5 rounded-md hover:bg-white hover:text-[#28a745] transition text-sm"
            >
              Đăng nhập
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-white text-[#28a745] px-4 py-1.5 rounded-md hover:bg-gray-100 transition text-sm font-semibold"
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
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#28a745] px-4 pb-4 space-y-2 text-white text-sm font-medium">
          <Link to="/" className="block hover:text-gray-100">
            Trang chủ
          </Link>
          <Link to="/features" className="block hover:text-gray-100">
            Tính năng
          </Link>
          <Link to="/services" className="block hover:text-gray-100">
            Dịch vụ
          </Link>
          <Link to="/contact" className="block hover:text-gray-100">
            Liên hệ
          </Link>
          <div className="pt-2 border-t border-white/30 space-y-2">
            <button
              onClick={() => navigate("/login")}
              className="w-full text-left text-white border border-white px-3 py-2 rounded-md hover:bg-white hover:text-[#28a745] transition"
            >
              Đăng nhập
            </button>
            <button
              onClick={() => navigate("/register")}
              className="w-full text-left bg-white text-[#28a745] px-3 py-2 rounded-md hover:bg-gray-100 transition font-semibold"
            >
              Đăng ký
            </button>
          </div>
        </div>
      )}
    </header>
  )
};

export default Navbar;
