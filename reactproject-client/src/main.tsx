import { createRoot } from 'react-dom/client';
import './styles/index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import AddRecipe from './components/AddRecipe';
import EditRecipe from './components/EditRecipe';
import RecipesList from './components/RecipesList';
import RecipeDetail from './components/RecipeDetail';
import userContext from './context/userContext';

const routes = createBrowserRouter([
  {
    path: "*", element: <App />, children: [
      
      {
        path: "Login",
        element: <Login />
      },
      {
        path: "Register",
        element: <Register />
      },
      {
        path: "RecipeDetail/:id",
        element: <RecipeDetail />
      }
      ,
      {
        path: "edit-recipe/:id",
        element: <EditRecipe />
      } // עדכון ל-:id
      ,
      {
        path: "ShowRecipes",
        element: <RecipesList />,
        // children: [
        //   { path: "RecipeDetail/:id", element: <RecipeDetail /> }, // עדכון ל-:id
        //   { path: "edit-recipe/:id", element: <EditRecipe /> } // עדכון ל-:id
        // ]
      },
      {
        path: "add-recipe",
        element: <AddRecipe />
      }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={routes} />
);
