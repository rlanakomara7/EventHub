import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import EventCard from "../../components/EventCard";
import CommunityCard from "../../components/CommunityCard";
import MyProfileFilter from "../../components/MyProfileFilter";

import {
  selectUser,
  selectProfileLoading,
  selectProfileError,
  fetchProfile,
  updateProfile,
  clearProfileError,
} from "../../redux/slice/authSlice";

import {
  fetchJoinedEvents,
  selectJoinedEvents,
  selectMemberLoading,
  selectMemberError,
} from "../../redux/slice/eventMemberSlice";

import {
  fetchSavedEvents,
  selectSavedEvents,
  selectSavedLoading,
  selectSavedError,
} from "../../redux/slice/savedEventSlice";

import {
  fetchSavedCommunities,
  selectSavedCommunities,
  selectSavedCommunityLoading,
  selectSavedCommunityError,
} from "../../redux/slice/savedCommunitySlice";

import { fetchCommunityMemberships } from "../../redux/slice/communityMemberSlice";
import { getExploreCommunities } from "../../services/exploreService";
import { getAvatarUrl } from "../../services/profileService";

function getId(item) {
  return String(item.event_id ?? item.community_id ?? item.id);
}

function MyProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const profileLoading = useSelector(selectProfileLoading);
  const profileError = useSelector(selectProfileError);

  const registeredEvents = useSelector(selectJoinedEvents) || [];
  const eventsLoading = useSelector(selectMemberLoading);
  const eventsError = useSelector(selectMemberError);

  const savedEvents = useSelector(selectSavedEvents) || [];
  const savedEventsLoading = useSelector(selectSavedLoading);
  const savedEventsError = useSelector(selectSavedError);

  const savedCommunities = useSelector(selectSavedCommunities) || [];
  const savedCommunitiesLoading = useSelector(selectSavedCommunityLoading);
  const savedCommunitiesError = useSelector(selectSavedCommunityError);

  const membershipById = useSelector((state) => state.communityMember.byId);

  const membershipsLoading = useSelector(
    (state) => state.communityMember.loading,
  );

  const membershipsError = useSelector((state) => state.communityMember.error);

  const [allCommunities, setAllCommunities] = useState([]);
  const [communitiesLoading, setCommunitiesLoading] = useState(true);
  const [communitiesError, setCommunitiesError] = useState("");

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewError, setPreviewError] = useState("");
  const [activeTab, setActiveTab] = useState("events");

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    location: "",
    bio: "",
    avatar: "",
  });

  const joinedCommunities = allCommunities.filter(
    (community) =>
      membershipById[String(community.community_id ?? community.id)] === true,
  );

  useEffect(() => {
    if (!localStorage.getItem("token")) return;

    const request = dispatch(fetchProfile());

    return () => request.abort();
  }, [dispatch]);

  useEffect(() => {
    if (!user || !localStorage.getItem("token")) return;

    const requests = [
      dispatch(fetchJoinedEvents()),
      dispatch(fetchCommunityMemberships()),
      dispatch(fetchSavedEvents()),
      dispatch(fetchSavedCommunities()),
    ];

    return () => {
      requests.forEach((request) => request.abort());
    };
  }, [dispatch, user]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCommunities() {
      try {
        const data = await getExploreCommunities(controller.signal);

        if (!controller.signal.aborted) {
          setAllCommunities(data);
          setCommunitiesError("");
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setCommunitiesError(error.message || "Failed to load communities.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setCommunitiesLoading(false);
        }
      }
    }

    loadCommunities();

    return () => controller.abort();
  }, []);

  function handleOpenEditProfile() {
    dispatch(clearProfileError());
    setPreviewError("");
    setAvatarFile(null);

    setProfileForm({
      name: user?.name || "",
      email: user?.email || "",
      location: user?.location || "",
      bio: user?.bio || "",
      avatar: user?.avatar || "",
    });

    setShowEditProfile(true);
  }

  function handleCloseEditProfile() {
    if (profileLoading) return;

    setShowEditProfile(false);
    setAvatarFile(null);
    setPreviewError("");
    dispatch(clearProfileError());
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setPreviewError("File harus JPG, PNG, atau WEBP.");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setPreviewError("Ukuran foto maksimal 2 MB.");
      e.target.value = "";
      return;
    }

    setPreviewError("");
    setAvatarFile(file);

    const reader = new FileReader();

    reader.onload = () => {
      setProfileForm((prev) => ({
        ...prev,
        avatar: reader.result,
      }));
    };

    reader.onerror = () => {
      setAvatarFile(null);
      setPreviewError("Gagal membaca gambar.");
    };

    reader.readAsDataURL(file);
  }

  async function handleSaveProfile(e) {
    e.preventDefault();

    if (profileLoading) return;

    if (profileForm.name.trim().length < 2) {
      setPreviewError("Nama minimal 2 karakter.");
      return;
    }

    setPreviewError("");

    try {
      await dispatch(
        updateProfile({
          form: profileForm,
          avatarFile,
        }),
      ).unwrap();

      setAvatarFile(null);
      setShowEditProfile(false);
    } catch {
      // Error ditampilkan dari Redux.
    }
  }

  function renderEventCard(event) {
    return (
      <EventCard
        key={getId(event)}
        event={event}
        isRegistered={registeredEvents.some(
          (item) => getId(item) === getId(event),
        )}
        onEventClick={(eventId) => navigate(`/event/${eventId}`)}
      />
    );
  }

  function renderCommunityCard(community) {
    return <CommunityCard key={getId(community)} community={community} />;
  }

  return (
    <div className="mt-10 dark:text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-4 sm:gap-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <img
              src={getAvatarUrl(user?.avatar)}
              alt={user?.name || "Profile"}
              className="h-20 w-20 rounded-2xl object-cover"
            />

            <span className="absolute right-0 top-0 h-4 w-4 rounded-md border-2 border-white bg-green-500" />
          </div>

          {/* Profile Information */}
          <div className="flex min-w-0 flex-1 flex-col">
            <h2 className="wrap-break-word text-xl font-bold leading-tight sm:text-2xl">
              {user?.name || "User"}
            </h2>

            <p className="mt-1 break-all text-sm text-gray-500 sm:text-base">
              {user?.email || "-"}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-500">
              <span>{user?.location || "Indonesia"}</span>

              {user?.joinedAt && (
                <span>
                  Joined {new Date(user.joinedAt).toLocaleDateString("id-ID")}
                </span>
              )}

              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-500 dark:bg-orange-500/15">
                {user?.role || "Attendee"}
              </span>
            </div>

            <p className="mt-3 max-w-xl break-words text-sm leading-relaxed text-gray-600 dark:text-zinc-400 sm:text-base">
              {user?.bio || "Belum ada informasi bio."}
            </p>
          </div>
        </div>

        {/* Edit Profile */}
        <button
          type="button"
          onClick={handleOpenEditProfile}
          className="w-full shrink-0 self-start rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 sm:w-auto dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
        >
          Edit Profile
        </button>
      </div>

      <div className="mx-auto mt-8 grid max-w-4xl grid-cols-3 py-5 text-center">
        <div>
          <h3 className="text-2xl font-bold">{registeredEvents.length}</h3>
          <p className="text-gray-500">Events</p>
        </div>

        <div className="border-x border-gray-300 dark:border-zinc-700">
          <h3 className="text-2xl font-bold">{joinedCommunities.length}</h3>
          <p className="text-gray-500">Communities</p>
        </div>

        <div>
          <h3 className="text-2xl font-bold">
            {savedEvents.length + savedCommunities.length}
          </h3>
          <p className="text-gray-500">Saved</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl">
        <MyProfileFilter activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <section className="min-h-screen bg-white-secondary py-6 transition-colors duration-300 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-6">
          {activeTab === "events" && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {eventsLoading ? (
                <p className="text-sm text-gray-secondary">Loading events...</p>
              ) : eventsError ? (
                <div>
                  <p className="text-sm text-red-600">{eventsError}</p>
                  <button
                    type="button"
                    onClick={() => dispatch(fetchJoinedEvents())}
                    className="mt-2 text-orange-primary underline"
                  >
                    Try Again
                  </button>
                </div>
              ) : registeredEvents.length > 0 ? (
                registeredEvents.map(renderEventCard)
              ) : (
                <p className="text-sm text-gray-secondary">
                  Belum ada event yang diikuti.
                </p>
              )}
            </div>
          )}

          {activeTab === "communities" && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {communitiesLoading || membershipsLoading ? (
                <p className="text-sm text-gray-secondary">
                  Loading communities...
                </p>
              ) : communitiesError || membershipsError ? (
                <div>
                  <p className="text-sm text-red-600">
                    {communitiesError || membershipsError}
                  </p>

                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="mt-2 text-orange-primary underline"
                  >
                    Try Again
                  </button>
                </div>
              ) : joinedCommunities.length > 0 ? (
                joinedCommunities.map(renderCommunityCard)
              ) : (
                <p className="text-sm text-gray-secondary">
                  Belum ada community yang diikuti.
                </p>
              )}
            </div>
          )}

          {activeTab === "saved" && (
            <div className="space-y-8">
              <div>
                <h2 className="mb-4 text-lg font-semibold">Saved Events</h2>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {savedEventsLoading ? (
                    <p className="text-sm text-gray-secondary">
                      Loading saved events...
                    </p>
                  ) : savedEventsError ? (
                    <div>
                      <p className="text-sm text-red-600">{savedEventsError}</p>

                      <button
                        type="button"
                        onClick={() => dispatch(fetchSavedEvents())}
                        className="mt-2 text-orange-primary underline"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : savedEvents.length > 0 ? (
                    savedEvents.map(renderEventCard)
                  ) : (
                    <p className="text-sm text-gray-secondary">
                      Belum ada event yang disimpan.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-lg font-semibold">
                  Saved Communities
                </h2>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {savedCommunitiesLoading ? (
                    <p className="text-sm text-gray-secondary">
                      Loading saved communities...
                    </p>
                  ) : savedCommunitiesError ? (
                    <div>
                      <p className="text-sm text-red-600">
                        {savedCommunitiesError}
                      </p>

                      <button
                        type="button"
                        onClick={() => dispatch(fetchSavedCommunities())}
                        className="mt-2 text-orange-primary underline"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : savedCommunities.length > 0 ? (
                    savedCommunities.map(renderCommunityCard)
                  ) : (
                    <p className="text-sm text-gray-secondary">
                      Belum ada community yang disimpan.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <form
            onSubmit={handleSaveProfile}
            className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl dark:bg-zinc-900 dark:text-white"
          >
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-lg font-semibold">Edit Profile</h2>

              <button
                type="button"
                onClick={handleCloseEditProfile}
                disabled={profileLoading}
                className="text-gray-500"
                aria-label="Close edit profile"
              >
                ×
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <img
                  src={getAvatarUrl(profileForm.avatar)}
                  alt="Profile preview"
                  className="mb-3 h-20 w-20 rounded-2xl object-cover"
                />

                <label htmlFor="profileAvatar" className="mb-1 block text-sm">
                  Profile Photo
                </label>

                <input
                  id="profileAvatar"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handlePhotoChange}
                  disabled={profileLoading}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label htmlFor="profileName" className="mb-1 block text-sm">
                  Full Name
                </label>

                <input
                  id="profileName"
                  type="text"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  minLength={2}
                  maxLength={100}
                  required
                  disabled={profileLoading}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label htmlFor="profileEmail" className="mb-1 block text-sm">
                  Email
                </label>

                <input
                  id="profileEmail"
                  type="email"
                  value={profileForm.email}
                  readOnly
                  className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm dark:bg-zinc-800"
                />
              </div>

              <div>
                <label htmlFor="profileLocation" className="mb-1 block text-sm">
                  Location
                </label>

                <input
                  id="profileLocation"
                  type="text"
                  value={profileForm.location}
                  maxLength={150}
                  disabled={profileLoading}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label htmlFor="profileBio" className="mb-1 block text-sm">
                  Bio
                </label>

                <textarea
                  id="profileBio"
                  value={profileForm.bio}
                  maxLength={500}
                  rows={4}
                  disabled={profileLoading}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      bio: e.target.value,
                    }))
                  }
                  placeholder="Tell the community a little about yourself..."
                  className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              {(previewError || profileError) && (
                <p role="alert" className="text-sm text-red-500">
                  {previewError || profileError}
                </p>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCloseEditProfile}
                disabled={profileLoading}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 disabled:opacity-50 dark:bg-zinc-800 dark:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={profileLoading}
                className="rounded-lg bg-orange-primary px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                {profileLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default MyProfile;
