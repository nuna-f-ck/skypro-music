import styles from "./CenterBlock.module.css";
import Search from "../Search/Search";
import Filter from "../Filter/Filter";
import TrackList from "../TrackList/TrackList";

export default function CenterBlock() {
  return (
    <div className={styles["centerblock"]}>
      <Search />
      <h2 className={styles["centerblock__h2"]}>Треки</h2>
      <Filter />
      <TrackList />
    </div>
  );
}
