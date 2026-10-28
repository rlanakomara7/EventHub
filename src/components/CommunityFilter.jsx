const statuses = ["All", "Joined", "Not Joined"];

const categories = [
  "All",
  "Technology",
  "Design",
  "Business",
  "Career",
  "AI",
  "Programming",
  "Music",
];

function CommunityFilter({
  selectedStatus,
  setSelectedStatus,
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap px-6 py-4">
      {/* STATUS FILTER */}
      <div className="flex shrink-0 items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-900">
        {statuses.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setSelectedStatus(status)}
            className={`rounded-md px-3 py-2 text-xs font-medium transition-colors ${
              selectedStatus === status
                ? "bg-orange-primary text-white"
                : "text-gray-primary hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* CATEGORY FILTER */}
      <div className="flex shrink-0 items-center gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
              selectedCategory === category
                ? "border-orange-primary bg-orange-primary text-white"
                : "border-gray-200 bg-white text-gray-primary hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-300"
            }`}
          >
            {category === "All" ? "All Categories" : category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CommunityFilter;
