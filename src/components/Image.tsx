import { useEffect, useState } from "react";
import RenderIf from "./RenderIf";
import images from "@/assets/imgs";
import { cn } from "@/lib/utils";

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallback?: string;
};

const Image = ({ src, alt = "Image not available", fallback, className, ...props }: ImageProps) => {
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
        <img
          src={imgSrc}
          alt={alt}
          onError={handleError}
          className={cn("rounded-full size-[40px]", className)}
          {...props}
        />
      </RenderIf>
      <RenderIf value={isError}>
        <img src={images.profile} alt="profile" className={cn("rounded-full size-[40px]", className)} />
      </RenderIf>
    </>
  );
};

export default Image;
