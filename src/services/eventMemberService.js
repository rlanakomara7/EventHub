const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

async function requestAPI(path, method = "GET", signal) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login first.");
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Request failed.");
  }

  return result;
}

export async function getJoinedEventsAPI(signal) {
  const result = await requestAPI("/api/events/joined", "GET", signal);

  if (!Array.isArray(result.data)) {
    throw new Error("Invalid joined events response.");
  }

  return result.data;
}

export async function joinEventAPI(eventId) {
  return requestAPI(`/api/events/${eventId}/join`, "POST");
}

export async function leaveEventAPI(eventId) {
  return requestAPI(`/api/events/${eventId}/leave`, "DELETE");
}
