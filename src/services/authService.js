const API_URL = import.meta.env.VITE_API_URL;

//register -----------------------------------------
export async function registerUser(name, email, password) {
  const payload = {
    name: name,
    email: email,
    password: password,
  };
  console.log("REGISTER PAYLOAD", payload);

  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  console.log("REGISTER STATUS", response.status);
  console.log("LOGIN RESPONSE", JSON.stringify(result));

  if (!response.ok) {
    throw new Error(result.message || "Register failed");
  }

  return result;
}

//login -------------------------------------------------
export async function loginUser(email, password) {
  const payload = {
    email: email,
    password: password,
  };

  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  console.log("LOGIN STATUS:", response.status);
  console.log("LOGIN RESPONSE:", JSON.stringify(result));

  if (!response.ok) {
    throw new Error(result.message || "Email or password is incorrect");
  }

  return result;
}

//logout --------------------------------------------------
export async function logoutUser() {
  const token = localStorage.getItem("token");

  if (token) {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok && response.status !== 401) {
      throw new Error(`Logout failed"(${response.status})`);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}
