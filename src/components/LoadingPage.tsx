import Logo from "./Logo";

const LoadingPage = () => {
  return (
    <div className="grid place-items-center min-h-screen bg-background">
      <div className="animate-swing">
        <Logo />
      </div>
    </div>
  );
};

export default LoadingPage;
