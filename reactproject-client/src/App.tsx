import './App.css';
import { Outlet } from 'react-router-dom';
import UserContext from './context/userContext';
import CategoryContext from './components/CategoriesContext';
import Home from './components/Home';

function App() {
  return (
    <CategoryContext>
      <UserContext>
        <div className="app-container">
          {/* כאן יוצגו הרכיבים לפי הנתיב */}
          <Home />
        </div>
      </UserContext>
    </CategoryContext>
  );
}

export default App;
