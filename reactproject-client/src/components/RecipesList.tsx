import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Recipe, Category, User } from "../types/Types";
import "../styles/RecipesList.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";

const RecipesList = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState({
    category: "",
    difficulty: "",
    time: "",
    user: "",
  });

  const nav = useNavigate();

  // המשתמש המחובר (לדוגמה, מ-localStorage)
  const currentUser: User | null = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    axios.get("http://localhost:8080/api/recipe").then((res) => {
      const data = res.data.map((rec: any) => ({
        ...rec,
        Ingredients: rec.Ingredients ?? [],
        Instructions: rec.Instructions ?? [],
      }));
      setRecipes(data);
    });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8080/api/category").then((res) => {
      setCategories(res.data);
    });
  }, []);

  const handleDelete = (id: number, ownerId: number) => {
    if (currentUser?.Id !== ownerId) {
      alert("אין לך הרשאה למחוק מתכון שלא אתה יצרת");
      return;
    }

    axios.delete(`http://localhost:8080/api/recipe/${id}`).then(() => {
      setRecipes(recipes.filter((rec) => rec.Id !== id));
    });
  };

  const handleEdit = (id: number, ownerId: number) => {
    if (currentUser?.Id !== ownerId) {
      alert("אין לך הרשאה לערוך מתכון שלא אתה יצרת");
      return;
    }

    nav(`/edit-recipe/${id}`);
  };

  const filteredRecipes = recipes.filter((rec) => {
    const matchesCategory = filter.category === "" || rec.CategoryId === parseInt(filter.category);
    const matchesDifficulty = filter.difficulty === "" || rec.Difficulty === filter.difficulty;
    const matchesTime = filter.time === "" || rec.Duration <= parseInt(filter.time);
    const matchesUser = filter.user === "" || rec.User.Name.includes(filter.user);

    return matchesCategory && matchesDifficulty && matchesTime && matchesUser;
  });

  return (
    <div className="recipes-list">
      <h2>רשימת מתכונים</h2>

      <div className="filters">
        <select onChange={(e) => setFilter({ ...filter, category: e.target.value })}>
          <option value="">בחר קטגוריה</option>
          {categories.map((cat) => (
            <option key={cat.Id} value={cat.Id.toString()}>
              {cat.Name}
            </option>
          ))}
        </select>

        <select onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}>
          <option value="">בחר רמת קושי</option>
          <option value="קל">קל</option>
          <option value="בינוני">בינוני</option>
          <option value="קשה">קשה</option>
        </select>

        <input
          type="number"
          placeholder="משך זמן (בדקות)"
          onChange={(e) => setFilter({ ...filter, time: e.target.value })}
        />

        <input
          type="text"
          placeholder="שם יוצר המתכון"
          onChange={(e) => setFilter({ ...filter, user: e.target.value })}
        />
      </div>

      <div className="recipes-grid">
        {filteredRecipes.map((rec) => (
          <div key={rec.Id} className="recipe-card">
            <img src={rec.Img} alt={rec.Name} className="recipe-image" />
            <div className="recipe-info">
              <h5 onClick={() => nav(`/recipe/${rec.Id}`)} className="recipe-title">
                {rec.Name}
              </h5>
              <p><strong>רמת קושי:</strong> {rec.Difficulty}</p>
              <p>{rec.Description}</p>

              {currentUser?.Id === rec.UserId && (
                <div className="actions">
                  <Tooltip title="ערוך">
                    <IconButton onClick={() => handleEdit(rec.Id, rec.UserId)}>
                      <EditIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="מחק">
                    <IconButton onClick={() => handleDelete(rec.Id, rec.UserId)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipesList;
