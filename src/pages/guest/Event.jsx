import { useEffect, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import SearchBar from "../../components/SearchBar";
import EventList from "../../components/EventList";

import {
  fetchEventPage,
  fetchEventCategories,
  selectEvents,
  selectEventMetadata,
  selectEventLoading,
  selectEventError,
  selectEventCategories,
  selectCategoriesLoading,
  selectCategoriesError,
} from "../../redux/slice/eventSlice";

const PAGE_LIMIT = 6;

function Event() {
  const { handleEventClick, handleJoin } = useOutletContext();

  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const events = useSelector(selectEvents);
  const metadata = useSelector(selectEventMetadata);
  const loading = useSelector(selectEventLoading);
  const error = useSelector(selectEventError);

  const categories = useSelector(selectEventCategories);
  const categoriesLoading = useSelector(selectCategoriesLoading);
  const categoriesError = useSelector(selectCategoriesError);

  const [page, setPage] = useState(1);

  const search = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "All";

  function handleSearchChange() {
    setPage(1);
  }

  function handleCategoryChange() {
    setPage(1);
  }

  useEffect(() => {
    const request = dispatch(fetchEventCategories());

    return () => {
      request.abort();
    };
  }, [dispatch]);

  useEffect(() => {
    const request = dispatch(
      fetchEventPage({
        page,
        limit: PAGE_LIMIT,
        search,
        category: selectedCategory,
      }),
    );

    return () => {
      request.abort();
    };
  }, [dispatch, page, search, selectedCategory]);

  function retryCategories() {
    dispatch(fetchEventCategories());
  }

  function retryEvents() {
    dispatch(
      fetchEventPage({
        page,
        limit: PAGE_LIMIT,
        search,
        category: selectedCategory,
      }),
    );
  }

  const currentPage = metadata.current_page || page;
  const totalPage = metadata.total_page || 0;

  return (
    <>
      <SearchBar
        search={search}
        setSearch={handleSearchChange}
        selectedCategory={selectedCategory}
        setSelectedCategory={handleCategoryChange}
        categories={categories}
        categoriesLoading={categoriesLoading}
        categoriesError={categoriesError}
        onRetryCategories={retryCategories}
      />

      <div className="px-4 md:px-10 lg:px-14">
        <div className="px-1 py-5">
          <p className="text-lg font-bold">
            {metadata.total_data}{" "}
            <span className="font-medium text-gray-primary/40">
              events found
            </span>
          </p>
        </div>

        {loading && (
          <p className="py-8 text-center text-gray-500">Loading Events...</p>
        )}

        {!loading && error && (
          <div role="alert" className="py-8 text-center">
            <p className="text-red-500">{error}</p>

            <button
              type="button"
              onClick={retryEvents}
              className="mt-3 rounded-lg bg-orange-primary px-4 py-2 text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <p className="py-10 text-center text-gray-500">No events found.</p>
        )}

        {!loading && !error && events.length > 0 && (
          <EventList
            events={events}
            onAuthRequired={handleJoin}
            onEventClick={handleEventClick}
          />
        )}

        {!loading && !error && (
          <div className="my-8 flex items-center justify-center gap-4">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((previous) => Math.max(1, previous - 1))}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40 dark:text-white"
            >
              Previous
            </button>

            <span className="text-sm dark:text-white">
              Page {currentPage} of {totalPage}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPage}
              onClick={() => setPage((previous) => previous + 1)}
              className="rounded-lg bg-orange-primary px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Event;
