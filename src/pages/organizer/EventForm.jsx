import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";

import { createEvent } from "../../services/eventsService";
import { getEventDetail, updateEvent } from "../../services/eventEditService";
import { getCommunities } from "../../services/communityService";

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

function getImageUrl(path) {
  if (!path) return "";

  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:")
  ) {
    return path;
  }

  const baseUrl = (
    import.meta.env.VITE_API_URL || "http://localhost:8500"
  ).replace(/\/$/, "");

  return path.startsWith("/") ? `${baseUrl}${path}` : `${baseUrl}/${path}`;
}

function EventForm({ mode = "create" }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const currentUser = useSelector((state) => state.auth.user);
  const isEdit = mode === "edit";

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ ...emptyForm });

  const [speakerInput, setSpeakerInput] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [availableCommunities, setAvailableCommunities] = useState([]);

  const [loadingEvent, setLoadingEvent] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    getCommunities("", "", controller.signal)
      .then((communities) => {
        if (!controller.signal.aborted) {
          setAvailableCommunities(communities);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Failed to load communities:", err.message);
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!isEdit) return;

    const controller = new AbortController();

    getEventDetail(id, controller.signal)
      .then((event) => {
        if (controller.signal.aborted) return;

        const category = event.categories[0];

        const speakers = event.speakers
          .map((speaker) =>
            typeof speaker === "string" ? speaker : speaker.name,
          )
          .filter(Boolean);

        const communityID =
          event.community?.community_id ?? event.community_id ?? "";

        setForm({
          title: event.title || "",
          description: event.description || "",
          category:
            typeof category === "string"
              ? category
              : category?.category_name || "",
          community: Number(communityID) > 0 ? String(communityID) : "",
          image: getImageUrl(event.banner_url),
          date: String(event.event_date || "").slice(0, 10),
          time: String(event.start_time || "").slice(0, 5),
          endTime: String(event.end_time || "").slice(0, 5),
          eventFormat: event.format === "online" ? "online" : "in-person",
          location: event.location || "",
          capacity: event.capacity ?? 100,
          speakers,
        });

        setError("");
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(err.message || "Failed to load event.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoadingEvent(false);
        }
      });

    return () => controller.abort();
  }, [isEdit, id]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function resizeImageFile(file, maxWidth = 1280, quality = 0.7) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onerror = () => reject(reader.error);

      reader.onload = () => {
        const img = new Image();

        img.onerror = () => reject(new Error("Invalid image file."));

        img.onload = () => {
          const scale = Math.min(1, maxWidth / img.width);

          const canvas = document.createElement("canvas");

          canvas.width = img.width * scale;
          canvas.height = img.height * scale;

          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Canvas is not available."));
            return;
          }

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          resolve(canvas.toDataURL("image/jpeg", quality));
        };

        img.src = reader.result;
      };

      reader.readAsDataURL(file);
    });
  }

  async function processImageFile(file) {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("File must be JPG, PNG, or WEBP.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Maximum file size is 2 MB.");
      return;
    }

    setError("");

    try {
      const preview = await resizeImageFile(file);

      setForm((previous) => ({
        ...previous,
        image: preview,
      }));

      setBannerFile(file);
    } catch {
      setError("Failed to process the image.");
    }
  }

  function handleImageChange(event) {
    processImageFile(event.target.files?.[0]);
  }

  function handleDrop(event) {
    event.preventDefault();
    processImageFile(event.dataTransfer.files?.[0]);
  }

  function addSpeaker() {
    const speaker = speakerInput.trim();

    if (!speaker) return;

    setForm((previous) => ({
      ...previous,
      speakers: [...previous.speakers, speaker],
    }));

    setSpeakerInput("");
  }

  function removeSpeaker(indexToRemove) {
    setForm((previous) => ({
      ...previous,
      speakers: previous.speakers.filter((_, index) => index !== indexToRemove),
    }));
  }

  function validateStep() {
    setError("");

    if (step === 1) {
      if (!form.title.trim() || !form.category) {
        setError("Please complete the event title and category.");
        return false;
      }
    }

    if (step === 2) {
      if (
        !form.date ||
        !form.time ||
        !form.endTime ||
        !form.location.trim() ||
        Number(form.capacity) <= 0
      ) {
        setError("Please complete the date, time, location, and capacity.");
        return false;
      }

      if (form.endTime <= form.time) {
        setError("End time must be after start time.");
        return false;
      }
    }

    return true;
  }

  function handleContinue() {
    if (!validateStep()) return;

    setStep((previous) => previous + 1);
  }

  function handleFormKeyDown(event) {
    if (event.key !== "Enter" || event.target.tagName === "TEXTAREA") {
      return;
    }

    event.preventDefault();

    if (step < 3) {
      handleContinue();
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (step !== 3 || submitting) return;

    setError("");
    setSubmitting(true);

    try {
      if (isEdit) {
        await updateEvent(id, form, bannerFile);
      } else {
        await createEvent(form, bannerFile);
      }

      setSuccess(true);

      window.setTimeout(() => {
        navigate(isEdit ? "/dashboard" : "/event");
      }, 1800);
    } catch (err) {
      setError(err.message || "Failed to save event.");
    } finally {
      setSubmitting(false);
    }
  }

  if (currentUser?.role !== "organizer") {
    return (
      <main className="p-10 text-center">
        <h1 className="text-2xl font-bold">Access denied</h1>

        <p className="mt-2 text-gray-secondary">
          Only organizers can manage events.
        </p>
      </main>
    );
  }

  if (loadingEvent) {
    return (
      <main className="p-10 text-center">
        <p className="text-gray-secondary">Loading event data...</p>
      </main>
    );
  }

  if (success) {
    return (
      <main className="min-h-screen bg-white">
        <div className="flex min-h-[75vh] flex-col items-center justify-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-500">
            ✓
          </div>

          <h1 className="mt-4 text-xl font-semibold text-gray-900">
            {isEdit ? "Event Updated!" : "Event Created!"}
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            {isEdit
              ? "Redirecting to your dashboard..."
              : "Redirecting to event list..."}
          </p>
        </div>
      </main>
    );
  }

  // ✅ TAMBAH: Jangan tampilkan form kosong jika gagal load Edit
  if (isEdit && error && !form.title) {
    return (
      <main className="mx-auto max-w-2xl p-10">
        <p role="alert" className="text-red-600">
          {error}
        </p>

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mt-4 text-orange-primary"
        >
          ← Back to Dashboard
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="text-sm text-gray-500 hover:text-orange-primary"
            >
              ← Back
            </button>

            <h1 className="text-lg font-semibold text-gray-900">
              {isEdit ? "Edit Event" : "Create Event"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {[1, 2, 3].map((item, index) => (
              <div key={item} className="flex items-center gap-3">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                    step >= item
                      ? "bg-orange-primary text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > item ? "✓" : item}
                </div>

                {index < 2 && <div className="h-px w-8 bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-8">
        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-600"
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          onKeyDown={handleFormKeyDown}
          className="rounded-xl bg-white px-8 py-7 shadow-sm"
        >
          {step === 1 && (
            <>
              <h2 className="text-xl font-semibold text-gray-900">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Tell attendees what your event is about.
              </p>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium">
                  Cover Image
                </label>

                <label
                  htmlFor="coverImage"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={handleDrop}
                  className="flex h-28 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-gray-300 hover:border-orange-primary"
                >
                  {form.image ? (
                    <img
                      src={form.image}
                      alt="Event cover"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <div className="text-2xl">⇧</div>

                      <p className="mt-1 text-sm">
                        Click to upload or drag and drop
                      </p>

                      <p className="text-xs">
                        PNG, JPG, WEBP up to 2MB · 16:9 recommended
                      </p>
                    </div>
                  )}
                </label>

                <input
                  id="coverImage"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {isEdit && (
                  <p className="mt-2 text-xs text-gray-400">
                    Leave unchanged to keep the current banner.
                  </p>
                )}
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium">
                  Event Title
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Go Concurrency Workshop"
                  className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-orange-primary"
                />
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="What will attendees learn or experience?"
                  className="w-full resize-none rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-orange-primary"
                />
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium">
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-orange-primary"
                >
                  <option value="">Select a category</option>
                  <option value="Technology">Technology</option>
                  <option value="Design">Design</option>
                  <option value="Business">Business</option>
                  <option value="AI">AI</option>
                  <option value="Programming">Programming</option>
                  <option value="Career">Career</option>
                </select>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium">
                  Community{" "}
                  <span className="font-normal text-gray-400">(optional)</span>
                </label>

                <select
                  name="community"
                  value={form.community}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-orange-primary"
                >
                  <option value="">No community</option>

                  {form.community &&
                    !availableCommunities.some(
                      (community) =>
                        String(community.community_id) ===
                        String(form.community),
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
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-semibold text-gray-900">
                Date, Location & Capacity
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                When and where is your event?
              </p>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium">
                  Event Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-orange-primary"
                />
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Start Time
                  </label>

                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-orange-primary"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    End Time
                  </label>

                  <input
                    type="time"
                    name="endTime"
                    value={form.endTime}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-orange-primary"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium">
                  Event Format
                </label>

                <div className="inline-flex rounded-lg bg-gray-100 p-1">
                  <button
                    type="button"
                    onClick={() =>
                      setForm((previous) => ({
                        ...previous,
                        eventFormat: "in-person",
                      }))
                    }
                    className={`rounded-md px-4 py-2 text-sm ${
                      form.eventFormat === "in-person"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    📍 In Person
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setForm((previous) => ({
                        ...previous,
                        eventFormat: "online",
                      }))
                    }
                    className={`rounded-md px-4 py-2 text-sm ${
                      form.eventFormat === "online"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    ▣ Online
                  </button>
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium">
                  Location
                </label>

                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Bandung, West Java"
                  className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-orange-primary"
                />
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium">
                  Capacity
                </label>

                <input
                  type="number"
                  min="1"
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  placeholder="100"
                  className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-orange-primary"
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-xl font-semibold text-gray-900">
                Speakers & Review
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Add speakers and confirm your event details.
              </p>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium">
                  Speakers{" "}
                  <span className="font-normal text-gray-400">(optional)</span>
                </label>

                <div className="flex gap-2">
                  <input
                    value={speakerInput}
                    onChange={(event) => setSpeakerInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addSpeaker();
                      }
                    }}
                    placeholder="Speaker name and title"
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none focus:border-orange-primary"
                  />

                  <button
                    type="button"
                    onClick={addSpeaker}
                    className="rounded-lg border border-gray-200 px-4 text-sm hover:border-orange-primary"
                  >
                    Add
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {form.speakers.map((speaker, index) => (
                    <button
                      key={`${speaker}-${index}`}
                      type="button"
                      onClick={() => removeSpeaker(index)}
                      className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
                    >
                      {speaker} ×
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
                {[
                  ["Title", form.title || "-"],
                  ["Category", form.category || "-"],
                  ["Date", form.date || "-"],
                  [
                    "Time",
                    form.time && form.endTime
                      ? `${form.time} – ${form.endTime} WIB`
                      : "-",
                  ],
                  [
                    "Format",
                    form.eventFormat === "online" ? "Online" : "In Person",
                  ],
                  ["Location", form.location || "-"],
                  ["Capacity", `${form.capacity} attendees`],
                  ["Speakers", `${form.speakers.length} added`],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="grid grid-cols-2 border-b border-gray-100 px-4 py-3 text-sm last:border-b-0"
                  >
                    <span className="text-gray-500">{label}</span>
                    <span className="text-right text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={() =>
                step === 1 ? navigate("/dashboard") : setStep(step - 1)
              }
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:border-orange-primary"
            >
              {step === 1 ? "Cancel" : "← Back"}
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={handleContinue}
                className="rounded-lg bg-orange-primary px-5 py-2.5 text-sm text-white"
              >
                Continue →
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-green-500 px-5 py-2.5 text-sm text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting
                  ? "Saving..."
                  : isEdit
                    ? "✓ Save Changes"
                    : "✓ Publish Event"}
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}

export default EventForm;
