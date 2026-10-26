const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

export async function getEvents(search = "", format = "") {
  const params = new URLSearchParams();

  if (search) params.set("search", search);
  if (format) params.set("format", format);

  const url = params.toString()
    ? `${API_URL}/api/events?${params.toString()}`
    : `${API_URL}/api/events`;

  const response = await fetch(url);
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Failed to get events");
  }

  return result;
}

export async function getPaginatedEvents(
  { page = 1, limit = 6, search = "", format = "", category = "" },
  signal,
) {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("limit", String(limit));

  if (search) params.set("search", search);
  if (format) params.set("format", format);

  if (category && category !== "All") {
    params.set("category", category);
  }

  const response = await fetch(`${API_URL}/api/events?${params.toString()}`, {
    signal,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Failed to load events");
  }

  return result;
}

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

export async function getMyEvents(signal) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login as organizer first");
  }

  const response = await fetch(`${API_URL}/api/events/my`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Failed to load your events");
  }

  const candidates = [
    result,
    result.data,
    result.events,
    result.my_events,
    result.data?.events,
    result.data?.my_events,
    result.data?.items,
  ];

  const events = candidates.find(Array.isArray);

  if (!events) {
    throw new Error("Format response GET /api/events/my not found");
  }

  return events;
}
