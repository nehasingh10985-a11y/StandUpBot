import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Submit from "./pages/Submit";
import History from "./pages/History";
import Members from "./pages/Members";
import Blockers from "./pages/Blockers";
import Analytics from "./pages/Analytics";
import WeeklySummary from "./pages/WeeklySummary";
import Login from "./pages/Login";

// Private Route Guard
const PrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  return user ? children : <Navigate to="/login" />;
};
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Private Routes */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <div className="flex min-h-screen bg-[#F7F5F0]">
                <Sidebar
                  isOpen={sidebarOpen}
                  onClose={() => setSidebarOpen(false)}
                />

                {sidebarOpen && (
                  <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                  />
                )}

                <main className="flex-1 lg:ml-[200px] min-h-screen">
                  {/* Mobile Top Bar */}
                  <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-[#0f0f0f] sticky top-0 z-10">
                    <button
                      onClick={() => setSidebarOpen(true)}
                      className="text-white p-1"
                    >
                      <div className="w-5 h-0.5 bg-white mb-1" />
                      <div className="w-5 h-0.5 bg-white mb-1" />
                      <div className="w-5 h-0.5 bg-white" />
                    </button>
                    <h1 className="text-white text-[15px] font-medium tracking-tight">
                      Standup<span className="text-[#FAC775]">.</span>Bot
                    </h1>
                  </div>

                  <div className="p-4 md:p-6">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/submit" element={<Submit />} />
                      <Route path="/history" element={<History />} />
                      <Route path="/members" element={<Members />} />
                      <Route path="/blockers" element={<Blockers />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/weekly" element={<WeeklySummary />} />
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </div>
                </main>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
