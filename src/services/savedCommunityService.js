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

export async function getSavedCommunitiesAPI(signal) {
  const result = await request("/api/communities/saved", "GET", signal);
  return result.data ?? [];
}

export function saveCommunityAPI(communityId) {
  return request(`/api/communities/${communityId}/save`, "POST");
}

export function unsaveCommunityAPI(communityId) {
  return request(`/api/communities/${communityId}/save`, "DELETE");
}
