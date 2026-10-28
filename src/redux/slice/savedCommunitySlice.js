import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login, logout } from "./authSlice";

import {
  getSavedCommunitiesAPI,
  saveCommunityAPI,
  unsaveCommunityAPI,
} from "../../services/savedCommunityService";

const getId = (community) => String(community.community_id ?? community.id);

export const fetchSavedCommunities = createAsyncThunk(
  "savedCommunity/fetch",
  async (_, { signal }) => {
    return await getSavedCommunitiesAPI(signal);
  },
);

export const saveCommunity = createAsyncThunk(
  "savedCommunity/save",
  async (community) => {
    await saveCommunityAPI(getId(community));
    return community;
  },
);

export const unsaveCommunity = createAsyncThunk(
  "savedCommunity/unsave",
  async (communityId) => {
    await unsaveCommunityAPI(communityId);
    return String(communityId);
  },
);

const initialState = {
  items: [],
  ids: [],
  loading: false,
  fetchRequestId: null,
  actionLoadingById: {},
  errorById: {},
  error: null,
};

const savedCommunitySlice = createSlice({
  name: "savedCommunity",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedCommunities.pending, (state, action) => {
        state.loading = true;
        state.fetchRequestId = action.meta.requestId;
        state.error = null;
      })
      .addCase(fetchSavedCommunities.fulfilled, (state, action) => {
        if (state.fetchRequestId !== action.meta.requestId) return;

        state.loading = false;
        state.fetchRequestId = null;
        state.items = action.payload;
        state.ids = action.payload.map(getId);
      })
      .addCase(fetchSavedCommunities.rejected, (state, action) => {
        if (state.fetchRequestId !== action.meta.requestId) return;

        state.loading = false;
        state.fetchRequestId = null;

        if (!action.meta.aborted) {
          state.error =
            action.error.message || "Failed to load saved communities.";
        }
      })

      .addCase(saveCommunity.pending, (state, action) => {
        const id = getId(action.meta.arg);

        state.actionLoadingById[id] = true;
        state.errorById[id] = null;
      })
      .addCase(saveCommunity.fulfilled, (state, action) => {
        const community = action.payload;
        const id = getId(community);

        if (!state.actionLoadingById[id]) return;

        state.actionLoadingById[id] = false;

        if (!state.ids.includes(id)) {
          state.ids.push(id);
          state.items.unshift(community);
        }
      })
      .addCase(saveCommunity.rejected, (state, action) => {
        const id = getId(action.meta.arg);

        if (!state.actionLoadingById[id]) return;

        state.actionLoadingById[id] = false;
        state.errorById[id] =
          action.error.message || "Failed to save community.";
      })

      .addCase(unsaveCommunity.pending, (state, action) => {
        const id = String(action.meta.arg);

        state.actionLoadingById[id] = true;
        state.errorById[id] = null;
      })
      .addCase(unsaveCommunity.fulfilled, (state, action) => {
        const id = action.payload;

        if (!state.actionLoadingById[id]) return;

        state.actionLoadingById[id] = false;
        state.ids = state.ids.filter((item) => item !== id);
        state.items = state.items.filter(
          (community) => getId(community) !== id,
        );
      })
      .addCase(unsaveCommunity.rejected, (state, action) => {
        const id = String(action.meta.arg);

        if (!state.actionLoadingById[id]) return;

        state.actionLoadingById[id] = false;
        state.errorById[id] =
          action.error.message || "Failed to unsave community.";
      })

      .addCase(login, () => initialState)
      .addCase(logout, () => initialState);
  },
});

export const selectSavedCommunities = (state) => state.savedCommunity.items;

export const selectSavedCommunityIds = (state) => state.savedCommunity.ids;

export const selectSavedCommunityLoading = (state) =>
  state.savedCommunity.loading;

export const selectSavedCommunityError = (state) => state.savedCommunity.error;

export default savedCommunitySlice.reducer;
