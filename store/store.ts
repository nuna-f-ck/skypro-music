import { configureStore } from "@reduxjs/toolkit";
import trackReducer from "./features/trackSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      tracks: trackReducer,
    },
    devTools: typeof window !== "undefined",
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
