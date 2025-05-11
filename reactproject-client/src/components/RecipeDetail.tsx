import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import MobxRec from "../mobx/MobxRec";
import { observer } from "mobx-react-lite";
import { Recipe } from "../types/Types";
// import "../styles/RecipesForm.css";
import "../styles/RecipeDetail.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton, Tooltip } from "@mui/material";
import { Button } from "@mui/material";

const getDifficultyText = (difficulty: number) => {
  switch (difficulty) {
    case 1: return "קל";
    case 2: return "בינוני";
    case 3: return "קשה";
    default: return "לא ידוע";
  }
};

const RecipeDetail = observer(() => {
  const { id } = useParams();
  const nav = useNavigate();
  const recipe = MobxRec.getCurrRecipe();
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/recipe/${id}`);
        const data = res.data;

        const formatted: Recipe = {
          ...data,
          Difficulty: getDifficultyText(data.Difficulty),
          Ingredients: data.Ingredients ?? [],
          Instructions: data.Instructions ?? [],
          Category: data.Category ?? { Id: 0, Name: "" },
          User: data.User ?? { Id: 0, Name: "", Email: "" },
        };

        MobxRec.setCurrRecipe(formatted);
      } catch (err) {
        console.error("שגיאה בטעינת מתכון:", err);
      }
    };

    if (id) fetchRecipe();
  }, [id]);

  if (!recipe) return <p>טוען נתונים...</p>;

  const handleDelete = async () => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את המתכון?")) {
      try {
        await axios.delete(`http://localhost:8080/api/recipe/${recipe.Id}`);
        alert("המתכון נמחק בהצלחה");
        nav("/ShowRecipes");
      } catch (err) {
        console.error("שגיאה במחיקת מתכון:", err);
        alert("אירעה שגיאה במחיקה");
      }
    }
  };

  return (
    <div className="recipe-detail">
      <div className="top-actions">
        <Tooltip title="חזרה לרשימה">
          <IconButton onClick={() => nav("/ShowRecipes")}>
            <ArrowBackIcon color="primary" />חזרה לרשימה
          </IconButton>
        </Tooltip>

        {currentUser?.Id === recipe.UserId && (
          <div className="edit-delete-buttons">
            <Tooltip title="ערוך">
              <IconButton onClick={() => nav(`/edit-recipe/${recipe.Id}`)}>
                <EditIcon color="primary" />
              </IconButton>
            </Tooltip>

            <Tooltip title="מחק">
              <IconButton onClick={handleDelete}>
                <DeleteIcon color="error" />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </div>

      <h2>{recipe.Name}</h2>

      {recipe.Img && (
        <img src={recipe.Img} alt={recipe.Name} className="recipe-detail-img" />
      )}

      <p><strong>תיאור:</strong> {recipe.Description}</p>
      <p><strong>רמת קושי:</strong> {recipe.Difficulty}</p>
      <p><strong>זמן הכנה:</strong> {recipe.Duration} דקות</p>
      <p><strong>קטגוריה:</strong> {recipe.Category?.Name}</p>
      <p><strong>נוצר ע"י:</strong> {recipe.User?.Name}</p>

      <div>
        <h4>רכיבים:</h4>
        <ul>
          {recipe.Ingredients.map((ing, i) => (
            <li key={i}>
              {ing.Name} {ing.Count && `- ${ing.Count}`} {ing.Type && `(${ing.Type})`}
            </li>
          ))}
        </ul>
      </div>

      <div className="instructions">
        <h4>שלבי הכנה:</h4>
        <ol>
          {recipe.Instructions.map((ins, i) => (
            <li key={i}>{ins.Name}</li>
          ))}
        </ol>
      </div>
    </div>
  );
});

export default RecipeDetail;
