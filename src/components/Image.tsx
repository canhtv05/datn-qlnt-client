import { useEffect, useState } from "react";
import RenderIf from "./RenderIf";
import { NoImageIcon } from "@/assets/icons";
import useTheme from "@/hooks/useTheme";

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallback?: string;
};

const Image = ({ src, alt = "Image not available", fallback, className, ...props }: ImageProps) => {
  const { theme } = useTheme();
  const [imgSrc, setImgSrc] = useState(src);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!imgSrc || !src) {
      setIsError(true);
    }
  }, [imgSrc, src]);

  const handleError = () => {
    if (fallback) {
      setImgSrc(fallback);
    } else {
      setIsError(true);
    }
  };

  return (
    <>
      <RenderIf value={!isError}>
        <img src={imgSrc} alt={alt} onError={handleError} className={className} {...props} />
      </RenderIf>
      <RenderIf value={isError}>
        <NoImageIcon stroke={`${theme === "dark" ? "white" : "black"}`} />
      </RenderIf>
    </>
  );
};

export default Image;
