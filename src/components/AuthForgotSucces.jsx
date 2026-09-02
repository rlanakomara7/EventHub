import { FiCheck } from "react-icons/fi";
import { Link } from "react-router";

function AuthForgotSuccess() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
        <FiCheck className="text-xl text-green-500" />
      </div>

      <h1 className="mt-5 text-2xl font-bold text-black-primary">
        Your password has been updated successfully...
      </h1>

      <p className="mt-2 text-sm text-gray-secondary">
        Check your email . We sent a reset link to{" "}
        <span className="font-semibold text-black-primary">your@mail.com</span>
      </p>

      <Link to="/signin" className="mt-6 text-sm text-orange-primary">
        Back to sign in
      </Link>
    </div>
  );
}

export default AuthForgotSuccess;
