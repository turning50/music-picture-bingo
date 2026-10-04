export const categories = [
  { id: "cat", label: "Cat", color: "#ffe1ed" },
  { id: "train", label: "Train", color: "#d8edf9" },
  { id: "star", label: "Star", color: "#fff0bb" },
  { id: "rabbit", label: "Rabbit", color: "#e8dfff" },
  { id: "duck", label: "Duck", color: "#fff0d1" },
  { id: "fish", label: "Fish", color: "#d1f1f0" },
  { id: "elephant", label: "Elephant", color: "#dce8fd" },
  { id: "bear", label: "Bear", color: "#f5e2cf" },
  { id: "spider", label: "Spider", color: "#e4efcc" },
] as const;
export type Category = (typeof categories)[number]["id"];
export interface Song {
  id: string;
  title: string;
  artist: string;
  spotifyUrl: string;
  language: "fi";
  category: Category;
  explanation: string;
  source: string;
  checkedAt: string;
  verification: "metadata-verified";
  audioVerified: false;
  finlandPlaybackVerified: false;
}
const rows: [Category, string, string, string][] = [
  ["cat", "04yz77n7GrrxeH29JblfEc", "Vanha kissa", "Anni Tannin Lapsilaulajat"],
  [
    "cat",
    "3Dwvl0n5H9cTSczx7c12XV",
    "Pieni kissanpoikanen",
    "Anni Tannin Lapsilaulajat",
  ],
  [
    "cat",
    "0ttg0ChK2Hixoy7qk3EkVw",
    "Vanha kissa",
    "Ritva Mustonen-Laurilan musiikkileikkikoulun lapset",
  ],
  [
    "train",
    "6LwcapvJTQjR5mCYgsBUdb",
    "Pienen Pieni Veturi",
    "Satu Sopanen & Tuttiorkesteri",
  ],
  [
    "train",
    "42Y7PiSJ7tuCuk64rd6iCv",
    "Pienen pieni veturi",
    "Anni Tannin Lapsilaulajat",
  ],
  ["train", "223I4bmkj1oWq82ejVX1ns", "Pienen pieni veturi", "Kujakissat"],
  [
    "star",
    "3xoRrvPvftgiOpXiAXEg8D",
    "Tuiki, tuiki, tähtönen",
    "Fröbelin Palikat",
  ],
  [
    "star",
    "4ZspZORBqt88xkpc0Qpffa",
    "Tuiki tuiki tähtönen",
    "Suomalaisia Lastenlauluja",
  ],
  ["star", "22YkpZfFcKuLBoszXwFFUj", "Tuiki, Tuiki Tähtönen", "Ti-Ti Nalle"],
  [
    "rabbit",
    "06eujTg4ZxItugm313pehK",
    "Jänis Istui Maassa",
    "Satu Sopanen & Tuttiorkesteri",
  ],
  [
    "rabbit",
    "3nVb0C0anh8smYrCfMW8IT",
    "Jänis istui maassa",
    "Anni Tannin Lapsilaulajat",
  ],
  [
    "rabbit",
    "0yDgfiwowyay3Vz6j9t2UH",
    "Jänis istui maassa",
    "Lapsikuoro Satulaulajat",
  ],
  [
    "duck",
    "4rSYEDaCyLePL1H4pmy9i2",
    "Viisi Pientä Ankkaa",
    "Satu Sopanen & Tuttiorkesteri",
  ],
  [
    "duck",
    "41L11wSaruaDSz9UhTxxsm",
    "Viisi pientä ankkaa",
    "Anni Tannin Lapsilaulajat",
  ],
  [
    "duck",
    "11Qtc7G6eYaqFsxF0DfeFy",
    "Pieni ankanpoikanen",
    "Suomalaisia Lastenlauluja",
  ],
  [
    "fish",
    "6Z59Q1eZWwDcLiAJMLpppe",
    "Pikkuiset Kultakalat",
    "Satu Sopanen & Tuttiorkesteri",
  ],
  [
    "fish",
    "2HzrDqVxLMMZJT3aINzGzf",
    "Pikkuiset kultakalat",
    "Anni Tannin Lapsilaulajat",
  ],
  [
    "fish",
    "4KXlrzhaHfPlMXTMODOsDP",
    "Pikkuiset kultakalat",
    "Fröbelin Palikat",
  ],
  [
    "elephant",
    "4khtDWu4JxiQp13YUqUV9B",
    "Elefanttimarssi",
    "Satu Sopanen & Tuttiorkesteri",
  ],
  [
    "elephant",
    "5ybtniwfgoo5oVuL0nAaQU",
    "Yksi pieni elefantti",
    "Anni Tannin Lapsilaulajat",
  ],
  [
    "elephant",
    "2l8Uf7u912on8BoGQ6VFpc",
    "Elefanttimarssi",
    "Maija Salon musiikkileikkikoulun lapset",
  ],
  ["bear", "3VPIhC2USXX1U1Yu94f6I6", "Karhu nukkuu", "Lapsikuoro"],
  [
    "bear",
    "2l7YIoMUACfFWr9k7lWKWR",
    "Karhu nukkuu",
    "Anni Tannin Lapsilaulajat",
  ],
  [
    "bear",
    "1JWmEGpID3HMQqh4qxjIuB",
    "Karhulapset",
    "Anni Tannin Lapsilaulajat",
  ],
  [
    "spider",
    "1l41EBhUeR3sHasq2XDlSW",
    "Hämä-Hämähäkki",
    "Satu Sopanen & Tuttiorkesteri",
  ],
  [
    "spider",
    "2oNNP1r12CVggCWhtKMk4U",
    "Hämä-hämä-häkki",
    "Anni Tannin Lapsilaulajat",
  ],
  [
    "spider",
    "73WYrBdWi69nTwqhpxyb0J",
    "Hämä-hämähäkki - 1969 versio",
    "Tapio Rautavaara",
  ],
];
const explanation: Record<Category, string> = {
  cat: "The song is about a cat.",
  train: "The song is about a little train.",
  star: "The song is about a twinkling star.",
  rabbit: "The song is about a rabbit sitting on the ground.",
  duck: "The song is about little ducks.",
  fish: "The song is about fish.",
  elephant: "The song is about an elephant.",
  bear: "The song is about bears.",
  spider: "The song is about a little spider.",
};
export const songs: Song[] = rows.map(([category, id, title, artist]) => ({
  id,
  title,
  artist,
  category,
  spotifyUrl: `https://open.spotify.com/track/${id}`,
  language: "fi",
  explanation: explanation[category],
  source: `https://open.spotify.com/track/${id}`,
  checkedAt: "2026-10-04",
  verification: "metadata-verified",
  audioVerified: false,
  finlandPlaybackVerified: false,
}));
export const categoryIds: Category[] = categories.map((c) => c.id);
export function getSong(id: string): Song {
  const song = songs.find((s) => s.id === id);
  if (!song) throw new Error("Unknown song");
  return song;
}
