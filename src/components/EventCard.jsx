import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { FiCalendar } from "react-icons/fi";
import { FaBookmark } from "react-icons/fa";
import { MdPeopleAlt } from "react-icons/md";
import { FaLocationPin } from "react-icons/fa6";

import {
  joinEvent,
  leaveEvent,
  fetchJoinedEvents,
  selectJoinedIds,
  selectMemberLoaded,
  selectMemberLoading,
  selectMemberError,
  selectMemberActionLoadingId,
} from "../redux/slice/eventMemberSlice";

import {
  saveEvent,
  unsaveEvent,
  selectSavedIds,
  selectSavedActionLoadingId,
} from "../redux/slice/savedEventSlice";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

function resolveImageUrl(path) {
  if (!path) return "";

  if (/^(https?:\/\/|data:)/i.test(path)) {
    return path;
  }

  return `${API_URL}/${String(path).replace(/^\/+/, "")}`;
}

function EventCard({
  event,
  onAuthRequired = () => {},
  onEventClick = () => {},
}) {
  const eventId = event.event_id ?? event.id;
  const dispatch = useDispatch();
  const savedIds = useSelector(selectSavedIds);
  const savingId = useSelector(selectSavedActionLoadingId);
  const saved = savedIds.includes(String(eventId));
  const saving = savingId !== null && String(savingId) === String(eventId);
  const token = localStorage.getItem("token");
  const joinedIds = useSelector(selectJoinedIds);
  const memberLoaded = useSelector(selectMemberLoaded);
  const memberLoading = useSelector(selectMemberLoading);
  const memberError = useSelector(selectMemberError);
  const actionLoadingId = useSelector(selectMemberActionLoadingId);
  const registered = joinedIds.includes(String(eventId));
  const registering = actionLoadingId === String(eventId);
  const [actionError, setActionError] = useState("");
  const [imageFailed, setImageFailed] = useState(false);
  const [attendeeDelta, setAttendeeDelta] = useState(0);
  const initialAttendees = Number(event.attendee_count ?? event.attendees ?? 0);
  const attendees = Math.max(
    0,
    (Number.isFinite(initialAttendees) ? initialAttendees : 0) + attendeeDelta,
  );
  const capacity = Number(event.capacity) || 0;

  const percentage =
    capacity > 0 ? Math.min(100, Math.round((attendees / capacity) * 100)) : 0;

  const isFull = capacity > 0 && attendees >= capacity;

  const bannerUrl = resolveImageUrl(event.banner_url || event.image);

  const date = String(event.event_date || event.date || "").slice(0, 10);

  const time = String(
    event.start_time || event.event_time || event.time || "",
  ).slice(0, 5);

  const categories = Array.isArray(event.categories) ? event.categories : [];

  async function handleSave(e) {
    e.stopPropagation();

    if (eventId == null || saving) return;

    const token = localStorage.getItem("token");

    if (!token) {
      onAuthRequired(event);
      return;
    }

    setActionError("");

    try {
      if (saved) {
        await dispatch(unsaveEvent(eventId)).unwrap();
      } else {
        await dispatch(saveEvent(event)).unwrap();
      }
    } catch (error) {
      setActionError(error.message || "Failed to update saved event.");
    }
  }

  async function handleJoin(e) {
    e.stopPropagation();

    if (eventId == null || actionLoadingId !== null) return;

    if (!token) {
      onAuthRequired(event);
      return;
    }

    if (!memberLoaded) return;

    setActionError("");

    try {
      if (registered) {
        await dispatch(leaveEvent(eventId)).unwrap();
        setAttendeeDelta((previous) => previous - 1);
      } else {
        await dispatch(joinEvent(eventId)).unwrap();
        setAttendeeDelta((previous) => previous + 1);
      }
    } catch (error) {
      setActionError(
        typeof error === "string"
          ? error
          : error?.message || "Failed to update registration.",
      );
    }
  }

  return (
    <article className="flex h-full w-full min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
      <button
        type="button"
        onClick={() => onEventClick(eventId)}
        className="block h-44 w-full shrink-0 overflow-hidden bg-gray-100"
        aria-label={`View ${event.title}`}
      >
        {bannerUrl && !imageFailed ? (
          <img
            src={bannerUrl}
            alt={event.title}
            className="block h-full w-full object-cover"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
            No event image
          </div>
        )}
      </button>

      <div className="flex min-w-0 flex-1 flex-col p-4">
        <div className="space-y-3">
          <h3 className="min-h-12 text-base font-bold leading-6 md:text-lg">
            <button
              type="button"
              onClick={() => onEventClick(eventId)}
              className="line-clamp-2 w-full wrap-break-word text-left hover:text-orange-primary"
            >
              {event.title}
            </button>
          </h3>

          <div className="flex min-h-6 flex-wrap gap-1.5">
            {categories.map((category, index) => {
              const categoryName =
                typeof category === "string"
                  ? category
                  : (category.category_name ?? category.name);

              if (!categoryName) return null;

              return (
                <span
                  key={`${categoryName}-${index}`}
                  className="rounded-full bg-orange-primary/10 px-2 py-1 text-xs text-orange-primary"
                >
                  {categoryName}
                </span>
              );
            })}
          </div>

          <div className="flex min-w-0 items-start gap-2 text-sm text-gray-secondary">
            <FiCalendar className="mt-0.5 shrink-0" />

            <p className="min-w-0">
              {date || "-"}
              {time ? ` · ${time} WIB` : ""}
            </p>
          </div>

          <div className="flex min-w-0 items-start gap-2 text-sm text-gray-secondary">
            <FaLocationPin className="mt-0.5 shrink-0" />

            <p className="min-w-0 wrap-break-word">
              {event.location || (event.format === "online" ? "Online" : "-")}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-secondary">
            <MdPeopleAlt className="shrink-0" />
            <p>{percentage}% attendees</p>
          </div>
        </div>

        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between gap-2 text-xs text-gray-secondary">
            <p>{attendees} attendees</p>
            <p>{capacity} capacity</p>
          </div>

          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-green-primary transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {actionError && (
            <p role="alert" className="mt-3 text-xs text-red-600">
              {actionError}
            </p>
          )}

          {token && !memberLoaded && memberError && (
            <div className="mt-3 text-xs text-red-600">
              <p>{memberError}</p>
              <button
                type="button"
                onClick={() => dispatch(fetchJoinedEvents())}
                className="mt-1 underline"
              >
                Try Again
              </button>
            </div>
          )}

          <div className="mt-4 flex w-full items-center gap-2">
            <button
              type="button"
              onClick={handleJoin}
              disabled={
                eventId == null ||
                actionLoadingId !== null ||
                (Boolean(token) && (!memberLoaded || memberLoading)) ||
                (!registered && isFull)
              }
              className={`flex h-9 min-w-0 flex-1 items-center justify-center rounded-lg px-3 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${
                registered ? "bg-green-primary" : "bg-orange-primary"
              }`}
            >
              {registering
                ? "Processing..."
                : registered
                  ? "Leave Event"
                  : token && !memberLoaded
                    ? "Checking..."
                    : isFull
                      ? "Event Full"
                      : "Join Event"}
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              aria-label={saved ? "Unsave event" : "Save event"}
              title={saved ? "Unsave event" : "Save event"}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              <FaBookmark
                className={`text-lg ${
                  saved ? "text-orange-primary" : "text-gray-400"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default EventCard;
