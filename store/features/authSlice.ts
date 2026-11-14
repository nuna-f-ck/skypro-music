import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthStateType = {
  username: string;
  isAuth: boolean;
  // true, когда мы уже прочитали localStorage (чтобы не редиректить раньше времени)
  isReady: boolean;
};

const initialState: AuthStateType = {
  username: "",
  isAuth: false,
  isReady: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
      state.isAuth = true;
      state.isReady = true;
    },
    setReady: (state) => {
      state.isReady = true;
    },
    logout: (state) => {
      state.username = "";
      state.isAuth = false;
      state.isReady = true;
    },
  },
});

export const { setAuth, setReady, logout } = authSlice.actions;
export default authSlice.reducer;
