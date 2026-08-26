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
      <section className="mb-6 min-h-[420px] px-4 flex flex-col items-center gap-4 bg-black-primary text-white-primary bg-radial from-orange-600/20 from-0% via-orange-500/10 via-35% to-transparent to-70% md:min-h-[440px]">
        <div className=" flex justify-center">
          <p className=" my-6 rounded-full border border-orange-primary/20 bg-orange-primary/5 px-4 py-2 text-sm font-semibold text-orange-primary backdrop-blur-sm">
            Discover . Connect . Participate
          </p>
        </div>
        <h1 className="text-center font-extrabold text-4xl leading-tight md:text-5xl lg:text-6xl">
          Finds events that <br />
          <span className="text-orange-primary">actually matter</span> {"  "}to
          you
        </h1>
        <p className="max-w-3xl text-center text-xs leading-5 text-gray-secondary md:text-base">
          Join Workshops, confidence, and meetups in Indonesia's best tech
          communities - or create your own
        </p>
        <div className="w-full px-6">
          <form
            className="mx-auto flex w-full max-w-3xl overflow-hidden rounded-xl bg-white-secondary"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="relative flex-1">
              <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-black" />

              <input
                type="search"
                placeholder="Search events, topics, or locations..."
                className="w-full bg-white-secondary py-2 pl-9 pr-3 outline-none text-black-primary placeholder:text-gray-primary"
                value={search}
                onChange={(e) => {
                  CreateParam("search", e.target.value);
                  setSearch(e.target.value);
                }}
              />
            </div>

            <button
              type="submit"
              className="m-1 rounded-lg bg-orange-primary px-3 text-xs text-white-secondary md:px-6 md:text-sm"
            >
              Search
            </button>
          </form>
        </div>
        {/* --------- */}
        <div className="mt-4 flex max-w-3xl flex-wrap justify-center gap-2 md:gap-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className="rounded-full border bg-transparent border-white/30 px-5 py-1.5 text-gray-secondary text-xs font-medium "
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category ? "All" : category,
                )
              }
              // style active
              className={`rounded-full border px-5 py-1.5 text-xs font-medium ${
                selectedCategory === category
                  ? "border-orange-primary bg-orange-primary text-white"
                  : "border-white/30 bg-transparent text-gray-secondary"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

export default Hero;
