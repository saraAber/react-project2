import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import MobxRec from "../mobx/MobxRec";
import { observer } from "mobx-react-lite";
import { Recipe } from "../types/Types";
import "../styles/RecipeDetail.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton, Tooltip } from "@mui/material";
import { userContext } from "../context/userContext";
import { CategoriesContext } from "../context/CategoriesContext";

// helper לפענוח רמת קושי
const getDifficultyText = (difficulty: number) => {
  switch (difficulty) {
    case 1: return "קל";
    case 2: return "בינוני";
    case 3: return "קשה";
    default: return "";
  }
};


const RecipeDetail = observer(() => {
  const { id } = useParams();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [show, setShow] = useState<number>(0);

  // const currentUser = useContext(userContext).Myuser;
  const { Myuser: currentUser } = useContext(userContext);
  const { categories } = useContext(CategoriesContext);

  useEffect(() => {
    const loadRecipe = async () => {
      if (!id) return;

      const existing = MobxRec.getCurrRecipe();
      if (existing && String(existing.Id) === id) return;

      setLoading(true);
      setError("");

      try {
        const res = await axios.get(`http://localhost:8080/api/recipe/${id}`);
        const data = res.data;

        const formatted: Recipe = {
          ...data,
          Difficulty: data.Difficulty, // השאר כמספר
          Ingredients: data.Ingredients ?? [],
          Instructions: data.Instructions ?? [],
          Category: data.Category ?? { Id: 0, Name: "" },
          User: data.User ?? { Id: 0, Name: "", Email: "" },
        };
        

        MobxRec.setCurrRecipe(formatted);
      } catch (err) {
        console.error("שגיאה בטעינת מתכון:", err);
        setError("לא הצלחנו לטעון את פרטי המתכון.");
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [id]);

  const recipe = MobxRec.getCurrRecipe();
  const handleEditRecipe = (userId: number) => {
    if (currentUser) {
      if (currentUser.Id === userId)
        nav(`edit-recipe/${MobxRec.currRecipe?.Name}`);
      else
        setMsg(" אינך מורשה לערוך את המתכון מכיוון שאינך יצרת אותו");
    } else {
      setMsg(" אינך מורשה לערוך את המתכון מכיוון שאינך מחובר");
    }
    setShow(1);
  };
  const handleDelete = async () => {
    if (!recipe) return;
  
    const confirmDelete = window.confirm("האם אתה בטוח שברצונך למחוק את המתכון?");
    if (!confirmDelete) return;
  
    try {
      const res = await axios.post(`http://localhost:8080/api/recipe/delete/${recipe.Id}`, {
        Id: recipe.Id,
      });
  
      alert("המתכון נמחק בהצלחה");
      nav("/RecipesList");
    } catch (error) {
      console.error("שגיאה במחיקת מתכון:", error);
      alert("אירעה שגיאה במחיקת המתכון");
    }
  };


  if (loading) return <p>טוען נתונים...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!recipe) return <p>לא נמצא מתכון להצגה.</p>;

  const categoryName = categories?.find(c => c.Id === recipe.Categoryid)?.Name || "לא מוגדרת";

  return (
    <div className="recipe-detail">
      <div className="top-actions">
        <Tooltip title="חזרה לרשימה">
          <IconButton onClick={() => nav("/RecipesList")}>
            <ArrowBackIcon color="primary" />
          </IconButton>
        </Tooltip>

        {currentUser?.Id === recipe.UserId && (
          <div className="edit-delete-buttons">
            <Tooltip title="ערוך">
              <IconButton onClick={() => {
                if (!currentUser) {
                  alert("יש להתחבר כדי לערוך מתכון");
                } else if (currentUser.Id !== recipe.UserId) {
                  alert("אין לך הרשאה לערוך את המתכון הזה");
                } else {
                  nav(`/edit-recipe/${recipe.Id}`);
                }
              }}>
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="מחק">
              <IconButton onClick={handleDelete}>
                <DeleteIcon />
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
      {/* <p><strong>רמת קושי:</strong> {recipe.Difficulty}</p> */}
      {/* <p><strong>רמת קושי:</strong> {getDifficultyText(recipe.Difficulty)}</p> */}
      <p><strong>רמת קושי:</strong> {getDifficultyText(Number(recipe.Difficulty))}</p>


      <p><strong>זמן הכנה:</strong> {recipe.Duration} דקות</p>
      <p><strong>קטגוריה:</strong> {categoryName}</p>
      <p><strong>נוצר ע"י:</strong> {recipe.UserId}</p>

      <div className="ingredients-instructions">
        <div className="ingredients-box">
          <h4>רכיבים:</h4>
          <ul>
            {recipe.Ingridents.map((ing, i) => (
              <li key={i}>
                {ing.Name} {ing.Count && `- ${ing.Count}`} {ing.Type && `(${ing.Type})`}
              </li>
            ))}
          </ul>
        </div>

        <div className="instructions-box">
          <h4>שלבי הכנה:</h4>
          <ol>
            {recipe.Instructions.map((ins, i) => (
              <li key={i}>{ins.Name}</li>
            ))}
          </ol>
        </div>
      </div>

    </div>
  );
});

export default RecipeDetail;
