import { ReactNode } from "react";

import { svg } from "@/assets/svg";
import RenderIf from "@/components/RenderIf";
import { Viewport } from "@/enums";
import useViewport from "@/hooks/useViewport";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const { width } = useViewport();
  return (
    <main className="lg:flex w-full h-screen justify-center">
      <RenderIf value={width >= Viewport.LG}>
        <article className="p-5 flex justify-center items-center bg-primary flex-1 float-start w-[70%]">
          <img src={svg.login} alt="img_login" className="object-contain h-[80%]" loading="lazy" />
        </article>
      </RenderIf>
      <aside className="flex justify-center items-center h-full float-end lg:w-[35%] w-full bg-white lg:px-12 py-15 md:px-40 sm:px-12 px-10">
        <div className="flex items-center h-full flex-col w-full justify-center">
          <img src={svg.react} alt="logo" className="object-contain w-[100px] h-[100px]" loading="lazy" />
          {children}
        </div>
      </aside>
    </main>
  );
};

export default AuthLayout;
