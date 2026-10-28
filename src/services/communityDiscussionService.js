const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export async function getCommunityDiscussionsAPI(communityId, signal) {
  const response = await fetch(
    `${API_URL}/api/communities/${communityId}/discussions`,
    { signal },
  );

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Failed to load discussions.");
  }

  if (!Array.isArray(result.data)) {
    throw new Error("Invalid discussions response.");
  }

  return result.data;
}

export async function createCommunityDiscussionAPI(communityId, message) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login first.");
  }

  const response = await fetch(
    `${API_URL}/api/communities/${communityId}/discussions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    },
  );

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Failed to send discussion.");
  }

  return result.data;
}
