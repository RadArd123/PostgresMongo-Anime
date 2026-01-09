import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import { useAuthStore } from './store/authStore'
import { useEffect, type JSX } from 'react'
import AdminPage from './pages/AdminPage'
import AnimePage from './pages/AnimePage'
import EpisodePage from './pages/EpisodePage'
import LoginPage from './pages/LoginPage'
import FavoritesPage from './pages/FavoritesPage'
import WatchlistPage from './pages/WatchlistPage'

function App() {

  const {checkAuth, isAuthenticated,} = useAuthStore();

  const RestictedRoute = ({ children }: { children: JSX.Element }) => {
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }
    return children;
  }
  // const RestictedAdminRoute = ({ children }: { children: JSX.Element }) => {
  //   if (!isAdmin) {
  //     return <Navigate to="/" replace />
  //   }
  //   return children;
  // };
  
  const RestictedAuthRoute = ({ children }: { children: JSX.Element }) => {
    if (isAuthenticated) {
       return <Navigate to="/" replace />
    }
    return children;
  };

  useEffect(()=>{
    checkAuth();
  },[])

  return (
    <> 
      <Routes>
        <Route path="/signup" element={<RestictedAuthRoute><SignUpPage/></RestictedAuthRoute>}></Route>
         <Route path="/login" element={<RestictedAuthRoute><LoginPage/></RestictedAuthRoute>}></Route>
          <Route path="/admin" element={<AdminPage/>}></Route>
        <Route  element={<MainLayout/>}>
          <Route path="/" element={<RestictedRoute><HomePage/></RestictedRoute>}></Route>  
          <Route path="/anime/:id" element={<AnimePage/>}></Route>
          <Route path="/anime/episode/:id" element={<EpisodePage/>}></Route>
          <Route path="/favorites" element={<FavoritesPage/>}></Route>
          <Route path="/watchlist" element={<WatchlistPage/>}></Route>
        
        </Route>
      </Routes>
    
     </>
  )
}

export default App
            