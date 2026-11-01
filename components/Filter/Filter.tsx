import cn from "classnames";
import styles from "./Filter.module.css";

export default function Filter() {
  return (
    <div className={styles["centerblock__filter"]}>
      <div className={styles["filter__title"]}>Искать по:</div>
      <div className={cn(styles["filter__button"], styles["btnText"])}>
        исполнителю
      </div>
      <div className={cn(styles["filter__button"], styles["btnText"])}>
        году выпуска
      </div>
      <div className={cn(styles["filter__button"], styles["btnText"])}>
        жанру
      </div>
    </div>
  );
}
