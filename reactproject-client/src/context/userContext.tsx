import { createContext, useState } from "react";
import type { ReactElement } from "react";
// import { user } from "../Types";
import { User } from "../types/Types";


type userContextType = {
  Myuser: User | null,          // אפשר גם לאפשר null
  setMyUser: (Myuser: User) => void
}

export const userContext = createContext<userContextType>({
  Myuser: null,
  setMyUser: (_: User) => { }
});

const UserContext = ({ children }: { children: ReactElement }) => {
  const [user, setUser] = useState<User | null>(null);

  const setMyUser = (user: User) => {
    setUser(user);
  };

  return (
    <userContext.Provider value={{ Myuser: user, setMyUser }}>
      {children}
    </userContext.Provider>
  );
};

export default UserContext;
