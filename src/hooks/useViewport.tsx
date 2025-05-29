import { useEffect, useState } from "react";

interface ViewportType {
  width: number;
  height: number;
}

export default function useViewport() {
  const [viewPort, setViewPort] = useState<ViewportType>({
    width: window.innerWidth || 0,
    height: window.innerHeight || 0,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => setViewPort({ width: window.innerWidth, height: window.innerHeight });

      setViewPort({ width: window.innerWidth, height: window.innerHeight });
      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return {
    width: viewPort.width,
    height: viewPort.height,
  };
}
