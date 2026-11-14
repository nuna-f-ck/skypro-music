"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./CenterBlock.module.css";
import Search from "../Search/Search";
import Filter from "../Filter/Filter";
import TrackList from "../TrackList/TrackList";
import { TrackType } from "../../data/tracks";
import { getSelection, getTracks } from "../../services/tracks";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loadFavorites } from "../../store/features/favoritesSlice";

type CenterBlockProps = {
  selectionId?: string;
  title?: string;
  isFavorites?: boolean;
};

export default function CenterBlock({
  selectionId,
  title = "Треки",
  isFavorites = false,
}: CenterBlockProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const isAuth = useAppSelector((state) => state.auth.isAuth);
  const isReady = useAppSelector((state) => state.auth.isReady);
  const favoriteTracks = useAppSelector((state) => state.favorites.tracks);
  const isFavoritesLoaded = useAppSelector((state) => state.favorites.isLoaded);
  const favoritesError = useAppSelector((state) => state.favorites.loadError);

  const [tracks, setTracks] = useState<TrackType[]>([]);
  const [heading, setHeading] = useState<string>(title);
  const [isLoading, setIsLoading] = useState<boolean>(!isFavorites);
  const [error, setError] = useState<string>("");

  // обычный режим: главная и подборки грузятся из API
  useEffect(() => {
    if (isFavorites) return;

    let ignore = false;

    const load = async (): Promise<void> => {
      try {
        if (selectionId) {
          const selection = await getSelection(selectionId);
          if (ignore) return;
          setTracks(selection.tracks);
          setHeading(selection.name);
        } else {
          const list = await getTracks();
          if (ignore) return;
          setTracks(list);
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err instanceof Error ? err.message : "Не удалось загрузить треки",
          );
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    void load();

    return () => {
      ignore = true;
    };
  }, [selectionId, isFavorites]);

  // режим избранного: только для авторизованных, данные синхронизируем с сервером
  useEffect(() => {
    if (!isFavorites || !isReady) return;

    if (!isAuth) {
      router.replace("/music/main");
      return;
    }

    void dispatch(loadFavorites());
  }, [isFavorites, isReady, isAuth, dispatch, router]);

  const list = isFavorites ? favoriteTracks : tracks;
  const loading = isFavorites ? !isReady || !isFavoritesLoaded : isLoading;
  const errorText = isFavorites ? favoritesError : error;
  const emptyText = isFavorites
    ? "В избранном пока нет треков"
    : "Здесь пока нет треков";

  return (
    <div className={styles["centerblock"]}>
      <Search />
      <h2 className={styles["centerblock__h2"]}>{heading}</h2>
      <Filter tracks={list} />
      {loading && <p className={styles["status"]}>Загрузка треков...</p>}
      {!loading && errorText && <p className={styles["error"]}>{errorText}</p>}
      {!loading && !errorText && list.length === 0 && (
        <p className={styles["status"]}>{emptyText}</p>
      )}
      {!loading && !errorText && list.length > 0 && <TrackList tracks={list} />}
    </div>
  );
}
