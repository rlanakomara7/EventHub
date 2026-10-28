import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login, logout } from "./authSlice";

import {
  getSavedEventsAPI,
  saveEventAPI,
  unsaveEventAPI,
} from "../../services/savedEventService";

const getId = (event) => String(event.event_id ?? event.id);

export const fetchSavedEvents = createAsyncThunk(
  "savedEvent/fetch",
  getSavedEventsAPI,
);

export const saveEvent = createAsyncThunk("savedEvent/save", async (event) => {
  await saveEventAPI(getId(event));
  return event;
});

export const unsaveEvent = createAsyncThunk(
  "savedEvent/unsave",
  async (eventId) => {
    await unsaveEventAPI(eventId);
    return String(eventId);
  },
);

const initialState = {
  items: [],
  ids: [],
  loading: false,
  fetchRequestId: null,
  actionLoadingId: null,
  error: null,
};

const savedEventSlice = createSlice({
  name: "savedEvent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedEvents.pending, (state, action) => {
        state.loading = true;
        state.fetchRequestId = action.meta.requestId;
        state.error = null;
      })
      .addCase(fetchSavedEvents.fulfilled, (state, action) => {
        if (state.fetchRequestId !== action.meta.requestId) return;

        state.loading = false;
        state.fetchRequestId = null;
        state.items = action.payload;
        state.ids = action.payload.map(getId);
      })
      .addCase(fetchSavedEvents.rejected, (state, action) => {
        if (state.fetchRequestId !== action.meta.requestId) return;

        state.loading = false;
        state.fetchRequestId = null;

        if (!action.meta.aborted) {
          state.error = action.error.message || "Failed to load saved events.";
        }
      })

      .addCase(saveEvent.pending, (state, action) => {
        state.actionLoadingId = getId(action.meta.arg);
        state.error = null;
      })
      .addCase(saveEvent.fulfilled, (state, action) => {
        const event = action.payload;
        const id = getId(event);

        state.actionLoadingId = null;

        if (!state.ids.includes(id)) {
          state.items.unshift(event);
          state.ids.push(id);
        }
      })
      .addCase(saveEvent.rejected, (state, action) => {
        state.actionLoadingId = null;
        state.error = action.error.message;
      })

      .addCase(unsaveEvent.pending, (state, action) => {
        state.actionLoadingId = String(action.meta.arg);
        state.error = null;
      })
      .addCase(unsaveEvent.fulfilled, (state, action) => {
        const id = action.payload;

        state.actionLoadingId = null;
        state.ids = state.ids.filter((item) => item !== id);
        state.items = state.items.filter((event) => getId(event) !== id);
      })
      .addCase(unsaveEvent.rejected, (state, action) => {
        state.actionLoadingId = null;
        state.error = action.error.message;
      })

      .addCase(login, () => initialState)
      .addCase(logout, () => initialState);
  },
});

export const selectSavedEvents = (state) => state.savedEvent.items;
export const selectSavedIds = (state) => state.savedEvent.ids;
export const selectSavedLoading = (state) => state.savedEvent.loading;
export const selectSavedActionLoadingId = (state) =>
  state.savedEvent.actionLoadingId;
export const selectSavedError = (state) => state.savedEvent.error;

export default savedEventSlice.reducer;
