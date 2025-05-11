import { createContext, useState, useEffect, ReactNode } from "react";
import { User, Recipe } from "../types/Types";
import axios from "axios";

type UserContextType = {
  Myuser: User | null;
  setMyUser: (Myuser: User) => void;
  recipes: Recipe[];
  setRecipes: (recipes: Recipe[]) => void;
  handleDelete: (id: number) => void;
  handleEdit: (editedRecipe: Recipe) => void;
};

export const userContext = createContext<UserContextType>({
  Myuser: null,
  setMyUser: (_: User) => {},
  recipes: [],
  setRecipes: (_: Recipe[]) => {},
  handleDelete: (_: number) => {},
  handleEdit: (_: Recipe) => {},
});

const UserContext = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Fetching recipes from the API
    axios.get("http://localhost:8080/api/recipe").then((res) => {
      setRecipes(res.data);
      console.log("newwwwwwww listttttt");
      console.log("Recipes loaded from API:", res.data);
    });
  }, []);

  const setMyUser = (user: User) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user)); // Save user to localStorage
  };

  // Handle delete recipe
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/recipe/delete/${id}`);
      setRecipes((prev) => prev.filter((rec) => rec.Id !== id));
    } catch (err) {
      console.error("מחיקה נכשלה:", err);
      alert("אירעה שגיאה במחיקת המתכון");
    }
    console.log("העוגה לא נמחקה");
    
  };
  
  // Handle edit recipe (this will update the recipe both in state and on the server)
  const handleEdit = (editedRecipe: Recipe) => {
    // Update the recipe in the database (server-side)
    axios.put(`http://localhost:8080/api/recipe/${editedRecipe.Id}`, editedRecipe)
      .then(() => {
        // After successful update, update the recipe list in the state
        setRecipes((prevRecipes) => {
          return prevRecipes.map((recipe) => 
            recipe.Id === editedRecipe.Id ? editedRecipe : recipe
          );
        });
      })
      .catch((error) => {
        console.error("Error updating recipe:", error);
      });
  };

  return (
    <userContext.Provider value={{ Myuser: user, setMyUser, recipes, setRecipes, handleDelete, handleEdit }}>
      {children}
    </userContext.Provider>
  );
};

export default UserContext;
