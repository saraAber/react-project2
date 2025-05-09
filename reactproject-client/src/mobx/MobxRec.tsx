import { makeAutoObservable } from "mobx";
import { Recipe } from "../types/Types";

class RecipesStore {
  currRecipe: Recipe | null = null;
  recipes: Recipe[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setCurrentRecipe(recipe: Recipe) {
    this.currRecipe = recipe;
  }

  get getCurrentRecipe() {
    return this.currRecipe;
  }

  setAllRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
  }

  get getAllRecipes() {
    return this.recipes;
  }

  get filteredRecipes() {
    return (filter: {
      category: string;
      difficulty: string;
      time: string;
      user: string;
    }) => {
      return this.recipes.filter((rec) => {
        const matchesCategory =
          filter.category === "" || rec.CategoryId === parseInt(filter.category);
        const matchesDifficulty =
          filter.difficulty === "" || rec.Difficulty === filter.difficulty;
        const matchesTime =
          filter.time === "" || rec.Duration <= parseInt(filter.time);
        const matchesUser =
          filter.user === "" || rec.User.Name.includes(filter.user);

        return matchesCategory && matchesDifficulty && matchesTime && matchesUser;
      });
    };
  }
}

const recipesStore = new RecipesStore();
export default recipesStore; // ✅ ודא שהייצוא הוא default
