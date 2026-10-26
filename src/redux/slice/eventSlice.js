import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getPaginatedEvents } from "../../services/eventsService";

export const fetchEventPage = createAsyncThunk(
  "events/fetchPage",
  async (params, { rejectWithValue, signal }) => {
    try {
      return await getPaginatedEvents(params, signal);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  items: [],
  metadata: {
    current_page: 1,
    total_page: 0,
    total_data: 0,
    limit: 6,
    next: "",
    prev: "",
  },
  loading: false,
  error: null,
  requestId: null,
};

const eventSlice = createSlice({
  name: "events",
  initialState,

  reducers: {
    clearEventError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchEventPage.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.requestId = action.meta.requestId;
      })
      .addCase(fetchEventPage.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;

        state.loading = false;
        state.requestId = null;
        state.items = action.payload.data || [];
        state.metadata = action.payload.metadata;
      })
      .addCase(fetchEventPage.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;

        state.loading = false;
        state.requestId = null;

        if (action.meta.aborted) return;

        state.error =
          action.payload || action.error.message || "Failed to load events";
      });
  },
});

export const { clearEventError } = eventSlice.actions;

export const selectEvents = (state) => state.events.items;
export const selectEventMetadata = (state) => state.events.metadata;
export const selectEventLoading = (state) => state.events.loading;
export const selectEventError = (state) => state.events.error;

export default eventSlice.reducer;
