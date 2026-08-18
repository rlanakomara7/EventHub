function MyEventsFilter() {
  return (
    <>
      <div className="mt-5 flex gap-7 ">
        <button type="button" className="px-2 pb-3 text-sm text-gray-secondary">
          Upcoming
        </button>
        <button type="button" className="px-2 pb-3 text-sm text-gray-secondary">
          Past
        </button>
        <button type="button" className="px-2 pb-3 text-sm text-gray-secondary">
          Saved
        </button>
      </div>
    </>
  );
}

export default MyEventsFilter;
