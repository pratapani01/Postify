import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';

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

const AnimatedPage = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.25 }}
    className="h-full" // Make animation wrapper take full height
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
        
        <main className="w-full max-w-2xl lg:max-w-xl xl:max-w-2xl border-x border-gray-700 flex flex-col">
          {/* THE FIX IS HERE: The mobile header is now outside the scrollable area */}
          <div className="lg:hidden sticky top-0 z-20">
            <MobileHeader />
          </div>
          {/* This div is now the main scrollable container */}
          <div className="flex-1 overflow-y-auto">
            <Outlet />
          </div>
        </main>

        <div className="hidden lg:block sticky top-0 h-screen">
          <RightSidebar />
        </div>
      </div>
      
      {/* The bottom navbar is outside the main content flow */}
      <div className="lg:hidden">
        <BottomNavbar />
      </div>
    </div>
  );
};

function App() {
  const location = useLocation();
  return (
    <AuthProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<AnimatedPage><HomePage /></AnimatedPage>} />
            <Route path="/create" element={<AnimatedPage><HomePage /></AnimatedPage>} />
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

