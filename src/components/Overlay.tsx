import { cn } from "@/lib/utils";
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type OverlayProps = {
  children: ReactNode;
};

const Overlay = ({ children }: OverlayProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate(-1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) navigate(-1);
      }}
    >
      <div className={cn("relative mx-auto max-w-full w-full sm:w-auto")}>{children}</div>
    </div>
  );
};

export default Overlay;
