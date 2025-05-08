import React, { useContext } from 'react';
import axios from 'axios';
import { useForm, useFieldArray } from 'react-hook-form';
import { userContext } from '../context/userContext';
import { RecipeCreate } from '../types/Types';
import '../styles/AddRecipe.css';

const isValidImageUrl = (url: string) => {
  return /\.(jpeg|jpg|png|gif|bmp|webp)$/i.test(url);
};

const AddRecipe = () => {
  const { Myuser } = useContext(userContext);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors }
  } = useForm<RecipeCreate>({
    defaultValues: {
      Name: '',
      Img: '',
      Description: '',
      Difficulty: 'קל',
      Duration: 0,
      Ingredients: [],
      Instructions: [],
      CategoryId: '',
      UserId: Myuser?.Id || 0
    }
  });

  const { fields: ingredientFields, append: appendIngredient } = useFieldArray({
    control,
    name: 'Ingredients'
  });

  const { fields: instructionFields, append: appendInstruction } = useFieldArray({
    control,
    name: 'Instructions'
  });

  const onSubmit = async (data: RecipeCreate) => {
    if (!isValidImageUrl(data.Img)) {
      alert("הקישור לא תקין. אנא הוסף קישור לתמונה.");
      return;
    }

    const difficultyMap: Record<string, number> = {
      'קל': 1,
      'בינוני': 2,
      'קשה': 3,
    };

    const recipeToSend = {
      ...data,
      Difficulty: difficultyMap[data.Difficulty] || 1,
    };

    try {
      await axios.post('http://localhost:8080/api/recipe', recipeToSend, {
        headers: { 'Content-Type': 'application/json' }
      });
      alert('המתכון נוסף בהצלחה!');
    } catch (err) {
      console.error(err);
      alert('שגיאה בהוספת המתכון');
    }
  };

  return (
    <div className="add-recipe-wrapper">
      <div className="add-recipe-card">
        <h2 className="add-recipe-title">הוספת מתכון חדש</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register("Name", { required: true })} placeholder="שם מתכון" />

          <input {...register("Img")} placeholder="קישור לתמונה (URL בלבד)" />

          <textarea {...register("Description", { required: true })} placeholder="תיאור" />

          <input type="number" {...register("Duration", { required: true })} placeholder="משך זמן הכנה (בדקות)" />

          <select {...register("Difficulty", { required: true })}>
            <option value="קל">קל</option>
            <option value="בינוני">בינוני</option>
            <option value="קשה">קשה</option>
          </select>

          <input {...register("CategoryId", { required: true })} placeholder="קטגוריה" />

          <div className="ingredients-and-steps">
            <div className="ingredient-section">
              <h3>רכיבים</h3>
              {ingredientFields.map((item, index) => (
                <div className="inline-group" key={item.id}>
                  <span className="ingredient-number">{index + 1}.</span>
                  <input {...register(`Ingredients.${index}.Name` as const)} placeholder="שם" />
                  <input {...register(`Ingredients.${index}.Count` as const)} placeholder="כמות" />
                  <input {...register(`Ingredients.${index}.Type` as const)} placeholder="יחידה" />
                </div>
              ))}
              <button type="button" className="add-button" onClick={() => appendIngredient({ Name: '', Count: '', Type: '' })}>
                ➕ הוסף רכיב
              </button>
            </div>

            <div className="step-section">
              <h3>שלבי הכנה</h3>
              {instructionFields.map((item, index) => (
                <div key={item.id} className="instruction-group">
                  <span className="instruction-number">{index + 1}.</span>
                  <textarea {...register(`Instructions.${index}.Name` as const)} placeholder={`שלב ${index + 1}`} />
                </div>
              ))}
              <button type="button" className="add-button" onClick={() => appendInstruction({ Name: '' })}>
                ➕ הוסף שלב
              </button>
            </div>
          </div>

          <button type="submit">📤 שלח מתכון</button>
        </form>
      </div>
    </div>
  );
};

export default AddRecipe;
