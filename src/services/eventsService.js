const API_URL = import.meta.env.VITE_API_URL;

// Get Events
export async function getEvents(search = "", format = "") {
  const params = new URLSearchParams();

  if (search) {
    params.append("search", search);
  }

  if (format) {
    params.append("format", format);
  }

  const url = params.toString()
    ? `${API_URL}/api/events?${params.toString()}`
    : `${API_URL}/api/events`;

  const response = await fetch(url);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to get events");
  }

  return result;
}

// Create Event multipart/form-data
export async function createEvent(form, bannerFile) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login as organizer first.");
  }

  const formData = new FormData();

  formData.append("title", form.title.trim());
  formData.append("description", form.description || "");
  formData.append("category", form.category);

  formData.append("event_date", form.date);
  formData.append("start_time", form.time);
  formData.append("end_time", form.endTime);

  formData.append(
    "format",
    form.eventFormat === "in-person" ? "in_person" : "online",
  );

  formData.append("location", form.location);
  formData.append("capacity", String(form.capacity));

  if (form.community) {
    formData.append("community_id", String(form.community));
  }

  form.speakers.forEach((speaker) => {
    formData.append("speakers", speaker);
  });

  if (bannerFile) {
    formData.append("banner", bannerFile);
  }

  const response = await fetch(`${API_URL}/api/events`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Failed to create event.");
  }

  return result;
}
