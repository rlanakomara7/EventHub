import { MdPeopleAlt } from "react-icons/md";
import { FiCalendar } from "react-icons/fi";
import { useNavigate } from "react-router";

function CommunityCard({ community, onAuthRequired }) {
  const navigate = useNavigate();
  console.log("Community Detail Loaded");
  return (
    <article className="flex flex-col h-full overflow-hidden rounded-xl border border-gray-200 bg-white-secondary shadow-sm">
      <div
        className="h-44 w-full overflow-hidden cursor-pointer"
        onClick={() => navigate(`/communities/${community.id}`)}
      >
        <img
          src={community.image}
          alt={community.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-col flex-1 space-y-3 px-4 py-4">
        <h3
          className="cursor-pointer text-lg font-semibold text-gray-900"
          onClick={() => navigate(`/communities/${community.id}`)}
        >
          {community.name}
        </h3>

        <p className="h-10 line-clamp-2 text-sm leading-5 text-gray-secondary">
          {community.description}
        </p>

        <div className="mt-auto flex flex-wrap gap-2">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-500">
            {community.category}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-secondary">
          <div className="flex items-center gap-1">
            <MdPeopleAlt />
            <span>{community.members.toLocaleString("id-ID")} members</span>
          </div>

          <div className="flex items-center gap-1">
            <FiCalendar />
            <span>{community.upcomingEvents} upcoming</span>
          </div>
        </div>

        <button
          type="button"
          className="mt-auto w-full rounded-lg bg-orange-primary py-2 text-sm font-medium text-white-secondary"
          onClick={onAuthRequired}
        >
          Join Community
        </button>
      </div>
    </article>
  );
}

export default CommunityCard;
