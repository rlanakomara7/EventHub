const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

export async function getEventCategoriesAPI(signal) {
  const response = await fetch(`${API_URL}/api/events/categories`, { signal });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Failed to load event categories");
  }

  if (!Array.isArray(result.data)) {
    throw new Error("Invalid categories response");
  }
  return result.data;
}
