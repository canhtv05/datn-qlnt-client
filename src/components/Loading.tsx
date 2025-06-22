import { gifs } from "@/assets/gifs";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-background/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2">
        {/* <LoaderCircle className="h-8 w-8 animate-spin text-foreground" /> */}
        <img src={gifs.loading} alt="loading icon" />
        <span className="text-sm text-muted-foreground">Đang tải...</span>
      </div>
    </div>
  );
};

export default Loading;
