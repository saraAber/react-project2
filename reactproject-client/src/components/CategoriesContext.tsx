import axios from "axios";
import type { ReactElement } from "react";
import { createContext, useEffect, useState } from "react";

// הגדרת סוג של קטגוריות
type catContextType = {
  categories: Array<{ Id: number; Name: string }> | null;
  setCategories: (categories: Array<{ Id: number; Name: string }>) => void;
};

// יצירת קונטקסט
export const CatContext = createContext<catContextType>({
  categories: null,
  setCategories: () => { },
});

const CatContextProvider = ({ children }: { children: ReactElement }) => {
  const [category, setCategory] = useState<Array<{ Id: number; Name: string }> | null>(null);

  // פונקציה לעדכון הקטגוריות
  const setCategories = (cats: Array<{ Id: number; Name: string }>) => {

    setCategory(cats);
  };

  const getCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/category");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, [])
  return (
    <CatContext.Provider value={{ categories: category, setCategories }}>
      {children}
    </CatContext.Provider>
  );
};

export default CatContextProvider;
