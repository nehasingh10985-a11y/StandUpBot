import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const roles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "UI/UX Designer",
  "QA Engineer",
  "Product Manager",
];

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    teamName: "",
    role: "",
  });

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (isRegister) {
      dispatch(registerUser(form));
    } else {
      dispatch(loginUser({ email: form.email, password: form.password }));
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-[#0f0f0f] tracking-tight">
            Standup<span className="text-[#FAC775]">.</span>Bot
          </h1>
          <p className="text-xs text-[#888] mt-1">
            {isRegister ? "Create your account" : "Sign in to your team"}
          </p>
        </div>

        <div className="bg-white border border-[#E2DDD5] rounded-xl p-6">
          {/* Error */}
          {error && (
            <p className="text-xs text-[#D85A30] bg-[#FAECE7] border border-[#F5C4B3] rounded-md px-3 py-2 mb-4">
              {error}
            </p>
          )}

          {/* Register Fields */}
          {isRegister && (
            <>
              {/* Name */}
              <div className="mb-3">
                <label className="block text-[12px] font-medium text-[#0f0f0f] mb-1.5">
                  Full Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-[#F7F5F0] border border-[#E2DDD5] rounded-md px-3 py-2 text-sm outline-none text-[#0f0f0f] placeholder:text-[#bbb]"
                />
              </div>

              {/* Team Name */}
              <div className="mb-3">
                <label className="block text-[12px] font-medium text-[#0f0f0f] mb-1.5">
                  Team Name
                </label>
                <input
                  name="teamName"
                  value={form.teamName}
                  onChange={handleChange}
                  placeholder="e.g. Backend Team"
                  className="w-full bg-[#F7F5F0] border border-[#E2DDD5] rounded-md px-3 py-2 text-sm outline-none text-[#0f0f0f] placeholder:text-[#bbb]"
                />
              </div>

              {/* Role */}
              <div className="mb-3">
                <label className="block text-[12px] font-medium text-[#0f0f0f] mb-1.5">
                  Your Role
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full bg-[#F7F5F0] border border-[#E2DDD5] rounded-md px-3 py-2 text-sm outline-none text-[#0f0f0f]"
                >
                  <option value="">Select your role</option>
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Email */}
          <div className="mb-3">
            <label className="block text-[12px] font-medium text-[#0f0f0f] mb-1.5">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="rahul@company.com"
              className="w-full bg-[#F7F5F0] border border-[#E2DDD5] rounded-md px-3 py-2 text-sm outline-none text-[#0f0f0f] placeholder:text-[#bbb]"
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block text-[12px] font-medium text-[#0f0f0f] mb-1.5">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-[#F7F5F0] border border-[#E2DDD5] rounded-md px-3 py-2 text-sm outline-none text-[#0f0f0f] placeholder:text-[#bbb]"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#0f0f0f] text-white text-sm font-medium py-2.5 rounded-lg disabled:opacity-50 cursor-pointer hover:bg-[#1a1a1a] transition-colors"
          >
            {loading
              ? "Please wait..."
              : isRegister
                ? "Create Account →"
                : "Sign In →"}
          </button>

          {/* Toggle Register/Login */}
          <p className="text-center text-xs text-[#888] mt-4">
            {isRegister ? "Already have an account?" : "New here?"}{" "}
            <span
              onClick={() => {
                setIsRegister(!isRegister);
                setForm({
                  name: "",
                  email: "",
                  password: "",
                  teamName: "",
                  role: "",
                });
              }}
              className="text-[#0f0f0f] font-medium cursor-pointer hover:underline"
            >
              {isRegister ? "Sign in" : "Create account"}
            </span>
          </p>
        </div>

        {/* Bottom Note */}
        <p className="text-center text-[11px] text-[#bbb] mt-4 font-mono">
          StandupBot · Async standups for teams
        </p>
      </div>
    </div>
  );
}

export default Login;
