# 🎲 Scrabble Score Tracker — Pro Edition

A mobile-first, tournament-grade **Scrabble Scorekeeper & Match Tracker** built with **Next.js 14 (App Router)**, **Tailwind CSS**, **Lucide Icons**, and **Canvas Confetti**. Engineered for zero-configuration deployment on **Vercel** with full client-side state persistence.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)
![Deploy on Vercel](https://img.shields.io/badge/Vercel-Ready-000000?logo=vercel)

---

## ✨ Key Features

- **👥 2 to 6 Player Support:** Dynamic player setup with duplicate/blank name validation and color-coded player avatars.
- **🔤 Interactive Tactile Tile Modifiers:** Type any word to render interactive Scrabble tiles in real time. Tap any individual tile to apply official board multipliers:
  - `Normal (1x)` — Standard letter value
  - `Double Letter (DL)` — Letter points × 2
  - `Triple Letter (TL)` — Letter points × 3
  - `Blank Tile (0 pts)` — Wildcard tile worth 0 points
  - `Double Word (DW)` — Entire word score × 2
  - `Triple Word (TW)` — Entire word score × 3
  - `Center Star (★)` — First-turn center tile bonus (Entire word score × 2)
- **➕ Intersecting Words Support:** Add multiple secondary/cross words formed in a single turn, each calculated independently with its own tile modifiers.
- **🔥 Bingo! (+50 pts) Toggle:** One-tap 50-point bonus toggle when a player uses all 7 tiles from their rack.
- **⏪ Deterministic Undo Stack:** Revert the previous turn (or multiple turns) with complete restoration of player scores, round counters, and turn order.
- **🧮 Automated Endgame & Leftover Tile Calculator:** Deducts unplayed tile values from each player's score and automatically awards the sum of all deducted points to the player who went out.
- **🏆 Winner Podium & Match Review:** Multi-stage confetti celebration, ranked final standings with score adjustment breakdowns, full match history modal, and an **"Undo & Resume Game"** safeguard.
- **💾 Automatic LocalStorage Persistence:** Saves match state (`scrabble_game_v1`) and theme preference (`scrabble_theme_v1`) automatically. Prompts users to **Resume Game** or **Start Fresh** upon page reload.
- **🌗 Dark & Light Mode:** Seamless class-based theme switching with system preference detection.

---

## 📐 Official Scoring & Mathematical Order of Operations

### 1. Official Letter Point Values
| Points | Letters |
| :--- | :--- |
| **0 pts** | `Blank / Wildcard` |
| **1 pt** | `A`, `E`, `I`, `O`, `U`, `L`, `N`, `S`, `T`, `R` |
| **2 pts** | `D`, `G` |
| **3 pts** | `B`, `C`, `M`, `P` |
| **4 pts** | `F`, `H`, `V`, `W`, `Y` |
| **5 pts** | `K` |
| **8 pts** | `J`, `X` |
| **10 pts** | `Q`, `Z` |

### 2. Turn Calculation Pipeline
1. **Letter Multipliers First:** Each tile's base value is evaluated (`0` if marked `BLANK`, `base × 2` for `DL`, `base × 3` for `TL`).
2. **Base Word Sum:** All adjusted letter values in the word are summed.
3. **Compound Word Multipliers:** The base word sum is multiplied by `2` for every tile marked `DW` or `★`, and multiplied by `3` for every tile marked `TW` (e.g., hitting two `DW` tiles multiplies the word by $2 \times 2 = 4$).
4. **Multi-Word Aggregation:** The primary word and all intersecting words played on the turn are summed.
5. **Bingo Bonus:** If the **Bingo! (+50 pts)** toggle is active, `50` points are added to the turn total.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14+](https://nextjs.org/) (App Router)
- **UI & Styling:** [Tailwind CSS](https://tailwindcss.com/) (`darkMode: 'class'`)
- **Typography:** `Inter` (UI) & `JetBrains Mono` (Scores & Tiles) via `next/font/google`
- **Icons:** [Lucide React](https://lucide.dev/)
- **Visual Effects:** [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **State Persistence:** Browser `localStorage` with hydration-safe mount guards

---

## 📁 Project Structure

```text
scrabble-score-tracker/
├── app/
│   ├── globals.css          # Tailwind directives & custom scrollbar utilities
│   ├── layout.jsx           # Root layout, Google Fonts, and metadata
│   └── page.jsx             # Complete SPA state machine, scoring engine, and UI screens
├── package.json             # Dependencies and build scripts
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.js       # Custom Scrabble tile theme & shadow tokens
└── README.md                # Project documentation
