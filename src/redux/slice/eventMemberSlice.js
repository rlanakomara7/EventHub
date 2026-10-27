import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getJoinedEventsAPI,
  joinEventAPI,
  leaveEventAPI,
} from "../../services/eventMemberService";

import { login, logout } from "./authSlice";

export const fetchJoinedEvents = createAsyncThunk(
  "eventMember/fetchJoinedEvents",
  async (_, { rejectWithValue, signal }) => {
    try {
      return await getJoinedEventsAPI(signal);
    } catch (error) {
      if (signal.aborted) throw error;
      return rejectWithValue(error.message);
    }
  },
);

export const joinEvent = createAsyncThunk(
  "eventMember/joinEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      await joinEventAPI(eventId);
      return eventId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const leaveEvent = createAsyncThunk(
  "eventMember/leaveEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      await leaveEventAPI(eventId);
      return eventId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  joinedEvents: [],
  joinedIds: [],

  loading: false,
  error: null,
  loaded: false,

  actionLoadingId: null,
  actionError: null,
};

const eventMemberSlice = createSlice({
  name: "eventMember",
  initialState,

  reducers: {
    clearMemberError: (state) => {
      state.error = null;
      state.actionError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchJoinedEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchJoinedEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;

        state.joinedEvents = action.payload;

        state.joinedIds = action.payload.map((event) => String(event.event_id));
      })

      .addCase(fetchJoinedEvents.rejected, (state, action) => {
        state.loading = false;

        if (!action.meta.aborted) {
          state.error = action.payload || "Failed to load joined events.";
        }
      })

      .addCase(joinEvent.pending, (state, action) => {
        state.actionLoadingId = String(action.meta.arg);
        state.actionError = null;
      })

      .addCase(joinEvent.fulfilled, (state, action) => {
        const eventId = String(action.payload);

        state.actionLoadingId = null;

        if (!state.joinedIds.includes(eventId)) {
          state.joinedIds.push(eventId);
        }
      })

      .addCase(joinEvent.rejected, (state, action) => {
        state.actionLoadingId = null;
        state.actionError = action.payload || "Failed to join event.";
      })

      .addCase(leaveEvent.pending, (state, action) => {
        state.actionLoadingId = String(action.meta.arg);
        state.actionError = null;
      })

      .addCase(leaveEvent.fulfilled, (state, action) => {
        const eventId = String(action.payload);

        state.actionLoadingId = null;

        state.joinedIds = state.joinedIds.filter((id) => id !== eventId);

        state.joinedEvents = state.joinedEvents.filter(
          (event) => String(event.event_id) !== eventId,
        );
      })

      .addCase(leaveEvent.rejected, (state, action) => {
        state.actionLoadingId = null;
        state.actionError = action.payload || "Failed to leave event.";
      })

      .addCase(login, () => initialState)
      .addCase(logout, () => initialState);
  },
});

export const { clearMemberError } = eventMemberSlice.actions;

export const selectJoinedEvents = (state) => state.eventMember.joinedEvents;

export const selectJoinedIds = (state) => state.eventMember.joinedIds;

export const selectMemberLoading = (state) => state.eventMember.loading;

export const selectMemberLoaded = (state) => state.eventMember.loaded;

export const selectMemberError = (state) => state.eventMember.error;

export const selectMemberActionLoadingId = (state) =>
  state.eventMember.actionLoadingId;

export const selectMemberActionError = (state) => state.eventMember.actionError;

export default eventMemberSlice.reducer;
