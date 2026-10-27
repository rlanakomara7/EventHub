import { useEffect, useState } from "react";
import CommunityCard from "./CommunityCard";

const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

function CommunityList({ communities = [], onAuthRequired, onSavedChange }) {
  const [membershipMap, setMembershipMap] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const controller = new AbortController();

    async function loadMemberships() {
      try {
        const response = await fetch(`${API_URL}/api/communities`, {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) return;

        const result = await response.json();

        const items =
          result.data?.communities ??
          result.data ??
          result.communities ??
          result;

        if (!Array.isArray(items)) return;

        const nextMap = {};

        for (const item of items) {
          const communityId = item.community_id ?? item.id;

          const isJoined = item.is_joined ?? item.isJoined;

          if (communityId != null && typeof isJoined === "boolean") {
            nextMap[String(communityId)] = isJoined;
          }
        }

        if (!controller.signal.aborted) {
          setMembershipMap(nextMap);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to load community memberships:", error.message);
        }
      }
    }

    loadMemberships();

    return () => controller.abort();
  }, []);

  function handleMembershipUpdated(communityId, joined) {
    setMembershipMap((previous) => ({
      ...previous,
      [String(communityId)]: joined,
    }));
  }

  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-stretch gap-4 py-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {communities.map((community) => {
        const communityId = community.community_id ?? community.id;

        const key = String(communityId);

        const hasMembershipData = Object.prototype.hasOwnProperty.call(
          membershipMap,
          key,
        );

        const item = hasMembershipData
          ? {
              ...community,
              is_joined: membershipMap[key],
              isJoined: membershipMap[key],
            }
          : community;

        return (
          <CommunityCard
            key={key}
            community={item}
            onAuthRequired={onAuthRequired}
            onSavedChange={onSavedChange}
            onMembershipUpdated={handleMembershipUpdated}
          />
        );
      })}
    </div>
  );
}

export default CommunityList;
