"use client";

import { MouseEvent, useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./NavMenu.module.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/features/authSlice";
import { clearAuth } from "../../services/auth";

export default function NavMenu() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector((state) => state.auth.isAuth);

  const toggleMenu = (): void => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = useCallback(
    (e: MouseEvent<HTMLAnchorElement>): void => {
      e.preventDefault();

      clearAuth();
      dispatch(logout());
      setIsOpen(false);

      // с страницы избранного уходим на главную
      if (pathname.startsWith("/music/favorites")) {
        router.push("/music/main");
      }
    },
    [dispatch, pathname, router],
  );

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
              <Link href="/music/main" className={styles["menu__link"]}>
                Главное
              </Link>
            </li>
            {isAuth && (
              <li className={styles["menu__item"]}>
                <Link href="/music/favorites" className={styles["menu__link"]}>
                  Мой плейлист
                </Link>
              </li>
            )}
            <li className={styles["menu__item"]}>
              {isAuth ? (
                <Link
                  href="/signin"
                  className={styles["menu__link"]}
                  onClick={handleLogout}
                >
                  Выйти
                </Link>
              ) : (
                <Link href="/signin" className={styles["menu__link"]}>
                  Войти
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
