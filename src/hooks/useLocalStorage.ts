import configs from "@/configs";

const key = configs.storage.key;

export default function useLocalStorage() {
  const getItem = (): Record<string, unknown> => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
  };

  const setItem = (objectSet: Record<string, unknown>) => {
    const data = getItem();
    const newData = { ...data, ...objectSet };

    localStorage.setItem(key, JSON.stringify(newData));
  };

  const deleteItem = (item: string) => {
    if (!item) return;

    const data = getItem();
    if (data && typeof data === "object") {
      delete data[item];
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  return {
    dataStorage: getItem,
    setStorage: setItem,
    deleteStorage: deleteItem,
  };
}
