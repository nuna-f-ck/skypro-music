"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./store";
import { logout, setAuth, setReady } from "./features/authSlice";
import { loadFavorites } from "./features/favoritesSlice";
import { AUTH_EXPIRED_EVENT, getRefresh, getUsername } from "../services/auth";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [store] = useState(() => makeStore());

  useEffect(() => {
    // восстанавливаем сессию из LocalStorage
    if (getRefresh()) {
      store.dispatch(setAuth(getUsername()));
      void store.dispatch(loadFavorites());
    } else {
      store.dispatch(setReady());
    }

    // если не удалось обновить токен — выходим из аккаунта
    const handleExpired = () => {
      store.dispatch(logout());
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, handleExpired);

    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpired);
    };
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
