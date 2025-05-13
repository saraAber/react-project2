import { createContext, ReactElement, useState } from "react";
import { user } from "../types/Types";

type userContextType = {
  Myuser: user | null;
  setMyUser: (Myuser: user | null) => void; // 👈 שינוי כאן
};

export const userContext = createContext<userContextType>({
  Myuser: null,
  setMyUser: (_: user | null) => {}, // 👈 שינוי כאן
});

const UserContext = ({ children }: { children: ReactElement }) => {
  const [user, setUser] = useState<user | null>(null);

  const setMyUser = (user: user | null) => { // 👈 שינוי כאן
    setUser(user);
  };

  return (
    <userContext.Provider value={{ Myuser: user, setMyUser }}>
      {children}
    </userContext.Provider>
  );
};

export default UserContext;
