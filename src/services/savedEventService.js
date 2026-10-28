const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

async function request(path, method = "GET") {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login first.");
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Request failed.");
  }

  return result;
}

export async function getSavedEventsAPI() {
  const result = await request("/api/events/saved");
  return result.data ?? [];
}

export function saveEventAPI(eventId) {
  return request(`/api/events/${eventId}/save`, "POST");
}

export function unsaveEventAPI(eventId) {
  return request(`/api/events/${eventId}/save`, "DELETE");
}
