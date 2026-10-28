import Link from "next/link";
import styles from "./Track.module.css";
import { TrackType } from "../../data/tracks";

type TrackProps = Omit<TrackType, "id">;

export default function Track({
  title,
  subtitle,
  author,
  album,
  time,
}: TrackProps) {
  return (
    <div className={styles["playlist__item"]}>
      <div className={styles["playlist__track"]}>
        <div className={styles["track__title"]}>
          <div className={styles["track__titleImage"]}>
            <svg className={styles["track__titleSvg"]}>
              <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
            </svg>
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
