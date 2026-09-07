import { useState } from "react";
import { useNavigate } from "react-router";

function AuthForgotForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.some((user) => user.email === email);

    if (!userExists) {
      setError("Email is not registered");
      return;
    }

    // simpan email target reset, dipakai di halaman InsertNewPassword
    localStorage.setItem("resetEmail", email);

    navigate("/insert-password");
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-md px-6 leading-6">
      <div>
        <h1 className="text-3xl font-bold text-black-primary dark:text-white">
          Reset your password
        </h1>
        <p className="text-gray-secondary text-sm">
          Enter your email and we'll send a link.
        </p>
      </div>
      <form className=" flex flex-col gap-4 leading-7" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium">
            Email address
          </label>

          <input
            type="email"
            placeholder="mail@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            className={`w-full rounded-lg border px-3 py-3 text-sm outline-none ${
              error ? "border-red-500" : "border-gray-200"
            }`}
          />

          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-orange-primary py-3 text-sm font-semibold text-white-primary"
        >
          Send reset link
        </button>
      </form>
    </div>
  );
}

export default AuthForgotForm;
