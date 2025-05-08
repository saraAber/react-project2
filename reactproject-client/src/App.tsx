import './App.css'
import Home from './components/Home'
import UserContext from './context/userContext'
import CategoryContext from './components/CategoriesContext'


function App() {

  return (
    <CategoryContext>
      <UserContext>
        <>
          <Home />
        </>
      </UserContext>
    </CategoryContext>
  )
}

export default App
