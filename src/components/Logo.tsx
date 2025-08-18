// import { cn } from "@/lib/utils";

// const Logo = ({ className, tro, hub }: { className?: string; tro?: string; hub?: string }) => {
//   return (
//     <div className="mt-2">
//       <div className={cn(className)}>
//         <span className={cn("font-bold text-black dark:text-white", tro)}>Tro</span>
//         <span className={cn("font-bold text-white dark:text-black bg-[#FA9A61] rounded-sm ml-1 p-1", hub)}>Hub</span>
//         <span>.</span>
//         <span>VN</span>
//       </div>
//     </div>
//   );
// };

// export default Logo;

import images from "@/assets/imgs";
import { cn } from "@/lib/utils";

const Logo = ({
  className,
  tro,
  hub,
  dot,
  vn,
}: {
  className?: string;
  tro?: string;
  hub?: string;
  dot?: string;
  vn?: string;
}) => {
  return (
    <div className="mt-2 ml-2">
      <div className={cn("flex items-center", className)}>
        <span className={cn("font-bold text-black dark:text-white", tro)}>Tro</span>
        <span className={cn("font-bold text-white dark:text-black bg-[#FA9A61] rounded-sm ml-1 p-1", hub)}>Hub</span>
        <span className={cn("text-[20px] leading-none font-black ml-1 text-black dark:text-white", dot)}>.</span>
        <span
          className={cn("font-bold text-transparent bg-clip-text bg-center bg-cover", vn)}
          style={{
            backgroundImage: `url(${images.vnFlag})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          VN
        </span>
      </div>
    </div>
  );
};

export default Logo;
