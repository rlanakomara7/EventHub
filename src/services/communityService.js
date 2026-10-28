const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export async function getCommunities(search = "", category = "", signal) {
  const params = new URLSearchParams();

  if (search) params.set("search", search);
  if (category && category !== "All") {
    params.set("category", category);
  }

  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/communities?${params.toString()}`,
    {
      signal,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  );

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Failed to get communities.");
  }

  return result.data ?? [];
}

async function changeCommunityMembership(communityId, method, action) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login first.");
  }

  const response = await fetch(
    `${API_URL}/api/communities/${communityId}/${action}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || `Failed to ${action} community.`);
  }

  return result;
}

export function joinCommunity(communityId) {
  return changeCommunityMembership(communityId, "POST", "join");
}

export function leaveCommunity(communityId) {
  return changeCommunityMembership(communityId, "DELETE", "leave");
}
