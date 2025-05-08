// types.ts

export type User = {
    Id: number;
    Name: string;
    Password: string;
    UserName: string;
    Phone: string;
    Email: string;
    Tz: string;
  };
  
  export type Category = {
    Id: number;
    Name: string;
  };
  
  export type Ingredient = {
    Name: string;
    Count: string;
    Type: string;
  };
  
  export type Instruction = {
    Name: string;
  };
  
  // טיפוס מלא כפי שמתקבל מהשרת
  export type Recipe = {
    Id: number;
    Name: string;
    Img: string;
    Description: string;
    Difficulty: number; // ← מספר, לפי השרת
    Duration: number;
    Ingredients: Ingredient[];
    Instructions: Instruction[];
    CategoryId: number;
    UserId: number;
  };
  
  // טיפוס ליצירת מתכון חדש (לשליחה לשרת)
  export type RecipeCreate = {
    Name: string;
    Img: string;
    Description: string;
    Difficulty: 'קל' | 'בינוני' | 'קשה'; // ← עדיין מחרוזת, כי זה מה שאת שולחת מהטופס
    Duration: number;
    Ingredients: Ingredient[];
    Instructions: Instruction[];
    CategoryId: string;
    UserId: number;
  };
  