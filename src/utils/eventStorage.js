import defaultEvents from "../data/events.json";

export function getEvents() {
  try {
    const savedEvents = JSON.parse(localStorage.getItem("events"));

    return Array.isArray(savedEvents) ? savedEvents : defaultEvents;
  } catch {
    return defaultEvents;
  }
}

export function saveEvents(events) {
  localStorage.setItem("events", JSON.stringify(events));
}

//delete events
export function deleteEvent(eventId) {
  const events = getEvents();

  const remainingEvents = events.filter(
    (item) => String(item.id) !== String(eventId),
  );

  saveEvents(remainingEvents);

  return remainingEvents;
}
