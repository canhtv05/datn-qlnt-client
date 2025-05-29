import { svg } from "@/assets/svg";

const Login = () => {
  return (
    <main className="flex w-full h-screen">
      <article className="p-5 flex justify-center items-center bg-primary flex-1 float-start w-[70%]">
        <img src={svg.login} alt="img_login" className="object-contain h-[80%]" loading="lazy" />
      </article>
      <aside className="flex flex-col  float-end w-[35%] bg-white">
        <img src={svg.react} alt="logo" className="object-contain w-[80px] h-[80px]" loading="lazy" />
      </aside>
    </main>
  );
};

export default Login;
