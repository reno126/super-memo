<div align="center">

# Super Memo

### A small, responsive memory game built with React, TypeScript, and Redux Toolkit.

[**Play the live demo**](https://reno126.github.io/super-memo/)

Match all eight pairs, keep an eye on your move count, and try to beat your time. The board works with mouse, keyboard, and touch input.

> 🧪 **Why this project?** Super Memo is a demo app for exploring the advantages of **Redux Toolkit**: keeping game state in one place, expressing updates as clear actions, and making state transitions straightforward to test. The game UI stays intentionally small so the state-management approach is easy to follow.

</div>

---

## 🎮 Features

- **Sixteen shuffled cards** arranged as eight matching pairs.
- **Move counter and timer** update as you play.
- **Match feedback** reveals cards briefly before hiding a non-matching pair.
- **Quick restart** starts a fresh, shuffled game.
- **Completion dialog** shows your final time and number of moves.
- **Responsive layout** keeps the board usable on phones, tablets, and desktops.
- **Accessible controls** use native buttons, focus styles, and descriptive card labels.

## 🧰 Built with

| Tool | Role |
| --- | --- |
| React 18 | Component-based user interface |
| TypeScript | Typed game data and component props |
| Redux Toolkit + React Redux | Centralized game state and actions |
| Tailwind CSS | Responsive utility styling |
| Jest + React Testing Library | State, hook, and component tests |

## 🚀 Run locally

You’ll need Node.js and [pnpm](https://pnpm.io/installation).

```bash
git clone https://github.com/reno126/super-memo.git
cd super-memo
pnpm install
pnpm start
```

The development server prints its local URL when it starts.

## 📋 Useful commands

| Command | Description |
| --- | --- |
| `pnpm start` | Start the local development server |
| `pnpm test` | Run the test suite in watch mode |
| `pnpm test --watchAll=false` | Run the test suite once |
| `pnpm run build` | Create a production build in `build/` |
| `pnpm run lint` | Run ESLint on the source files |
| `pnpm run prettier` | Check formatting for configured source files |
| `pnpm run deploy` | Build and publish the app to GitHub Pages |

## 🗂️ Project structure

```text
src/
├── components/       # Game board, cards, score, and dialogs
├── data/             # Initial card set
├── hooks/            # Game timer and interaction orchestration
├── store/            # Redux store, typed hooks, and game slice
├── tests/            # Unit and component tests
├── types/            # Shared game types
└── utils/            # Formatting and test helpers
```

The Redux slice owns the game state and transitions. The `useGameLogic` hook connects those actions to the timer and card interactions, while the UI components render the current state.

## 🧠 What this demo explores

This project is a compact example of separating game state from presentation. It demonstrates Redux Toolkit reducers, typed React components, a custom hook for coordinating timed interactions, and behavior-focused component tests.

## 📄 License

The project is described as MIT-licensed. See the repository’s license file for the terms.
