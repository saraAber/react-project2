import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import MobxRec from "../mobx/MobxRec";
import { observer } from "mobx-react-lite";
import { Recipe } from "../types/Types";
import "../styles/RecipeForm.css";

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
  const recipe = MobxRec.getCurrentRecipe; // ✅ בלי סוגריים

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/recipe/${id}`);
        const data = res.data;

        const formatted: Recipe = {
          ...data,
          Difficulty: getDifficultyText(data.Difficulty),
          Ingredients: data.Ingredients ?? [],
          Instructions: data.Instructions ?? [],
        };

        MobxRec.setCurrentRecipe(formatted);
      } catch (err) {
        console.error("שגיאה בטעינת מתכון:", err);
      }
    };

    if (id) fetchRecipe();
  }, [id]);

  if (!recipe) return <p>טוען נתונים...</p>;

  return (
    <div className="recipe-detail">
      <h2>{recipe.Name}</h2>
      {recipe.Img && (
        <img
          src={recipe.Img}
          alt={recipe.Name}
          className="recipe-detail-img"
        />
      )}

      <p><strong>תיאור:</strong> {recipe.Description}</p>
      <p><strong>רמת קושי:</strong> {recipe.Difficulty}</p>
      <p><strong>זמן הכנה:</strong> {recipe.Duration} דקות</p>

      <div>
        <h4>רכיבים:</h4>
        <ul>
          {recipe.Ingredients.map((ing) => (
            <li key={ing.Name}>
              {ing.Name} {ing.Count && `- ${ing.Count}`} {ing.Type && `(${ing.Type})`}
            </li>
          ))}
        </ul>
      </div>

      <div className="instructions">
        <h4>שלבי הכנה:</h4>
        <ol>
          {recipe.Instructions.map((ins) => (
            <li key={ins.Name}>{ins.Name}</li>
          ))}
        </ol>
      </div>

      <button onClick={() => nav("/recipes")}>חזרה לרשימה</button>
    </div>
  );
});

export default RecipeDetail;
