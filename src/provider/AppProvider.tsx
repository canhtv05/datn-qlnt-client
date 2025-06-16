import { ReactNode } from "react";

// import ScrollToTop from "@/components/ScrollToTop";
import { Toaster } from "@/components/ui/sonner";
import Loading from "@/components/Loading";
import { useMutationState } from "@tanstack/react-query";
import RenderIf from "@/components/RenderIf";
import useTheme from "@/hooks/useTheme";
import { useMyInfo } from "@/hooks/useMyInfo";
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

type AppProviderProps = {
  children: ReactNode;
};

const AppProvider = ({ children }: AppProviderProps) => {
  useTheme();
  useMyInfo();

  const isMutating =
    useMutationState({
      filters: {
        status: "pending",
      },
    }).length > 0;

  return (
    <>
      <RenderIf value={isMutating}>
        <Loading />
      </RenderIf>
      {children}
      {/* <ScrollToTop /> */}
      <Toaster richColors position="top-right" closeButton theme="light" />
      {/* <ReactQueryDevtools /> */}
    </>
  );
};

export default AppProvider;
