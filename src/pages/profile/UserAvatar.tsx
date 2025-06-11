import React, { useRef } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "@/components/Image";

interface UserAvatarProps {
  profilePicture: string;
  fullName: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ profilePicture, fullName, onImageChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-5 items-center">
      <div className="relative">
        {profilePicture ? (
  <Image
    src={profilePicture}
    alt={fullName}
    className="md:size-[140px] sm:size-[120px] size-[100px] rounded-full"
  />
) : (
  <div className="md:size-[140px] sm:size-[120px] size-[100px] rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
    {/* Có thể hiển thị icon hoặc chữ viết tắt tên */}
    {fullName ? fullName.charAt(0).toUpperCase() : "U"}
  </div>
)}

        <Button
          variant="round"
          size="icon"
          type="button"
          className="absolute bottom-0 right-0"
          onClick={() => fileInputRef.current?.click()}
        >
          <Camera className="text-foreground size-4" />
        </Button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={onImageChange}
        />
      </div>
    </div>
  );
};

export default UserAvatar;
