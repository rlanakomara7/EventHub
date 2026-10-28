import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { login, logout } from "./authSlice";

import {
  getCommunities,
  joinCommunity,
  leaveCommunity,
} from "../../services/communityService";

export const fetchCommunityMemberships = createAsyncThunk(
  "communityMember/fetch",
  async (_, { signal }) => {
    return await getCommunities("", "", signal);
  },
);

export const toggleCommunityMembership = createAsyncThunk(
  "communityMember/toggle",
  async ({ communityId, joined }, { rejectWithValue }) => {
    try {
      if (joined) {
        await leaveCommunity(communityId);
      } else {
        await joinCommunity(communityId);
      }

      return {
        communityId: String(communityId),
        joined: !joined,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  byId: {},
  deltaById: {},
  loadingById: {},
  errorById: {},
  loading: false,
  requestId: null,
  error: null,
};

const communityMemberSlice = createSlice({
  name: "communityMember",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchCommunityMemberships.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.requestId = action.meta.requestId;
      })
      .addCase(fetchCommunityMemberships.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;

        state.loading = false;
        state.requestId = null;

        for (const community of action.payload) {
          const id = String(community.community_id ?? community.id);

          state.byId[id] = community.is_joined === true;
        }
      })
      .addCase(fetchCommunityMemberships.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;

        state.loading = false;
        state.requestId = null;

        if (!action.meta.aborted) {
          state.error = action.error.message || "Failed to load memberships.";
        }
      })

      .addCase(toggleCommunityMembership.pending, (state, action) => {
        const id = String(action.meta.arg.communityId);

        state.loadingById[id] = true;
        state.errorById[id] = null;
      })
      .addCase(toggleCommunityMembership.fulfilled, (state, action) => {
        const { communityId, joined } = action.payload;

        state.loadingById[communityId] = false;
        state.byId[communityId] = joined;

        state.deltaById[communityId] =
          (state.deltaById[communityId] ?? 0) + (joined ? 1 : -1);
      })
      .addCase(toggleCommunityMembership.rejected, (state, action) => {
        const id = String(action.meta.arg.communityId);

        state.loadingById[id] = false;
        state.errorById[id] =
          action.payload || "Failed to update community membership.";
      })

      .addCase(login, () => initialState)
      .addCase(logout, () => initialState);
  },
});

export default communityMemberSlice.reducer;
