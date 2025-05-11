import { makeAutoObservable } from "mobx";
import { Recipe } from "../types/Types";

class MobxRec {
  currRecipe: Recipe | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setCurrRecipe = (rec: Recipe) => {
    this.currRecipe = rec;
  };

  getCurrRecipe = () => {
    return this.currRecipe;
  };

  clearRecipe = () => {
    this.currRecipe = null;
  };
}

export default new MobxRec();
