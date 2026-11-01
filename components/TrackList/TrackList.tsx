import cn from "classnames";
import styles from "./TrackList.module.css";
import Track from "../Track/Track";
import { tracks } from "../../data/tracks";

export default function TrackList() {
  return (
    <div className={styles["centerblock__content"]}>
      <div className={styles["content__title"]}>
        <div className={cn(styles["playlistTitle__col"], styles["col01"])}>
          Трек
        </div>
        <div className={cn(styles["playlistTitle__col"], styles["col02"])}>
          Исполнитель
        </div>
        <div className={cn(styles["playlistTitle__col"], styles["col03"])}>
          Альбом
        </div>
        <div className={cn(styles["playlistTitle__col"], styles["col04"])}>
          <svg className={styles["playlistTitle__svg"]}>
            <use xlinkHref="/img/icon/sprite.svg#icon-watch"></use>
          </svg>
        </div>
      </div>
      <div className={styles["content__playlist"]}>
        {tracks.map((track) => (
          <Track key={track.id} {...track} />
        ))}
      </div>
    </div>
  );
}
