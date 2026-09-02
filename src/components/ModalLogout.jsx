function ModalLogout({ onCancel, onConfirm }) {
  return (
    <div className="fixed top-0 z-[200] flex h-screen w-screen items-center justify-center bg-black/30 backdrop-blur-xs px-4 ">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-800">
          Are you sure you want to log out?
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          You will be signed out from EventHub.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-400 px-4 py-2 text-sm text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalLogout;
