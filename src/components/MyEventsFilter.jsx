function MyEventsFilter({ activeTab, setActiveTab, counts }) {
  const tabs = [
    { key: "upcoming", label: "Upcoming" },
    { key: "past", label: "Past" },
    { key: "saved", label: "Saved" },
  ];

  return (
    <div className="mt-8 grid grid-cols-3 text-center">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => setActiveTab(tab.key)}
          className={`border-b-2 px-2 pb-3 text-sm ${
            activeTab === tab.key
              ? "border-orange-primary text-orange-primary"
              : "border-transparent text-gray-secondary"
          }`}
        >
          {tab.label} ({counts[tab.key]})
        </button>
      ))}
    </div>
  );
}

export default MyEventsFilter;
