import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Import Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import MessagesPage from './pages/MessagesPage';
import ImaginePage from './pages/ImaginePage';

// Import Components
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import BottomNavbar from './components/BottomNavbar';
import MobileHeader from './components/MobileHeader';
// THE FIX IS HERE: Import the AuthProvider correctly
import { AuthProvider } from './context/AuthContext';

const AnimatedPage = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.25 }}
  >
    {children}
  </motion.div>
);

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto flex justify-center">
        <div className="hidden lg:block sticky top-0 h-screen">
          <LeftSidebar />
        </div>
        
        <main className="w-full max-w-2xl lg:max-w-xl xl:max-w-2xl border-x border-gray-700">
          <div className="lg:hidden">
            <MobileHeader />
          </div>
          <Outlet />
        </main>

        <div className="hidden lg:block sticky top-0 h-screen">
          <RightSidebar />
        </div>
      </div>

      <div className="lg:hidden">
        <BottomNavbar />
      </div>
    </div>
  );
};

function App() {
  const location = useLocation();
  return (
    // THE FIX IS HERE: Wrap the entire app with AuthProvider
    <AuthProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<AnimatedPage><HomePage /></AnimatedPage>} />
            <Route path="/profile/:username" element={<AnimatedPage><ProfilePage /></AnimatedPage>} />
            
            <Route path="/messages" element={<AnimatedPage><MessagesPage /></AnimatedPage>} />
            <Route path="/messages/:otherUserId" element={<AnimatedPage><MessagesPage /></AnimatedPage>} />
            
            <Route path="/imagine" element={<AnimatedPage><ImaginePage /></AnimatedPage>} />
          </Route>

          <Route path="/login" element={<AnimatedPage><LoginPage /></AnimatedPage>} />
          <Route path="/register" element={<AnimatedPage><RegisterPage /></AnimatedPage>} />
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  );
}

export default App;

