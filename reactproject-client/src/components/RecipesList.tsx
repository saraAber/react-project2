import { useContext, useState, useEffect } from "react";
import { userContext } from "../context/userContext";
import axios from "axios";
import { Category } from "../types/Types";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import "../styles/RecipesForm.css";

const RecipesList = () => {
  const { recipes, Myuser, handleDelete } = useContext(userContext);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState({
    category: "",
    difficulty: "",
    time: "",
    user: "",
  });
  const navigate = useNavigate();

  console.log("Recipes from context:", recipes);

  useEffect(() => {
    axios.get("http://localhost:8080/api/category").then((res) => {
      setCategories(res.data);
    });
  }, []);

  const filteredRecipes = recipes.filter((rec) => {
    const matchesCategory =
      filter.category === "" || rec.CategoryId === parseInt(filter.category);
    const matchesDifficulty =
      filter.difficulty === "" || rec.Difficulty === parseInt(filter.difficulty);
    const matchesTime =
      filter.time === "" || rec.Duration <= parseInt(filter.time);
    const matchesUser =
      filter.user === "" || rec.User?.Name?.includes(filter.user);
    return (
      matchesCategory && matchesDifficulty && matchesTime && matchesUser
    );
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
          <option value="1">קל</option>
          <option value="2">בינוני</option>
          <option value="3">קשה</option>
          <option value="0">לא ידוע</option>
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
        {filteredRecipes.map((recipe) => (
          <div key={recipe.Id} className="recipe-card">
            <div
              className="recipe-link"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/RecipeDetail/${recipe.Id}`)}
            >
              {recipe.Img && (
                <div className="recipe-image">
                  <img src={recipe.Img} alt={recipe.Name} />
                </div>
              )}
              <div className="recipe-info">
                <h3 className="recipe-title">{recipe.Name}</h3>
                <p>{recipe.Description}</p>
              </div>
            </div>

            <div className="actions">
              <Tooltip title="ערוך">
                <IconButton
                  onClick={() => {
                    if (Myuser?.Id === recipe.UserId) {
                      navigate(`/edit-recipe/${recipe.Id}`);
                    } else {
                      alert("אין לך הרשאה לערוך את המתכון הזה");
                    }
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="מחק">
                <IconButton onClick={() => handleDelete(recipe.Id)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipesList;
