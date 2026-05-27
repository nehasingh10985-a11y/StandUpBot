import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_API_URL || "";
const getToken = () => localStorage.getItem("token");

// Fetch all standups
export const fetchStandups = createAsyncThunk(
  "standup/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(`${BASE_URL}/api/standup`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// Submit standup
export const submitStandup = createAsyncThunk(
  "standup/submit",
  async (formData, thunkAPI) => {
    try {
      const res = await fetch(`${BASE_URL}/api/standup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) return thunkAPI.rejectWithValue(data.message);
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// Delete standup
export const deleteStandup = createAsyncThunk(
  "standup/delete",
  async (id, thunkAPI) => {
    try {
      const res = await fetch(`${BASE_URL}/api/standup/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) return thunkAPI.rejectWithValue("Delete failed");
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// Edit standup
export const editStandup = createAsyncThunk(
  "standup/edit",
  async ({ id, formData }, thunkAPI) => {
    try {
      const res = await fetch(`${BASE_URL}/api/standup/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) return thunkAPI.rejectWithValue(data.message);
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// ── Slice ──────────────────────────────────
const standupSlice = createSlice({
  name: "standup",
  initialState: {
    standups: [],
    loading: false,
    error: null,
    submitSuccess: false,
  },
  reducers: {
    resetSubmitSuccess: (state) => {
      state.submitSuccess = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch
    builder.addCase(fetchStandups.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchStandups.fulfilled, (state, action) => {
      state.loading = false;
      state.standups = action.payload || [];
    });
    builder.addCase(fetchStandups.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Submit
    builder.addCase(submitStandup.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.submitSuccess = false;
    });
    builder.addCase(submitStandup.fulfilled, (state, action) => {
      state.loading = false;
      state.submitSuccess = true;
      if (action.payload) {
        state.standups.unshift(action.payload);
      }
    });
    builder.addCase(submitStandup.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Delete
    builder.addCase(deleteStandup.fulfilled, (state, action) => {
      state.standups = state.standups.filter((s) => s._id !== action.payload);
    });

    // Edit
    builder.addCase(editStandup.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(editStandup.fulfilled, (state, action) => {
      state.loading = false;
      if (!action.payload || !action.payload._id) return;
      const index = state.standups.findIndex(
        (s) => s._id === action.payload._id,
      );
      if (index !== -1) {
        state.standups[index] = action.payload;
      }
    });
    builder.addCase(editStandup.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { resetSubmitSuccess, clearError } = standupSlice.actions;
export default standupSlice.reducer;
