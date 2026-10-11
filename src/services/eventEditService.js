const API_URL = import.meta.env.VITE_API_URL;

export async function getEventDetail(eventId, signal) {
  const response = await fetch(`${API_URL}/api/events/${eventId}`, {
    method: "GET",
    signal,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Failed to load event");
  }

  const event = result.data?.event ?? result.data ?? result;

  if (!event || !event.event_id) {
    throw new Error("Invalid event detail response.");
  }

  if (
    !Array.isArray(event.categories) ||
    event.categories.length !== 1 ||
    !Array.isArray(event.speakers)
  ) {
    throw new Error(
      "Event detail must contain one category and speakers array.",
    );
  }
  return event;
}

export async function updateEvent(eventId, form, bannerFile) {
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
    form.EventFormat == "in-person" ? "in_person" : "online",
  );

  formData.append("location", form.location);
  formData.append("capacity", String(form.capacity));

  if (form.community) {
    formData.append("community_id", String(form.community));
  }

  form.speakers.forEach((speaker) => {
    formData.append("speakers", speaker.trim());
  });

  if (bannerFile) {
    formData.append("banner", bannerFile);
  }

  const response = await fetch(`${API_URL}/api/events/${eventId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Failed to update event.");
  }

  return result;
}
