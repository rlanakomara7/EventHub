import { useState } from "react";
import { useSearchParams } from "react-router";
import { BsFilterSquare } from "react-icons/bs";

function SearchBar({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  categories = [],
  categoriesLoading = false,
  categoriesError = null,
  onRetryCategories,
}) {
  const [showFilter, setShowFilter] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  function updateParam(key, value) {
    const params = new URLSearchParams(searchParams);

    if (!value || value === "All") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    setSearchParams(params);
  }

  function handleSearchChange(event) {
    const value = event.target.value;

    setSearch(value);
    updateParam("search", value);
  }

  function handleCategoryChange(category) {
    setSelectedCategory(category);
    updateParam("category", category);
  }

  const categoryNames = [
    "All",
    ...categories.map((item) => item.category_name).filter(Boolean),
  ];

  return (
    <>
      <div className="px-4 py-5 md:px-10">
        <div className="flex items-center justify-between gap-3">
          <input
            type="search"
            placeholder="Search events"
            aria-label="Search events"
            value={search}
            onChange={handleSearchChange}
            className="min-w-0 flex-1 rounded-xl bg-white-secondary px-4 py-2 dark:text-black"
          />

          <button
            type="button"
            onClick={() => setShowFilter((previous) => !previous)}
            aria-expanded={showFilter}
            className="flex shrink-0 items-center gap-2 rounded-xl border-2 border-white-secondary px-3 py-2 text-gray-primary"
          >
            <BsFilterSquare />
            Filters
          </button>
        </div>
      </div>

      {showFilter && (
        <div className="border-t border-gray-200 px-4 py-4 md:px-10">
          <p className="text-xs font-semibold text-gray-secondary">CATEGORY</p>

          {categoriesLoading && (
            <p className="mt-3 text-sm text-gray-500">Loading categories...</p>
          )}

          {categoriesError && (
            <div role="alert" className="mt-3 text-sm text-red-500">
              <p>{categoriesError}</p>

              <button
                type="button"
                onClick={onRetryCategories}
                className="mt-2 underline"
              >
                Try again
              </button>
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            {categoryNames.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryChange(category)}
                className={`rounded-lg px-3 py-2 text-xs transition-colors ${
                  selectedCategory === category
                    ? "bg-orange-primary text-white"
                    : "border border-gray-200 text-gray-700 dark:text-white"
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
