"use client";

import { ChangeEvent, CSSProperties, useEffect, useRef, useState } from "react";
import cn from "classnames";
import Link from "next/link";
import styles from "./Bar.module.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  nextTrack,
  prevTrack,
  setIsPlay,
  toggleLoop,
  toggleShuffle,
} from "../../store/features/trackSlice";

// секунды -> "м:сс"
const formatTime = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60);
  const secs = total % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

export default function Bar() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlay = useAppSelector((state) => state.tracks.isPlay);
  const playlist = useAppSelector((state) => state.tracks.playlist);
  const shuffledPlaylist = useAppSelector(
    (state) => state.tracks.shuffledPlaylist,
  );
  const isShuffle = useAppSelector((state) => state.tracks.isShuffle);
  const isLoop = useAppSelector((state) => state.tracks.isLoop);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isLoading, setIsLoading] = useState(true);

  // позиция текущего трека в активном списке (обычном или перемешанном)
  const activeList = isShuffle ? shuffledPlaylist : playlist;
  const index = activeList.findIndex((track) => track.id === currentTrack?.id);
  const hasPrev = index > 0;
  const hasNext = index !== -1 && index < activeList.length - 1;

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

  // громкость
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, currentTrack]);

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

  const handleNext = () => {
    if (hasNext) dispatch(nextTrack());
  };

  const handlePrev = () => {
    if (hasPrev) dispatch(prevTrack());
  };

  // трек закончился (при включённом loop это событие не срабатывает)
  const handleEnded = () => {
    if (hasNext) {
      dispatch(nextTrack());
    } else {
      dispatch(setIsPlay(false));
    }
  };

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const time = Number(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolume = (e: ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={styles["bar"]}>
      <audio
        ref={audioRef}
        src={currentTrack.track_file}
        loop={isLoop}
        onLoadStart={() => {
          setIsLoading(true);
          setCurrentTime(0);
          setDuration(0);
        }}
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onPlaying={() => setIsLoading(false)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onEnded={handleEnded}
      />
      <div className={styles["bar__content"]}>
        <div className={styles["bar__playerProgress"]}>
          <input
            className={styles["bar__progressLine"]}
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(currentTime, duration || 0)}
            onChange={handleSeek}
            style={{ "--progress": `${progress}%` } as CSSProperties}
          />
        </div>
        <div className={styles["bar__playerBlock"]}>
          <div className={styles["bar__player"]}>
            <div className={styles["player__controls"]}>
              <div
                className={cn(
                  styles["player__btnPrev"],
                  styles["btn"],
                  !hasPrev && styles["btnDisabled"],
                )}
                onClick={handlePrev}
              >
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
              <div
                className={cn(
                  styles["player__btnNext"],
                  styles["btn"],
                  !hasNext && styles["btnDisabled"],
                )}
                onClick={handleNext}
              >
                <svg className={styles["player__btnNextSvg"]}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-next"></use>
                </svg>
              </div>
              <div
                className={cn(
                  styles["player__btnRepeat"],
                  styles["btnIcon"],
                  isLoop && styles["btnActive"],
                )}
                onClick={() => dispatch(toggleLoop())}
              >
                <svg className={styles["player__btnRepeatSvg"]}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-repeat"></use>
                </svg>
              </div>
              <div
                className={cn(
                  styles["player__btnShuffle"],
                  styles["btnIcon"],
                  isShuffle && styles["btnActive"],
                )}
                onClick={() => dispatch(toggleShuffle())}
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
            <div className={styles["bar__timeBlock"]}>
              <span className={styles["bar__time"]}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              {isLoading && (
                <span className={styles["bar__loading"]}>Трек загружается</span>
              )}
            </div>
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
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={handleVolume}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
