"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./NavMenu.module.css";

export default function NavMenu() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleMenu = (): void => {
    setIsOpen((prev) => !prev);
  };

  return (
    <nav className={styles["main__nav"]}>
      <div className={styles["nav__logo"]}>
        <Image
          src="/img/logo.png"
          alt="Logo"
          width={113}
          height={17}
          className={styles["logo__image"]}
          priority
        />
      </div>
      <button
        type="button"
        className={styles["nav__burger"]}
        onClick={toggleMenu}
        aria-label="Открыть или закрыть меню"
        aria-expanded={isOpen}
      >
        <span className={styles["burger__line"]}></span>
        <span className={styles["burger__line"]}></span>
        <span className={styles["burger__line"]}></span>
      </button>
      {isOpen && (
        <div className={styles["nav__menu"]}>
          <ul className={styles["menu__list"]}>
            <li className={styles["menu__item"]}>
              <Link href="#" className={styles["menu__link"]}>
                Главное
              </Link>
            </li>
            <li className={styles["menu__item"]}>
              <Link href="#" className={styles["menu__link"]}>
                Мой плейлист
              </Link>
            </li>
            <li className={styles["menu__item"]}>
              <Link href="/signin" className={styles["menu__link"]}>
                Войти
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
