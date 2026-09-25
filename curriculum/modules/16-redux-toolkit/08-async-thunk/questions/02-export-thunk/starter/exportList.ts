import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
export const exportList = createAsyncThunk(
  'watchlists/export',
  async (_ids: number[]) => [] as number[],
)
export const exportSlice = createSlice({
  name: 'export',
  initialState: {
    status: 'idle' as 'idle' | 'pending' | 'fulfilled' | 'rejected',
    ids: [] as number[],
  },
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(exportList.pending, (state) => {
        state.status = 'pending'
      })
      .addCase(exportList.fulfilled, (state, action) => {
        state.status = 'fulfilled'
        state.ids = action.payload
      })
      .addCase(exportList.rejected, (state) => {
        state.status = 'rejected'
      }),
})
