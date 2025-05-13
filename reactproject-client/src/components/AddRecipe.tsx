import React, { useContext, useState } from "react";
import {
  useForm,
  Controller,
} from "react-hook-form";
import {
  Button, Card, CardContent, Typography, TextField, MenuItem, Box,
  IconButton
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { userContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { CategoriesContext } from "../context/CategoriesContext";

const validationSchema = yup.object({
  Name: yup.string().required("שם חובה"),
  Difficulty: yup.string().required("דרגת קושי חובה"),
  Duration: yup
    .number()
    .typeError("חובה מספר")
    .required("משך זמן חובה")
    .moreThan(0, "משך הזמן חייב להיות גדול מ־0"),
  Description: yup.string().required("תיאור חובה"),
  Categoryid: yup
    .mixed()
    .test("is-number", "יש לבחור קטגוריה", (value) => {
      return typeof value === "number" && !isNaN(value);
    })
    .required("קטגוריה חובה"),
  Img: yup.string().notRequired(),
  Instructions: yup.array().of(
    yup.object({ Name: yup.string().required("הוראה חובה") })
  ),
  Ingridents: yup.array().of(
    yup.object({
      Name: yup.string().required("שם רכיב חובה"),
      Count: yup
        .number()
        .typeError("הכמות חייבת להיות מספר")
        .moreThan(0, "הכמות חייבת להיות גדולה מ־0"),
      Type: yup.string().required("סוג רכיב חובה"),
    })
  ),
});

const AddRecipe = () => {
  const { categories } = useContext(CategoriesContext);
  const { Myuser } = useContext(userContext);
  const [msg, setMsg] = useState<string | null>(null);
  const nav = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      Name: "",
      Difficulty: "",
      Duration: 0,
      Description: "",
      Categoryid: "",
      Img: "",  // אם לא נמסר URL לתמונה, תוכל להשתמש בברירת מחדל
      Instructions: [{ Name: "" }],
      Ingridents: [{ Name: "", Count: 0, Type: "" }],
    },
  });

  const onSubmit = async (data: any) => {
    // if (!Myuser?.Id) {
    //   setMsg("משתמש לא מחובר. לא ניתן להוסיף מתכון");
    //   return;
    // }
  
    // המרת דרגת קושי
    let difficultyValue;
    switch (data.Difficulty) {
      case "קל":
        difficultyValue = 1;
        break;
      case "בינוני":
        difficultyValue = 2;
        break;
      case "קשה":
        difficultyValue = 3;
        break;
    }
  
    const updatedData = {
      ...data,
      Difficulty: difficultyValue,
      UserId: Myuser?.Id,
      Img: data.Img || "/images/aaa.jpg",
    };
  
    try {
      await axios.post(`http://localhost:8080/api/recipe`, updatedData);
      setMsg("המתכון נוסף בהצלחה 🎉");
      setTimeout(() => nav("/RecipeDetail"), 1000);
    } catch (error) {
      setMsg("שגיאה בהוספת מתכון. ודא שכל השדות מולאו כראוי.");
      console.error(error);
    }
  };
  


  return (
    <Box display="flex" justifyContent="center" mt={2}>
      <Card sx={{ width: 650, padding: 2 }}>
        <CardContent>
          <Typography variant="h6" textAlign="center" gutterBottom>
            הוסף מתכון
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Name */}
            <Controller
              name="Name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="שם"
                  fullWidth
                  size="small"
                  error={!!errors.Name}
                  helperText={errors.Name?.message}
                  sx={{ mb: 1 }}
                />
              )}
            />


            {/* Difficulty */}
            <Controller
              name="Difficulty"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="דרגת קושי"
                  fullWidth
                  select
                  size="small"
                  error={!!errors.Difficulty}
                  helperText={errors.Difficulty?.message}
                  sx={{ mb: 1 }}
                >
                  <MenuItem value="קל">קל</MenuItem>
                  <MenuItem value="בינוני">בינוני</MenuItem>
                  <MenuItem value="קשה">קשה</MenuItem>
                </TextField>
              )}
            />

            {/* Duration */}
            <Controller
              name="Duration"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="משך זמן (דקות)"
                  fullWidth
                  size="small"
                  type="number"
                  error={!!errors.Duration}
                  helperText={errors.Duration?.message}
                  sx={{ mb: 1 }}
                />
              )}
            />

            {/* Description */}
            <Controller
              name="Description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="תיאור"
                  fullWidth
                  size="small"
                  error={!!errors.Description}
                  helperText={errors.Description?.message}
                  sx={{ mb: 1 }}
                />
              )}
            />

            {/* Category */}
            <Controller
              name="Categoryid"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="קטגוריה"
                  fullWidth
                  select
                  size="small"
                  error={!!errors.Categoryid}
                  helperText={errors.Categoryid?.message}
                  sx={{ mb: 1 }}
                  value={field.value ?? ""} // כדי שלא תהיה בעיה בטייפ
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val === "" ? "" : Number(val));
                  }}
                >
                  <MenuItem value="">בחר קטגוריה</MenuItem>
                  {categories?.map((cat) => (
                    <MenuItem key={cat.Id} value={cat.Id}>
                      {cat.Name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />



            {/* Image URL */}
            <Controller
              name="Img"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="URL תמונה"
                  fullWidth
                  size="small"
                  error={!!errors.Img}
                  helperText={errors.Img?.message}
                  sx={{ mb: 2 }}
                />
              )}
            />

            {/* Ingredients */}
            <Box mb={2}>
              <Typography variant="subtitle1">רכיבים</Typography>
              <Controller
                name="Ingridents"
                control={control}
                render={({ field }) => (
                  <>
                    {(field.value || []).map((ing, index) => (
                      <Box key={index} display="flex" gap={1} alignItems="center" mb={1}>
                        <TextField
                          label={`רכיב ${index + 1}`}
                          value={ing.Name}
                          onChange={(e) => {
                            const newList = [...(field.value || [])];  // אם field.value הוא undefined, השתמש במערך ריק
                            newList[index].Name = e.target.value;
                            field.onChange(newList);
                          }}
                          size="small"
                        />
                        <TextField
                          label="כמות"
                          value={ing.Count}
                          onChange={(e) => {
                            const newList = [...(field.value || [])];
                            newList[index].Count = Number(e.target.value); // ודא שהערך הוא מספר
                            field.onChange(newList);
                          }}
                          size="small"
                        />
                        <TextField
                          label="סוג"
                          value={ing.Type}
                          onChange={(e) => {
                            const newList = [...(field.value || [])];
                            newList[index].Type = e.target.value;
                            field.onChange(newList);
                          }}
                          size="small"
                        />
                        <IconButton
                          onClick={() => {
                            const newList = [...(field.value || [])];
                            newList.splice(index, 1); // שימוש ב-splice להסרת רכיב
                            field.onChange(newList);
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Box>
                    ))}
                    <Button
                      startIcon={<AddCircleIcon />}
                      // עבור רכיבים (Ingredients)
                      onClick={() =>
                        field.onChange([
                          ...(field.value || []),  // אם אין ערך, השתמש במערך ריק
                          { Name: "", Count: 0, Type: "" },
                        ])
                      }
                    >
                      הוסף רכיב
                    </Button>
                  </>
                )}
              />
            </Box>

            {/* Instructions */}
            <Box mb={2}>
              <Typography variant="subtitle1">הוראות</Typography>
              <Controller
                name="Instructions"
                control={control}
                render={({ field }) => (
                  <>
                    {(field.value || []).map((instruction, index) => (
                      <Box key={index} display="flex" alignItems="center" mb={1}>
                        <TextField
                          label={`הוראה ${index + 1}`}
                          value={instruction.Name}
                          onChange={(e) => {
                            const newList = [...(field.value || [])];  // אם field.value הוא undefined, השתמש במערך ריק
                            newList[index].Name = e.target.value;
                            field.onChange(newList);
                          }}
                          fullWidth
                          size="small"
                        />
                        <IconButton
                          onClick={() => {
                            const newList = [...(field.value || [])];
                            newList.splice(index, 1); // שימוש ב-splice להסרת הוראה
                            field.onChange(newList);
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Box>
                    ))}
                    <Button
                      startIcon={<AddCircleIcon />}
                      onClick={() => field.onChange([... (field.value || []), { Name: "" }])}
                    >
                      הוסף הוראה
                    </Button>
                  </>
                )}
              />
            </Box>

            {/* Submit Button */}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
              שלח
            </Button>
            {msg && (
              <Typography
                variant="body1"
                color={msg.includes("שגיאה") ? "error" : "primary"}
                textAlign="center"
                sx={{ mt: 2 }}
              >
                {msg}
              </Typography>
            )}

          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddRecipe;
