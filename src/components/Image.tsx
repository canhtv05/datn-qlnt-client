import { ImgHTMLAttributes, useEffect, useState } from "react";
import images from "@/assets/imgs";
import { cn } from "@/lib/utils";

type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fallback?: string;
};

const Image = ({ src, alt = "Image not available", fallback, className, ...props }: ImageProps) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src);

  useEffect(() => {
    if (src) {
      setImgSrc(src);
    }
  }, [src]);

  const handleError = () => {
    if (fallback && imgSrc !== fallback) {
      setImgSrc(fallback);
    } else {
      setImgSrc(images.profile);
    }
  };

  return (
    <img
      src={imgSrc || images.profile}
      alt={alt}
      onError={handleError}
      className={cn("rounded-full size-[40px] object-cover", className)}
      {...props}
    />
  );
};

export default Image;
