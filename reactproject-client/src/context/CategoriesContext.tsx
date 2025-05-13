import axios from "axios";
import type { ReactElement } from "react";
import { createContext, useEffect, useState } from "react";

// טיפוס לקטגוריה אחת
type Category = {
  Id: number;
  Name: string;
};

// טיפוס לקונטקסט
type CategoriesContextType = {
  categories: Category[] | null;
  setCategories: (categories: Category[]) => void;
};

// יצירת קונטקסט עם ערכים ראשוניים
export const CategoriesContext = createContext<CategoriesContextType>({
  categories: null,
  setCategories: () => {},
});

// קומפוננטת Provider
const CategoriesContextProvider = ({ children }: { children: ReactElement }) => {
  const [categories, setCategoriesState] = useState<Category[] | null>(null);

  const setCategories = (cats: Category[]) => {
    setCategoriesState(cats);
  };

  const getCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/category");
      setCategories(res.data);
    } catch (error) {
      console.error("שגיאה בהבאת קטגוריות:", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories, setCategories }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export default CategoriesContextProvider;
