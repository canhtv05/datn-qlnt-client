import { cn } from "@/lib/utils";

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className="mt-2">
      <div className={cn(className)}>
        <span className="font-bold text-black dark:text-white">Tro</span>
        <span className="font-bold text-white dark:text-black bg-[#FA9A61] rounded-sm ml-1 p-1">Hub</span>
      </div>
    </div>
  );
};

export default Logo;
