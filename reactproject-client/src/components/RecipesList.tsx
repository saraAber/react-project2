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

const RecipesList = () => {
  const { Myuser } = useContext(userContext); // משתמש מתחום הקונטקסט
  const [recipes, setRecipes] = useState<any[]>([]); // מתכונים
  const [categories, setCategories] = useState<Category[]>([]); // קטגוריות
  const [filter, setFilter] = useState({
    category: "",
    difficulty: "",
    time: "",
    user: "",
  });
  const [msg, setMsg] = useState<string | null>(null); // הודעות שגיאה או הצלחה
  const [show, setShow] = useState<number>(0); // מצב שמראה אם יש הודעה
  const [loading, setLoading] = useState<boolean>(true); // מצב טעינה
  const [error, setError] = useState<string | null>(null); // הודעת שגיאה אם יש

  const navigate = useNavigate();

  // קריאה ל-API לקבלת המתכונים
  const getRecipes = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/recipe");
      setRecipes(res.data); // הגדרת המתכונים
      // console.log("recipes loaded:", res.data);

    } catch (e) {
      setError("נכשל בקבלת הנתונים");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  // useEffect(() => {
  //   // console.log("כל המתכונים מהשרת:", recipes);
  //   recipes.forEach((r, i) => {
  //     console.log(`מתכון ${i}:`, r);
  //   });
  // }, [recipes]);

  // קריאה ל-API לקבלת קטגוריות
  useEffect(() => {
    axios.get("http://localhost:8080/api/category").then((res) => {
      // console.log("קטגוריות שהתקבלו:", res.data);
      setCategories(res.data);
    });
  }, []);

  // קריאה ל-getRecipes ברגע שהקומפוננטה נטענת
  useEffect(() => {
    getRecipes();
  }, []);

  const difficultyMap: { [key: number]: 'קל' | 'בינוני' | 'קשה' } = {
    1: 'קל',
    2: 'בינוני',
    3: 'קשה',
  };

  const filteredRecipes = recipes.filter((rec) => {
    const matchesCategory =
      filter.category === "" || Number(filter.category) === Number(rec.Categoryid);

    const matchesDifficulty =
      filter.difficulty === "" || rec.Difficulty === parseInt(filter.difficulty);

    const matchesTime =
      filter.time === "" || rec.Duration <= parseInt(filter.time);

    const matchesUser =
      filter.user === "" || rec.UserId === parseInt(filter.user);

    // console.log("filter.category", filter.category);
    // console.log("recipe.CategoryId", rec.CategoryId);

    return matchesCategory && matchesDifficulty && matchesTime && matchesUser;
  });


  //עריכת מתכון
  const nav = useNavigate();

  const handleEditRecipe = (userId: number) => {
    if (Myuser) {
      if (Myuser.Id === userId)
        nav(`edit-recipe/${MobxRec.currRecipe?.Name}`);
      else
        setMsg(" אינך מורשה לערוך את המתכון מכיוון שאינך יצרת אותו");
    } else {
      setMsg(" אינך מורשה לערוך את המתכון מכיוון שאינך מחובר");
    }
    setShow(1);
  };
  // פונקציית מחיקת מתכון
  // const handleDeleteRecipe = async (id: number, userId: number) => {
  //   try {
  //     // בדיקה אם המשתמש הוא זה שיצר את המתכון
  //     if (Myuser?.Id === userId) {
  //       // console.log('נשלח למחיקה: ', { id }); // הדפסת הנתונים שנשלחים למחיקה

  //       // שלח את הבקשה למחיקה לשרת
  //       const response = await axios.post(`http://localhost:8080/api/recipe/delete/${id}`, { Id: id });

  //       // console.log('תשובת השרת למחיקה:', response.data); // הדפסת התשובה שהתקבלה מהשרת

  //       // עדכון הרשימה לאחר מחיקה
  //       setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.Id !== id));
  //       setMsg("המתכון נמחק בהצלחה");
  //       nav("/RecipesList");
  //       setShow(1);
  //     } else {
  //       // אם המשתמש לא יכול למחוק
  //       setMsg(
  //         Myuser
  //           ? " אינך מורשה למחוק את המתכון מכיוון שאינך יצרת אותו"
  //           : " אינך רשאי למחוק את המתכון כי אינך מחובר"
  //       );
  //       setShow(1);
  //     }
  //   } catch (error) {
  //     // הדפסת שגיאה אם יש
  //     console.error("שגיאה במחיקת המתכון", error);
  //     setMsg("אירעה שגיאה במחיקת המתכון");

  //     // הדפסת פרטי השגיאה כדי להבין את הבעיה
  //     if (axios.isAxiosError(error)) {
  //       console.error('Axios error details:', error.response?.data || error.message);
  //     }

  //     setShow(1);
  //   }
  // };

  if (loading) {
    return <div>טוען...</div>; // אם בטעינה תציג הודעת טעינה
  }

  if (error) {
    return <div>{error}</div>; // אם יש שגיאה תציג הודעת שגיאה
  }

  return (
    <div className="recipes-list">
      <h2>רשימת מתכונים</h2>

      {show === 1 && msg && <div className="error-message">{msg}</div>}

      <div className="filters">
        <select
          value={filter.category}
          onChange={(e) =>
            setFilter({ ...filter, category: e.target.value })
          }
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
          onChange={(e) =>
            setFilter({ ...filter, difficulty: e.target.value })
          }
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


        <input
          type="number"
          placeholder="קוד משתמש"
          value={filter.user}
          onChange={(e) =>
            setFilter({ ...filter, user: e.target.value })
          }
        />
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
                      recipe.Img && recipe.Img.startsWith("http")
                        ? recipe.Img
                        : "/images/ccc.jpg"
                    }
                    alt={recipe.Name}
                    onError={(e) => {
                      e.currentTarget.src = "/images/bbb.jpg"; //ניסוי
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
                <IconButton onClick={() => {
                  if (!Myuser) {
                    alert("יש להתחבר כדי לערוך מתכון");
                  } else if (Myuser.Id !== recipe.UserId) {
                    alert("אין לך הרשאה לערוך את המתכון הזה");
                  } else {
                    navigate(`/edit-recipe/${recipe.Id}`);
                  }
                }}>
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
