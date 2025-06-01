import useLocalStorage from "./useLocalStorage";

export default function useTheme() {
  const { dataStorage, setStorage } = useLocalStorage();

  const initialTheme = dataStorage().theme || "dark";

  if (typeof window !== "undefined") {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(String(initialTheme));
  }

  const toggleTheme = () => {
    const newTheme = initialTheme === "dark" ? "light" : "dark";

    setStorage({ theme: newTheme });

    window.location.reload();
  };

  return {
    theme: initialTheme,
    toggleTheme,
  };
}
