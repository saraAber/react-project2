// מודל קטגוריה
export type Category = {
  Id: number;
  Name: string;
};

// מודל רכיב
export type Ingredient = {
  Name: string;
  Count: string;
  Type: string;
};

// מודל הוראה
export type Instruction = {
  Name: string;
};

// מודל מתכון לצורך הצגת מתכון (כולל Id)
export type Recipe = {
  Id: number; // מזהה המתכון
  Name: string; // שם המתכון
  Img: string; // URL של התמונה
  Description: string; // תיאור המתכון
  Difficulty: "קל" | "בינוני" | "קשה"; // רמת הקושי
  Duration: number; // זמן הכנה בדקות
  CategoryId: number; // מזהה הקטגוריה
  UserId: number; // מזהה המשתמש שיצר את המתכון
  Ingredients: Ingredient[]; // רשימת רכיבים
  Instructions: Instruction[]; // רשימת הוראות הכנה
  Category: Category; // קטגוריה של המתכון
  User: User; // מידע על המשתמש שיצר את המתכון
};


// מודל מתכון ליצירה
export type RecipeCreate = {
  Name: string;
  Img: string;
  Description: string;
  Difficulty: "קל" | "בינוני" | "קשה";
  Duration: number;
  CategoryId: number;
  Ingredients: Ingredient[];
  Instructions: Instruction[];
  UserId: number; // ה-UserId בהגשה
};

// מודל מתכון לעריכה
export type RecipeEdit = RecipeCreate & {
  Id: number; // הוספת Id לעריכה
};

// טיפוס של משתמש – אם צריך להשלים את הנתונים על המשתמש
export type User = {
  Id: number;
  Name: string;
  Email: string;
  // כל פרט נוסף שצריך כאן
};
