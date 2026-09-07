import { BsFilterSquare } from "react-icons/bs";
import { useState } from "react";
import { useSearchParams } from "react-router";

function SearchBar({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
}) {
  const [showFilter, setShowFilter] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  function CreateParam(key, value) {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    setSearchParams(params);
  }

  const categories = [
    "All",
    "Technology",
    "Design",
    "Business",
    "AI",
    "Progamming",
    "Music",
  ];

  return (
    <>
      <div className="px-10 py-5">
        <div className="flex flex-row justify-between items-center gap-3">
          <input
            type="text"
            placeholder="Search events"
            className="w-screen py-2 px-4 bg-white-secondary rounded-xl  dark:text-black"
            value={search}
            onChange={(e) => {
              e.preventDefault();
              CreateParam("events", e.target.value);

              setSearch(e.target.value);
            }}
          />
          <div className="flex flex-row py-2 px-2 items-center rounded-xl border-2 border-white-secondary gap-1">
            <BsFilterSquare className="text-gray-primary" />
            <button
              type="button"
              onClick={() => setShowFilter(!showFilter)}
              className="text-gray-primary hover:cursor-pointer"
            >
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* panel filter */}
      {showFilter && (
        <div className="border-t border-gray-200 px-10 py-4">
          <p className="text-xs font-semibold text-gray-secondary">CATEGORY</p>

          <div className="mt-2 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setSelectedCategory(category);
                  CreateParam("category", category);
                }}
                className={`rounded-lg px-3 py-2 text-xs hover:cursor-pointer ${
                  selectedCategory === category
                    ? "bg-orange-primary text-white"
                    : "border border-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default SearchBar;
