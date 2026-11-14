"use client";

import { useEffect } from "react";
import styles from "./ErrorToast.module.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearError } from "../../store/features/favoritesSlice";

export default function ErrorToast() {
  const dispatch = useAppDispatch();
  const error = useAppSelector((state) => state.favorites.error);

  // сообщение пропадает само через 4 секунды
  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => dispatch(clearError()), 4000);
    return () => clearTimeout(timer);
  }, [error, dispatch]);

  if (!error) return null;

  return (
    <div
      className={styles["toast"]}
      role="alert"
      onClick={() => dispatch(clearError())}
    >
      {error}
    </div>
  );
}
