import { createSlice } from "@reduxjs/toolkit";

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
  } catch {
    return null;
  }
}

const initialState = {
  user: getCurrentUser(),
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    login: (state, action) => {
      state.user = action.payload;

      localStorage.setItem("currentUser", JSON.stringify(action.payload));
    },

    updateProfile: (state, action) => {
      if (!state.user) return;

      const oldEmail = state.user.email;

      const updatedUser = {
        ...state.user,
        ...action.payload,
      };

      state.user = updatedUser;

      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      const users = JSON.parse(localStorage.getItem("users")) || [];

      const userIndex = users.findIndex(
        (item) =>
          String(item.id) === String(updatedUser.id) || item.email === oldEmail,
      );

      if (userIndex !== -1) {
        users[userIndex] = {
          ...users[userIndex],
          ...action.payload,
        };

        localStorage.setItem("users", JSON.stringify(users));
      }
    },

    logout: (state) => {
      state.user = null;
      localStorage.removeItem("currentUser");
    },
  },
});

export const { login, updateProfile, logout } = authSlice.actions;

export const selectUser = (state) => state.auth.user;

export default authSlice.reducer;
