import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TrackType } from "../../data/tracks";
import { ApiError } from "../../services/api";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../../services/tracks";
import { logout } from "./authSlice";

type RejectPayload = {
  message: string;
  unauthorized: boolean;
};

type FavoritesStateType = {
  tracks: TrackType[];
  // id треков, для которых прямо сейчас идёт запрос (защита от двойных кликов)
  pendingIds: number[];
  isLoaded: boolean;
  // ошибка загрузки списка (показывается на странице избранного)
  loadError: string;
  // ошибка лайка (показывается всплывающим сообщением)
  error: string;
};

const initialState: FavoritesStateType = {
  tracks: [],
  pendingIds: [],
  isLoaded: false,
  loadError: "",
  error: "",
};

const toRejectPayload = (error: unknown, fallback: string): RejectPayload => ({
  message: error instanceof Error ? error.message : fallback,
  unauthorized: error instanceof ApiError && error.status === 401,
});

export const loadFavorites = createAsyncThunk<
  TrackType[],
  void,
  { rejectValue: RejectPayload }
>("favorites/load", async (_, { rejectWithValue }) => {
  try {
    return await getFavorites();
  } catch (error) {
    return rejectWithValue(
      toRejectPayload(error, "Не удалось загрузить избранные треки"),
    );
  }
});

export const toggleFavorite = createAsyncThunk<
  void,
  { track: TrackType; like: boolean },
  { rejectValue: RejectPayload }
>("favorites/toggle", async ({ track, like }, { rejectWithValue }) => {
  try {
    if (like) {
      await addFavorite(track.id);
    } else {
      await removeFavorite(track.id);
    }
  } catch (error) {
    return rejectWithValue(
      toRejectPayload(
        error,
        "Не удалось обновить избранное. Попробуйте ещё раз.",
      ),
    );
  }
});

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // при выходе из аккаунта чистим избранное
      .addCase(logout, () => initialState)

      .addCase(loadFavorites.pending, (state) => {
        state.loadError = "";
      })
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.tracks = action.payload;
        state.isLoaded = true;
      })
      .addCase(loadFavorites.rejected, (state, action) => {
        // сессия закончилась — пользователь уже разлогинен
        if (action.payload?.unauthorized) return;
        state.loadError =
          action.payload?.message ?? "Не удалось загрузить избранные треки";
        state.isLoaded = true;
      })

      // оптимистичное обновление: меняем сразу, не дожидаясь сервера
      .addCase(toggleFavorite.pending, (state, action) => {
        const { track, like } = action.meta.arg;
        state.pendingIds.push(track.id);

        if (like) {
          if (!state.tracks.some((item) => item.id === track.id)) {
            state.tracks.push(track);
          }
        } else {
          state.tracks = state.tracks.filter((item) => item.id !== track.id);
        }
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { track } = action.meta.arg;
        state.pendingIds = state.pendingIds.filter((id) => id !== track.id);
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        const { track, like } = action.meta.arg;
        state.pendingIds = state.pendingIds.filter((id) => id !== track.id);
        state.error =
          action.payload?.message ??
          "Не удалось обновить избранное. Попробуйте ещё раз.";

        // сессия закончилась — состояние уже сброшено при выходе
        if (action.payload?.unauthorized) return;

        // сервер не принял — откатываем изменение
        if (like) {
          state.tracks = state.tracks.filter((item) => item.id !== track.id);
        } else if (!state.tracks.some((item) => item.id === track.id)) {
          state.tracks.push(track);
        }
      });
  },
});

export const { setError, clearError } = favoritesSlice.actions;
export default favoritesSlice.reducer;
