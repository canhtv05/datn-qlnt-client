import useViewport from "@/hooks/useViewport";
import Logo from "./Logo";

const LoadingPage = () => {
  const { height, width } = useViewport();
  return (
    <div
      className="grid place-items-center bg-background fixed z-50"
      style={{
        width,
        height,
      }}
    >
      <div className="animate-swing">
        <Logo />
      </div>
    </div>
  );
};

export default LoadingPage;
