import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiSend } from "react-icons/fi";

import { getAvatarUrl } from "../services/profileService";

import {
  fetchCommunityDiscussions,
  createCommunityDiscussion,
} from "../redux/slice/communityDiscussionSlice";

const EMPTY_DISCUSSIONS = [];

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

function CommunityDiscussion({ communityId, joined, membershipLoading, user }) {
  const dispatch = useDispatch();
  const key = String(communityId);

  const discussions = useSelector(
    (state) => state.communityDiscussion.itemsById[key] ?? EMPTY_DISCUSSIONS,
  );

  const loading = useSelector(
    (state) => state.communityDiscussion.loadingById[key] === true,
  );

  const error = useSelector(
    (state) => state.communityDiscussion.errorById[key],
  );

  const posting = useSelector(
    (state) => state.communityDiscussion.postingById[key] === true,
  );

  const postError = useSelector(
    (state) => state.communityDiscussion.postErrorById[key],
  );

  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const request = dispatch(fetchCommunityDiscussions(communityId));

    return () => request.abort();
  }, [dispatch, communityId]);

  async function handleSubmit(event) {
    event.preventDefault();

    const text = message.trim();

    if (posting || loading) return;

    if (!user || !localStorage.getItem("token")) {
      setFormError("Please login first.");
      return;
    }

    if (!joined) {
      setFormError("Join this community first.");
      return;
    }

    if (text.length === 0 || Array.from(text).length > 1000) {
      setFormError("Message must contain 1-1000 characters.");
      return;
    }

    setFormError("");

    try {
      await dispatch(
        createCommunityDiscussion({
          communityId,
          message: text,
        }),
      ).unwrap();

      setMessage("");
    } catch {
      // Pesan error ditampilkan dari Redux.
    }
  }

  const cannotSend =
    !joined || membershipLoading || loading || posting || !message.trim();

  return (
    <section className="mt-6">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <img
          src={getAvatarUrl(user?.avatar || user?.avatar_url)}
          alt=""
          className="h-9 w-9 shrink-0 rounded-full object-cover"
        />

        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-900">
          <input
            type="text"
            value={message}
            maxLength={1000}
            onChange={(event) => {
              setMessage(event.target.value);
              setFormError("");
            }}
            disabled={!joined || membershipLoading || posting}
            placeholder={
              membershipLoading
                ? "Checking membership..."
                : joined
                  ? "Write a message..."
                  : "Join this community to send a message..."
            }
            className="min-w-0 flex-1 bg-transparent py-3 text-sm text-gray-secondary outline-none disabled:cursor-not-allowed"
          />

          <button
            type="submit"
            disabled={cannotSend}
            aria-label="Send discussion"
            className="shrink-0 text-orange-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiSend />
          </button>
        </div>
      </form>

      {!joined && !membershipLoading && (
        <p className="mt-3 text-xs text-gray-secondary">
          Join this community to participate in the discussion.
        </p>
      )}

      {(formError || postError) && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {formError || postError}
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
            onClick={() => dispatch(fetchCommunityDiscussions(communityId))}
            className="mt-2 text-sm text-orange-primary underline"
          >
            Try Again
          </button>
        </div>
      ) : discussions.length === 0 ? (
        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-gray-secondary">
            No community discussions yet.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {discussions.map((item) => (
            <div key={item.discussion_id} className="flex items-start gap-3">
              <img
                src={getAvatarUrl(item.avatar_url)}
                alt=""
                className="h-9 w-9 shrink-0 rounded-full object-cover"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.src = "/Default-Avatar.svg";
                }}
              />

              <div className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold">
                    {item.name || "Member"}
                  </span>

                  <span className="text-xs text-gray-secondary">
                    {formatDiscussionTime(item.created_at)}
                  </span>
                </div>

                <p className="mt-1 break-words text-sm leading-6 text-gray-secondary">
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

export default CommunityDiscussion;
