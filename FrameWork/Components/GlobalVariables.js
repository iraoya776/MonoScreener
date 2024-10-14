import { createContext, useState } from "react";
import { Themes } from "./Themes";

const AppContext = createContext();

function AppProvider({ children }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(undefined);
  const [preloader, setPreloader] = useState(false);
  const [userUID, setUserUID] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [groupInfo, setGroupInfo] = useState("");
  const [reload, setReload] = useState(0);

  return (
    <AppContext.Provider
      value={{
        email,
        setEmail,
        password,
        setPassword,
        preloader,
        setPreloader,
        userUID,
        setUserUID,
        userInfo,
        setUserInfo,
        groupInfo,
        setGroupInfo,
        reload,
        setReload,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export { AppContext, AppProvider };
