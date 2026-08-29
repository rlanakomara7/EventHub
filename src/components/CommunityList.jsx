import CommunityCard from "./CommunityCard";

function CommunityList({ communities, onAuthRequired, events, onEventClick }) {
  return (
    <>
      <main className=" grid grid-cols-1 gap-4 py-5 md:grid-cols-2  lg:grid-cols-3  xl:grid-cols-4">
        {communities.map((community) => (
          <CommunityCard
            key={community.id}
            community={community}
            onAuthRequired={onAuthRequired}
          />
        ))}
      </main>
    </>
  );
}

export default CommunityList;
