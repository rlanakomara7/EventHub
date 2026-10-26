import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getPaginatedEvents } from "../../services/eventsService";
import { getEventCategoriesAPI } from "../../services/eventCategoryService";

export const fetchEventPage = createAsyncThunk(
  "events/fetchPage",
  async (params, { rejectWithValue, signal }) => {
    try {
      return await getPaginatedEvents(params, signal);
    } catch (error) {
      if (signal.aborted) {
        throw error;
      }

      return rejectWithValue(error.message);
    }
  },
);

export const fetchEventCategories = createAsyncThunk(
  "events/fetchCategories",
  async (_, { rejectWithValue, signal }) => {
    try {
      return await getEventCategoriesAPI(signal);
    } catch (error) {
      if (signal.aborted) {
        throw error;
      }

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

  categories: [],

  loading: false,
  error: null,
  requestId: null,

  categoriesLoading: false,
  categoriesError: null,
  categoriesRequestId: null,
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
        if (state.requestId !== action.meta.requestId) {
          return;
        }

        state.loading = false;
        state.requestId = null;
        state.items = action.payload.data || [];

        state.metadata = action.payload.metadata || {
          current_page: 1,
          total_page: 0,
          total_data: 0,
          limit: 6,
          next: "",
          prev: "",
        };
      })
      .addCase(fetchEventPage.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) {
          return;
        }

        state.loading = false;
        state.requestId = null;

        if (action.meta.aborted) {
          return;
        }

        state.error =
          action.payload || action.error.message || "Failed to load events";
      })

      .addCase(fetchEventCategories.pending, (state, action) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
        state.categoriesRequestId = action.meta.requestId;
      })
      .addCase(fetchEventCategories.fulfilled, (state, action) => {
        if (state.categoriesRequestId !== action.meta.requestId) {
          return;
        }

        state.categoriesLoading = false;
        state.categoriesRequestId = null;
        state.categories = action.payload;
      })
      .addCase(fetchEventCategories.rejected, (state, action) => {
        if (state.categoriesRequestId !== action.meta.requestId) {
          return;
        }

        state.categoriesLoading = false;
        state.categoriesRequestId = null;

        if (action.meta.aborted) {
          return;
        }

        state.categoriesError =
          action.payload || action.error.message || "Failed to load categories";
      });
  },
});

export const { clearEventError } = eventSlice.actions;

export const selectEvents = (state) => state.events.items;
export const selectEventMetadata = (state) => state.events.metadata;
export const selectEventLoading = (state) => state.events.loading;
export const selectEventError = (state) => state.events.error;

export const selectEventCategories = (state) => state.events.categories;

export const selectCategoriesLoading = (state) =>
  state.events.categoriesLoading;

export const selectCategoriesError = (state) => state.events.categoriesError;

export default eventSlice.reducer;
