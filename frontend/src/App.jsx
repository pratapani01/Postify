import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import BottomNavbar from './components/BottomNavbar';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import MobileHeader from './components/MobileHeader';
import MessagesPage from './pages/MessagesPage';
import ChatPage from './pages/ChatPage';
import ImaginePage from './pages/ImaginePage';

const AnimatedPage = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
);

const MainLayout = () => {
  const location = useLocation();
  const isChatPage = location.pathname.startsWith('/messages/');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#151a2c] to-[#0d101c] text-white flex justify-center">
      <div className="flex w-full max-w-7xl">
        {/* Left Sidebar */}
        <div className="hidden lg:flex lg:flex-col lg:w-[275px] sticky top-0 h-screen">
          <LeftSidebar />
        </div>

        {/* Main Content Feed */}
        <main className="w-full lg:max-w-[600px] border-x border-gray-700/50">
          <div className="lg:hidden">
            <MobileHeader />
          </div>
          <Outlet />
        </main>

        {/* Right Sidebar */}
        <div className="hidden lg:flex lg:flex-col lg:w-[350px] sticky top-0 h-screen">
          <RightSidebar />
        </div>
      </div>
      
      {/* Bottom Navbar for mobile */}
      <div className={`lg:hidden ${isChatPage ? 'hidden' : 'block'}`}>
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
          <Route path="/profile/:username" element={<AnimatedPage><ProfilePage /></AnimatedPage>} />
          <Route path="/messages" element={<AnimatedPage><MessagesPage /></AnimatedPage>} />
          <Route path="/messages/:userId" element={<AnimatedPage><ChatPage /></AnimatedPage>} />
          <Route path="/imagine" element={<AnimatedPage><ImaginePage /></AnimatedPage>} />
          <Route path="/create" element={<AnimatedPage><HomePage showCreatePostModal={true} /></AnimatedPage>} />
        </Route>
        <Route path="/login" element={<AnimatedPage><LoginPage /></AnimatedPage>} />
        <Route path="/register" element={<AnimatedPage><RegisterPage /></AnimatedPage>} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;

