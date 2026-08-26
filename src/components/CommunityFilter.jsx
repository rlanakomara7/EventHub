function CommunityFilter({
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
}) {
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

  const locations = [
    "All Locations",
    "Jakarta",
    "Bandung",
    "Surabaya",
    "Yogyakarta",
    "Online",
  ];

  return (
    <>
      <div
        className="
          flex
          flex-col
          gap-4
          px-3
          py-4
          md:flex-row
          md:items-center
          md:px-6
          lg:px-10
        "
      >
        <div
          className="
            flex
            shrink-0
            items-center
            rounded-lg
            border
            border-gray-200
            bg-white
            p-1
          "
        >
          {locations.map((location) => (
            <button
              key={location}
              type="button"
              // TAMBAH:
              // ketika tombol diklik, ubah selectedLocation
              onClick={() => setSelectedLocation(location)}
              className={`
                shrink-0
                rounded-md
                px-3
                py-2
                text-xs
                md:px-4
                md:text-sm

                ${
                  selectedLocation === location
                    ? "bg-orange-primary text-white-primary"
                    : "text-gray-secondary"
                }
              `}
            >
              {location}
            </button>
          ))}
        </div>

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
              // TAMBAH:
              // ketika category diklik
              onClick={() => setSelectedCategory(category)}
              className={`
                shrink-0
                rounded-md
                px-3
                py-2
                text-xs
                md:px-4
                md:text-sm

                ${
                  selectedCategory === category
                    ? "bg-orange-primary text-white-primary"
                    : "text-gray-secondary"
                }
              `}
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
