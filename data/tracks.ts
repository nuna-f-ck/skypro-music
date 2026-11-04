export type TrackType = {
  id: number;
  title: string;
  subtitle?: string;
  author: string;
  album: string;
  time: string;
  genre: string;
  track_file: string;
};

const BASE = "https://webdev-music-003b5b991590.herokuapp.com/media/music_files/";

export const tracks: TrackType[] = [
  {
    id: 10,
    title: "Sneaky Snitch",
    author: "Kevin Macleod",
    album: "Sneaky Snitch",
    time: "5:05",
    genre: "Классическая музыка",
    track_file: BASE + "Kevin_Macleod_-_Sneaky_Snitch.mp3",
  },
  {
    id: 11,
    title: "Secret Garden",
    author: "Mixkit",
    album: "Secret Garden",
    time: "5:24",
    genre: "Классическая музыка",
    track_file: BASE + "Mixkit_-_Secret_Garden.mp3",
  },
  {
    id: 17,
    title: "Cinematic",
    author: "Winniethemoog",
    album: "Cinematic",
    time: "3:26",
    genre: "Классическая музыка",
    track_file: BASE + "Winniethemoog_-_Cinematic.mp3",
  },
  {
    id: 28,
    title: "Carol Of The Bells",
    author: "Alexander Nakarada",
    album: "Carol Of The Bells",
    time: "3:25",
    genre: "Рок музыка",
    track_file: BASE + "Alexander_Nakarada_-_Carol_Of_The_Bells.mp3",
  },
  {
    id: 29,
    title: "Feel Good Rock",
    author: "Audionautix",
    album: "FAST",
    time: "5:12",
    genre: "Рок музыка",
    track_file: BASE + "Audionautix_-_Feel_Good_Rock.mp3",
  },]
  