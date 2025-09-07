import { Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom';
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
    className="h-full"
  >
    {children}
  </motion.div>
);

const MainLayout = () => {
  return (
    <div className="h-screen bg-gray-900 text-white flex justify-center">
      {/* Left Sidebar */}
      <div className="hidden lg:flex sticky top-0 h-full">
        <LeftSidebar />
      </div>
      
      {/* Main Content */}
      <main className="w-full max-w-2xl border-x border-gray-700 flex flex-col relative">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-20">
          <MobileHeader />
        </div>
        
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto pt-16 pb-16">
          <Outlet />
        </div>
        
        {/* Mobile Bottom Navbar */}
        <div className="lg:hidden sticky bottom-0 z-20">
          <BottomNavbar />
        </div>
      </main>

      {/* Right Sidebar */}
      <div className="hidden lg:flex sticky top-0 h-full">
        <RightSidebar />
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

            {/* FIXED Profile Routes */}
            <Route path="/profile" element={<Navigate to="/login" replace />} />
            <Route path="/profile/:username" element={<AnimatedPage><ProfilePage /></AnimatedPage>} />

            <Route path="/messages" element={<AnimatedPage><MessagesPage /></AnimatedPage>} />
            <Route path="/messages/:otherUserId" element={<AnimatedPage><MessagesPage /></AnimatedPage>} />
            <Route path="/imagine" element={<AnimatedPage><ImaginePage /></AnimatedPage>} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<AnimatedPage><LoginPage /></AnimatedPage>} />
          <Route path="/register" element={<AnimatedPage><RegisterPage /></AnimatedPage>} />
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  );
}

export default App;
