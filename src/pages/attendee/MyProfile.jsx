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

import { getAvatarUrl } from "../../services/profileService";

function readStorage(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function MyProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const profileLoading = useSelector(selectProfileLoading);
  const profileError = useSelector(selectProfileError);

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewError, setPreviewError] = useState("");

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    location: "",
    bio: "",
    avatar: "",
  });

  const [activeTab, setActiveTab] = useState("events");

  const [registeredEvents, setRegisteredEvents] = useState(() =>
    readStorage("registeredEvents"),
  );

  const [joinedCommunities, setJoinedCommunities] = useState(() =>
    readStorage("joinedCommunities"),
  );

  const [savedEvents, setSavedEvents] = useState(() =>
    readStorage("savedEvents"),
  );

  const [savedCommunities, setSavedCommunities] = useState(() =>
    readStorage("savedCommunities"),
  );

  useEffect(() => {
    if (!localStorage.getItem("token")) return;

    const request = dispatch(fetchProfile());

    return () => {
      request.abort();
    };
  }, [dispatch]);

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
      // Pesan error ditangani oleh Redux.
    }
  }

  function handleEventClick(eventId) {
    navigate(`/event/${eventId}`);
  }

  function handleToggleRegistered(event) {
    const alreadyRegistered = registeredEvents.some(
      (item) => String(item.id) === String(event.id),
    );

    const updatedEvents = alreadyRegistered
      ? registeredEvents.filter((item) => String(item.id) !== String(event.id))
      : [...registeredEvents, event];

    localStorage.setItem("registeredEvents", JSON.stringify(updatedEvents));

    setRegisteredEvents(updatedEvents);
  }

  function handleJoinedCommunityChange(community, isJoined) {
    const updatedCommunities = isJoined
      ? joinedCommunities.some(
          (item) => String(item.id) === String(community.id),
        )
        ? joinedCommunities
        : [...joinedCommunities, community]
      : joinedCommunities.filter(
          (item) => String(item.id) !== String(community.id),
        );

    localStorage.setItem(
      "joinedCommunities",
      JSON.stringify(updatedCommunities),
    );

    setJoinedCommunities(updatedCommunities);
  }

  function handleSavedEventChange(event, isSaved) {
    const updatedEvents = isSaved
      ? savedEvents.some((item) => String(item.id) === String(event.id))
        ? savedEvents
        : [...savedEvents, event]
      : savedEvents.filter((item) => String(item.id) !== String(event.id));

    localStorage.setItem("savedEvents", JSON.stringify(updatedEvents));

    setSavedEvents(updatedEvents);
  }

  function handleSavedCommunityChange(community, isSaved) {
    const updatedCommunities = isSaved
      ? savedCommunities.some(
          (item) => String(item.id) === String(community.id),
        )
        ? savedCommunities
        : [...savedCommunities, community]
      : savedCommunities.filter(
          (item) => String(item.id) !== String(community.id),
        );

    localStorage.setItem(
      "savedCommunities",
      JSON.stringify(updatedCommunities),
    );

    setSavedCommunities(updatedCommunities);
  }

  function renderEventCard(event) {
    return (
      <EventCard
        key={event.id ?? event.event_id}
        event={event}
        isRegistered={registeredEvents.some(
          (item) => String(item.id) === String(event.id),
        )}
        onEventClick={handleEventClick}
        onAuthRequired={() => handleToggleRegistered(event)}
        onSavedChange={handleSavedEventChange}
      />
    );
  }

  function renderCommunityCard(community) {
    return (
      <CommunityCard
        key={community.id ?? community.community_id}
        community={community}
        isJoined={joinedCommunities.some(
          (item) => String(item.id) === String(community.id),
        )}
        isSaved={savedCommunities.some(
          (item) => String(item.id) === String(community.id),
        )}
        onJoinChange={handleJoinedCommunityChange}
        onSavedChange={handleSavedCommunityChange}
      />
    );
  }

  return (
    <div className="mt-10 dark:text-white">
      <div className="mx-auto flex max-w-4xl items-start justify-between gap-4 px-4">
        <div className="flex gap-5">
          <div className="relative shrink-0">
            <img
              src={getAvatarUrl(user?.avatar)}
              alt={user?.name || "Profile"}
              className="h-20 w-20 rounded-2xl object-cover"
            />
            <span className="absolute right-0 top-0 h-4 w-4 rounded-md border-2 border-white bg-green-500" />
          </div>

          <div className="flex flex-col">
            <h2 className="text-2xl font-bold">{user?.name || "User"}</h2>

            <p className="text-gray-500">{user?.email || "-"}</p>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span>{user?.location || "Indonesia"}</span>

              {user?.joinedAt && (
                <span>
                  Joined {new Date(user.joinedAt).toLocaleDateString("id-ID")}
                </span>
              )}

              <span className="rounded-full bg-orange-100 px-2 py-1 text-orange-500">
                {user?.role || "Attendee"}
              </span>
            </div>

            <p className="mt-3 max-w-xl leading-relaxed text-gray-600">
              {user?.bio || "Belum ada informasi bio."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenEditProfile}
          className="shrink-0 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
        >
          Edit Profile
        </button>
      </div>

      <div className="mx-auto mt-8 grid max-w-4xl grid-cols-3 py-5 text-center">
        <div>
          <h3 className="text-2xl font-bold">{registeredEvents.length}</h3>
          <p className="text-gray-500">Events</p>
        </div>

        <div className="border-x border-gray-300">
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

      <section className="min-h-screen bg-white-secondary py-6">
        <div className="mx-auto max-w-6xl px-6">
          {activeTab === "events" && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {registeredEvents.length > 0 ? (
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
              {joinedCommunities.length > 0 ? (
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
                  {savedEvents.length > 0 ? (
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
                  {savedCommunities.length > 0 ? (
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
