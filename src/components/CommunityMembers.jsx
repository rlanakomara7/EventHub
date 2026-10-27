import { useEffect, useState } from "react";
import { MdPeopleAlt } from "react-icons/md";

const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

function resolveAvatar(path) {
  if (!path) return "/Default-Avatar.svg";

  if (/^(https?:\/\/|data:)/i.test(path)) {
    return path;
  }

  return `${API_URL}/${String(path).replace(/^\/+/, "")}`;
}

function MemberAvatar({ member }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <img
      src={
        imageFailed ? "/Default-Avatar.svg" : resolveAvatar(member.avatar_url)
      }
      alt={member.name}
      className="h-12 w-12 shrink-0 rounded-full bg-gray-100 object-cover"
      loading="lazy"
      onError={() => setImageFailed(true)}
    />
  );
}

function CommunityMembers({ communityId, onCountChange }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadMembers() {
      try {
        const response = await fetch(
          `${API_URL}/api/communities/${communityId}/members`,
          {
            signal: controller.signal,
          },
        );

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to load community members.",
          );
        }

        if (!Array.isArray(result.data)) {
          throw new Error("Invalid community members response.");
        }

        if (controller.signal.aborted) return;

        setMembers(result.data);
        setLoading(false);

        // Sinkronkan jumlah anggota ke halaman detail
        onCountChange?.(result.data.length);
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(err.message || "Failed to load members.");
        setLoading(false);
      }
    }

    loadMembers();

    return () => controller.abort();
  }, [communityId, onCountChange]);

  if (loading) {
    return (
      <p className="py-8 text-sm text-gray-secondary">
        Loading community members...
      </p>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600"
      >
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* JUMLAH ANGGOTA */}
      <div className="flex items-center gap-2 text-sm text-gray-secondary">
        <MdPeopleAlt />
        <span>{members.length.toLocaleString("id-ID")} members</span>
      </div>

      {/* EMPTY STATE */}
      {members.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white px-5 py-10 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-gray-secondary">
            No members have joined this community yet.
          </p>
        </div>
      ) : (
        <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <article
              key={member.user_id}
              className="flex min-w-0 items-center gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <MemberAvatar member={member} />

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white md:text-base">
                  {member.name}
                </h3>

                <p className="mt-1 truncate text-sm text-gray-secondary">
                  {member.job?.trim() || "Job not specified"}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default CommunityMembers;
