"use client";

import { useEffect, useRef } from "react";
import cn from "classnames";
import Link from "next/link";
import styles from "./Bar.module.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setIsPlay } from "../../store/features/trackSlice";

export default function Bar() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlay = useAppSelector((state) => state.tracks.isPlay);

  // при выборе нового трека запускаем его воспроизведение
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    audio.play().catch((error: Error) => {
      // AbortError возникает при быстром переключении треков — это нормально
      if (error.name !== "AbortError") {
        dispatch(setIsPlay(false));
      }
    });
  }, [currentTrack, dispatch]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlay) {
      audio.pause();
      dispatch(setIsPlay(false));
    } else {
      audio.play().catch(() => dispatch(setIsPlay(false)));
      dispatch(setIsPlay(true));
    }
  };

  if (!currentTrack) return null;

  return (
    <div className={styles["bar"]}>
      <audio
        ref={audioRef}
        src={currentTrack.track_file}
        onEnded={() => dispatch(setIsPlay(false))}
      />
      <div className={styles["bar__content"]}>
        <div className={styles["bar__playerProgress"]}></div>
        <div className={styles["bar__playerBlock"]}>
          <div className={styles["bar__player"]}>
            <div className={styles["player__controls"]}>
              <div className={styles["player__btnPrev"]}>
                <svg className={styles["player__btnPrevSvg"]}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-prev"></use>
                </svg>
              </div>
              <div
                className={cn(styles["player__btnPlay"], styles["btn"])}
                onClick={handlePlayPause}
              >
                {isPlay ? (
                  <svg
                    className={styles["player__btnPlaySvg"]}
                    viewBox="0 0 15 19"
                  >
                    <rect x="0" y="0" width="5" height="19" />
                    <rect x="10" y="0" width="5" height="19" />
                  </svg>
                ) : (
                  <svg className={styles["player__btnPlaySvg"]}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-play"></use>
                  </svg>
                )}
              </div>
              <div className={styles["player__btnNext"]}>
                <svg className={styles["player__btnNextSvg"]}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-next"></use>
                </svg>
              </div>
              <div
                className={cn(styles["player__btnRepeat"], styles["btnIcon"])}
              >
                <svg className={styles["player__btnRepeatSvg"]}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-repeat"></use>
                </svg>
              </div>
              <div
                className={cn(styles["player__btnShuffle"], styles["btnIcon"])}
              >
                <svg className={styles["player__btnShuffleSvg"]}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-shuffle"></use>
                </svg>
              </div>
            </div>

            <div className={styles["player__trackPlay"]}>
              <div className={styles["trackPlay__contain"]}>
                <div className={styles["trackPlay__image"]}>
                  <svg className={styles["trackPlay__svg"]}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                  </svg>
                </div>
                <div className={styles["trackPlay__author"]}>
                  <Link className={styles["trackPlay__authorLink"]} href="#">
                    {currentTrack.title}
                  </Link>
                </div>
                <div className={styles["trackPlay__album"]}>
                  <Link className={styles["trackPlay__albumLink"]} href="#">
                    {currentTrack.author}
                  </Link>
                </div>
              </div>

              <div className={styles["trackPlay__likeDis"]}>
                <div
                  className={cn(styles["trackPlay__like"], styles["btnIcon"])}
                >
                  <svg className={styles["trackPlay__likeSvg"]}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                  </svg>
                </div>
                <div
                  className={cn(
                    styles["trackPlay__dislike"],
                    styles["btnIcon"],
                  )}
                >
                  <svg className={styles["trackPlay__dislikeSvg"]}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-dislike"></use>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className={styles["bar__volumeBlock"]}>
            <div className={styles["volume__content"]}>
              <div className={styles["volume__image"]}>
                <svg className={styles["volume__svg"]}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-volume"></use>
                </svg>
              </div>
              <div className={cn(styles["volume__progress"], styles["btn"])}>
                <input
                  className={cn(styles["volume__progressLine"], styles["btn"])}
                  type="range"
                  name="range"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
