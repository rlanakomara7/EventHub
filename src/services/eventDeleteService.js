const API_URL = import.meta.env.VITE_API_URL;

export async function deleteEvent(eventId) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login as organizer first.");
  }

  const response = await fetch(`${API_URL}/api/events/${eventId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete event.");
  }

  return result;
}
