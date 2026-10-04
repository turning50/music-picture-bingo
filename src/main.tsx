import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { QRCodeSVG } from "qrcode.react";
import { categories, getSong, type Category } from "./catalog";
import {
  answer,
  bingoLines,
  createGame,
  nextRound,
  ready,
  restoreGame,
  skipSong,
  startAnswers,
  STORAGE_KEY,
  type Game,
  type Mode,
} from "./game";
import { Picture } from "./art";
import "./style.css";
function readSaved() {
  try {
    return restoreGame(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}
function App() {
  const [saved, setSaved] = useState<Game | null>(readSaved);
  const [game, setGame] = useState<Game | null>(null);
  const [mode, setMode] = useState<Mode>("together");
  const [count, setCount] = useState(2);
  const [names, setNames] = useState(["", "", "", ""]);
  const [selected, setSelected] = useState<Category | null>(null);
  const [qr, setQr] = useState(false);
  const [help, setHelp] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [showBoards, setShowBoards] = useState(false);
  const focusRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (game) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
        setSaved(game);
        setStorageError(false);
      } catch {
        setStorageError(true);
      }
    }
  }, [game]);
  useEffect(() => {
    setSelected(null);
    setQr(false);
    setShowBoards(false);
    focusRef.current?.focus();
  }, [game?.phase, game?.round, game?.activePlayer]);
  function start() {
    setGame(createGame(mode, names.slice(0, count)));
    setConfirm(false);
  }
  function requestStart() {
    if (saved && saved.phase !== "finished") setConfirm(true);
    else start();
  }
  const current = game ? getSong(game.songId) : null;
  const player = game?.players[game.activePlayer];
  const cat = categories.find((c) => c.id === current?.category);
  const winningNames = game?.winners
    .map((i) => game.players[i].name)
    .join(" & ");
  function board(index: number, interactive = false) {
    const p = game!.players[index];
    const won = new Set(bingoLines(p).flat());
    return (
      <div className="board" aria-label={`${p.name}'s bingo card`}>
        {p.board.map((id, i) => {
          const c = categories.find((c) => c.id === id)!;
          const marked = p.marked.includes(id);
          return (
            <button
              key={id}
              type="button"
              className={`tile ${marked ? "marked" : ""} ${selected === id && interactive ? "selected" : ""} ${won.has(i) ? "winning" : ""}`}
              style={{ "--tile-color": c.color } as React.CSSProperties}
              disabled={!interactive}
              aria-label={`${c.label}${marked ? ", marked" : ""}`}
              aria-pressed={interactive ? selected === id : undefined}
              onClick={() => setSelected(id)}
            >
              <Picture kind={id} />
              <span className="tile-label">{c.label}</span>
              {marked && (
                <span className="stamp" aria-label="Marked">
                  ✓
                </span>
              )}
              {selected === id && interactive && (
                <span className="selection">●</span>
              )}
            </button>
          );
        })}
      </div>
    );
  }
  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          className="brand"
          onClick={() => setGame(null)}
          aria-label="Go to home"
        >
          <Picture kind="paw" />
          <span>
            Music Picture
            <br />
            <strong>Bingo</strong>
          </span>
        </button>
        <button
          className="icon-button"
          aria-label="How to play"
          onClick={() => setHelp(true)}
        >
          ?
        </button>
      </header>
      {storageError && (
        <p className="notice" role="alert">
          This browser cannot save your game. Keep this tab open while playing.
        </p>
      )}
      <main>
        {!game ? (
          <>
            <section className="welcome">
              <div className="hero-cat">
                <Picture kind="cat" />
                <span className="note n1">♪</span>
                <span className="note n2">♫</span>
                <span className="sparkle">✦</span>
              </div>
              <div className="eyebrow">LITTLE EARS. BIG DISCOVERIES.</div>
              <h1>
                Listen. Find.
                <br />
                <em>Bingo!</em>
              </h1>
              <p>
                Match Finnish songs to pictures.
                <br />A little music, a little teamwork.
              </p>
              <span className="age-pill">Ages 6+ · No timer</span>
            </section>
            <section className="setup">
              <h2>How will you play?</h2>
              <div className="mode-picker">
                <button
                  className={mode === "together" ? "active" : ""}
                  aria-pressed={mode === "together"}
                  onClick={() => setMode("together")}
                >
                  <span>♡</span>
                  <strong>Together</strong>
                  <small>One card, one team</small>
                </button>
                <button
                  className={mode === "pass" ? "active" : ""}
                  aria-pressed={mode === "pass"}
                  onClick={() => setMode("pass")}
                >
                  <span>✿</span>
                  <strong>Pass & Play</strong>
                  <small>2–4 players, one phone</small>
                </button>
              </div>
              {mode === "pass" && (
                <div className="player-setup">
                  <label htmlFor="count">Players</label>
                  <select
                    id="count"
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                  >
                    {[2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n} players
                      </option>
                    ))}
                  </select>
                  <div className="names">
                    {names.slice(0, count).map((n, i) => (
                      <label key={i}>
                        Player {i + 1}
                        <input
                          value={n}
                          maxLength={24}
                          placeholder={`Player ${i + 1}`}
                          onChange={(e) =>
                            setNames(
                              names.map((v, j) =>
                                j === i ? e.target.value : v,
                              ),
                            )
                          }
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}
              {saved && saved.phase !== "finished" && (
                <button
                  className="button secondary"
                  onClick={() => setGame(saved)}
                >
                  Resume game <small>Round {saved.round}</small>
                </button>
              )}
              <button className="button primary" onClick={requestStart}>
                {saved && saved.phase !== "finished"
                  ? "New game"
                  : "Let’s play"}
              </button>
              <p className="setup-note">
                An adult plays the music in Spotify.
                <br />
                Keep the Spotify screen away from players.
              </p>
            </section>
          </>
        ) : (
          <>
            <div className="roundbar">
              <span>
                {game.mode === "together" ? "Together" : "Pass & Play"}
              </span>
              <span>Round {game.round}</span>
            </div>
            {game.phase === "listen" && (
              <section className="listen panel">
                <div className="music-disc">
                  <Picture kind="music" />
                </div>
                <h1 tabIndex={-1} ref={focusRef}>
                  Time to listen
                </h1>
                <p>
                  Adult: play the song in Spotify.
                  <br />
                  Everyone else: ears ready!
                </p>
                <a
                  className="button spotify"
                  href={current!.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ▶ Open Spotify
                </a>
                <button
                  className="button secondary"
                  onClick={() => setQr(true)}
                >
                  ▦ Show QR
                </button>
                <div className="divider" />
                <button
                  className="button primary"
                  onClick={() => setGame(startAnswers(game))}
                >
                  We’ve listened
                </button>
                <button
                  className="text-button"
                  onClick={() => setGame(skipSong(game))}
                >
                  Skip song
                </button>
                <p className="fine-print">
                  Keep the Spotify screen hidden.
                  <br />
                  You start and stop the music yourself.
                </p>
              </section>
            )}
            {game.phase === "handoff" && (
              <section className="handoff panel">
                <Picture kind="paw" className="big-picture" />
                <div className="eyebrow">
                  PLAYER {game.activePlayer + 1} OF {game.players.length}
                </div>
                <h1 tabIndex={-1} ref={focusRef}>
                  Pass to
                  <br />
                  {player!.name}
                </h1>
                <p>
                  Only this player should see the card.
                  <br />
                  Keep your choice a secret.
                </p>
                <button
                  className="button primary"
                  onClick={() => setGame(ready(game))}
                >
                  I’m ready
                </button>
              </section>
            )}
            {game.phase === "choose" && (
              <section className="choose">
                <div className="choose-heading">
                  <h1 tabIndex={-1} ref={focusRef}>
                    {game.mode === "together"
                      ? "Find the picture"
                      : player!.name}
                  </h1>
                  <p>Which picture matches the song?</p>
                </div>
                {board(game.activePlayer, true)}
                <button
                  className="button primary"
                  disabled={!selected}
                  onClick={() => {
                    if (selected) setGame(answer(game, selected));
                  }}
                >
                  Confirm picture
                </button>
                <p className="fine-print">
                  {selected
                    ? `${categories.find((c) => c.id === selected)!.label} selected`
                    : "Tap one picture. Then confirm."}
                </p>
              </section>
            )}
            {game.phase === "reveal" && (
              <section className="reveal panel">
                <div className="answer-art" style={{ background: cat!.color }}>
                  <Picture kind={cat!.id} />
                </div>
                <div className="eyebrow">THE PICTURE IS</div>
                <h1 tabIndex={-1} ref={focusRef}>
                  {cat!.label}
                </h1>
                <p className="song-title" lang="fi">
                  {current!.title}
                </p>
                <p className="artist">{current!.artist}</p>
                <p>{current!.explanation}</p>
                <ul className="results">
                  {game.players.map((p, i) => (
                    <li key={i}>
                      <span>{p.name}</span>
                      <strong>
                        {game.answers[i] === cat!.id
                          ? "✓ Matched!"
                          : "Try the next one"}
                      </strong>
                    </li>
                  ))}
                </ul>
                {game.winners.length > 0 && (
                  <div className="bingo-alert">
                    ✦ BINGO! ✦<small>{winningNames}</small>
                  </div>
                )}
                <button
                  className="button primary"
                  onClick={() => setGame(nextRound(game))}
                >
                  {game.winners.length ? "Celebrate bingo" : "Next song"}
                </button>
                <button
                  className="text-button"
                  onClick={() => setShowBoards(!showBoards)}
                >
                  {showBoards ? "Hide cards" : "See cards"}
                </button>
                {showBoards &&
                  game.players.map((p, i) => (
                    <div key={i} className="review-card">
                      <h2>{p.name}</h2>
                      {board(i)}
                    </div>
                  ))}
              </section>
            )}
            {game.phase === "finished" && (
              <section className="finished panel">
                <Picture kind="cat" className="big-picture" />
                <div className="eyebrow">THREE IN A ROW!</div>
                <h1 tabIndex={-1} ref={focusRef}>
                  Bingo!
                </h1>
                <h2>{winningNames}</h2>
                <p>
                  {game.winners.length > 1
                    ? "A shared win. High paws all round!"
                    : "High paws! You found your line."}
                </p>
                {game.winners.map((i) => (
                  <div className="review-card" key={i}>
                    {board(i)}
                  </div>
                ))}
                <button
                  className="button primary"
                  onClick={() =>
                    setGame(
                      createGame(
                        game.mode,
                        game.players.map((p) => p.name),
                      ),
                    )
                  }
                >
                  Play again
                </button>
                <button
                  className="button secondary"
                  onClick={() => setGame(null)}
                >
                  Home
                </button>
              </section>
            )}
          </>
        )}
      </main>
      <footer>
        Made for little listeners & their grown-ups <span>♡</span>
      </footer>
      {qr && current && (
        <Modal title="Scan to listen" onClose={() => setQr(false)}>
          <p>
            Adult: scan with a second phone.
            <br />
            Keep Spotify away from players.
          </p>
          <div className="qr-code">
            <QRCodeSVG
              value={current.spotifyUrl}
              size={220}
              marginSize={4}
              title="Spotify song QR code"
            />
          </div>
          <button className="button primary" onClick={() => setQr(false)}>
            Done
          </button>
        </Modal>
      )}
      {help && (
        <Modal title="How to play" onClose={() => setHelp(false)}>
          <ol className="instructions">
            <li>An adult plays a Finnish song in Spotify.</li>
            <li>Listen for the animal or thing in the song.</li>
            <li>Tap its picture, then confirm.</li>
            <li>A match marks your square. Three in a row is bingo!</li>
          </ol>
          <p>
            Rows, columns and diagonals all count. Wrong answers keep your
            earlier marks. There is no timer.
          </p>
          <p>
            In Pass & Play, everyone chooses privately before the answer
            appears. More than one player can win together.
          </p>
          <p>
            Can’t play a song? Use Skip song. That picture will come back in a
            later cycle.
          </p>
          <button className="button primary" onClick={() => setHelp(false)}>
            Got it
          </button>
        </Modal>
      )}
      {confirm && (
        <Modal title="Start a new game?" onClose={() => setConfirm(false)}>
          <p>This replaces your unfinished game.</p>
          <button className="button primary" onClick={start}>
            Start new game
          </button>
          <button
            className="button secondary"
            onClick={() => setConfirm(false)}
          >
            Keep current game
          </button>
        </Modal>
      )}
    </div>
  );
}
function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = dialog.current!;
    const opener = document.activeElement as HTMLElement | null;
    d.showModal();
    return () => {
      d.close();
      queueMicrotask(() => opener?.focus());
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="modal"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-labelledby="modal-title"
    >
      <div className="modal-head">
        <h2 id="modal-title">{title}</h2>
        <button className="icon-button" aria-label="Close" onClick={onClose}>
          ×
        </button>
      </div>
      {children}
    </dialog>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
