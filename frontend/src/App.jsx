import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import MessagesPage from './pages/MessagesPage'; // 1. Import the new page
import BottomNavbar from './components/BottomNavbar';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import MobileHeader from './components/MobileHeader';

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
    <div className="min-h-screen bg-gray-900">
      <MobileHeader />
      <div className="container mx-auto flex justify-center">
        <div className="hidden lg:block">
          <LeftSidebar />
        </div>
        <main className="w-full max-w-2xl border-x border-gray-700 pt-16 lg:pt-0">
          <Outlet />
        </main>
        <div className="hidden lg:block">
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
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<AnimatedPage><HomePage /></AnimatedPage>} />
          <Route path="/create" element={<AnimatedPage><HomePage /></AnimatedPage>} />
          <Route path="/messages" element={<AnimatedPage><MessagesPage /></AnimatedPage>} /> {/* 2. Add the new route */}
          <Route path="/profile/:username" element={<AnimatedPage><ProfilePage /></AnimatedPage>} />
        </Route>
        <Route path="/login" element={<AnimatedPage><LoginPage /></AnimatedPage>} />
        <Route path="/register" element={<AnimatedPage><RegisterPage /></AnimatedPage>} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
