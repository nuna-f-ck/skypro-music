"use client";

import { KeyboardEvent, MouseEvent, useCallback } from "react";
import cn from "classnames";
import styles from "./LikeButton.module.css";
import { TrackType } from "../../data/tracks";
import { useLike } from "../../hooks/useLike";

type LikeButtonProps = {
  track: TrackType;
  // класс иконки из того компонента, куда вставляем кнопку (размер, цвет по умолчанию)
  svgClassName?: string;
};

export default function LikeButton({ track, svgClassName }: LikeButtonProps) {
  const { isLiked, toggleLike } = useLike(track);

  const handleClick = useCallback(
    (e: MouseEvent<SVGSVGElement>): void => {
      // чтобы клик по сердечку не запускал трек
      e.stopPropagation();
      toggleLike();
    },
    [toggleLike],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<SVGSVGElement>): void => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        toggleLike();
      }
    },
    [toggleLike],
  );

  return (
    <svg
      className={cn(svgClassName, styles["like"], isLiked && styles["liked"])}
      role="button"
      tabIndex={0}
      aria-pressed={isLiked}
      aria-label={isLiked ? "Убрать из избранного" : "Добавить в избранное"}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
    </svg>
  );
}
