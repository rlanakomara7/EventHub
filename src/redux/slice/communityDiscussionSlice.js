import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { login, logout } from "./authSlice";

import {
  getCommunityDiscussionsAPI,
  createCommunityDiscussionAPI,
} from "../../services/communityDiscussionService";

export const fetchCommunityDiscussions = createAsyncThunk(
  "communityDiscussion/fetch",
  async (communityId, { signal }) => {
    const items = await getCommunityDiscussionsAPI(communityId, signal);

    return {
      communityId: String(communityId),
      items,
    };
  },
);

export const createCommunityDiscussion = createAsyncThunk(
  "communityDiscussion/create",
  async ({ communityId, message }) => {
    const item = await createCommunityDiscussionAPI(communityId, message);

    return {
      communityId: String(communityId),
      item,
    };
  },
);

const initialState = {
  itemsById: {},
  loadingById: {},
  errorById: {},
  requestIdById: {},
  postingById: {},
  postErrorById: {},
};

const communityDiscussionSlice = createSlice({
  name: "communityDiscussion",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchCommunityDiscussions.pending, (state, action) => {
        const id = String(action.meta.arg);

        state.loadingById[id] = true;
        state.errorById[id] = null;
        state.requestIdById[id] = action.meta.requestId;
      })
      .addCase(fetchCommunityDiscussions.fulfilled, (state, action) => {
        const { communityId, items } = action.payload;

        if (state.requestIdById[communityId] !== action.meta.requestId) {
          return;
        }

        state.loadingById[communityId] = false;
        state.requestIdById[communityId] = null;
        state.itemsById[communityId] = items;
      })
      .addCase(fetchCommunityDiscussions.rejected, (state, action) => {
        const id = String(action.meta.arg);

        if (state.requestIdById[id] !== action.meta.requestId) {
          return;
        }

        state.loadingById[id] = false;
        state.requestIdById[id] = null;

        if (!action.meta.aborted) {
          state.errorById[id] =
            action.error.message || "Failed to load discussions.";
        }
      })

      .addCase(createCommunityDiscussion.pending, (state, action) => {
        const id = String(action.meta.arg.communityId);

        state.postingById[id] = true;
        state.postErrorById[id] = null;
      })
      .addCase(createCommunityDiscussion.fulfilled, (state, action) => {
        const { communityId, item } = action.payload;

        state.postingById[communityId] = false;

        const existing = state.itemsById[communityId] ?? [];

        state.itemsById[communityId] = [
          item,
          ...existing.filter(
            (discussion) => discussion.discussion_id !== item.discussion_id,
          ),
        ].slice(0, 100);
      })
      .addCase(createCommunityDiscussion.rejected, (state, action) => {
        const id = String(action.meta.arg.communityId);

        state.postingById[id] = false;
        state.postErrorById[id] =
          action.error.message || "Failed to send discussion.";
      })

      .addCase(login, () => initialState)
      .addCase(logout, () => initialState);
  },
});

export default communityDiscussionSlice.reducer;
