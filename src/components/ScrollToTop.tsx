import { useEffect, useRef, useState } from "react";
import { ChevronsUp } from "lucide-react";

const ScrollToTop = () => {
  const [showButton, setShowButton] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = () => {
    const scrollTop = window.scrollY;

    setShowButton(scrollTop >= 100);

    setIsScrolling(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 500);
  };

  const onScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!showButton) return null;

  return (
    <button
      onClick={onScrollToTop}
      className={`${
        isScrolling ? "bg-primary/40" : "bg-primary"
      } fixed bottom-3 right-3 z-50 rounded-full hover:shadow-primary p-2 cursor-pointer border duration-200 transition-colors`}
    >
      <ChevronsUp className="size-5 text-white" />
    </button>
  );
};

export default ScrollToTop;
