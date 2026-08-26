import { CiSearch } from "react-icons/ci";

function CommunityHero({ search, setSearch }) {
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
    <section
      className="bg-black-primary 
        px-4 py-8 
        text-white-primary 
        md:px-6 md:py-12"
    >
      <h1 className="text-center text-2xl font-bold md:text-3xl">
        Explore Communities
      </h1>

      <p
        className="
          mx-auto mt-2 
          max-w-2xl 
          text-center 
          text-xs leading-5 
          text-gray-secondary 
          md:text-sm
        "
      >
        Join communities that match your interests and get personalized event
        recommendations.
      </p>

      <div className="mx-auto mt-5 max-w-3xl">
        <div className="relative">
          <CiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-secondary" />

          <input
            type="search"
            placeholder="Search communities..."
            // TAMBAH
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className="w-full rounded-xl bg-white-secondary py-3 pl-11 pr-4 text-black-primary outline-none placeholder:text-gray-primary"
          />
        </div>
      </div>
    </section>
  );
}

export default CommunityHero;
