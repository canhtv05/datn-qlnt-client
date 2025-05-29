import Cookies from "js-cookie";

import configs from "@/configs";

const key = configs.storage.key;

const cookieUtil = {
  //secure cookie
  setStorage: (objectSet = {}, options = {}) => {
    const data = cookieUtil.getStorage();
    Object.assign(data, objectSet);

    const jsonData = JSON.stringify(data);

    Cookies.set(key, jsonData, { ...options, secure: true, sameSite: "Strict" });
  },
  getStorage: () => {
    const data = Cookies.get(key);
    return data ? JSON.parse(data) : {};
  },
  deleteStorage: () => {
    Cookies.remove(key);
  },
};

export default cookieUtil;
