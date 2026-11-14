"use client";

import { useCallback } from "react";
import { TrackType } from "../data/tracks";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setError, toggleFavorite } from "../store/features/favoritesSlice";

export function useLike(track: TrackType | null) {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector((state) => state.auth.isAuth);
  const trackId = track?.id;

  const isLiked = useAppSelector(
    (state) =>
      trackId !== undefined &&
      state.favorites.tracks.some((item) => item.id === trackId),
  );
  const isPending = useAppSelector(
    (state) =>
      trackId !== undefined && state.favorites.pendingIds.includes(trackId),
  );

  const changeLike = useCallback(
    (like: boolean): void => {
      if (!track) return;

      if (!isAuth) {
        dispatch(setError("Чтобы ставить лайки, нужно войти в аккаунт"));
        return;
      }
      if (isPending) return;

      void dispatch(toggleFavorite({ track, like }));
    },
    [track, isAuth, isPending, dispatch],
  );

  const toggleLike = useCallback((): void => {
    changeLike(!isLiked);
  }, [changeLike, isLiked]);

  return { isLiked, changeLike, toggleLike };
}
