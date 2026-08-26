import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router";
import { useState } from "react";

function AuthSignUpForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};

    //validasi
    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Password do not match";
    }

    if (!agree) {
      newErrors.agree = "You must agree to the term";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    // cek email exist
    const userExist = users.find((user) => user.email === email);

    if (userExist) {
      setErrors({
        email: "Email already registered",
      });
      return;
    }

    // set data untuk user baru
    const newUser = {
      id: Date.now(),
      name: fullName,
      email: email,
      password: password,
      role: "attendee",
      image: "/Default-Avatar.svg",
    };

    // tambah data to local storage
    localStorage.setItem("users", JSON.stringify([...users, newUser]));

    // move to signin
    navigate("/signin");
  }

  return (
    <div className="w-full max-w-md px-6">
      <h1 className="text-3xl font-bold text-black-primary">
        Create Your Account
      </h1>

      <p className="mt-1 text-sm text-gray-secondary">
        Already have an account?{" "}
        <Link to="/signin" className="text-orange-primary">
          Sign in
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
        {/* fullname */}
        <div>
          <label className="mb-2 block text-sm">Full Name</label>

          <input
            type="text"
            placeholder="Your Name"
            className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);

              // hapus error saat mulai mengetik
              if (errors.fullName) {
                setErrors((prev) => ({
                  ...prev,
                  fullName: "",
                }));
              }
            }}
            className={`w-full rounded-lg border px-3 py-3 text-sm outline-none ${
              errors.fullName ? "border-red-500" : "border-gray-200"
            }`}
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
          )}
        </div>

        {/* email */}
        <div>
          <label className="mb-2 block text-sm">Email address</label>

          <input
            type="email"
            placeholder="rama@example.com"
            className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);

              if (errors.email) {
                setErrors((prev) => ({
                  ...prev,
                  email: "",
                }));
              }
            }}
            className={`w-full rounded-lg border px-3 py-3 text-sm outline-none ${
              errors.email ? "border-red-500" : "border-gray-200"
            }`}
          />

          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        {/* password */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm">Password</label>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 character"
              className="w-full rounded-lg border border-gray-200 px-3 py-3 pr-10 text-sm outline-none"
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
              className={`w-full rounded-lg border px-3 py-3 pr-10 text-sm outline-none ${
                errors.password ? "border-red-500" : "border-gray-200"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-secondary"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password}</p>
          )}
        </div>

        {/* confirm password */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm">Confirm Password</label>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              className="w-full rounded-lg border border-gray-200 px-3 py-3 pr-10 text-sm outline-none"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);

                if (errors.confirmPassword) {
                  setErrors((prev) => ({
                    ...prev,
                    confirmPassword: "",
                  }));
                }
              }}
              className={`w-full rounded-lg border px-3 py-3 pr-10 text-sm outline-none ${
                errors.password ? "border-red-500" : "border-gray-200"
              }`}
            />
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* checkbox agree */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="agree"
            id="agree"
            checked={agree}
            onChange={(e) => {
              setAgree(e.target.checked);

              if (errors.agree) {
                setErrors((prev) => ({
                  ...prev,
                  agree: "",
                }));
              }
            }}
          />

          <label className="text-xs text-gray-secondary leading-5">
            I agree to the{" "}
            <span className="text-orange-primary">Terms of Service</span> and{" "}
            <span className="text-orange-primary">Privacy Policy</span>
          </label>
          {errors.agree && (
            <p className="text-xs text-red-500">{errors.agree}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-orange-primary py-3 text-sm font-semibold text-white-primary"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

export default AuthSignUpForm;
