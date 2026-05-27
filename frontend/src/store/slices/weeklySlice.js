import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_API_URL || "";

// Fetch all weekly summaries
export const fetchWeeklySummaries = createAsyncThunk(
  "weekly/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(`${BASE_URL}/api/weekly`);
      const data = await res.json();
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// Manual generate
export const generateSummary = createAsyncThunk(
  "weekly/generate",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(`${BASE_URL}/api/weekly/generate`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) return thunkAPI.rejectWithValue(data.message);
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const weeklySlice = createSlice({
  name: "weekly",
  initialState: {
    summaries: [],
    loading: false,
    generating: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch
    builder.addCase(fetchWeeklySummaries.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchWeeklySummaries.fulfilled, (state, action) => {
      state.loading = false;
      state.summaries = action.payload || [];
    });
    builder.addCase(fetchWeeklySummaries.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Generate
    builder.addCase(generateSummary.pending, (state) => {
      state.generating = true;
      state.error = null;
    });
    builder.addCase(generateSummary.fulfilled, (state, action) => {
      state.generating = false;
      if (action.payload) {
        state.summaries.unshift(action.payload);
      }
    });
    builder.addCase(generateSummary.rejected, (state, action) => {
      state.generating = false;
      state.error = action.payload;
    });
  },
});

export default weeklySlice.reducer;
