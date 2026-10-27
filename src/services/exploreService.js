import { getEvents } from "./eventsService";

const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export function resolveMediaUrl(path) {
  if (!path) return "";

  if (/^(https?:\/\/|data:)/i.test(path)) {
    return path;
  }

  return `${API_URL}/${String(path).replace(/^\/+/, "")}`;
}

// 🔄 UBAH
export async function getExploreEvents() {
  const result = await getEvents();

  const events = Array.isArray(result) ? result : result?.data;

  if (!Array.isArray(events)) {
    throw new Error("Invalid events response from backend.");
  }

  return events.map((event) => ({
    ...event,
    id: event.event_id,
    image: resolveMediaUrl(event.banner_url),
    banner_url: resolveMediaUrl(event.banner_url),
    date: event.event_date,
    time: event.start_time,
    attendees: event.attendee_count ?? 0,
    categories: event.categories ?? [],
  }));
}

export async function getExploreCommunities(signal) {
  const response = await fetch(`${API_URL}/api/communities/public`, {
    signal,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Failed to load communities.");
  }

  if (!Array.isArray(result.data)) {
    throw new Error("Invalid communities response from backend.");
  }

  return result.data.map((community) => ({
    ...community,
    id: community.community_id,
    image: resolveMediaUrl(community.banner_url),
    category: community.categories?.[0] || "Community",
    members: community.member_count ?? 0,
    upcomingEvents: community.upcoming_count ?? 0,
  }));
}
