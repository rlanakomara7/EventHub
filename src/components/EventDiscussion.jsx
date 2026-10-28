import { useEffect, useState } from "react";
import { FiMessageCircle, FiSend } from "react-icons/fi";

import { getAvatarUrl } from "../services/profileService";

import {
  getEventDiscussionsAPI,
  createEventDiscussionAPI,
} from "../services/eventDiscussionService";

function formatDiscussionTime(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function EventDiscussion({ eventId, joined, membershipLoading, user }) {
  const [discussions, setDiscussions] = useState([]);
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadDiscussions() {
      setLoading(true);
      setError("");
      setDiscussions([]);

      try {
        const data = await getEventDiscussionsAPI(eventId, controller.signal);

        if (!controller.signal.aborted) {
          setDiscussions(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || "Failed to load discussions.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadDiscussions();

    return () => controller.abort();
  }, [eventId, refresh]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (posting || loading || membershipLoading) return;

    if (!user || !localStorage.getItem("token")) {
      setFormError("Please login first.");
      return;
    }

    if (!joined) {
      setFormError("Join this event first.");
      return;
    }

    const text = message.trim();

    if (!text || Array.from(text).length > 1000) {
      setFormError("Message must contain 1-1000 characters.");
      return;
    }

    setPosting(true);
    setFormError("");

    try {
      const newDiscussion = await createEventDiscussionAPI(eventId, text);

      setDiscussions((previous) =>
        [
          newDiscussion,
          ...previous.filter(
            (item) => item.discussion_id !== newDiscussion.discussion_id,
          ),
        ].slice(0, 100),
      );

      setMessage("");
    } catch (err) {
      setFormError(err.message || "Failed to send discussion.");
    } finally {
      setPosting(false);
    }
  }

  const cannotSend =
    !joined || membershipLoading || loading || posting || !message.trim();

  return (
    <section className="mt-7">
      <h2 className="flex items-center gap-2 font-semibold">
        <FiMessageCircle />
        Discussion
        <span className="text-sm font-normal text-gray-secondary">
          ({discussions.length})
        </span>
      </h2>

      {/* Form diskusi */}
      <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-3">
        <img
          src={getAvatarUrl(user?.avatar || user?.avatar_url)}
          alt=""
          className="h-9 w-9 rounded-full object-cover"
        />

        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-gray-200 px-4 dark:border-zinc-800">
          <input
            type="text"
            value={message}
            maxLength={1000}
            disabled={!joined || membershipLoading || posting}
            onChange={(event) => {
              setMessage(event.target.value);
              setFormError("");
            }}
            placeholder={
              membershipLoading
                ? "Checking membership..."
                : joined
                  ? "Write a message..."
                  : "Join this event to send a message..."
            }
            className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed"
          />

          <button
            type="submit"
            disabled={cannotSend}
            aria-label="Send discussion"
            className="text-orange-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiSend />
          </button>
        </div>
      </form>

      {!joined && !membershipLoading && (
        <p className="mt-3 text-xs text-gray-secondary">
          Join this event to participate in the discussion.
        </p>
      )}

      {formError && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {formError}
        </p>
      )}

      {loading ? (
        <p className="mt-5 text-sm text-gray-secondary">
          Loading discussions...
        </p>
      ) : error ? (
        <div className="mt-5">
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() => setRefresh((value) => value + 1)}
            className="mt-2 text-sm text-orange-primary underline"
          >
            Try Again
          </button>
        </div>
      ) : discussions.length === 0 ? (
        <div className="mt-5 rounded-xl border border-gray-200 p-6 text-center dark:border-zinc-800">
          <p className="text-sm text-gray-secondary">No discussions yet.</p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {discussions.map((item) => (
            <div key={item.discussion_id} className="flex items-start gap-3">
              <img
                src={getAvatarUrl(item.avatar_url)}
                alt=""
                className="h-9 w-9 rounded-full object-cover"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = "/Default-Avatar.svg";
                }}
              />

              <div className="min-w-0 flex-1 rounded-xl border border-gray-200 p-4 dark:border-zinc-800">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold">
                    {item.name || "Member"}
                  </span>

                  <span className="text-xs text-gray-secondary">
                    {formatDiscussionTime(item.created_at)}
                  </span>
                </div>

                <p className="mt-2 wrap-break-word text-sm text-gray-secondary">
                  {item.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default EventDiscussion;
