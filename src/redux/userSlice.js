import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {},
  reducers: {
    updateuser: (state, action) => {
      return action.payload;
    },
    removeuser: (state) => {
      return null;
    },
  },
});

export const { updateuser, removeuser } = userSlice.actions;

export default userSlice.reducer;
