import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TrackType } from "../../data/tracks";

type TrackStateType = {
  currentTrack: TrackType | null;
  isPlay: boolean;
  playlist: TrackType[];
  shuffledPlaylist: TrackType[];
  isShuffle: boolean;
  isLoop: boolean;
};

const initialState: TrackStateType = {
  currentTrack: null,
  isPlay: false,
  playlist: [],
  shuffledPlaylist: [],
  isShuffle: false,
  isLoop: false,
};

// перемешивает плейлист
const makeShuffled = (
  playlist: TrackType[],
  currentTrack: TrackType | null,
): TrackType[] => {
  const rest = playlist.filter((track) => track.id !== currentTrack?.id);

  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }

  return currentTrack ? [currentTrack, ...rest] : rest;
};

// список, по которому сейчас идёт воспроизведение
const getActiveList = (state: TrackStateType): TrackType[] =>
  state.isShuffle ? state.shuffledPlaylist : state.playlist;

const trackSlice = createSlice({
  name: "tracks",
  initialState,
  reducers: {
    setCurrentTrack: (
      state,
      action: PayloadAction<{ track: TrackType; playlist: TrackType[] }>,
    ) => {
      const { track, playlist } = action.payload;
      state.currentTrack = track;
      state.playlist = playlist;
      state.shuffledPlaylist = state.isShuffle
        ? makeShuffled([...playlist], track)
        : [];
      state.isPlay = true;
    },
    setIsPlay: (state, action: PayloadAction<boolean>) => {
      state.isPlay = action.payload;
    },
    nextTrack: (state) => {
      const list = getActiveList(state);
      const index = list.findIndex(
        (track) => track.id === state.currentTrack?.id,
      );

      if (index !== -1 && index < list.length - 1) {
        state.currentTrack = list[index + 1];
        state.isPlay = true;
      }
    },
    prevTrack: (state) => {
      const list = getActiveList(state);
      const index = list.findIndex(
        (track) => track.id === state.currentTrack?.id,
      );

      if (index > 0) {
        state.currentTrack = list[index - 1];
        state.isPlay = true;
      }
    },
    toggleShuffle: (state) => {
      state.isShuffle = !state.isShuffle;

      if (state.isShuffle) {
        state.shuffledPlaylist = makeShuffled(
          [...state.playlist],
          state.currentTrack,
        );
      } else {
        state.shuffledPlaylist = [];
      }
    },
    toggleLoop: (state) => {
      state.isLoop = !state.isLoop;
    },
  },
});

export const {
  setCurrentTrack,
  setIsPlay,
  nextTrack,
  prevTrack,
  toggleShuffle,
  toggleLoop,
} = trackSlice.actions;
export default trackSlice.reducer;
