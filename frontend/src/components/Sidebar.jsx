import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/slices/authSlice";

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
    onClose();
  };

  const mainLinks = [
    { path: "/", label: "Dashboard", icon: "⊞" },
    { path: "/submit", label: "Submit", icon: "✎" },
    { path: "/history", label: "History", icon: "◷" },
  ];

  const teamLinks = [
    { path: "/members", label: "Members", icon: "👥" },
    { path: "/blockers", label: "Blockers", icon: "⚠" },
    { path: "/analytics", label: "Analytics", icon: "📊" },
    { path: "/weekly", label: "Weekly", icon: "📋" },
  ];

  return (
    <div
      className={`
        fixed top-0 left-0 h-full w-[200px] bg-[#0f0f0f]
        flex flex-col z-30 transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
    >
      {/* Logo */}
      <div className="px-4 pt-5 pb-4 border-b border-white/5 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-white/30 tracking-widest uppercase mb-1">
            workspace
          </p>
          <h1 className="text-[18px] font-medium text-white tracking-tight">
            Standup<span className="text-[#FAC775]">.</span>Bot
          </h1>
        </div>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white lg:hidden text-xl"
        >
          ✕
        </button>
      </div>

      {/* User Info */}
      {user && (
        <div className="px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#FAC775] text-[#0f0f0f] flex items-center justify-center text-xs font-medium shrink-0">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              {/* Name */}
              <p className="text-[12px] text-white font-medium truncate">
                {user.name}
              </p>

              {/* Added Developer Role Field */}
              {user.role && (
                <p className="text-[10px] text-white/50 truncate font-mono mt-0.5">
                  {user.role}
                </p>
              )}

              {/* Team Name */}
              <p className="text-[10px] text-white/30 truncate mt-0.5">
                {user.teamName}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        <p className="text-[10px] text-white/20 tracking-widest uppercase px-4 pt-2 pb-1">
          main
        </p>
        {mainLinks.map((link) => (
          <div
            key={link.path}
            onClick={() => handleNavigate(link.path)}
            className={`flex items-center gap-2 px-4 py-2.5 text-[13px] cursor-pointer transition-all
              ${
                location.pathname === link.path
                  ? "text-white bg-white/[0.07]"
                  : "text-white/40 hover:text-white/80 hover:bg-white/[0.04]"
              }`}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </div>
        ))}

        <p className="text-[10px] text-white/20 tracking-widest uppercase px-4 pt-4 pb-1">
          team
        </p>
        {teamLinks.map((link) => (
          <div
            key={link.path}
            onClick={() => handleNavigate(link.path)}
            className={`flex items-center gap-2 px-4 py-2.5 text-[13px] cursor-pointer transition-all
              ${
                location.pathname === link.path
                  ? "text-white bg-white/[0.07]"
                  : "text-white/40 hover:text-white/80 hover:bg-white/[0.04]"
              }`}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-4 py-3 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 text-[12px] text-white/30 hover:text-white/70 transition-colors"
        >
          <span>⎋</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
