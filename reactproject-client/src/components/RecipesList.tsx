import { useContext, useState, useEffect } from "react";
import { userContext } from "../context/userContext";
import axios from "axios";
import { Category } from "../types/Types";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import "../styles/RecipesForm.css";
import MobxRec from "../mobx/MobxRec";

// ... (שאר הייבוא נשאר זהה)

const RecipesList = () => {
  const { Myuser } = useContext(userContext);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState({
    category: "",
    difficulty: "",
    time: "",
    user: "",
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [show, setShow] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showOnlyMine, setShowOnlyMine] = useState<boolean>(false); // חדש

  const navigate = useNavigate();

  const getRecipes = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/recipe");
      setRecipes(res.data);
    } catch (e) {
      setError("נכשל בקבלת הנתונים");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    axios.get("http://localhost:8080/api/category").then((res) => {
      setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    getRecipes();
  }, []);

  const filteredRecipes = recipes.filter((rec) => {
    const matchesCategory =
      filter.category === "" || Number(filter.category) === Number(rec.Categoryid);
    const matchesDifficulty =
      filter.difficulty === "" || rec.Difficulty === parseInt(filter.difficulty);
    const matchesTime =
      filter.time === "" || rec.Duration <= parseInt(filter.time);
    const matchesUser =
      !showOnlyMine || (Myuser && rec.UserId === Myuser.Id);

    return matchesCategory && matchesDifficulty && matchesTime && matchesUser;
  });

  if (loading) return <div>טוען...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="recipes-list">
      <h2>רשימת מתכונים</h2>

      {show === 1 && msg && <div className="error-message">{msg}</div>}

      <div className="filters">
        <select
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
        >
          <option value="">כל הקטגוריות</option>
          {categories.map((cat) => (
            <option key={cat.Id} value={cat.Id}>
              {cat.Name}
            </option>
          ))}
        </select>

        <select
          value={filter.difficulty}
          onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}
        >
          <option value="">כל הרמות</option>
          <option value="1">קל</option>
          <option value="2">בינוני</option>
          <option value="3">קשה</option>
        </select>

        <input
          type="number"
          placeholder="הכנה עד X דקות"
          value={filter.time}
          onChange={(e) => setFilter({ ...filter, time: e.target.value })}
        />

        {Myuser && (
          <button
            className="my-recipes-button"
            onClick={() => setShowOnlyMine(!showOnlyMine)}
          >
            {showOnlyMine ? "הצג את כל המתכונים" : "הצג את המתכונים שלי"}
          </button>
        )}
      </div>

      <div className="recipes-grid">
        {filteredRecipes.map((recipe) => (
          <div key={recipe.Id} className="recipe-card">
            <div
              className="recipe-link"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/RecipeDetail/${recipe.Id}`)}
            >
              {recipe.Img && (
                <div className="recipe-image">
                  <img
                    src={
                      recipe.Img.startsWith("http") || recipe.Img.startsWith("/images/")
                        ? recipe.Img
                        : `/images/${recipe.Img}`
                    }
                    alt={recipe.Name}
                    onError={(e) => {
                      e.currentTarget.src = "/images/ccc.jpg"; // תמונת גיבוי
                    }}
                  />

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
                    if (!Myuser) {
                      alert("יש להתחבר כדי לערוך מתכון");
                    } else if (Myuser.Id !== recipe.UserId) {
                      alert("אין לך הרשאה לערוך את המתכון הזה");
                    } else {
                      navigate(`/edit-recipe/${recipe.Id}`);
                    }
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="מחק">
                <IconButton onClick={() => navigate(`/RecipeDetail/${recipe.Id}`)}>
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
