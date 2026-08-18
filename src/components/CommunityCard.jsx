import { MdPeopleAlt } from "react-icons/md";
import { FiCalendar } from "react-icons/fi";

function CommunityCard({ community, onAuthRequired }) {
  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white-secondary shadow-sm">
      <div className="h-44 w-full overflow-hidden">
        <img
          src={community.image}
          alt={community.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="space-y-3 px-4 py-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {community.name}
        </h3>

        <p className="text-sm leading-5 text-gray-secondary">
          {community.description}
        </p>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-500">
            {community.category}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-secondary">
          <div className="flex items-center gap-1">
            <MdPeopleAlt className="text-sm" />
            <span>{community.members.toLocaleString("id-ID")} members</span>
          </div>

          <div className="flex items-center gap-1">
            <FiCalendar className="text-sm" />
            <span>{community.upcomingEvents} upcoming</span>
          </div>
        </div>

        <button
          type="button"
          className="w-full rounded-lg bg-orange-primary py-2 text-sm font-medium text-white-secondary transition hover:opacity-90"
          onClick={onAuthRequired}
        >
          Join Community
        </button>
      </div>
    </article>
  );
}

export default CommunityCard;
