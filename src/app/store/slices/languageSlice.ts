import { createSlice } from "@reduxjs/toolkit";

interface LanguageState {
  current: "ar" | "en";
}

const initialState: LanguageState = {
  current: "en",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    toggleLanguage: (state) => {
      state.current = state.current === "ar" ? "en" : "ar";
    },
    setLanguage: (state, action) => {
      state.current = action.payload;
    },
  },
});

export const { toggleLanguage, setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
