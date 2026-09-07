import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link } from "react-router";
import { useState } from "react";
import { useNavigate } from "react-router";

//redux
import { useAppDispatch } from "../hooks/reduxHooks";
import { login } from "../redux/slice/authSlice";

function AuthSignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  //redux
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    let admin = import.meta.env.VITE_ADMIN;

    let organizer = import.meta.env.VITE_ORGANIZER;

    admin = JSON.parse(admin);
    organizer = JSON.parse(organizer);

    users.push(admin);

    users.push(organizer);

    const user = users.find(
      (user) => user.email === email && user.password === password,
    );

    if (!user) {
      setErrors({
        login: "Email or password is incorrect",
      });
      return;
    }

    //redux
    dispatch(
      login({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || user.user_type || "attendee",
        location: user.location || "Indonesia",
        bio: user.bio || "",
        avatar: user.avatar || "/SON_9681.JPG",
      }),
    );

    navigate("/explore");
  }
  return (
    <div className="w-full max-w-md px-6 dark:bg-">
      <h1 className="text-3xl font-bold text-black-primary dark:text-white">
        Welcome back
      </h1>

      <p className="mt-1 text-sm text-gray-secondary">
        Don't have an account?{" "}
        <Link to="/signup" className="text-orange-primary">
          Sign up
        </Link>
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 py-2 text-sm"
        >
          <FcGoogle />
          Google
        </button>

        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 py-2 text-sm"
        >
          <FaGithub />
          GitHub
        </button>
      </div>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200"></div>

        <p className="text-xs text-gray-secondary">or continue with email</p>

        <div className="h-px flex-1 bg-gray-200"></div>
      </div>

      {/* FORM */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm">Email address</label>

          <input
            type="email"
            placeholder="ram@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);

              //clear error saat input
              if (errors.email) {
                setErrors((prev) => ({
                  ...prev,
                  email: "",
                }));
              }
            }}
            className={`w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none ${
              errors.email ? "border-red-500" : "border-gray-200"
            }`}
          />
          {/* ERROR EMAIL */}
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm">Password</label>

            <Link to="/forgot-password" className="text-xs text-orange-primary">
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);

                if (errors.password) {
                  setErrors((prev) => ({
                    ...prev,
                    password: "",
                  }));
                }
              }}
              className={`w-full rounded-lg border border-gray-200 px-3 py-3 pr-10 text-sm outline-none ${
                errors.password ? "border-red-500" : "border-gray-200"
              }`}
            />
            {/* showpassword */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-secondary"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {/* Error Password */}
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password}</p>
          )}
        </div>

        {/* error login */}
        {errors.login && <p className="text-xs text-red-500">{errors.login}</p>}

        <button
          type="submit"
          className="w-full rounded-lg bg-orange-primary py-3 text-sm font-semibold text-white-primary"
        >
          Sign in
        </button>
      </form>

      {/* GUEST */}
      <p className="mt-5 text-center text-xs text-gray-secondary">
        Just browsing?{" "}
        <Link to="/explore" className="underline">
          Continue as guest →
        </Link>
      </p>
    </div>
  );
}

export default AuthSignInForm;
