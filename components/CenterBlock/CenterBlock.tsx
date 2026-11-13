"use client";

import { useEffect, useState } from "react";
import styles from "./CenterBlock.module.css";
import Search from "../Search/Search";
import Filter from "../Filter/Filter";
import TrackList from "../TrackList/TrackList";
import { TrackType } from "../../data/tracks";
import { getSelection, getTracks } from "../../services/tracks";

type CenterBlockProps = {
  selectionId?: string;
  title?: string;
};

export default function CenterBlock({
  selectionId,
  title = "Треки",
}: CenterBlockProps) {
  const [tracks, setTracks] = useState<TrackType[]>([]);
  const [heading, setHeading] = useState<string>(title);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
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
  }, [selectionId]);

  return (
    <div className={styles["centerblock"]}>
      <Search />
      <h2 className={styles["centerblock__h2"]}>{heading}</h2>
      <Filter tracks={tracks} />
      {isLoading && <p className={styles["status"]}>Загрузка треков...</p>}
      {!isLoading && error && <p className={styles["error"]}>{error}</p>}
      {!isLoading && !error && tracks.length === 0 && (
        <p className={styles["status"]}>Здесь пока нет треков</p>
      )}
      {!isLoading && !error && tracks.length > 0 && (
        <TrackList tracks={tracks} />
      )}
    </div>
  );
}
