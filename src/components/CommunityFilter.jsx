function CommunityFilter() {
  const categories = [
    "All Categories",
    "Technology",
    "Design",
    "Business",
    "Career",
    "AI",
    "Programming",
    "Music",
  ];

  const filterStatus = ["All", "Joined", "Not Joined"];
  return (
    <>
      <div
        className="flex
          flex-col
          gap-4
          px-3
          py-4

          md:flex-row
          md:items-center
          md:px-6

          lg:px-10"
      >
        {/* FILTER STATUS */}
        <div
          className=" flex
            shrink-0
            items-center
            rounded-lg
            border
            border-gray-200
            bg-white
            p-1 "
        >
          {filterStatus.map((status) => (
            <button
              key={status}
              type="button"
              className={`shrink-0 rounded-md px-3 py-2 text-xs md:px-4 md:text-sm ${
                status === "All"
                  ? "bg-orange-primary text-white-primary"
                  : "text-gray-secondary"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* FILTER CATEGORY */}
        <div
          className="
    flex
    w-full
    max-w-full
    gap-2
    overflow-x-auto
    whitespace-nowrap
    pb-1
  "
        >
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`shrink-0 rounded-md px-3 py-2 text-xs md:px-4 md:text-sm ${
                category === "All Categories"
                  ? "bg-orange-primary text-white-primary"
                  : "text-gray-secondary"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default CommunityFilter;
