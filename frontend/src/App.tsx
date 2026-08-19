import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import { useAuthStore } from './store/authStore'
import { useThemeStore } from './store/themeStore'
import { useEffect, type JSX } from 'react'
import AdminPage from './pages/AdminPage'
import AnimePage from './pages/AnimePage'
import EpisodePage from './pages/EpisodePage'
import LoginPage from './pages/LoginPage'
import FavoritesPage from './pages/FavoritesPage'
import WatchlistPage from './pages/WatchlistPage'
import BrowsePage from './pages/BrowsePage'
import ProfilePage from './pages/ProfilePage'
import ContinueWatchingPage from './pages/ContinueWatchingPage'
import CommunityChatPage from './pages/CommunityChatPage'
import SettingsPage from './pages/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  const { checkAuth, isAuthenticated } = useAuthStore();
  const { initTheme } = useThemeStore();

  const RestrictedRoute = ({ children }: { children: JSX.Element }) => {
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }
    return children;
  }
  
  const RestrictedAuthRoute = ({ children }: { children: JSX.Element }) => {
    if (isAuthenticated) {
       return <Navigate to="/" replace />
    }
    return children;
  };

  const RestrictedAdminRoute = ({ children }: { children: JSX.Element }) => {
    const { isAdmin } = useAuthStore();
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  useEffect(()=>{
    checkAuth();
    initTheme();
  },[])

  return (
    <> 
      <Routes>
        <Route path="/signup" element={<RestrictedAuthRoute><SignUpPage/></RestrictedAuthRoute>}></Route>
         <Route path="/login" element={<RestrictedAuthRoute><LoginPage/></RestrictedAuthRoute>}></Route>
          <Route path="/admin" element={<RestrictedAdminRoute><AdminPage/></RestrictedAdminRoute>}></Route>
        <Route  element={<MainLayout/>}>
          <Route path="/" element={<HomePage/>}></Route>  
          <Route path="/anime/:id" element={<AnimePage/>}></Route>
          <Route path="/anime/episode/:id" element={<EpisodePage/>}></Route>
          <Route path="/favorites" element={<RestrictedRoute><FavoritesPage/></RestrictedRoute>}></Route>
          <Route path="/watchlist" element={<RestrictedRoute><WatchlistPage/></RestrictedRoute>}></Route>
          <Route path="/browse" element={<BrowsePage/>}></Route>
          <Route path="/profile" element={<RestrictedRoute><ProfilePage/></RestrictedRoute>}></Route>
          <Route path="/continue-watching" element={<RestrictedRoute><ContinueWatchingPage/></RestrictedRoute>}></Route>
          <Route path="/chat" element={<RestrictedRoute><CommunityChatPage/></RestrictedRoute>}></Route>
          <Route path="/settings" element={<RestrictedRoute><SettingsPage/></RestrictedRoute>}></Route>
          
          <Route path="*" element={<NotFoundPage/>}></Route>
        </Route>
      </Routes>
    
     </>

  )
}

export default App
            