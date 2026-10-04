import { test, expect, type Page } from "@playwright/test";
import { PNG } from "pngjs";
import {
  BinaryBitmap,
  HybridBinarizer,
  RGBLuminanceSource,
  QRCodeReader,
} from "@zxing/library";
import { categoryIds, categories, getSong, songs } from "../src/catalog";
import { createGame, STORAGE_KEY, type Game } from "../src/game";
async function saved(page: Page): Promise<Game> {
  return JSON.parse(
    (await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY))!,
  );
}
async function seed(page: Page, g: Game) {
  await page.goto("./");
  await page.evaluate(({ key, data }) => localStorage.setItem(key, data), {
    key: STORAGE_KEY,
    data: JSON.stringify(g),
  });
  await page.reload();
  await page.getByRole("button", { name: /Resume game/ }).click();
}
async function pickCorrect(page: Page) {
  const g = await saved(page);
  const label = categories.find(
    (c) => c.id === getSong(g.songId).category,
  )!.label;
  await page
    .getByRole("button", { name: new RegExp(`^${label}(, marked)?$`) })
    .click();
  await page.getByRole("button", { name: "Confirm picture" }).click();
}
test("Together: secret song, QR decoding, answer, marks, and reload", async ({
  page,
}) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Let’s play" }).click();
  const g = await saved(page);
  const song = getSong(g.songId);
  await expect(
    page.getByRole("heading", { name: "Time to listen" }),
  ).toBeVisible();
  await expect(page.getByText(song.title, { exact: true })).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: /Open Spotify/ }),
  ).toHaveAttribute("href", song.spotifyUrl);
  await page.getByRole("button", { name: /Show QR/ }).click();
  const buffer = await page.locator(".qr-code").screenshot();
  const png = PNG.sync.read(buffer);
  const pixels = new Int32Array(png.width * png.height);
  for (let i = 0; i < pixels.length; i++)
    pixels[i] =
      (png.data[i * 4] << 16) |
      (png.data[i * 4 + 1] << 8) |
      png.data[i * 4 + 2];
  const bitmap = new BinaryBitmap(
    new HybridBinarizer(new RGBLuminanceSource(pixels, png.width, png.height)),
  );
  expect(new QRCodeReader().decode(bitmap).getText()).toBe(song.spotifyUrl);
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await page.getByRole("button", { name: "We’ve listened" }).click();
  await expect(
    page.getByRole("button", { name: "Confirm picture" }),
  ).toBeDisabled();
  await pickCorrect(page);
  await expect(page.getByText(song.title, { exact: true })).toBeVisible();
  expect((await saved(page)).players[0].marked).toContain(song.category);
  await page.reload();
  await page.getByRole("button", { name: /Resume game/ }).click();
  await expect(page.getByText(song.title, { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Next song" }).click();
  expect((await saved(page)).round).toBe(2);
});
for (const count of [2, 3, 4])
  test(`Pass & Play ${count}: private handoffs and simultaneous reveal`, async ({
    page,
  }) => {
    await page.goto("./");
    await page.getByRole("button", { name: /Pass & Play/ }).click();
    await page
      .getByLabel("Players", { exact: true })
      .selectOption(String(count));
    await page.getByRole("button", { name: "Let’s play" }).click();
    const g = await saved(page);
    const song = getSong(g.songId);
    await page.getByRole("button", { name: "We’ve listened" }).click();
    for (let i = 0; i < count; i++) {
      await expect(page.locator(".board")).toHaveCount(0);
      await expect(page.getByText(song.title, { exact: true })).toHaveCount(0);
      await page.getByRole("button", { name: "I’m ready" }).click();
      if (i === 1) {
        await page.reload();
        await page.getByRole("button", { name: /Resume game/ }).click();
      }
      await pickCorrect(page);
      if (i < count - 1)
        expect(
          (await saved(page)).players.every((p) => p.marked.length === 0),
        ).toBe(true);
    }
    await expect(page.getByText(song.title, { exact: true })).toBeVisible();
    expect(
      (await saved(page)).players.every((p) => p.marked.length === 1),
    ).toBe(true);
  });
test("wrong choice, skip, and replace-game confirmation", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Let’s play" }).click();
  await page.getByRole("button", { name: "Skip song" }).click();
  expect((await saved(page)).skipped).toBe(1);
  await page.getByRole("button", { name: "We’ve listened" }).click();
  const g = await saved(page);
  const wrong = categories.find((c) => c.id !== getSong(g.songId).category)!;
  await page.getByRole("button", { name: wrong.label, exact: true }).click();
  await page.getByRole("button", { name: "Confirm picture" }).click();
  expect((await saved(page)).players[0].marked).toEqual([]);
  await page.getByRole("button", { name: "Go to home" }).click();
  await page.getByRole("button", { name: "New game", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Keep current game" }).click();
  await page.getByRole("button", { name: /Resume game/ }).click();
  expect((await saved(page)).round).toBe(2);
});
test("simultaneous bingo celebration and fresh replay", async ({ page }) => {
  const g = createGame("pass", ["Mia", "Leo"]);
  const correct = getSong(g.songId).category;
  for (const p of g.players) {
    p.board = [correct, ...categoryIds.filter((c) => c !== correct)];
    p.marked = p.board.slice(1, 3);
  }
  await seed(page, g);
  await page.getByRole("button", { name: "We’ve listened" }).click();
  for (let i = 0; i < 2; i++) {
    await page.getByRole("button", { name: "I’m ready" }).click();
    await pickCorrect(page);
  }
  await expect(page.locator(".bingo-alert")).toContainText("Mia & Leo");
  await page.getByRole("button", { name: "Celebrate bingo" }).click();
  await expect(
    page.getByRole("heading", { name: "Bingo!", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Play again" }).click();
  expect((await saved(page)).players.every((p) => p.marked.length === 0)).toBe(
    true,
  );
  expect((await saved(page)).round).toBe(1);
});
for (const width of [320, 390, 430])
  test(`mobile ${width}: full grid, no overflow, English UI`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("./");
    await page.screenshot({
      path: `test-results/home-${width}.png`,
      fullPage: true,
    });
    await page.getByRole("button", { name: "Let’s play" }).click();
    await page.getByRole("button", { name: "We’ve listened" }).click();
    await expect(page.locator(".tile")).toHaveCount(9);
    const box = await page.locator(".board").boundingBox();
    expect(box!.y + box!.height).toBeLessThan(844);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/card-${width}.png`,
      fullPage: true,
    });
    const text = await page.locator("body").innerText();
    expect(text).not.toMatch(/Pelaaja|Aloita|kappale|Valitse|Jatka|Yhdessä/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });
test("keyboard help dialog and Escape restore focus", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "How to play" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "How to play" })).toBeFocused();
});
test("marked square remains selectable and does not duplicate", async ({
  page,
}) => {
  const g = createGame("together", []);
  g.players[0].marked = [getSong(g.songId).category];
  await seed(page, g);
  await page.getByRole("button", { name: "We’ve listened" }).click();
  await pickCorrect(page);
  expect((await saved(page)).players[0].marked).toHaveLength(1);
});
test("catalog verification report covers every playable track", async () => {
  const fs = await import("node:fs");
  const report = JSON.parse(
    fs.readFileSync("docs/spotify-verification.json", "utf8"),
  );
  for (const s of songs) {
    const record = report.find((r: { id: string }) => r.id === s.id);
    expect(record?.httpStatus).toBe(200);
    expect(record?.title?.toLowerCase()).toBe(s.title.toLowerCase());
    expect(record?.description).toContain(s.artist);
  }
});
