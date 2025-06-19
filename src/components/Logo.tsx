import { cn } from "@/lib/utils";

const Logo = ({ className, tro, hub }: { className?: string; tro?: string; hub?: string }) => {
  return (
    <div className="mt-2">
      <div className={cn(className)}>
        <span className={cn("font-bold text-black dark:text-white", tro)}>Tro</span>
        <span className={cn("font-bold text-white dark:text-black bg-[#FA9A61] rounded-sm ml-1 p-1", hub)}>Hub</span>
      </div>
    </div>
  );
};

export default Logo;
