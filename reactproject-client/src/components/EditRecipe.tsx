import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { Snackbar } from "@mui/material";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MobxRec from "../mobx/MobxRec";
import { CategoriesContext } from "../context/CategoriesContext";
import { userContext } from "../context/userContext";

const difficultyMap = {
  1: "קל",
  2: "בינוני",
  3: "קשה",
};

const validationSchema = yup.object({
  Name: yup.string().required("שם חובה"),
  Difficulty: yup.string().required("דרגת קושי חובה"),
  Duration: yup.number().typeError("חובה מספר").required("משך זמן חובה"),
  Description: yup.string().required("תיאור חובה"),
  Categoryid: yup
    .mixed()
    .test("is-number", "יש לבחור קטגוריה", (value) => typeof value === "number" && !isNaN(value))
    .required("קטגוריה חובה"),
  Img: yup.string().notRequired(),
  Instructions: yup.array().of(
    yup.object({ Name: yup.string().required("הוראה חובה") })
  ),
  Ingridents: yup.array().of(
    yup.object({
      Name: yup.string().required("שם רכיב חובה"),
      Count: yup.number().required("כמות רכיב חובה").typeError("הכמות חייבת להיות מספר"),
      Type: yup.string().required("סוג רכיב חובה"),
    })
  ),
});

const EditRecipe: React.FC = () => {
  const { categories } = useContext(CategoriesContext);
  const { Myuser } = useContext(userContext);
  const [msg, setMsg] = useState<string | null>(null);
  const nav = useNavigate();
  const currentRecipe = MobxRec.getCurrRecipe();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      Name: "",
      Difficulty: "",
      Duration: 0,
      Description: "",
      Categoryid: 0,
      Img: "",
      Instructions: [{ Name: "" }],
      Ingridents: [{ Name: "", Count: 0, Type: "" }],
    },
  });

  const { fields: instructionFields, append: appendInstruction, remove: removeInstruction } = useFieldArray({
    control,
    name: "Instructions",
  });

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control,
    name: "Ingridents",
  });

  useEffect(() => {
    if (currentRecipe && categories?.length) {
      reset({
        Name: currentRecipe.Name || "",
        Difficulty: difficultyMap[Number(currentRecipe.Difficulty) as 1 | 2 | 3] || "",
        Duration: currentRecipe.Duration || 0,
        Description: currentRecipe.Description || "",
        Categoryid: Number(currentRecipe.Categoryid) || 0,
        Img: currentRecipe.Img || "",
        Instructions: currentRecipe.Instructions?.length
          ? currentRecipe.Instructions
          : [{ Name: "" }],
        Ingridents: currentRecipe.Ingridents?.length
          ? currentRecipe.Ingridents
          : [{ Name: "", Count: 0, Type: "" }],
      });
    }
  }, [currentRecipe, reset, categories]);

  const onSubmit = async (data: any) => {
    const recipeId = currentRecipe?.Id;
    if (!recipeId) return;

    // המרת Difficulty לטיפוס מספר
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
      default:
        difficultyValue = 0;
    }

    // ברירת מחדל לתמונה
    const finalImg = data.Img?.trim()
      ? data.Img
      : "https://default-image-url.com/image.jpg";

    const updatedData = {
      ...data,
      Difficulty: difficultyValue,
      Categoryid: Number(data.Categoryid),
      Img: finalImg,
      Id: recipeId,
      UserId: Myuser?.Id,
    };

    try {
      const response = await axios.post("http://localhost:8080/api/recipe/edit", updatedData);
      setMsg("המתכון התעדכן בהצלחה 🎉");
      setTimeout(() => nav("/RecipesList"), 1000);
      if (response.data) {
        MobxRec.setCurrRecipe(response.data);
      } else {
        const getResp = await axios.get(`http://localhost:8080/api/recipe/byId/${recipeId}`);
        MobxRec.setCurrRecipe(getResp.data);
      }

      nav(`/RecipesList/RecipeDetail/${updatedData.Name}`);
    } catch (error) {
      console.error("שגיאה בעדכון מתכון:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("האם אתה בטוח שברצונך למחוק את המתכון?")) return;

    try {
      await axios.post(`http://localhost:8080/api/recipe/delete/${currentRecipe?.Id}`, { Id: currentRecipe?.Id });
      setMsg("המתכון נמחק בהצלחה 🎉");
      setTimeout(() => nav("/RecipesList"), 1000);
      nav("/RecipesList");
    } catch (error) {
      console.error("Error deleting recipe", error);
      alert("שגיאה במחיקת המתכון");
    }
  };

 


  return (
    <Box display="flex" justifyContent="center" mt={2}>
      <Card sx={{ width: 650, padding: 2 }}>
        <CardContent>
          <Typography variant="h6" textAlign="center" gutterBottom>
            ערוך מתכון
          </Typography>
          {msg && (
            <Typography color="success.main" textAlign="center" sx={{ mt: 2 }}>
              {msg}
            </Typography>
          )}
       

          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller name="Name" control={control} render={({ field }) => (
              <TextField {...field} label="שם" fullWidth size="small" error={!!errors.Name} helperText={errors.Name?.message} sx={{ mb: 1 }} />
            )} />
            <Controller name="Description" control={control} render={({ field }) => (
              <TextField {...field} label="תיאור" fullWidth size="small" error={!!errors.Description} helperText={errors.Description?.message} sx={{ mb: 1 }} />
            )} />
            <Controller name="Img" control={control} render={({ field }) => (
              <TextField {...field} label="URL תמונה" fullWidth size="small" error={!!errors.Img} helperText={errors.Img?.message} sx={{ mb: 1 }} />
            )} />
            <Controller name="Difficulty" control={control} render={({ field }) => (
              <TextField {...field} label="דרגת קושי" select fullWidth size="small" error={!!errors.Difficulty} helperText={errors.Difficulty?.message} sx={{ mb: 1 }}>
                <MenuItem value="קל">קל</MenuItem>
                <MenuItem value="בינוני">בינוני</MenuItem>
                <MenuItem value="קשה">קשה</MenuItem>
              </TextField>
            )} />
            <Controller name="Duration" control={control} render={({ field }) => (
              <TextField {...field} label="משך זמן (דקות)" fullWidth type="number" size="small" error={!!errors.Duration} helperText={errors.Duration?.message} sx={{ mb: 1 }} />
            )} />
            <Controller name="Categoryid" control={control} render={({ field }) => (
              <TextField {...field} label="קטגוריה" select fullWidth size="small" error={!!errors.Categoryid} helperText={errors.Categoryid?.message} sx={{ mb: 1 }}>
                <MenuItem value={0}>בחר קטגוריה</MenuItem>
                {categories?.map((cat) => (
                  <MenuItem key={cat.Id} value={cat.Id}>{cat.Name}</MenuItem>
                ))}
              </TextField>
            )} />
            <Box mb={2}>
              <Typography variant="subtitle1">רכיבים</Typography>
              {ingredientFields.map((item, index) => (
                <Box key={item.id} display="flex" gap={1} alignItems="center" mb={1}>
                  <Controller name={`Ingridents.${index}.Name`} control={control} render={({ field }) => (
                    <TextField {...field} label="שם" size="small" />
                  )} />
                  <Controller name={`Ingridents.${index}.Count`} control={control} render={({ field }) => (
                    <TextField {...field} label="כמות" size="small" type="number" />
                  )} />
                  <Controller name={`Ingridents.${index}.Type`} control={control} render={({ field }) => (
                    <TextField {...field} label="סוג" size="small" />
                  )} />
                  <IconButton onClick={() => removeIngredient(index)}><RemoveCircleIcon /></IconButton>
                </Box>
              ))}
              <Button startIcon={<AddCircleIcon />} onClick={() => appendIngredient({ Name: "", Count: 0, Type: "" })}>
                הוסף רכיב
              </Button>
            </Box>
            <Box mb={2}>
              <Typography variant="subtitle1">הוראות</Typography>
              {instructionFields.map((item, index) => (
                <Box key={item.id} display="flex" alignItems="center" mb={1}>
                  <Controller name={`Instructions.${index}.Name`} control={control} render={({ field }) => (
                    <TextField {...field} label={`הוראה ${index + 1}`} size="small" fullWidth />
                  )} />
                  <IconButton onClick={() => removeInstruction(index)}><RemoveCircleIcon /></IconButton>
                </Box>
              ))}
              <Button startIcon={<AddCircleIcon />} onClick={() => appendInstruction({ Name: "" })}>
                הוסף הוראה
              </Button>
            </Box>
            {Myuser && currentRecipe?.UserId === Myuser.Id ? (
              <>
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
                  עדכן מתכון
                </Button>
                <Button onClick={handleDelete} fullWidth variant="outlined" color="error" startIcon={<DeleteIcon />} sx={{ mt: 1 }}>
                  מחק מתכון
                </Button>
              </>
            ) : (
              <Typography color="error" sx={{ mt: 2 }}>
                אין לך הרשאה לערוך או למחוק את המתכון
              </Typography>
            )}
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditRecipe;
