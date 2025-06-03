import { useAuthStore } from "@/zustand/authStore";
import { useEffect } from "react";

const Home = () => {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    console.log("User từ zustand:", user);
  }, [user]);

  return <div>Home</div>;
};

export default Home;
