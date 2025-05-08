import { Link, Outlet, useNavigate } from "react-router-dom";
import "../styles/Home.css";
import { userContext } from "../context/userContext";
import { useContext, useState } from "react";
import { Box, Typography } from "@mui/material";

const Home = () => {
  const nav = useNavigate();
  const { Myuser } = useContext(userContext);
  const [navigateState, setNavigateState] = useState(0);

  return (
    <>
      <div className="home-container">

        {/* הודעת ברכה עם MUI */}
        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Typography variant="h3" color="primary" gutterBottom>
            ברוכים הבאים לאפליקציית המטבח שלי
          </Typography>
          <Typography variant="h5" color="white">
            {Myuser
              ? `שלום ${Myuser.Name}, כיף שחזרת!`
              : 'היכנסי כדי להתחיל לבשל ולשתף מתכונים'}
          </Typography>
        </Box>

        {/* כפתורים מעוצבים באותו סגנון */}
        <div className="button-container">
          {Myuser && (
            <button onClick={() => nav("/add-recipe")}>add recipe</button>
          )}
          {!Myuser && (
            <>
              <button onClick={() => { setNavigateState(1); nav("/Login") }}>login</button>
              <button onClick={() => { setNavigateState(1); nav("/Register") }}>register</button>
            </>
          )}
          <button onClick={() => { setNavigateState(0); nav("/Home"); }}>home</button>

          {navigateState === 0 && (
            <button onClick={() => { setNavigateState(1); nav("/RecipesList") }}>
              For a taste of our recipes
            </button>
          )}
        </div>

        {/* אזור טעינה של child routes */}
        <Outlet />
      </div>
    </>
  );
};

export default Home;
