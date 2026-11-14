import { request } from "./api";
import { TrackType } from "../data/tracks";

type TrackApiType = {
  _id: number;
  name: string;
  author: string;
  release_date: string;
  genre: string[];
  duration_in_seconds: number;
  album: string;
  logo: string | null;
  track_file: string;
  stared_user: unknown[];
};

type SelectionApiType = {
  _id: number;
  name: string;
  items: (number | TrackApiType)[];
};

type TracksResponse = TrackApiType[] | { data: TrackApiType[] };
type SelectionResponse = SelectionApiType | { data: SelectionApiType };

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

// превращаем ответ API в тип, с которым уже работают Track, Bar и Redux
const mapTrack = (track: TrackApiType): TrackType => ({
  id: track._id,
  title: track.name,
  author: track.author,
  album: track.album,
  time: formatTime(track.duration_in_seconds),
  genre: track.genre,
  release_date: track.release_date,
  track_file: track.track_file,
});

export const getTracks = async (): Promise<TrackType[]> => {
  const json = await request<TracksResponse>("/catalog/track/all/");
  const list = Array.isArray(json) ? json : json.data;
  return list.map(mapTrack);
};

export const getSelection = async (
  id: string,
): Promise<{ name: string; tracks: TrackType[] }> => {
  const json = await request<SelectionResponse>(`/catalog/selection/${id}/`);
  const selection = "data" in json ? json.data : json;
  const first = selection.items[0];

  if (first === undefined) {
    return { name: selection.name, tracks: [] };
  }

  // если в подборке лежат целые объекты треков
  if (typeof first === "object") {
    return {
      name: selection.name,
      tracks: (selection.items as TrackApiType[]).map(mapTrack),
    };
  }

  // если в подборке лежат только id треков
  const ids = selection.items as number[];
  const allTracks = await getTracks();
  return {
    name: selection.name,
    tracks: allTracks.filter((track) => ids.includes(track.id)),
  };
};
