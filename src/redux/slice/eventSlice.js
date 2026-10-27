import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getPaginatedEvents, createEvent } from "../../services/eventsService";

import { getEventDetail, updateEvent } from "../../services/eventEditService";

import { getEventCategoriesAPI } from "../../services/eventCategoryService";

export const fetchEventPage = createAsyncThunk(
  "events/fetchPage",
  async (params, { rejectWithValue, signal }) => {
    try {
      return await getPaginatedEvents(params, signal);
    } catch (error) {
      if (signal.aborted) throw error;
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
      if (signal.aborted) throw error;
      return rejectWithValue(error.message);
    }
  },
);

export const fetchEventDetail = createAsyncThunk(
  "events/fetchDetail",
  async (eventId, { rejectWithValue, signal }) => {
    try {
      return await getEventDetail(eventId, signal);
    } catch (error) {
      if (signal.aborted) throw error;
      return rejectWithValue(error.message);
    }
  },
);

export const createNewEvent = createAsyncThunk(
  "events/create",
  async ({ form, bannerFile }, { rejectWithValue }) => {
    try {
      return await createEvent(form, bannerFile);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateExistingEvent = createAsyncThunk(
  "events/update",
  async ({ eventId, form, bannerFile }, { rejectWithValue }) => {
    try {
      return await updateEvent(eventId, form, bannerFile);
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
  categories: [],
  detail: null,

  loading: false,
  error: null,
  requestId: null,

  categoriesLoading: false,
  categoriesError: null,
  categoriesRequestId: null,

  detailLoading: false,
  detailError: null,
  detailRequestId: null,

  saving: false,
  saveError: null,
  saveSuccess: false,
};

const eventSlice = createSlice({
  name: "events",
  initialState,

  reducers: {
    clearEventError: (state) => {
      state.error = null;
    },
    resetEventFormStatus: (state) => {
      state.saving = false;
      state.saveError = null;
      state.saveSuccess = false;
    },
    clearEventDetail: (state) => {
      state.detail = null;
      state.detailError = null;
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
        state.metadata = action.payload.metadata || initialState.metadata;
      })
      .addCase(fetchEventPage.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;

        state.loading = false;
        state.requestId = null;

        if (!action.meta.aborted) {
          state.error =
            action.payload || action.error.message || "Failed to load events";
        }
      })

      .addCase(fetchEventCategories.pending, (state, action) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
        state.categoriesRequestId = action.meta.requestId;
      })
      .addCase(fetchEventCategories.fulfilled, (state, action) => {
        if (state.categoriesRequestId !== action.meta.requestId) return;

        state.categoriesLoading = false;
        state.categoriesRequestId = null;
        state.categories = action.payload;
      })
      .addCase(fetchEventCategories.rejected, (state, action) => {
        if (state.categoriesRequestId !== action.meta.requestId) return;

        state.categoriesLoading = false;
        state.categoriesRequestId = null;

        if (!action.meta.aborted) {
          state.categoriesError = action.payload || "Failed to load categories";
        }
      })

      .addCase(fetchEventDetail.pending, (state, action) => {
        state.detailLoading = true;
        state.detailError = null;
        state.detail = null;
        state.detailRequestId = action.meta.requestId;
      })
      .addCase(fetchEventDetail.fulfilled, (state, action) => {
        if (state.detailRequestId !== action.meta.requestId) return;

        state.detailLoading = false;
        state.detailRequestId = null;
        state.detail = action.payload;
      })
      .addCase(fetchEventDetail.rejected, (state, action) => {
        if (state.detailRequestId !== action.meta.requestId) return;

        state.detailLoading = false;
        state.detailRequestId = null;

        if (!action.meta.aborted) {
          state.detailError = action.payload || "Failed to load event detail";
        }
      })

      .addCase(createNewEvent.pending, (state) => {
        state.saving = true;
        state.saveError = null;
        state.saveSuccess = false;
      })
      .addCase(createNewEvent.fulfilled, (state) => {
        state.saving = false;
        state.saveSuccess = true;
      })
      .addCase(createNewEvent.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload || "Failed to create event";
      })

      .addCase(updateExistingEvent.pending, (state) => {
        state.saving = true;
        state.saveError = null;
        state.saveSuccess = false;
      })
      .addCase(updateExistingEvent.fulfilled, (state) => {
        state.saving = false;
        state.saveSuccess = true;
      })
      .addCase(updateExistingEvent.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload || "Failed to update event";
      });
  },
});

export const { clearEventError, resetEventFormStatus, clearEventDetail } =
  eventSlice.actions;

export const selectEvents = (state) => state.events.items;
export const selectEventMetadata = (state) => state.events.metadata;
export const selectEventLoading = (state) => state.events.loading;
export const selectEventError = (state) => state.events.error;

export const selectEventCategories = (state) => state.events.categories;
export const selectCategoriesLoading = (state) =>
  state.events.categoriesLoading;
export const selectCategoriesError = (state) => state.events.categoriesError;

export const selectEventDetail = (state) => state.events.detail;
export const selectEventDetailLoading = (state) => state.events.detailLoading;
export const selectEventDetailError = (state) => state.events.detailError;

export const selectEventSaving = (state) => state.events.saving;
export const selectEventSaveError = (state) => state.events.saveError;
export const selectEventSaveSuccess = (state) => state.events.saveSuccess;

export default eventSlice.reducer;
