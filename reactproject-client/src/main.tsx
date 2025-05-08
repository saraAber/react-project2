import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { createRoot } from 'react-dom/client'

import "./styles/index.css";

import App from './App.tsx'
import Login from './components/Login.tsx'
import Register from './components/Register.tsx'
import RecipesList from './components/RecipesList.tsx';
import RecipeDetail from './components/RecipeDetail.tsx';
import AddRecipe from './components/AddRecipe.tsx'
import EditRecipe from './components/EditRecipe.tsx'

const routes = createBrowserRouter([
  {
    path: "*",
    element: <App />,
    children: [
      { path: "Login", element: <Login /> },
      { path: "Register", element: <Register /> },
      {
        path: "RecipesList",
        element: <RecipesList />,
        children: [
          { path: "ShowRecipe/:name", element: <RecipeDetail /> },
          { path: "edit-recipe/:name", element: <EditRecipe /> }
        ]
      },
      { path: "add-recipe", element: <AddRecipe /> }
      // שימי לב: הורדנו את { path: "", element: <Home /> }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={routes} />
);
