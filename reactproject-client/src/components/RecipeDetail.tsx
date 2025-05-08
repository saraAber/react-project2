import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Recipe } from "../types/Types";
import axios from "axios";
import "../styles/RecipeDetail.css";

const RecipeDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/recipe/${id}`);
        const data = res.data;
        const formatted: Recipe = {
          ...data,
          Ingredients: data.Ingredients ?? [],
          Instructions: data.Instructions ?? [],
        };
        setRecipe(formatted);
      } catch (err) {
        console.error("שגיאה בטעינת מתכון:", err);
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id]);

  const getDifficultyText = (value: number) => {
    switch (value) {
      case 1:
        return "קל";
      case 2:
        return "בינוני";
      case 3:
        return "קשה";
      default:
        return "לא ידוע";
    }
  };

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
      <p><strong>רמת קושי:</strong> {getDifficultyText(recipe.Difficulty)}</p>
      <p><strong>זמן הכנה:</strong> {recipe.Duration} דקות</p>

      <div>
        <h4>רכיבים:</h4>
        <ul>
          {recipe.Ingredients.map((ing) => (
            <li key={ing.Name}>{ing.Name} {ing.Count && `- ${ing.Count}`} {ing.Type && `(${ing.Type})`}</li>
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
};

export default RecipeDetail;
