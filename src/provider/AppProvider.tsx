import { ReactNode } from "react";

import ScrollToTop from "@/components/ScrollToTop";
import { Toaster } from "@/components/ui/sonner";
import { useMyInfo } from "@/hooks/useMyInfo";
import useTheme from "@/hooks/useTheme";
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

type AppProviderProps = {
  children: ReactNode;
};

const AppProvider = ({ children }: AppProviderProps) => {
  useTheme();
  useMyInfo();

  return (
    <>
      {children}
      <ScrollToTop />
      <Toaster richColors position="top-right" closeButton theme="light" />
      {/* <ReactQueryDevtools /> */}
    </>
  );
};

export default AppProvider;
