import { Outlet, useNavigate } from "react-router-dom";
import "../styles/Home.css";
import { userContext } from "../context/userContext";
import { useContext } from "react";
import { AppBar, Box, Button, Toolbar, Typography, IconButton } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Home = () => {
  const { Myuser, setMyUser } = useContext(userContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setMyUser(null);
    navigate("/");
  };

  return (
    <div className="home-container">
      <AppBar position="static" color="primary">
        <Toolbar className="navbar-toolbar">
          {Myuser ? (
            <>
              <Button color="inherit" onClick={() => navigate("/")}>
                <HomeIcon sx={{ mr: 1 }} /> בית
              </Button>
              <Button color="inherit" onClick={() => navigate("/ShowRecipes")}>
                <MenuBookIcon sx={{ mr: 1 }} /> הצגת מתכונים
              </Button>
              <Button color="inherit" onClick={() => navigate("/add-recipe")}>
                <AddCircleOutlineIcon sx={{ mr: 1 }} /> הוספת מתכון
              </Button>
              <Box sx={{ flexGrow: 1 }} />
              <Typography variant="subtitle1" sx={{ mr: 2 }}>
                שלום, {Myuser.Name}
              </Typography>
              <IconButton color="inherit" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate("/Login")}>
                <LoginIcon sx={{ mr: 1 }} /> התחברות
              </Button>
              <Button color="inherit" onClick={() => navigate("/Register")}>
                <PersonAddIcon sx={{ mr: 1 }} /> הרשמה
              </Button>
              <Button color="inherit" onClick={() => navigate("/ShowRecipes")}>
                <MenuBookIcon sx={{ mr: 1 }} /> הצגת מתכונים
              </Button>
              <Box sx={{ flexGrow: 1 }} />
              <AccountCircleIcon />
            </>
          )}
        </Toolbar>
      </AppBar>

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

      <Outlet />
    </div>
  );
};

export default Home;
