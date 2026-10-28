const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export async function getEventDiscussionsAPI(eventId, signal) {
  const response = await fetch(`${API_URL}/api/events/${eventId}/discussions`, {
    signal,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Failed to load discussions.");
  }

  if (!Array.isArray(result.data)) {
    throw new Error("Invalid discussions response.");
  }

  return result.data;
}

export async function createEventDiscussionAPI(eventId, message) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login first.");
  }

  const response = await fetch(`${API_URL}/api/events/${eventId}/discussions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Failed to send discussion.");
  }

  if (!result.data?.discussion_id) {
    throw new Error("Invalid discussion response.");
  }

  return result.data;
}
