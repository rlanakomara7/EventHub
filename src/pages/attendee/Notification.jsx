import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import {
  FiBell,
  FiCalendar,
  FiCheckCircle,
  FiMessageSquare,
  FiSend,
  FiUsers,
} from "react-icons/fi";

import {
  getNotificationsAPI,
  markNotificationReadAPI,
  markAllNotificationsReadAPI,
} from "../../services/notificationService";

// Format waktu dari database.
function formatTime(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Ikon mengikuti tipe notifikasi.
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

  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [markingAll, setMarkingAll] = useState(false);
  const [openingId, setOpeningId] = useState(null);

  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadNotifications() {
      setLoading(true);
      setError("");

      try {
        const data = await getNotificationsAPI(controller.signal);

        if (!controller.signal.aborted) {
          setNotifications(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || "Failed to load notifications.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadNotifications();

    return () => controller.abort();
  }, [refresh]);

  const unreadCount = notifications.filter((item) => !item.read).length;

  const displayedNotifications =
    activeTab === "unread"
      ? notifications.filter((item) => !item.read)
      : notifications;

  async function handleMarkAllRead() {
    if (markingAll || unreadCount === 0) return;

    setMarkingAll(true);
    setActionError("");

    try {
      await markAllNotificationsReadAPI();

      setNotifications((previous) =>
        previous.map((item) => ({
          ...item,
          read: true,
        })),
      );
      window.dispatchEvent(new Event("notifications-updated"));
    } catch (err) {
      setActionError(err.message || "Failed to mark notifications.");
    } finally {
      setMarkingAll(false);
    }
  }

  async function handleNotificationClick(notification) {
    if (openingId !== null) return;

    setOpeningId(notification.id);
    setActionError("");

    try {
      if (!notification.read) {
        await markNotificationReadAPI(notification.id);

        setNotifications((previous) =>
          previous.map((item) =>
            item.id === notification.id ? { ...item, read: true } : item,
          ),
        );
        window.dispatchEvent(new Event("notifications-updated"));
      }

      if (/^\/(event|communities)\/\d+$/.test(notification.path)) {
        navigate(notification.path);
      }
    } catch (err) {
      setActionError(err.message || "Failed to open notification.");
    } finally {
      setOpeningId(null);
    }
  }

  return (
    <main className="min-h-screen bg-white-secondary dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-5 py-8">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
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
            disabled={markingAll || loading || unreadCount === 0}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {markingAll ? "Processing..." : "Mark all as read"}
          </button>
        </div>

        {/* FILTER */}
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

        {/* ERROR */}
        {actionError && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {actionError}
          </p>
        )}

        {/* NOTIFICATION LIST */}
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
          {loading ? (
            <p className="p-8 text-center text-sm text-gray-secondary">
              Loading notifications...
            </p>
          ) : error ? (
            <div className="p-8 text-center">
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>

              <button
                type="button"
                onClick={() => setRefresh((value) => value + 1)}
                className="mt-2 text-sm text-orange-primary underline"
              >
                Try Again
              </button>
            </div>
          ) : displayedNotifications.length === 0 ? (
            <p className="p-8 text-center text-sm text-gray-secondary">
              No notifications.
            </p>
          ) : (
            displayedNotifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                disabled={openingId !== null}
                onClick={() => handleNotificationClick(notification)}
                className={`flex w-full items-start gap-3 border-b border-gray-100 p-4 text-left last:border-b-0 hover:bg-gray-50 disabled:opacity-60 dark:border-zinc-700 dark:hover:bg-zinc-800 ${
                  !notification.read
                    ? "bg-orange-50/40 dark:bg-orange-950/20"
                    : "bg-white dark:bg-zinc-900"
                }`}
              >
                {/* ICON */}
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-primary">
                  <NotificationIcon type={notification.type} />
                </span>

                {/* CONTENT */}
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-3">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {notification.title}
                    </span>

                    <span className="shrink-0 text-xs text-gray-400">
                      {formatTime(notification.created_at)}
                    </span>
                  </span>

                  <span className="mt-1 block text-xs text-gray-secondary">
                    {notification.message}
                  </span>
                </span>

                {/* UNREAD INDICATOR */}
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
