import { createSlice } from "@reduxjs/toolkit";

//persist local storage
const initialState = {
  user: JSON.parse(localStorage.getItem("currentUser")) || null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    login: (prevState, { payload }) => {
      localStorage.setItem("currentUser", JSON.stringify(payload));
      return {
        ...prevState,
        user: payload,
      };
    },

    logout: (prevState) => {
      localStorage.removeItem("currentUser");
      return {
        ...prevState,
        user: null,
      };
    },
  },
});

export const { login, logout } = authSlice.actions;
export const selectUser = (state) => state.auth.user;

export default authSlice.reducer;
