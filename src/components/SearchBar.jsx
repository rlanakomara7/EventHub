import { BsFilterSquare } from "react-icons/bs";
import { useState } from "react";
import { useSearchParams } from "react-router";
// import { useSearchParams } from "react-router";

function SearchBar({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
}) {
  const [showFilter, setShowFilter] = useState(false);
  const [searchParam, useSearchParam] = useSearchParams();

  function CreateParam(key, url) {
    const find = new URLSearchParams(searchParam);
    if (find.has(key)) {
      find.set(key, url);
    } else {
      find.append(key, url);
    }
    useSearchParam(find);
  }

  return (
    <>
      <div className="px-10 py-5">
        <div className="flex flex-row justify-between items-center gap-3">
          <input
            type="text"
            placeholder=" Search events"
            className="w-screen py-2 bg-white-secondary rounded-xl"
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
              className="text-gray-primary "
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
            <button
              type="button"
              onClick={() => setSelectedCategory("All")}
              className={`rounded-lg px-3 py-2 text-xs ${
                selectedCategory === "All"
                  ? "bg-orange-primary text-white"
                  : "border border-gray-200"
              }`}
            >
              All
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory("Technology")}
              className={`rounded-lg px-3 py-2 text-xs ${
                selectedCategory === "Technology"
                  ? "bg-orange-primary text-white"
                  : "border border-gray-200"
              }`}
            >
              Technology
            </button>

            <button
              type="button"
              onClick={() => {
                CreateParam("category", "design");

                setSelectedCategory("Design");
              }}
              className={`rounded-lg px-3 py-2 text-xs ${
                selectedCategory === "Design"
                  ? "bg-orange-primary text-white"
                  : "border border-gray-200"
              }`}
            >
              Design
            </button>

            <button
              type="button"
              onClick={() => {
                CreateParam("category", "business");
                setSelectedCategory("Business");
              }}
              className={`rounded-lg px-3 py-2 text-xs ${
                selectedCategory === "Business"
                  ? "bg-orange-primary text-white"
                  : "border border-gray-200"
              }`}
            >
              Business
            </button>

            <button
              type="button"
              onClick={() => {
                CreateParam("category", "ai");
                setSelectedCategory("AI");
              }}
              className={`rounded-lg px-3 py-2 text-xs ${
                selectedCategory === "AI"
                  ? "bg-orange-primary text-white"
                  : "border border-gray-200"
              }`}
            >
              AI
            </button>

            <button
              type="button"
              onClick={() => {
                CreateParam("category", "ai");
                setSelectedCategory("Programming");
              }}
              className={`rounded-lg px-3 py-2 text-xs ${
                selectedCategory === "Programming"
                  ? "bg-orange-primary text-white"
                  : "border border-gray-200"
              }`}
            >
              Programming
            </button>

            <button
              type="button"
              onClick={() => {
                CreateParam("category", "music");
                setSelectedCategory("Music");
              }}
              className={`rounded-lg px-3 py-2 text-xs ${
                selectedCategory === "Music"
                  ? "bg-orange-primary text-white"
                  : "border border-gray-200"
              }`}
            >
              Music
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default SearchBar;
