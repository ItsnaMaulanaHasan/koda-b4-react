import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dataProfile: {},
};

const profile = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setDataProfile: (state, action) => {
      state.dataProfile = action.payload;
    },
    clearDataProfile: (state) => {
      state.dataProfile = {};
    },
  },
});

export const {
  reducer: profileReducer,
  actions: { setDataProfile, clearDataProfile },
} = profile;
