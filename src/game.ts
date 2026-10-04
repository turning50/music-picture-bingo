import { categoryIds, getSong, songs, type Category } from "./catalog";
export type Mode = "together" | "pass";
export type Phase = "listen" | "handoff" | "choose" | "reveal" | "finished";
export interface Player {
  name: string;
  board: Category[];
  marked: Category[];
}
export interface Game {
  version: 1;
  mode: Mode;
  players: Player[];
  phase: Phase;
  round: number;
  deck: Category[];
  songId: string;
  bags: Record<Category, string[]>;
  activePlayer: number;
  answers: (Category | null)[];
  winners: number[];
  skipped: number;
}
export const STORAGE_KEY = "music-picture-bingo:v1";
export const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
export function shuffle<T>(items: readonly T[], random = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function bingoLines(player: Player): number[][] {
  return lines.filter((line) =>
    line.every((i) => player.marked.includes(player.board[i])),
  );
}
function draw(g: Game): Game {
  const deck = g.deck.length ? [...g.deck] : shuffle(categoryIds);
  const category = deck.shift()!;
  const bags = { ...g.bags };
  let bag = [...(bags[category] || [])];
  if (!bag.length)
    bag = shuffle(
      songs.filter((s) => s.category === category).map((s) => s.id),
    );
  const songId = bag.shift()!;
  bags[category] = bag;
  return {
    ...g,
    deck,
    bags,
    songId,
    phase: "listen",
    activePlayer: 0,
    answers: g.players.map(() => null),
    winners: [],
  };
}
export function createGame(mode: Mode, names: string[]): Game {
  const playerNames = mode === "together" ? ["Our team"] : names.slice(0, 4);
  if (mode === "pass" && (playerNames.length < 2 || playerNames.length > 4))
    throw new Error("Choose 2 to 4 players");
  const players = playerNames.map((name, i) => ({
    name: name.trim().slice(0, 24) || `Player ${i + 1}`,
    board: shuffle(categoryIds),
    marked: [] as Category[],
  }));
  // Avoid identical cards in a shared-device match.
  for (let i = 1; i < players.length; i++) {
    while (
      players
        .slice(0, i)
        .some((p) => p.board.join() === players[i].board.join())
    )
      players[i].board.push(players[i].board.shift()!);
  }
  return draw({
    version: 1,
    mode,
    players,
    phase: "listen",
    round: 1,
    deck: [],
    songId: "",
    bags: Object.fromEntries(
      categoryIds.map((c) => [c, [] as string[]]),
    ) as Game["bags"],
    activePlayer: 0,
    answers: [],
    winners: [],
    skipped: 0,
  });
}
export function startAnswers(g: Game): Game {
  return g.phase === "listen"
    ? { ...g, phase: g.mode === "pass" ? "handoff" : "choose" }
    : g;
}
export function ready(g: Game): Game {
  return g.phase === "handoff" ? { ...g, phase: "choose" } : g;
}
export function answer(g: Game, category: Category): Game {
  if (g.phase !== "choose" || !categoryIds.includes(category)) return g;
  const answers = [...g.answers];
  answers[g.activePlayer] = category;
  if (g.activePlayer < g.players.length - 1)
    return {
      ...g,
      answers,
      activePlayer: g.activePlayer + 1,
      phase: "handoff",
    };
  const correct = getSong(g.songId).category;
  const players = g.players.map((p, i) => ({
    ...p,
    marked:
      answers[i] === correct && !p.marked.includes(correct)
        ? [...p.marked, correct]
        : [...p.marked],
  }));
  const winners = players.flatMap((p, i) => (bingoLines(p).length ? [i] : []));
  return { ...g, players, answers, winners, phase: "reveal" };
}
export function nextRound(g: Game): Game {
  if (g.phase !== "reveal") return g;
  return g.winners.length
    ? { ...g, phase: "finished" }
    : draw({ ...g, round: g.round + 1 });
}
export function skipSong(g: Game): Game {
  return g.phase === "listen"
    ? draw({ ...g, round: g.round + 1, skipped: g.skipped + 1 })
    : g;
}
export function restoreGame(raw: string | null): Game | null {
  try {
    if (!raw) return null;
    const g = JSON.parse(raw) as Game;
    if (
      g.version !== 1 ||
      !["together", "pass"].includes(g.mode) ||
      !["listen", "handoff", "choose", "reveal", "finished"].includes(
        g.phase,
      ) ||
      !Number.isInteger(g.round) ||
      g.round < 1
    )
      return null;
    if (
      !Array.isArray(g.players) ||
      g.players.length < (g.mode === "pass" ? 2 : 1) ||
      g.players.length > (g.mode === "pass" ? 4 : 1)
    )
      return null;
    if (
      !g.players.every(
        (p) =>
          typeof p.name === "string" &&
          p.name.length <= 24 &&
          Array.isArray(p.board) &&
          p.board.length === 9 &&
          new Set(p.board).size === 9 &&
          p.board.every((c) => categoryIds.includes(c)) &&
          Array.isArray(p.marked) &&
          new Set(p.marked).size === p.marked.length &&
          p.marked.every((c) => categoryIds.includes(c)),
      )
    )
      return null;
    if (
      !Array.isArray(g.deck) ||
      new Set(g.deck).size !== g.deck.length ||
      g.deck.some((c) => !categoryIds.includes(c))
    )
      return null;
    getSong(g.songId);
    if (
      !g.bags ||
      categoryIds.some(
        (c) =>
          !Array.isArray(g.bags[c]) ||
          new Set(g.bags[c]).size !== g.bags[c].length ||
          g.bags[c].some((id) => getSong(id).category !== c),
      )
    )
      return null;
    if (
      !Number.isInteger(g.activePlayer) ||
      g.activePlayer < 0 ||
      g.activePlayer >= g.players.length
    )
      return null;
    if (
      !Array.isArray(g.answers) ||
      g.answers.length !== g.players.length ||
      g.answers.some((a) => a !== null && !categoryIds.includes(a))
    )
      return null;
    if (
      !Array.isArray(g.winners) ||
      new Set(g.winners).size !== g.winners.length ||
      g.winners.some(
        (i) => !Number.isInteger(i) || i < 0 || i >= g.players.length,
      )
    )
      return null;
    if (
      (g.phase === "reveal" || g.phase === "finished") &&
      g.answers.some((a) => a === null)
    )
      return null;
    if (!Number.isInteger(g.skipped) || g.skipped < 0) return null;
    return g;
  } catch {
    return null;
  }
}
