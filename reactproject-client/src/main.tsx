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
      // {path:"add-recipe",element:<AddRecipe/>},
      {
        path: "Login",
        element: <Login />
      },{path: "Register",
        element: <Register />},
        {path:"ShowRecipes",element:<RecipesList/>,children:[{path:"ShowRecipe/:name",element:<RecipeDetail/>}
          ,{path:"edit-recipe/:name",element:<EditRecipe/>}
        ]},
      
      {path:"add-recipe",element:<AddRecipe/>}]
     
  }
 
])

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={routes} />,
  //add-recipe
)