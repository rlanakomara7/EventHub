const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

async function request(path, method = "GET", signal) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login first.");
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    signal,
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

export async function getNotificationsAPI(signal) {
  const result = await request("/api/notifications", "GET", signal);

  if (!Array.isArray(result.data)) {
    throw new Error("Invalid notifications response.");
  }

  return result.data;
}

export async function markNotificationReadAPI(id) {
  return request(`/api/notifications/${id}/read`, "PATCH");
}

export async function markAllNotificationsReadAPI() {
  return request("/api/notifications/read-all", "PATCH");
}
