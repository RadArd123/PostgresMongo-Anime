import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import { useAuthStore } from './store/authStore'
import { useThemeStore } from './store/themeStore'
import { lazy, Suspense, useEffect, type JSX } from 'react'
import { useNotificationStore } from './store/notificationStore'

const HomePage = lazy(() => import('./pages/HomePage'))
const SignUpPage = lazy(() => import('./pages/SignUpPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const AnimePage = lazy(() => import('./pages/AnimePage'))
const EpisodePage = lazy(() => import('./pages/EpisodePage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'))
const WatchlistPage = lazy(() => import('./pages/WatchlistPage'))
const BrowsePage = lazy(() => import('./pages/BrowsePage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const ContinueWatchingPage = lazy(() => import('./pages/ContinueWatchingPage'))
const CommunityChatPage = lazy(() => import('./pages/CommunityChatPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const DonationSuccessPage = lazy(() => import('./pages/DonationSuccessPage'))
const NotificationSettingsPage = lazy(() => import('./pages/NotificationSettingsPage'))

const RestrictedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

const RestrictedAuthRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return isAuthenticated ? <Navigate to="/" replace /> : children
}

const RestrictedAdminRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isAdmin = useAuthStore((state) => state.isAdmin)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return isAdmin ? children : <Navigate to="/" replace />
}

const PageFallback = () => (
  <div className="min-h-screen bg-black text-white flex items-center justify-center">
    Se încarcă…
  </div>
)

function App() {
  const { checkAuth, hasCheckedAuth, isAuthenticated, user } = useAuthStore();
  const { initTheme } = useThemeStore();
  const { fetchUnreadCount } = useNotificationStore();

  useEffect(()=>{
    checkAuth();
    initTheme();
  }, [checkAuth, initTheme])

  // Fetch unread count when user logs in
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchUnreadCount();
    }
  }, [fetchUnreadCount, isAuthenticated, user?.id]);

  if (!hasCheckedAuth) return <PageFallback />;

  return (
    <Suspense fallback={<PageFallback />}>
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
          <Route path="/settings" element={<RestrictedRoute><NotificationSettingsPage/></RestrictedRoute>} />
          <Route path="/continue-watching" element={<RestrictedRoute><ContinueWatchingPage/></RestrictedRoute>}></Route>
          <Route path="/chat" element={<RestrictedRoute><CommunityChatPage/></RestrictedRoute>}></Route>
        </Route>

        <Route path="/donation-success" element={<DonationSuccessPage />}></Route>
        <Route path="*" element={<NotFoundPage/>}></Route>
      </Routes>
    </Suspense>

  )
}

export default App
