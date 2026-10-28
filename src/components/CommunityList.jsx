import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import CommunityCard from "./CommunityCard";

import { selectUser } from "../redux/slice/authSlice";
import { fetchCommunityMemberships } from "../redux/slice/communityMemberSlice";

function CommunityList({ communities = [], onAuthRequired, onSavedChange }) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    if (!user) return;

    const request = dispatch(fetchCommunityMemberships());

    return () => request.abort();
  }, [dispatch, user]);

  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-stretch gap-4 py-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {communities.map((community) => {
        const communityId = community.community_id ?? community.id;

        return (
          <CommunityCard
            key={communityId}
            community={community}
            onAuthRequired={onAuthRequired}
            onSavedChange={onSavedChange}
          />
        );
      })}
    </div>
  );
}

export default CommunityList;
