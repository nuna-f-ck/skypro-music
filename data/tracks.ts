export type TrackType = {
  id: number;
  title: string;
  subtitle?: string;
  author: string;
  album: string;
  time: string;
};

export const tracks: TrackType[] = [
  {
    id: 1,
    title: "Guilt",
    author: "Nero",
    album: "Welcome Reality",
    time: "4:44",
  },
  {
    id: 2,
    title: "Elektro",
    author: "Dynoro, Outwork, Mr. Gee",
    album: "Elektro",
    time: "2:22",
  },
  {
    id: 3,
    title: "I’m Fire",
    author: "Ali Bakgor",
    album: "I’m Fire",
    time: "2:22",
  },
  {
    id: 4,
    title: "Non Stop",
    subtitle: "(Remix)",
    author: "Стоункат, Psychopath",
    album: "Non Stop",
    time: "4:12",
  },
  {
    id: 5,
    title: "Run Run",
    subtitle: "(feat. AR/CO)",
    author: "Jaded, Will Clarke, AR/CO",
    album: "Run Run",
    time: "2:54",
  },
];
