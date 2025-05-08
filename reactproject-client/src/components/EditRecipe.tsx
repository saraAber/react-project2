import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Recipe, Ingredient, Instruction } from "../types/Types";
import axios from "axios";
import { userContext } from "../context/userContext";
import "../styles/EditRecipe.css"; // ודא שקובץ כזה קיים או צור אותו

type EditableIngredient = Partial<Ingredient>; // בלי Id
type EditableInstruction = Partial<Instruction>; // בלי Id

const EditRecipe = () => {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const { Myuser } = useContext(userContext);
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/recipe/${id}`);
        const data = res.data;
        setRecipe({
          ...data,
          Ingredients: data.Ingridents ?? [],
          Instructions: data.Instructions ?? [],
        });
      } catch (err) {
        console.error("שגיאה בטעינת מתכון:", err);
      }
    };
    fetchRecipe();
  }, [id]);

  if (!Myuser) return <p>עליך להיות מחובר כדי לערוך מתכון.</p>;
  if (!recipe) return <p>טוען מתכון לעריכה...</p>;

  const handleChange = (field: keyof Recipe, value: any) => {
    setRecipe(prev => prev && { ...prev, [field]: value });
  };

  const handleIngredientChange = (
    index: number,
    field: keyof EditableIngredient,
    value: string
  ) => {
    const updated = [...recipe.Ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setRecipe({ ...recipe, Ingredients: updated });
  };

  const handleInstructionChange = (index: number, value: string) => {
    const updated = [...recipe.Instructions];
    updated[index] = { ...updated[index], Name: value };
    setRecipe({ ...recipe, Instructions: updated });
  };

  const addIngredient = () => {
    if (!recipe) return;
    const updated = {
      ...recipe,
      Ingredients: [
        ...recipe.Ingredients,
        { Id: 0, Name: "", Count: "", Type: "", RecipeId: recipe.Id }
      ]
    };
    setRecipe(updated);
  };
  
  
  const removeIngredient = (index: number) => {
    if (!recipe) return;
    const updated = {
      ...recipe,
      Ingredients: recipe.Ingredients.filter((_, i) => i !== index)
    };
    setRecipe(updated);
  };
  
  const addInstruction = () => {
    if (!recipe) return;
    const updated = {
      ...recipe,
      Instructions: [
        ...recipe.Instructions,
        { Id: 0, Name: "", RecipeId: recipe.Id }
      ]
    };
    setRecipe(updated);
  };
  

  const removeInstruction = (index: number) => {
    if (!recipe) return;
    const updated = {
      ...recipe,
      Instructions: recipe.Instructions.filter((_, i) => i !== index)
    };
    setRecipe(updated);
  };
  
  const updateRecipe = async () => {
    try {
      await axios.put(`http://localhost:3000/api/recipe/${id}`, {
        ...recipe,
        Ingridents: recipe.Ingredients,
        Instructions: recipe.Instructions,
      });
      alert("המתכון עודכן בהצלחה");
      nav("/recipes");
    } catch (err) {
      console.error(err);
      alert("אירעה שגיאה בעת העדכון");
    }
  };

  const deleteRecipe = async () => {
    if (confirm("האם את בטוחה שברצונך למחוק את המתכון?")) {
      try {
        await axios.delete(`http://localhost:3000/api/recipe/${id}`);
        alert("המתכון נמחק");
        nav("/recipes");
      } catch (err) {
        console.error(err);
        alert("שגיאה במחיקה");
      }
    }
  };

  return (
    <div className="edit-recipe">
      <h2>עריכת מתכון</h2>

      <input
        type="text"
        value={recipe.Name}
        onChange={(e) => handleChange("Name", e.target.value)}
        placeholder="שם המתכון"
      />
      <textarea
        value={recipe.Description}
        onChange={(e) => handleChange("Description", e.target.value)}
        placeholder="תיאור"
      />
      <input
        type="text"
        value={recipe.Img}
        onChange={(e) => handleChange("Img", e.target.value)}
        placeholder="קישור לתמונה"
      />
      <input
        type="number"
        value={recipe.Duration}
        onChange={(e) => handleChange("Duration", +e.target.value)}
        placeholder="זמן הכנה בדקות"
      />

      <select
        value={recipe.Difficulty}
        onChange={(e) => handleChange("Difficulty", +e.target.value)}
      >
        <option value={1}>קל</option>
        <option value={2}>בינוני</option>
        <option value={3}>קשה</option>
      </select>

      <h4>רכיבים:</h4>
      {recipe.Ingredients.map((ing, idx) => (
        <div key={idx}>
          <input
            type="text"
            placeholder="שם"
            value={ing.Name || ""}
            onChange={(e) => handleIngredientChange(idx, "Name", e.target.value)}
          />
          <input
            type="text"
            placeholder="כמות"
            value={ing.Count || ""}
            onChange={(e) => handleIngredientChange(idx, "Count", e.target.value)}
          />
          <input
            type="text"
            placeholder="יחידה"
            value={ing.Type || ""}
            onChange={(e) => handleIngredientChange(idx, "Type", e.target.value)}
          />
          <button onClick={() => removeIngredient(idx)}>הסר</button>
        </div>
      ))}
      <button onClick={addIngredient}>➕ הוסף רכיב</button>

      <h4>שלבי הכנה:</h4>
      {recipe.Instructions.map((inst, idx) => (
        <div key={idx}>
          <textarea
            value={inst.Name || ""}
            onChange={(e) => handleInstructionChange(idx, e.target.value)}
          />
          <button onClick={() => removeInstruction(idx)}>הסר</button>
        </div>
      ))}
      <button onClick={addInstruction}>➕ הוסף שלב</button>

      <br /><br />
      <button onClick={updateRecipe}>💾 עדכן מתכון</button>
      <button onClick={deleteRecipe} style={{ backgroundColor: "crimson" }}>
        🗑️ מחיקת מתכון
      </button>
    </div>
  );
};

export default EditRecipe;
