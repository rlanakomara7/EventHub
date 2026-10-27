import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { getCommunities } from "../../services/communityService";

import {
  fetchEventCategories,
  fetchEventDetail,
  createNewEvent,
  updateExistingEvent,
  resetEventFormStatus,
  selectEventCategories,
  selectCategoriesLoading,
  selectCategoriesError,
  selectEventDetail,
  selectEventDetailLoading,
  selectEventDetailError,
  selectEventSaving,
  selectEventSaveError,
  selectEventSaveSuccess,
} from "../../redux/slice/eventSlice";

const emptyForm = {
  title: "",
  description: "",
  category: "",
  community: "",
  image: "",
  date: "",
  time: "",
  endTime: "",
  eventFormat: "in-person",
  location: "",
  capacity: 100,
  speakers: [],
};

function getLocalToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getImageUrl(path) {
  if (!path) return "";

  if (/^(https?:\/\/|data:|blob:)/i.test(path)) {
    return path;
  }

  const baseURL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  return `${baseURL}/${path.replace(/^\/+/, "")}`;
}

function validateSchedule(form) {
  if (!form.date || !form.time || !form.endTime) {
    return "Please complete the event date and time.";
  }

  const date = new Date(`${form.date}T00:00:00`);

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== Number(form.date.slice(0, 4)) ||
    date.getMonth() + 1 !== Number(form.date.slice(5, 7)) ||
    date.getDate() !== Number(form.date.slice(8, 10))
  ) {
    return "Invalid event date.";
  }

  if (form.date < getLocalToday()) {
    return "Event date cannot be in the past.";
  }

  if (form.endTime <= form.time) {
    return "End time must be after start time.";
  }

  if (
    form.date === getLocalToday() &&
    new Date(`${form.date}T${form.time}:00`) <= new Date()
  ) {
    return "Start time must be in the future.";
  }

  return "";
}

function EventForm({ mode = "create" }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const isEdit = mode === "edit";

  const user = useSelector((state) => state.auth.user);
  const categories = useSelector(selectEventCategories);
  const categoriesLoading = useSelector(selectCategoriesLoading);
  const categoriesError = useSelector(selectCategoriesError);

  const detail = useSelector(selectEventDetail);
  const detailLoading = useSelector(selectEventDetailLoading);
  const detailError = useSelector(selectEventDetailError);

  const saving = useSelector(selectEventSaving);
  const saveError = useSelector(selectEventSaveError);
  const saveSuccess = useSelector(selectEventSaveSuccess);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const [speakerInput, setSpeakerInput] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [availableCommunities, setAvailableCommunities] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(resetEventFormStatus());

    const categoryRequest = dispatch(fetchEventCategories());

    const communityController = new AbortController();

    getCommunities("", "", communityController.signal)
      .then((result) => {
        if (!communityController.signal.aborted) {
          setAvailableCommunities(result);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error(err.message);
        }
      });

    let detailRequest;
    let active = true;

    if (isEdit && id) {
      detailRequest = dispatch(fetchEventDetail(id));

      detailRequest
        .unwrap()
        .then((data) => {
          if (!active) return;

          const firstCategory = data.categories?.[0];

          const categoryName =
            typeof firstCategory === "string"
              ? firstCategory
              : firstCategory?.category_name || "";

          const speakers = (data.speakers || [])
            .map((speaker) =>
              typeof speaker === "string" ? speaker : speaker.name,
            )
            .filter(Boolean);

          const communityID =
            data.community?.community_id ?? data.community_id ?? "";

          setForm({
            title: data.title || "",
            description: data.description || "",
            category: categoryName,
            community: communityID ? String(communityID) : "",
            image: getImageUrl(data.banner_url),
            date: String(data.event_date || "").slice(0, 10),
            time: String(data.start_time || "").slice(0, 5),
            endTime: String(data.end_time || "").slice(0, 5),
            eventFormat: data.format === "online" ? "online" : "in-person",
            location: data.location || "",
            capacity: data.capacity ?? 100,
            speakers,
          });
        })
        .catch(() => {});
    }

    return () => {
      active = false;
      categoryRequest.abort();
      communityController.abort();
      detailRequest?.abort();
    };
  }, [dispatch, isEdit, id]);

  useEffect(() => {
    if (!saveSuccess) return;

    const nextPath = isEdit ? "/dashboard" : "/event";
    navigate(nextPath, { replace: true });
  }, [saveSuccess, navigate, isEdit]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  }

  function handleFormatChange(format) {
    setForm((previous) => ({
      ...previous,
      eventFormat: format,
      location: format === "online" ? "" : previous.location,
    }));

    setError("");
  }

  function handleCategorySelect(category) {
    setForm((previous) => ({
      ...previous,
      category: previous.category === category ? "" : category,
    }));

    setError("");
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Cover must be JPG, PNG, or WEBP.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Maximum cover size is 2 MB.");
      return;
    }

    setBannerFile(file);
    setError("");

    const reader = new FileReader();

    reader.onload = () => {
      setForm((previous) => ({
        ...previous,
        image: reader.result,
      }));
    };

    reader.onerror = () => setError("Failed to read image.");

    reader.readAsDataURL(file);
  }

  function addSpeaker() {
    const name = speakerInput.trim();

    if (!name || name.length > 100) return;

    if (
      form.speakers.some(
        (speaker) => speaker.toLowerCase() === name.toLowerCase(),
      )
    ) {
      return;
    }

    setForm((previous) => ({
      ...previous,
      speakers: [...previous.speakers, name],
    }));

    setSpeakerInput("");
  }

  function removeSpeaker(indexToRemove) {
    setForm((previous) => ({
      ...previous,
      speakers: previous.speakers.filter((_, index) => index !== indexToRemove),
    }));
  }

  function validateStep(targetStep) {
    if (targetStep === 1) {
      if (!form.title.trim() || form.title.trim().length > 150) {
        return "Title is required and must not exceed 150 characters.";
      }

      if (!form.category) {
        return "Please select an event category.";
      }

      if (
        categories.length > 0 &&
        !categories.some((item) => item.category_name === form.category)
      ) {
        return "Please select a valid category.";
      }

      if (categoriesError) {
        return "Categories could not be loaded.";
      }
    }

    if (targetStep === 2) {
      const scheduleError = validateSchedule(form);

      if (scheduleError) return scheduleError;

      if (form.eventFormat === "in-person" && !form.location.trim()) {
        return "Location is required for an in-person event.";
      }

      const capacity = Number(form.capacity);

      if (!Number.isInteger(capacity) || capacity <= 0) {
        return "Capacity must be a positive whole number.";
      }
    }

    return "";
  }

  function handleContinue() {
    const validationError = validateStep(step);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setStep((previous) => Math.min(3, previous + 1));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (step !== 3 || saving) return;

    const validationError = validateStep(1) || validateStep(2);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    try {
      if (isEdit) {
        await dispatch(
          updateExistingEvent({
            eventId: id,
            form,
            bannerFile,
          }),
        ).unwrap();
      } else {
        await dispatch(
          createNewEvent({
            form,
            bannerFile,
          }),
        ).unwrap();
      }
    } catch {
      // Error disimpan di Redux.
    }
  }

  if (user?.role !== "organizer") {
    return (
      <main className="p-10 text-center">
        <h1 className="text-2xl font-bold">Access denied</h1>
        <p>Only organizers can manage events.</p>
      </main>
    );
  }

  if (isEdit && detailLoading) {
    return <main className="p-10 text-center">Loading event data...</main>;
  }

  if (isEdit && (detailError || !detail)) {
    return (
      <main className="p-10 text-center">
        <p role="alert" className="text-red-500">
          {detailError || "Event not found."}
        </p>
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mt-4 text-orange-primary"
        >
          Back to Dashboard
        </button>
      </main>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-orange-primary";

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="text-sm text-gray-500 hover:text-orange-primary"
          >
            Back to Dashboard
          </button>

          <h1 className="text-lg font-semibold text-gray-900">
            {isEdit ? "Edit Event" : "Create Event"}
          </h1>

          <span className="text-sm text-gray-500">Step {step} of 3</span>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-8">
        {(error || saveError) && (
          <div
            role="alert"
            className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-600"
          >
            {error || saveError}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-xl bg-white px-6 py-7 shadow-sm md:px-8"
        >
          {step === 1 && (
            <>
              <h2 className="text-xl font-semibold">Basic Information</h2>

              <p className="mt-1 text-sm text-gray-500">
                Tell attendees what your event is about.
              </p>

              <div className="mt-6">
                <label htmlFor="eventTitle" className="mb-2 block text-sm">
                  Event Title
                </label>
                <input
                  id="eventTitle"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  maxLength={150}
                  placeholder="Go Concurrency Workshop"
                  className={inputClass}
                />
              </div>

              <div className="mt-5">
                <label
                  htmlFor="eventDescription"
                  className="mb-2 block text-sm"
                >
                  Description
                </label>
                <textarea
                  id="eventDescription"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className={inputClass}
                  placeholder="What will attendees learn?"
                />
              </div>

              <div className="mt-5">
                <p className="mb-2 text-sm">Category</p>

                {categoriesLoading && (
                  <p className="text-sm text-gray-500">Loading categories...</p>
                )}

                {categoriesError && (
                  <button
                    type="button"
                    onClick={() => dispatch(fetchEventCategories())}
                    className="text-sm text-red-500 underline"
                  >
                    Failed to load categories. Retry
                  </button>
                )}

                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      type="button"
                      key={category.category_id}
                      onClick={() =>
                        handleCategorySelect(category.category_name)
                      }
                      className={`rounded-full border px-3 py-2 text-sm ${
                        form.category === category.category_name
                          ? "border-orange-primary bg-orange-primary text-white"
                          : "border-gray-200 text-gray-600"
                      }`}
                    >
                      {category.category_name}
                    </button>
                  ))}
                </div>

                {form.category && (
                  <button
                    type="button"
                    onClick={() => handleCategorySelect(form.category)}
                    className="mt-3 rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-primary"
                  >
                    {form.category} ×
                  </button>
                )}
              </div>

              <div className="mt-5">
                <label htmlFor="eventCommunity" className="mb-2 block text-sm">
                  Community (optional)
                </label>

                <select
                  id="eventCommunity"
                  name="community"
                  value={form.community}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">No community</option>

                  {form.community &&
                    !availableCommunities.some(
                      (community) =>
                        String(community.community_id) === form.community,
                    ) && (
                      <option value={form.community}>
                        Current community (ID {form.community})
                      </option>
                    )}

                  {availableCommunities.map((community) => (
                    <option
                      key={community.community_id}
                      value={community.community_id}
                    >
                      {community.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-5">
                <label htmlFor="eventBanner" className="mb-2 block text-sm">
                  Cover Image
                </label>

                {form.image && (
                  <img
                    src={form.image}
                    alt="Cover preview"
                    className="mb-3 h-40 w-full rounded-lg object-cover"
                  />
                )}

                <input
                  id="eventBanner"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className={inputClass}
                />

                {isEdit && (
                  <p className="mt-2 text-xs text-gray-400">
                    Leave empty to keep the current banner.
                  </p>
                )}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-semibold">Date, Format & Capacity</h2>

              <div className="mt-6">
                <label htmlFor="eventDate" className="mb-2 block text-sm">
                  Event Date
                </label>
                <input
                  id="eventDate"
                  type="date"
                  name="date"
                  min={getLocalToday()}
                  value={form.date}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="startTime" className="mb-2 block text-sm">
                    Start Time
                  </label>
                  <input
                    id="startTime"
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="endTime" className="mb-2 block text-sm">
                    End Time
                  </label>
                  <input
                    id="endTime"
                    type="time"
                    name="endTime"
                    value={form.endTime}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mt-5">
                <p className="mb-2 text-sm">Event Format</p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleFormatChange("in-person")}
                    className={`rounded-lg px-4 py-2 text-sm ${
                      form.eventFormat === "in-person"
                        ? "bg-orange-primary text-white"
                        : "border border-gray-200"
                    }`}
                  >
                    In Person
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFormatChange("online")}
                    className={`rounded-lg px-4 py-2 text-sm ${
                      form.eventFormat === "online"
                        ? "bg-orange-primary text-white"
                        : "border border-gray-200"
                    }`}
                  >
                    Online
                  </button>
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="eventLocation" className="mb-2 block text-sm">
                  Location
                </label>
                <input
                  id="eventLocation"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  disabled={form.eventFormat === "online"}
                  placeholder={
                    form.eventFormat === "online"
                      ? "Not required for online events"
                      : "Bandung, West Java"
                  }
                  className={`${inputClass} disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400`}
                />
              </div>

              <div className="mt-5">
                <label htmlFor="eventCapacity" className="mb-2 block text-sm">
                  Capacity
                </label>
                <input
                  id="eventCapacity"
                  type="number"
                  min={1}
                  step={1}
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-xl font-semibold">Speakers & Review</h2>

              <p className="mt-1 text-sm text-gray-500">
                Add speakers and review your event.
              </p>

              <div className="mt-6">
                <label htmlFor="speakerName" className="mb-2 block text-sm">
                  Speakers (optional)
                </label>

                <div className="flex gap-2">
                  <input
                    id="speakerName"
                    value={speakerInput}
                    maxLength={100}
                    onChange={(event) => setSpeakerInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addSpeaker();
                      }
                    }}
                    placeholder="Speaker name"
                    className={inputClass}
                  />

                  <button
                    type="button"
                    onClick={addSpeaker}
                    className="rounded-lg border border-gray-200 px-4 text-sm"
                  >
                    Add
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {form.speakers.map((speaker, index) => (
                    <button
                      type="button"
                      key={`${speaker}-${index}`}
                      onClick={() => removeSpeaker(index)}
                      className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
                    >
                      {speaker} ×
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-lg border">
                {[
                  ["Title", form.title],
                  ["Category", form.category],
                  ["Community", form.community || "None"],
                  ["Date", form.date],
                  ["Start Time", form.time],
                  ["End Time", form.endTime],
                  ["Format", form.eventFormat],
                  [
                    "Location",
                    form.eventFormat === "online"
                      ? "Online Event"
                      : form.location,
                  ],
                  ["Capacity", String(form.capacity)],
                  ["Speakers", String(form.speakers.length)],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="grid grid-cols-2 gap-3 border-b px-4 py-3 text-sm last:border-b-0"
                  >
                    <span className="text-gray-500">{label}</span>
                    <span className="text-right wrap-break-word">
                      {value || "-"}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="mt-8 flex justify-between border-t pt-5">
            <button
              type="button"
              disabled={saving}
              onClick={() =>
                step === 1
                  ? navigate("/dashboard")
                  : setStep((previous) => previous - 1)
              }
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
            >
              {step === 1 ? "Cancel" : "Back"}
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={handleContinue}
                className="rounded-lg bg-orange-primary px-5 py-2.5 text-sm text-white"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-green-500 px-5 py-2.5 text-sm text-white disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : isEdit
                    ? "Save Changes"
                    : "Publish Event"}
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}

export default EventForm;
