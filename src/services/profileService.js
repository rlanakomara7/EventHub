const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

export function getAvatarUrl(path) {
  if (!path) return "/Default-Avatar.svg";

  if (/^(https?:\/\/|data:|blob:)/i.test(path)) {
    return path;
  }

  if (path.startsWith("/uploads/")) {
    return `${API_URL}${path}`;
  }

  if (path.startsWith("uploads/")) {
    return `${API_URL}/${path}`;
  }

  return path;
}

export async function getProfileAPI(signal) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Silakan login terlebih dahulu.");
  }

  const response = await fetch(`${API_URL}/api/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Gagal mengambil profil.");
  }

  return result.data;
}

export async function updateProfileAPI(form, avatarFile) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Silakan login terlebih dahulu.");
  }

  const formData = new FormData();

  formData.append("name", form.name.trim());
  formData.append("location", (form.location || "").trim());
  formData.append("bio", (form.bio || "").trim());

  if (avatarFile) {
    formData.append("avatar", avatarFile);
  }

  const response = await fetch(`${API_URL}/api/profile`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Gagal memperbarui profil.");
  }

  return result.data;
}
