import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dataProfile: {
    profilePhoto: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    joinDate: null,
  },
};

const profile = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setDataProfile: (state, action) => {
      state.dataProfile = { ...initialState.dataProfile, ...action.payload };
    },
    clearDataProfile: (state) => {
      state.dataProfile = initialState.dataProfile;
    },
  },
});

export const {
  reducer: profileReducer,
  actions: { setDataProfile, clearDataProfile },
} = profile;
