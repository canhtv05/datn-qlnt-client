import React from "react";

interface AvatarImageProps {
  src?: string;
  alt: string;
  className?: string;
}

const AvatarImage <AvatarImageProps> = ({ src, alt, className }) => {
  if (!src) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center text-gray-500 text-sm ${className} rounded-full`}
      >
        No Image
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{ objectFit: "cover" }}
    />
  );
};

export default AvatarImage;
