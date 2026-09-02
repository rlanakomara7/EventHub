function MyProfileFilter({ activeTab, setActiveTab }) {
  return (
    <div className="mt-8 grid grid-cols-3 text-center">
      <button
        type="button"
        onClick={() => setActiveTab("events")}
        className={
          activeTab === "events"
            ? "border-b-2 border-orange-primary px-2 pb-3 text-sm text-orange-primary"
            : "border-b-2 border-transparent px-2 pb-3 text-sm text-gray-secondary"
        }
      >
        Events
      </button>

      <button
        type="button"
        onClick={() => setActiveTab("communities")}
        className={
          activeTab === "communities"
            ? "border-b-2 border-orange-primary px-2 pb-3 text-sm text-orange-primary"
            : "border-b-2 border-transparent px-2 pb-3 text-sm text-gray-secondary"
        }
      >
        Communities
      </button>

      <button
        type="button"
        onClick={() => setActiveTab("saved")}
        className={
          activeTab === "saved"
            ? "border-b-2 border-orange-primary px-2 pb-3 text-sm text-orange-primary"
            : "border-b-2 border-transparent px-2 pb-3 text-sm text-gray-secondary"
        }
      >
        Saved
      </button>
    </div>
  );
}

export default MyProfileFilter;
