import React, { useContext, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { userContext } from "../context/userContext";
import { Category, Ingredient, Instruction, RecipeCreate } from "../types/Types";
import { useNavigate } from "react-router-dom";
import "../styles/RecipeForm.css";

const AddRecipe: React.FC = () => {
  const { Myuser } = useContext(userContext);
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue, // הוספת setValue כדי לקבוע ערכים ב-form
    formState: { errors },
  } = useForm<RecipeCreate>({
    defaultValues: {
      Name: "",
      Img: "",
      Description: "",
      Difficulty: "קל",
      Duration: 0,
      CategoryId: 0, // מתאים לערך של CategoryId שהוא מספר
      Ingredients: [{ Name: "", Count: "", Type: "" }],
      Instructions: [{ Name: "" }],
      UserId: Myuser?.Id ?? 0, // ודא שמשתמשים בזה נכון
    },
  });

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({ control, name: "Ingredients" });
  const { fields: instructionFields, append: appendInstruction, remove: removeInstruction } = useFieldArray({ control, name: "Instructions" });

  useEffect(() => {
    axios.get("http://localhost:8080/api/category")
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  const validateImageUrl = (value: string) => {
    if (!value) return true; // לא חובה
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(value);
    const isGoogleDrive = /^https:\/\/drive\.google\.com\/.*?\/(view|file)/.test(value);
    return isImage || isGoogleDrive || "קישור לתמונה לא תקין";
  };

  const onSubmit = (data: RecipeCreate) => {
    data.UserId = Myuser?.Id ?? 0; // ודא שה-ID לא ריק
    axios.post("http://localhost:8080/api/recipe", data)
      .then(() => navigate("/"))
      .catch(err => console.error(err));
  };

  return (
    <form className="recipe-form" onSubmit={handleSubmit(onSubmit)}>
      <h2>הוספת מתכון</h2>

      <div className="field">
        <label>שם</label>
        <input {...register("Name", { required: "שדה חובה" })} />
        {errors.Name && <span className="error">{errors.Name.message}</span>}
      </div>

      <div className="field">
        <label>תיאור</label>
        <textarea {...register("Description", { required: "שדה חובה" })} />
        {errors.Description && <span className="error">{errors.Description.message}</span>}
      </div>

      <div className="field">
        <label>תמונה (URL)</label>
        <input {...register("Img", { validate: validateImageUrl })} />
        {errors.Img && <span className="error">{errors.Img.message}</span>}
      </div>

      <div className="field">
        <label>רמת קושי</label>
        <select {...register("Difficulty", { required: true })}>
          <option value="קל">קל</option>
          <option value="בינוני">בינוני</option>
          <option value="קשה">קשה</option>
        </select>
      </div>

      <div className="field">
        <label>משך זמן (בדקות)</label>
        <input type="number" {...register("Duration", { min: 1 })} />
        {errors.Duration && <span className="error">זמן לא תקין</span>}
      </div>

      <div className="field">
        <label>קטגוריה</label>
        <select {...register("CategoryId", { required: "בחר קטגוריה" })}>
          <option value={0}>בחר</option>
          {categories.map(cat => (
            <option key={cat.Id} value={cat.Id}>{cat.Name}</option>
          ))}
        </select>
        {errors.CategoryId && <span className="error">{errors.CategoryId.message}</span>}
      </div>

      <div>
        <h4>רכיבים</h4>
        {ingredientFields.map((_, index) => (
          <div key={index} className="field">
            <input placeholder="שם" {...register(`Ingredients.${index}.Name`, { required: true })} />
            <input placeholder="כמות" {...register(`Ingredients.${index}.Count`, { required: true })} />
            <input placeholder="סוג" {...register(`Ingredients.${index}.Type`, { required: true })} />
            <button type="button" onClick={() => removeIngredient(index)}>x</button>
          </div>
        ))}
        <button type="button" onClick={() => appendIngredient({ Name: "", Count: "", Type: "" })}>הוסף רכיב</button>
      </div>

      <div>
        <h4>הוראות הכנה</h4>
        {instructionFields.map((_, index) => (
          <div key={index} className="field">
            <input placeholder="הוראה" {...register(`Instructions.${index}.Name`, { required: true })} />
            <button type="button" onClick={() => removeInstruction(index)}>x</button>
          </div>
        ))}
        <button type="button" onClick={() => appendInstruction({ Name: "" })}>הוסף הוראה</button>
      </div>

      <button className="submit-btn" type="submit">שלח</button>
    </form>
  );
};

export default AddRecipe;
