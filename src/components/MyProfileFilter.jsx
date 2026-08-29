function MyProfileFilter({ activeTab, setActivetab }) {
  return (
    <div
      className=" grid grid-cols-3
      mt-8
      text-center"
    >
      <button
        type="button"
        onClick={() => setActivetab("Events")}
        className={
          activeTab === "Events"
            ? "border-b-2 border-orange-primary px-2 pb-3 text-sm text-orange-primary"
            : "px-2 pb-3 text-sm text-gray-secondary"
        }
      >
        Events
      </button>
      <button
        type="button"
        onClick={() => setActivetab("communities")}
        className={
          activeTab === "Communities"
            ? "border-b-2 border-orange-primary px-2 pb-3 text-sm text-orange-primary"
            : "px-2 pb-3 text-sm text-gray-secondary"
        }
      >
        Communities
      </button>
      <button
        type="button"
        onClick={() => setActivetab("saved")}
        className={
          activeTab === "Saved"
            ? "border-b-2 border-orange-primary px-2 pb-3 text-sm text-orange-primary"
            : "px-2 pb-3 text-sm text-gray-secondary"
        }
      >
        Saved
      </button>
    </div>
  );
}

export default MyProfileFilter;
