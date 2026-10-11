import CommunityCard from "./CommunityCard";

function CommunityList({ communities, onAuthRequired, onJoinChange }) {
  return (
    <main className="grid grid-cols-1 gap-4 py-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {communities.map((community) => (
        <CommunityCard
          key={community.id}
          community={community}
          onAuthRequired={onAuthRequired}
          onJoinChange={onJoinChange}
        />
      ))}
    </main>
  );
}

export default CommunityList;
