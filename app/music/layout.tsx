import styles from "../page.module.css";
import NavMenu from "../../components/NavMenu/NavMenu";
import Sidebar from "../../components/Sidebar/Sidebar";
import Bar from "../../components/Bar/Bar";

export default function MusicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <NavMenu />
          {children}
          <Sidebar />
        </main>
        <Bar />
      </div>
    </div>
  );
}
