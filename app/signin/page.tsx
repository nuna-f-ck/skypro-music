"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./signin.module.css";
import classNames from "classnames";
import Link from "next/link";
import Image from "next/image";
import { getTokens, loginUser, saveAuth } from "../../services/auth";
import { useAppDispatch } from "../../store/hooks";
import { setAuth } from "../../store/features/authSlice";
import { loadFavorites } from "../../store/features/favoritesSlice";

export default function SignIn() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Заполните все поля");
      return;
    }

    setIsLoading(true);
    try {
      const user = await loginUser(email.trim(), password);
      const tokens = await getTokens(email.trim(), password);
      saveAuth(user, tokens);
      dispatch(setAuth(user.username));
      void dispatch(loadFavorites());
      router.push("/music/main");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Что-то пошло не так");
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.containerEnter}>
        <div className={styles.modal__block}>
          <form className={styles.modal__form} onSubmit={handleSubmit}>
            <Link href="/music/main">
              <div className={styles.modal__logo}>
                <Image
                  src="/img/logo_modal.png"
                  alt="logo"
                  width={140}
                  height={21}
                  priority
                />
              </div>
            </Link>
            <input
              className={classNames(styles.modal__input, styles.login)}
              type="text"
              name="login"
              placeholder="Почта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className={styles.modal__input}
              type="password"
              name="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className={styles.errorContainer}>{error}</div>
            <button
              className={styles.modal__btnEnter}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Вход..." : "Войти"}
            </button>
            <button
              className={styles.modal__btnSignup}
              type="button"
              onClick={() => router.push("/signup")}
            >
              Зарегистрироваться
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
