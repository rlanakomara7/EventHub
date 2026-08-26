import { useNavigate } from "react-router";

function AuthForgotForm() {
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    navigate("/forgot-password-success");
  }
  return (
    <div className="flex flex-col gap-8 w-full max-w-md px-6 leading-6">
      <div>
        <h1 className="text-3xl font-bold text-black-primary">
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
            placeholder="rama@example.com"
            className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-orange-primary py-3 text-sm font-semibold text-white-primary"
          to="/forgot-password-success"
        >
          Send reset link
        </button>
      </form>
    </div>
  );
}

export default AuthForgotForm;
