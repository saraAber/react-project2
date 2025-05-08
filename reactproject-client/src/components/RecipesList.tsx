import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Recipe, Category } from "../types/Types";
import axios from "axios";
import "../styles/RecipesList.css";

const RecipesList = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState({ category: '', difficulty: '', time: '' });
  const nav = useNavigate();

  // שליפת מתכונים
  useEffect(() => {
    axios.get("http://localhost:3000/api/recipe").then((res) => {
      const data = res.data.map((rec: any) => ({
        ...rec,
        Ingredients: rec.Ingredients ?? [],
        Instructions: rec.Instructions ?? [],
      }));
      setRecipes(data);
    });
  }, []);

  // שליפת קטגוריות
  useEffect(() => {
    axios.get("http://localhost:3000/api/category").then((res) => {
      setCategories(res.data);
    });
  }, []);

  const handleDelete = (id: number) => {
    axios.delete(`http://localhost:3000/api/recipe/${id}`).then(() => {
      setRecipes(recipes.filter(rec => rec.Id !== id));
    });
  };

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

  const filteredRecipes = recipes.filter(rec => {
    const matchesCategory = filter.category === '' || rec.CategoryId === parseInt(filter.category);
    const matchesDifficulty = filter.difficulty === '' || rec.Difficulty === parseInt(filter.difficulty);
    const matchesTime = filter.time === '' || rec.Duration <= parseInt(filter.time);

    return matchesCategory && matchesDifficulty && matchesTime;
  });

  return (
    <div className="recipes-list">
      <h2>רשימת מתכונים</h2>

      {/* סינון */}
      <div className="filters">
        <select onChange={(e) => setFilter({ ...filter, category: e.target.value })}>
          <option value="">בחר קטגוריה</option>
          {categories.map(cat => (
            <option key={cat.Id} value={cat.Id}>{cat.Name}</option>
          ))}
        </select>

        <select onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}>
          <option value="">בחר רמת קושי</option>
          <option value="1">קל</option>
          <option value="2">בינוני</option>
          <option value="3">קשה</option>
        </select>

        <input
          type="number"
          placeholder="משך זמן (דקות)"
          onChange={(e) => setFilter({ ...filter, time: e.target.value })}
        />
      </div>

      {filteredRecipes.map((rec) => (
        <div key={rec.Id} className="recipe-card">
          <h5 onClick={() => nav(`/recipe/${rec.Id}`)}>{rec.Name}</h5>
          <p><strong>רמת קושי:</strong> {getDifficultyText(rec.Difficulty)}</p>
          <p>{rec.Description}</p>
          <button onClick={() => handleDelete(rec.Id)}>מחק</button>
          <button onClick={() => nav(`/edit-recipe/${rec.Id}`)}>ערוך</button>
        </div>
      ))}
    </div>
  );
};

export default RecipesList;
