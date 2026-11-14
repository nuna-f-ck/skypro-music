import { configureStore } from "@reduxjs/toolkit";
import trackReducer from "./features/trackSlice";
import authReducer from "./features/authSlice";
import favoritesReducer from "./features/favoritesSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      tracks: trackReducer,
      auth: authReducer,
      favorites: favoritesReducer,
    },
    devTools: typeof window !== "undefined",
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
