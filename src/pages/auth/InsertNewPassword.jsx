import { useState } from "react";
import { useNavigate } from "react-router";
import { FiEye, FiEyeOff } from "react-icons/fi";

function InsertNewPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  function clearError(field) {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validate() {
    const newErrors = {};

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

    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const resetEmail = localStorage.getItem("resetEmail");
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex((user) => user.email === resetEmail);

    if (userIndex === -1) {
      setErrors({ email: "User not found" });
      return;
    }

    users[userIndex] = { ...users[userIndex], password };

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.removeItem("resetEmail");

    navigate("/forgot-password-success");
  }

  return (
    <div className="w-full max-w-md px-6">
      <h1 className="text-3xl font-bold text-black-primary">
        Create New Password
      </h1>
      <p className="mt-1 text-sm text-gray-secondary">
        Enter your new password below.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {/* PASSWORD */}
        <div>
          <label className="mb-2 block text-sm">New Password</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 character"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) clearError("password");
              }}
              className={`w-full rounded-lg border px-3 py-3 pr-10 text-sm outline-none ${
                errors.password ? "border-red-500" : "border-gray-200"
              }`}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-secondary"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password}</p>
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div>
          <label className="mb-2 block text-sm">Confirm Password</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) clearError("confirmPassword");
              }}
              className={`w-full rounded-lg border px-3 py-3 pr-10 text-sm outline-none ${
                errors.confirmPassword ? "border-red-500" : "border-gray-200"
              }`}
            />
          </div>

          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-orange-primary py-3 text-sm font-semibold text-white-primary"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}

export default InsertNewPassword;
