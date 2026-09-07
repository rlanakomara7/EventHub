import { Link } from "react-router";

function ModalSign({ onClose }) {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4 ">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:text-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-5 ">
          <h2 className="font-semibold">Sign in to continue</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-secondary"
          >
            X
          </button>
        </div>
        <div className="px-5 py-6">
          <p className="text-sm leading-6 text-gray-secondary">
            Create a free account to register for events, save favourites, join
            communities, and get personalised recommendations.
          </p>
        </div>
        <div className="flex justify-end gap-3 px-5 pb-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm"
          >
            Keep Browsing
          </button>
          <Link
            to="/signin"
            className="rounded-lg bg-orange-primary px-4 py-2 text-sm text-white-primary"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ModalSign;
