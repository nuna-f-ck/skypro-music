import Image from "next/image";
import Link from "next/link";
import styles from "./Sidebar.module.css";

const playlists = [
  "/img/playlist01.png",
  "/img/playlist02.png",
  "/img/playlist03.png",
];

export default function Sidebar() {
  return (
    <div className={styles["main__sidebar"]}>
      <div className={styles["sidebar__personal"]}>
        <p className={styles["sidebar__personalName"]}>Sergey.Ivanov</p>
        <div className={styles["sidebar__icon"]}>
          <svg>
            <use xlinkHref="/img/icon/sprite.svg#logout"></use>
          </svg>
        </div>
      </div>
      <div className={styles["sidebar__block"]}>
        <div className={styles["sidebar__list"]}>
          {playlists.map((src) => (
            <div className={styles["sidebar__item"]} key={src}>
              {/* Добавили style={{ position: "relative" }} прямо сюда, чтобы Next.js никогда не ругался */}
              <Link
                className={styles["sidebar__link"]}
                href="#"
                style={{ position: "relative" }}
              >
                <Image
                  className={styles["sidebar__img"]}
                  src={src}
                  alt="day's playlist"
                  fill
                  sizes="250px"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
