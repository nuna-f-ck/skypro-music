"use client";

import cn from "classnames";
import Link from "next/link";
import styles from "./Track.module.css";
import { TrackType } from "../../data/tracks";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setCurrentTrack } from "../../store/features/trackSlice";

type TrackProps = {
  track: TrackType;
  playlist: TrackType[];
};

export default function Track({ track, playlist }: TrackProps) {
  const { title, subtitle, author, album, time } = track;

  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlay = useAppSelector((state) => state.tracks.isPlay);

  const isCurrent = currentTrack?.id === track.id;

  const handleClick = () => {
    dispatch(setCurrentTrack({ track, playlist }));
  };

  return (
    <div className={styles["playlist__item"]} onClick={handleClick}>
      <div className={styles["playlist__track"]}>
        <div className={styles["track__title"]}>
          <div className={styles["track__titleImage"]}>
            {isCurrent ? (
              <span
                className={cn(
                  styles["track__dot"],
                  isPlay && styles["track__dot_playing"],
                )}
              ></span>
            ) : (
              <svg className={styles["track__titleSvg"]}>
                <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
              </svg>
            )}
          </div>
          <div>
            <Link className={styles["track__titleLink"]} href="#">
              {title}{" "}
              {subtitle && (
                <span className={styles["track__titleSpan"]}>{subtitle}</span>
              )}
            </Link>
          </div>
        </div>
        <div className={styles["track__author"]}>
          <Link className={styles["track__authorLink"]} href="#">
            {author}
          </Link>
        </div>
        <div className={styles["track__album"]}>
          <Link className={styles["track__albumLink"]} href="#">
            {album}
          </Link>
        </div>
        <div>
          <svg className={styles["track__timeSvg"]}>
            <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
          </svg>
          <span className={styles["track__timeText"]}>{time}</span>
        </div>
      </div>
    </div>
  );
}
