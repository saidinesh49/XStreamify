import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { getCurrentUser } from './services/authService';
import { Outlet, useNavigate } from 'react-router-dom';
import { useUserContext } from './context/UserContext';
import Loading from './components/Loading';
import Settings from './pages/Settings';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const {addUserData}=useUserContext();
  const navigate=useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      setIsLoading(true);
      try {
        const res = await getCurrentUser(addUserData);
      } catch (err) {
        console.error("Error fetching current user:", err);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchCurrentUser();
  }, []);
  

  return isLoading?
        <><Loading/>
        </>:(
        <div className="min-h-screen bg-surface-50 dark:bg-surface-900 transition-colors">
          <Sidebar isOpen={isSidebarOpen} />
          <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          
            <main className={`transition-all duration-300
            ${isSidebarOpen ? 'sm:ml-64' : 'sm:ml-20'}`}
            >
            <div className="max-w-7xl mx-auto">
              <Outlet/>
            </div>
            </main>
        </div>
  );
}

export default App;