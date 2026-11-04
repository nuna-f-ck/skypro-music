import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TrackType } from "../../data/tracks";

type TrackStateType = {
  currentTrack: TrackType | null;
  isPlay: boolean;
};

const initialState: TrackStateType = {
  currentTrack: null,
  isPlay: false,
};

const trackSlice = createSlice({
  name: "tracks",
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<TrackType>) => {
      state.currentTrack = action.payload;
      state.isPlay = true;
    },
    setIsPlay: (state, action: PayloadAction<boolean>) => {
      state.isPlay = action.payload;
    },
  },
});

export const { setCurrentTrack, setIsPlay } = trackSlice.actions;
export default trackSlice.reducer;
