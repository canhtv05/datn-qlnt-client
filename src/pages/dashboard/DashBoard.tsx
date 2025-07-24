import { useAuthStore } from "@/zustand/authStore";

const DashBoard = () => {
  const user = useAuthStore((s) => s.user);
  console.log(user);
  return <div></div>;
};

export default DashBoard;
