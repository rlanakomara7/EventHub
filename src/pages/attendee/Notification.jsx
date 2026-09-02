import { useState } from "react";
import { useNavigate } from "react-router";
import {
  FiBell,
  FiCalendar,
  FiCheckCircle,
  FiMessageSquare,
  FiSend,
  FiUsers,
} from "react-icons/fi";

const defaultNotifications = [
  {
    id: 1,
    type: "event",
    title: "Go Concurrency Workshop starts in 2 days",
    message:
      "Don't forget your registered event on Aug 23 at 09:00 in Bandung.",
    time: "2h ago",
    read: false,
    path: "/event/1",
  },
  {
    id: 2,
    type: "register",
    title: "Registration confirmed",
    message: "You're registered for Frontend Craft Conference on Oct 12, 2026.",
    time: "3h ago",
    read: false,
    path: "/event/3",
  },
  {
    id: 3,
    type: "community",
    title: "New event in Bandung Go Community",
    message: "Rizky posted a new event in the community.",
    time: "1d ago",
    read: false,
    path: "/communities/1",
  },
  {
    id: 4,
    type: "update",
    title: "Update: AI Product Design Summit",
    message: "The event schedule has been updated.",
    time: "2d ago",
    read: true,
    path: "/event/2",
  },
  {
    id: 5,
    type: "discussion",
    title: "Reply to your discussion",
    message: "Ahmad Fauzan replied to your question.",
    time: "3d ago",
    read: true,
    path: "/event/1",
  },
];

function readNotifications() {
  try {
    const saved = JSON.parse(localStorage.getItem("notifications"));

    if (Array.isArray(saved)) {
      return saved;
    }
  } catch {
    // Gunakan data awal jika localStorage rusak
  }

  return defaultNotifications;
}

function NotificationIcon({ type }) {
  const icons = {
    event: <FiCalendar />,
    register: <FiCheckCircle />,
    community: <FiUsers />,
    update: <FiSend />,
    discussion: <FiMessageSquare />,
  };

  return icons[type] || <FiBell />;
}

function Notification() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(readNotifications);
  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  const displayedNotifications =
    activeTab === "unread"
      ? notifications.filter((notification) => !notification.read)
      : notifications;

  function saveNotifications(updatedNotifications) {
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));

    setNotifications(updatedNotifications);
  }

  function handleMarkAllRead() {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      read: true,
    }));

    saveNotifications(updatedNotifications);
  }

  function handleNotificationClick(notification) {
    const updatedNotifications = notifications.map((item) =>
      item.id === notification.id ? { ...item, read: true } : item,
    );

    saveNotifications(updatedNotifications);

    if (notification.path) {
      navigate(notification.path);
    }
  }

  return (
    <main className="min-h-screen bg-white-secondary">
      <div className="mx-auto max-w-4xl px-5 py-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Notifications
              </h1>

              {unreadCount > 0 && (
                <span className="rounded-full bg-orange-primary px-2 py-0.5 text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-gray-secondary">
              Stay up to date with your events and communities.
            </p>
          </div>

          <button
            type="button"
            onClick={handleMarkAllRead}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
          >
            Mark all as read
          </button>
        </div>

        <div className="mt-5 flex gap-2 border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`rounded-t-lg px-4 py-2 text-sm ${
              activeTab === "all"
                ? "bg-orange-primary text-white"
                : "text-gray-secondary"
            }`}
          >
            All
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("unread")}
            className={`rounded-t-lg px-4 py-2 text-sm ${
              activeTab === "unread"
                ? "bg-orange-primary text-white"
                : "text-gray-secondary"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
          {displayedNotifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-secondary">
              No notifications.
            </div>
          ) : (
            displayedNotifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => handleNotificationClick(notification)}
                className={`flex w-full items-start gap-3 border-b border-gray-100 p-4 text-left last:border-b-0 hover:bg-gray-50 ${
                  !notification.read ? "bg-orange-50/40" : "bg-white"
                }`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-primary">
                  <NotificationIcon type={notification.type} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-3">
                    <span className="text-sm font-semibold text-gray-900">
                      {notification.title}
                    </span>

                    <span className="shrink-0 text-xs text-gray-400">
                      {notification.time}
                    </span>
                  </span>

                  <span className="mt-1 block text-xs text-gray-secondary">
                    {notification.message}
                  </span>
                </span>

                {!notification.read && (
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-primary" />
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default Notification;
