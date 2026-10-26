import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getProfileAPI, updateProfileAPI } from "../../services/profileService";

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue, signal }) => {
    try {
      return await getProfileAPI(signal);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async ({ form, avatarFile }, { rejectWithValue }) => {
    try {
      return await updateProfileAPI(form, avatarFile);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  user: null,
  profileLoading: false,
  profileError: null,
};

function setProfileData(state, profile) {
  state.user = {
    ...state.user,
    name: profile.name ?? state.user?.name ?? "",
    email: profile.email ?? state.user?.email ?? "",
    role: profile.role ?? state.user?.role ?? "",
    location: profile.location ?? "",
    bio: profile.bio ?? "",
    avatar: profile.avatar_url ?? state.user?.avatar ?? "",
    joinedAt: profile.joined_at ?? state.user?.joinedAt ?? "",
  };
}

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.profileError = null;
    },

    logout: (state) => {
      state.user = null;
      state.profileLoading = false;
      state.profileError = null;
    },

    clearProfileError: (state) => {
      state.profileError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        setProfileData(state, action.payload);
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.profileLoading = false;

        if (!action.meta.aborted) {
          state.profileError = action.payload || "Gagal mengambil profil.";
        }
      })

      .addCase(updateProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        setProfileData(state, action.payload);
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload || "Gagal memperbarui profil.";
      });
  },
});

export const { login, logout, clearProfileError } = authSlice.actions;

export const selectUser = (state) => state.auth.user;

export const selectProfileLoading = (state) => state.auth.profileLoading;

export const selectProfileError = (state) => state.auth.profileError;

export default authSlice.reducer;
