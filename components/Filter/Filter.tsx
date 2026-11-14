"use client";

import { useState } from "react";
import cn from "classnames";
import styles from "./Filter.module.css";
import { TrackType } from "../../data/tracks";

type FilterName = "author" | "year" | "genre";

type FilterConfig = {
  nameFilter: FilterName;
  label: string;
};

type FilterProps = {
  tracks: TrackType[];
};

const FILTERS: FilterConfig[] = [
  { nameFilter: "author", label: "исполнителю" },
  { nameFilter: "year", label: "году выпуска" },
  { nameFilter: "genre", label: "жанру" },
];

const YEAR_OPTIONS: string[] = [
  "По умолчанию",
  "Сначала новые",
  "Сначала старые",
];

// Set оставляет только уникальные значения
const getUniqueValues = (values: string[]): string[] =>
  Array.from(new Set(values));

export default function Filter({ tracks }: FilterProps) {
  const [activeFilter, setActiveFilter] = useState<FilterName | null>(null);

  // данные для фильтров берём из треков, полученных с API
  const filterOptions: Record<FilterName, string[]> = {
    author: getUniqueValues(tracks.map((track) => track.author)),
    genre: getUniqueValues(tracks.flatMap((track) => track.genre)),
    year: YEAR_OPTIONS,
  };

  const handleFilterClick = (nameFilter: FilterName): void => {
    // повторный клик по активной кнопке закрывает окно,
    // клик по другой — закрывает предыдущее и открывает новое
    setActiveFilter((prev) => (prev === nameFilter ? null : nameFilter));
  };

  return (
    <div className={styles["centerblock__filter"]}>
      <div className={styles["filter__title"]}>Искать по:</div>
      {FILTERS.map(({ nameFilter, label }) => (
        <div key={nameFilter} className={styles["filter__item"]}>
          <button
            type="button"
            className={cn(styles["filter__button"], styles["btnText"], {
              [styles["active"]]: activeFilter === nameFilter,
            })}
            onClick={() => handleFilterClick(nameFilter)}
          >
            {label}
          </button>
          {activeFilter === nameFilter && (
            <div className={styles["filter__dropdown"]}>
              <ul className={styles["filter__list"]}>
                {filterOptions[nameFilter].map((option) => (
                  <li key={option} className={styles["filter__option"]}>
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
