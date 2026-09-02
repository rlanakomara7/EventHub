function MyProfileFilter({ activeTab, setActiveTab }) {
  const tabs = [
    {
      key: "events",
      label: "Events",
    },
    {
      key: "communities",
      label: "Communities",
    },
    {
      key: "saved",
      label: "Saved",
    },
  ];

  return (
    <div className="mt-8 grid grid-cols-3 text-center">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`border-b-2 px-2 pb-3 text-sm ${
              isActive
                ? "border-orange-primary text-orange-primary"
                : "border-transparent text-gray-secondary"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export default MyProfileFilter;
