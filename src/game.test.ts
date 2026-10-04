import { describe, expect, it } from "vitest";
import {
  categories,
  categoryIds,
  getSong,
  songs,
  type Category,
} from "./catalog";
import {
  answer,
  bingoLines,
  createGame,
  lines,
  nextRound,
  ready,
  restoreGame,
  shuffle,
  skipSong,
  startAnswers,
  type Game,
} from "./game";
const choose = (g: Game, c: Category) => answer(ready(startAnswers(g)), c);
const reveal = (g: Game, correct = true) => {
  let s = startAnswers(g);
  for (let i = 0; i < s.players.length; i++) {
    s = ready(s);
    s = answer(
      s,
      correct
        ? getSong(s.songId).category
        : categoryIds.find((c) => c !== getSong(s.songId).category)!,
    );
  }
  return s;
};
describe("bingo lines", () => {
  for (const [i, line] of lines.entries())
    it(`recognises line ${i + 1}`, () => {
      const p = {
        name: "A",
        board: [...categoryIds],
        marked: line.map((j) => categoryIds[j]),
      };
      expect(bingoLines(p)).toContainEqual(line);
      p.marked.pop();
      expect(bingoLines(p)).toHaveLength(0);
    });
  it("does not mistake scattered squares for a line", () =>
    expect(
      bingoLines({
        name: "A",
        board: categoryIds,
        marked: [categoryIds[0], categoryIds[1], categoryIds[5]],
      }),
    ).toEqual([]));
});
describe("rounds and privacy", () => {
  it("Together earns one square for a correct answer", () => {
    const g = createGame("together", []);
    const r = choose(g, getSong(g.songId).category);
    expect(r.phase).toBe("reveal");
    expect(r.players[0].marked).toEqual([getSong(g.songId).category]);
  });
  it("wrong answers preserve old marks without awarding the correct square", () => {
    let g = createGame("together", []);
    g.players[0].marked = ["cat"];
    const c = categoryIds.find((c) => c !== getSong(g.songId).category)!;
    const r = choose(g, c);
    expect(r.players[0].marked).toEqual(["cat"]);
  });
  it("a marked square can be selected without earning it twice", () => {
    const g = createGame("together", []);
    const c = getSong(g.songId).category;
    g.players[0].marked = [c];
    expect(choose(g, c).players[0].marked).toEqual([c]);
  });
  for (const count of [2, 3, 4])
    it(`keeps answers unscored until all ${count} players answer`, () => {
      let g = createGame(
        "pass",
        Array.from({ length: count }, (_, i) => `Player ${i + 1}`),
      );
      g = startAnswers(g);
      expect(g.phase).toBe("handoff");
      for (let i = 0; i < count; i++) {
        g = ready(g);
        g = answer(g, getSong(g.songId).category);
        if (i < count - 1) {
          expect(g.phase).toBe("handoff");
          expect(g.players.every((p) => p.marked.length === 0)).toBe(true);
        } else expect(g.phase).toBe("reveal");
      }
    });
  it("recognises simultaneous winners after reveal", () => {
    let g = createGame("pass", ["A", "B"]);
    const c = getSong(g.songId).category;
    for (const p of g.players) {
      p.board = [c, ...categoryIds.filter((x) => x !== c)];
      p.marked = p.board.slice(1, 3);
    }
    g = reveal(g);
    expect(g.winners).toEqual([0, 1]);
    expect(g.phase).toBe("reveal");
    expect(nextRound(g).phase).toBe("finished");
  });
  it("ignores duplicate clicks and invalid phase actions", () => {
    const g = createGame("pass", ["A", "B"]);
    expect(answer(g, "cat")).toBe(g);
    expect(nextRound(g)).toBe(g);
    let h = answer(ready(startAnswers(g)), "cat");
    expect(answer(h, "fish")).toBe(h);
    expect(skipSong(h)).toBe(h);
  });
});
describe("randomisation", () => {
  it("Fisher-Yates uses each input exactly once", () => {
    expect(shuffle([1, 2, 3, 4], () => 0)).toEqual([2, 3, 4, 1]);
  });
  it("cards are permutations and players receive distinct cards", () => {
    for (let k = 0; k < 30; k++) {
      const g = createGame("pass", ["A", "B", "C", "D"]);
      for (const p of g.players)
        expect([...p.board].sort()).toEqual([...categoryIds].sort());
      expect(new Set(g.players.map((p) => p.board.join())).size).toBe(4);
    }
  });
  it("each cycle contains every category, even with skips", () => {
    let g = createGame("together", []);
    for (let cycle = 0; cycle < 10; cycle++) {
      const seen = [];
      for (let i = 0; i < 9; i++) {
        seen.push(getSong(g.songId).category);
        g = skipSong(g);
      }
      expect([...seen].sort()).toEqual([...categoryIds].sort());
    }
    expect(g.players[0].marked).toEqual([]);
  });
  it("uses every recording in a category before repeating one", () => {
    let g = createGame("together", []);
    const found = new Map<Category, string[]>();
    for (let i = 0; i < 27; i++) {
      const song = getSong(g.songId);
      found.set(song.category, [...(found.get(song.category) || []), song.id]);
      g = skipSong(g);
    }
    for (const c of categoryIds) {
      const first = (found.get(c) || []).slice(
        0,
        songs.filter((s) => s.category === c).length,
      );
      expect(new Set(first).size).toBe(first.length);
    }
  });
  it("continues after nine incorrect rounds and preserves marks", () => {
    let g = createGame("together", []);
    g.players[0].marked = ["cat"];
    for (let i = 0; i < 9; i++) g = nextRound(reveal(g, false));
    expect(g.round).toBe(10);
    expect(g.players[0].marked).toEqual(["cat"]);
  });
});
describe("storage and catalog", () => {
  it("round-trips every game phase", () => {
    let g = createGame("pass", ["A", "B"]);
    for (const state of [g, startAnswers(g), ready(startAnswers(g)), reveal(g)])
      expect(restoreGame(JSON.stringify(state))).toEqual(state);
  });
  it("rejects invalid, obsolete and tampered saved data", () => {
    for (const raw of [null, "bad", "{}", '{"version":99}'])
      expect(restoreGame(raw)).toBeNull();
    const g = createGame("together", []);
    g.players[0].board[0] = "invalid" as Category;
    expect(restoreGame(JSON.stringify(g))).toBeNull();
  });
  it("has at least two metadata-verified recordings per category and valid unique URLs", () => {
    expect(categories).toHaveLength(9);
    for (const c of categoryIds)
      expect(
        songs.filter((s) => s.category === c).length,
      ).toBeGreaterThanOrEqual(2);
    expect(new Set(songs.map((s) => s.id)).size).toBe(songs.length);
    for (const s of songs) {
      expect(s.spotifyUrl).toMatch(
        /^https:\/\/open\.spotify\.com\/track\/[A-Za-z0-9]{22}$/,
      );
      expect(s.language).toBe("fi");
      expect(s.source).toBe(s.spotifyUrl);
      expect(s.explanation.length).toBeGreaterThan(10);
    }
  });
});
