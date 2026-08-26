import { createSlice } from "@reduxjs/toolkit";

//redux persist
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

export default authSlice.reducer;
