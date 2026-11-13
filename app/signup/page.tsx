"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./signup.module.css";
import classNames from "classnames";
import Link from "next/link";
import Image from "next/image";
import { registerUser } from "../../services/auth";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim() || !repeatPassword.trim()) {
      setError("Заполните все поля");
      return;
    }
    if (password !== repeatPassword) {
      setError("Пароли не совпадают");
      return;
    }

    setIsLoading(true);
    try {
      await registerUser(email.trim(), password);
      router.push("/signin");
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
            <input
              className={styles.modal__input}
              type="password"
              name="repeatPassword"
              placeholder="Повторите пароль"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
            />
            <div className={styles.errorContainer}>{error}</div>
            <button
              className={styles.modal__btnSignupEnt}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Регистрация..." : "Зарегистрироваться"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
