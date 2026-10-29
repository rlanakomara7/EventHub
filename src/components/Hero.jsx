import { CiSearch } from "react-icons/ci";
import { useSearchParams } from "react-router";

function Hero({ search, setSearch, selectedCategory, setSelectedCategory }) {
  const categories = [
    "Technology",
    "AI",
    "Design",
    "Business",
    "Programming",
    "Music",
  ];

  const [searchParams, setSearchParams] = useSearchParams();

  function handleSearchChange(e) {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    setSearchParams(params, { replace: true });
    setSearch(value);
  }

  return (
    <section className="mb-6 flex w-full flex-col items-center gap-5 bg-black-primary bg-radial from-orange-600/20 from-0% via-orange-500/10 via-35% to-transparent to-70% px-4 pt-7 pb-10 text-white-primary sm:min-h-[440px] sm:px-6 sm:pt-9">
      <p className="rounded-full border border-orange-primary/20 bg-orange-primary/5 px-4 py-2 text-center text-xs font-semibold text-orange-primary sm:text-sm">
        Discover . Connect . Participate
      </p>

      <h1 className="mx-auto max-w-4xl text-balance text-center text-[clamp(1.875rem,7.2vw,3.75rem)] leading-[1.18] font-extrabold tracking-tight">
        Find events that{" "}
        <span className="text-orange-primary">actually matter</span>{" "}
        <span className="whitespace-nowrap">to you</span>
      </h1>

      <p className="mx-auto max-w-xl text-center text-sm leading-6 text-gray-secondary sm:text-base">
        Join workshops, conferences, and meetups in Indonesia's best tech
        communities — or create your own.
      </p>

      <form
        className="flex w-full max-w-2xl items-center rounded-xl bg-white-secondary p-1"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="relative min-w-0 flex-1">
          <CiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-xl text-black-primary" />

          <input
            type="search"
            placeholder="Search events..."
            aria-label="Search events"
            className="w-full min-w-0 bg-transparent py-2.5 pr-2 pl-9 text-sm text-black-primary outline-none placeholder:text-gray-primary sm:text-base"
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        <button
          type="submit"
          className="shrink-0 rounded-lg bg-orange-primary px-4 py-2.5 text-sm font-medium text-white sm:px-6"
        >
          Search
        </button>
      </form>

      <div className="flex w-full max-w-2xl flex-wrap justify-center gap-2 pt-1">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() =>
              setSelectedCategory(
                selectedCategory === category ? "All" : category,
              )
            }
            className={`rounded-full border px-3.5 py-2 text-xs font-medium transition-colors sm:px-5 ${
              selectedCategory === category
                ? "border-orange-primary bg-orange-primary text-white"
                : "border-white/30 bg-transparent text-gray-secondary hover:border-orange-primary hover:text-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </section>
  );
}

export default Hero;
