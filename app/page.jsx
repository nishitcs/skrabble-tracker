'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  Plus,
  Trash2,
  Sun,
  Moon,
  Sparkles,
  CheckCircle2,
  Passover,
  SkipForward,
  Flag,
  History,
  Play,
  RefreshCw,
  AlertCircle,
  X,
  Star,
  Award,
  Users,
  ChevronRight,
  Undo2,
  Crown,
  BookOpen,
  ArrowLeft,
} from 'lucide-react';

// ============================================================================
// CONSTANTS & OFFICIAL SCRABBLE SPECIFICATIONS
// ============================================================================

const STORAGE_KEY = 'scrabble_game_v1';
const THEME_KEY = 'scrabble_theme_v1';

const SCRABBLE_LETTER_VALUES = {
  A: 1,
  B: 3,
  C: 3,
  D: 2,
  E: 1,
  F: 4,
  G: 2,
  H: 4,
  I: 1,
  J: 8,
  K: 5,
  L: 1,
  M: 3,
  N: 1,
  O: 1,
  P: 3,
  Q: 10,
  R: 1,
  S: 1,
  T: 1,
  U: 1,
  V: 4,
  W: 4,
  X: 8,
  Y: 4,
  Z: 10,
};

const PLAYER_COLORS = [
  {
    id: 'emerald',
    name: 'Emerald',
    bg: 'bg-emerald-600',
    lightBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    ring: 'ring-emerald-500',
    border: 'border-emerald-500',
  },
  {
    id: 'indigo',
    name: 'Indigo',
    bg: 'bg-indigo-600',
    lightBg: 'bg-indigo-50 dark:bg-indigo-950/40',
    text: 'text-indigo-700 dark:text-indigo-300',
    ring: 'ring-indigo-500',
    border: 'border-indigo-500',
  },
  {
    id: 'rose',
    name: 'Rose',
    bg: 'bg-rose-600',
    lightBg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-700 dark:text-rose-300',
    ring: 'ring-rose-500',
    border: 'border-rose-500',
  },
  {
    id: 'amber',
    name: 'Amber',
    bg: 'bg-amber-600',
    lightBg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    ring: 'ring-amber-500',
    border: 'border-amber-500',
  },
  {
    id: 'cyan',
    name: 'Cyan',
    bg: 'bg-cyan-600',
    lightBg: 'bg-cyan-50 dark:bg-cyan-950/40',
    text: 'text-cyan-700 dark:text-cyan-300',
    ring: 'ring-cyan-500',
    border: 'border-cyan-500',
  },
  {
    id: 'purple',
    name: 'Purple',
    bg: 'bg-purple-600',
    lightBg: 'bg-purple-50 dark:bg-purple-950/40',
    text: 'text-purple-700 dark:text-purple-300',
    ring: 'ring-purple-500',
    border: 'border-purple-500',
  },
];

const TILE_MODIFIERS = {
  NORMAL: {
    key: 'NORMAL',
    label: 'Normal (1x)',
    shortLabel: '1x',
    description: 'Standard tile points',
    badgeClass:
      'bg-amber-900/10 text-amber-950 dark:bg-slate-700 dark:text-slate-300 border-amber-900/20',
    tileBorderClass: 'border-[#E5D3B3] dark:border-amber-800/50',
    buttonClass:
      'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 border-slate-300 dark:border-slate-700',
  },
  DL: {
    key: 'DL',
    label: 'Double Letter (DL)',
    shortLabel: 'DL',
    description: 'Tile points × 2',
    badgeClass: 'bg-cyan-500 text-white border-cyan-600 shadow-sm',
    tileBorderClass: 'border-cyan-500 ring-2 ring-cyan-500/40',
    buttonClass:
      'bg-cyan-50 hover:bg-cyan-100 text-cyan-900 dark:bg-cyan-950/60 dark:hover:bg-cyan-900/70 dark:text-cyan-200 border-cyan-300 dark:border-cyan-700',
  },
  TL: {
    key: 'TL',
    label: 'Triple Letter (TL)',
    shortLabel: 'TL',
    description: 'Tile points × 3',
    badgeClass: 'bg-blue-600 text-white border-blue-700 shadow-sm',
    tileBorderClass: 'border-blue-600 ring-2 ring-blue-600/40',
    buttonClass:
      'bg-blue-50 hover:bg-blue-100 text-blue-900 dark:bg-blue-950/60 dark:hover:bg-blue-900/70 dark:text-blue-200 border-blue-300 dark:border-blue-700',
  },
  BLANK: {
    key: 'BLANK',
    label: 'Blank Tile (0 pts)',
    shortLabel: '0 PT',
    description: 'Tile points set to 0',
    badgeClass: 'bg-slate-500 text-white border-slate-600 shadow-sm',
    tileBorderClass: 'border-slate-400 ring-2 ring-slate-400/40 opacity-85',
    buttonClass:
      'bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 border-slate-400 dark:border-slate-600',
  },
  DW: {
    key: 'DW',
    label: 'Double Word (DW)',
    shortLabel: 'DW',
    description: 'Whole word points × 2',
    badgeClass: 'bg-rose-500 text-white border-rose-600 shadow-sm',
    tileBorderClass: 'border-rose-500 ring-2 ring-rose-500/40',
    buttonClass:
      'bg-rose-50 hover:bg-rose-100 text-rose-900 dark:bg-rose-950/60 dark:hover:bg-rose-900/70 dark:text-rose-200 border-rose-300 dark:border-rose-700',
  },
  TW: {
    key: 'TW',
    label: 'Triple Word (TW)',
    shortLabel: 'TW',
    description: 'Whole word points × 3',
    badgeClass: 'bg-red-600 text-white border-red-700 shadow-sm',
    tileBorderClass: 'border-red-600 ring-2 ring-red-600/40',
    buttonClass:
      'bg-red-50 hover:bg-red-100 text-red-900 dark:bg-red-950/60 dark:hover:bg-red-900/70 dark:text-red-200 border-red-300 dark:border-red-700',
  },
  STAR: {
    key: 'STAR',
    label: 'Center Star (★)',
    shortLabel: '★ 2x',
    description: 'First-turn bonus (Whole word points × 2)',
    badgeClass: 'bg-amber-500 text-white border-amber-600 shadow-sm',
    tileBorderClass: 'border-amber-500 ring-2 ring-amber-500/40',
    buttonClass:
      'bg-amber-50 hover:bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:hover:bg-amber-900/70 dark:text-amber-200 border-amber-300 dark:border-amber-700',
  },
};

// ============================================================================
// SCORING MATHEMATICAL FUNCTIONS
// ============================================================================

/**
 * Calculates the exact score for a single word entry according to official
 * Scrabble order of operations:
 * 1. Base letter value (0 if BLANK, ×2 if DL, ×3 if TL)
 * 2. Sum all adjusted letter values
 * 3. Multiply word sum by 2 for each DW or STAR tile, and by 3 for each TW tile
 */
function calculateSingleWordScore(tiles = []) {
  if (!tiles || tiles.length === 0) {
    return {
      baseWordScore: 0,
      wordMultiplier: 1,
      totalWordScore: 0,
      letterBreakdown: [],
    };
  }

  let baseWordScore = 0;
  let wordMultiplier = 1;
  const letterBreakdown = [];

  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    const upperChar = (tile.letter || '').toUpperCase();
    const rawBase = SCRABBLE_LETTER_VALUES[upperChar] ?? 0;
    const mod = tile.modifier || 'NORMAL';

    let effectiveLetterScore = rawBase;
    if (mod === 'BLANK') {
      effectiveLetterScore = 0;
    } else if (mod === 'DL') {
      effectiveLetterScore = rawBase * 2;
    } else if (mod === 'TL') {
      effectiveLetterScore = rawBase * 3;
    }

    if (mod === 'DW' || mod === 'STAR') {
      wordMultiplier *= 2;
    } else if (mod === 'TW') {
      wordMultiplier *= 3;
    }

    baseWordScore += effectiveLetterScore;
    letterBreakdown.push({
      letter: upperChar,
      rawBase,
      modifier: mod,
      effectiveLetterScore,
    });
  }

  const totalWordScore = baseWordScore * wordMultiplier;

  return {
    baseWordScore,
    wordMultiplier,
    totalWordScore,
    letterBreakdown,
  };
}

/**
 * Calculates the total score for a complete turn across primary and intersecting words,
 * plus the +50 pt Bingo bonus if enabled.
 */
function calculateTurnScore(wordEntries = [], isBingo = false) {
  const validWords = wordEntries.filter((w) => w.tiles && w.tiles.length > 0);
  if (validWords.length === 0) {
    return {
      wordsTotal: 0,
      bingoBonus: isBingo ? 50 : 0,
      netTurnScore: isBingo ? 50 : 0,
      wordDetails: [],
    };
  }

  let wordsTotal = 0;
  const wordDetails = validWords.map((entry) => {
    const calc = calculateSingleWordScore(entry.tiles);
    wordsTotal += calc.totalWordScore;
    return {
      id: entry.id,
      wordText: entry.text,
      tiles: entry.tiles,
      ...calc,
    };
  });

  const bingoBonus = isBingo ? 50 : 0;
  const netTurnScore = wordsTotal + bingoBonus;

  return {
    wordsTotal,
    bingoBonus,
    netTurnScore,
    wordDetails,
  };
}

/**
 * Calculates total point value of leftover unplayed tiles string.
 */
function calculateLeftoverStringPoints(str = '') {
  const cleaned = str.toUpperCase().replace(/[^A-Z]/g, '');
  let sum = 0;
  const tiles = [];
  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];
    const pts = SCRABBLE_LETTER_VALUES[ch] || 0;
    sum += pts;
    tiles.push({ letter: ch, points: pts });
  }
  return { cleaned, sum, tiles };
}

/**
 * Helper to create a fresh empty word input object
 */
function createEmptyWordEntry(idSuffix = '1') {
  return {
    id: `word_${Date.now()}_${idSuffix}`,
    text: '',
    tiles: [],
  };
}

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================

export default function ScrabbleScoreTrackerApp() {
  // Mount guard for zero SSR hydration mismatch on Vercel
  const [isMounted, setIsMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Resume Game Prompt Modal
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [savedGameCache, setSavedGameCache] = useState(null);

  // Screen navigation: 'SETUP' | 'DASHBOARD' | 'PODIUM'
  const [screen, setScreen] = useState('SETUP');

  // Screen 1: Setup State
  const [playerCount, setPlayerCount] = useState(2);
  const [setupNames, setSetupNames] = useState(['Player 1', 'Player 2', '', '', '', '']);
  const [setupError, setSetupError] = useState('');

  // Screen 2: Active Game State
  const [players, setPlayers] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [history, setHistory] = useState([]); // Array of turn logs
  const [undoStack, setUndoStack] = useState([]); // Snapshots for deterministic undo
  const [preEndGameSnapshot, setPreEndGameSnapshot] = useState(null);

  // Turn Input Console State
  const [wordEntries, setWordEntries] = useState([createEmptyWordEntry('primary')]);
  const [isBingo, setIsBingo] = useState(false);
  const [turnError, setTurnError] = useState('');

  // Active Tile Modifier Modal State
  // { wordId: string, tileIndex: number } | null
  const [activeTilePicker, setActiveTilePicker] = useState(null);

  // Screen 3: End Game & Leftovers Modal State
  const [endGameStep, setEndGameStep] = useState(null); // null | 'CONFIRM' | 'LEFTOVERS'
  const [leftoverInputs, setLeftoverInputs] = useState({}); // { [playerId]: string }

  // Screen 4: Winner Podium Full History Modal State
  const [showFullHistoryModal, setShowFullHistoryModal] = useState(false);

  // --------------------------------------------------------------------------
  // INITIALIZATION & LOCALSTORAGE PERSISTENCE
  // --------------------------------------------------------------------------
  useEffect(() => {
    setIsMounted(true);

    // Load persisted theme
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme === 'dark') {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      } else if (savedTheme === 'light') {
        setDarkMode(false);
        document.documentElement.classList.remove('dark');
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      }
    } catch (err) {
      console.error('Failed to read theme from localStorage:', err);
    }

    // Check for saved game in localStorage ('scrabble_game_v1')
    try {
      const rawSaved = localStorage.getItem(STORAGE_KEY);
      if (rawSaved) {
        const parsed = JSON.parse(rawSaved);
        if (
          parsed &&
          Array.isArray(parsed.players) &&
          parsed.players.length >= 2 &&
          (parsed.screen === 'DASHBOARD' || parsed.screen === 'PODIUM')
        ) {
          setSavedGameCache(parsed);
          setShowResumeModal(true);
        }
      }
    } catch (err) {
      console.error('Failed to read game state from localStorage:', err);
    }
  }, []);

  // Sync theme changes
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
      } catch (e) {
        // ignore storage errors
      }
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  }, []);

  // Persist game state whenever core state changes while in DASHBOARD or PODIUM
  useEffect(() => {
    if (!isMounted) return;
    if (showResumeModal) return; // Don't overwrite while deciding to resume

    if (screen === 'DASHBOARD' || screen === 'PODIUM') {
      try {
        const payload = {
          screen,
          players,
          currentRound,
          currentPlayerIndex,
          history,
          undoStack,
          preEndGameSnapshot,
          updatedAt: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (err) {
        console.error('Failed to persist game state:', err);
      }
    }
  }, [
    isMounted,
    showResumeModal,
    screen,
    players,
    currentRound,
    currentPlayerIndex,
    history,
    undoStack,
    preEndGameSnapshot,
  ]);

  // Trigger multi-stage confetti when entering PODIUM screen
  useEffect(() => {
    if (!isMounted || screen !== 'PODIUM') return;

    const duration = 2800;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors: ['#10b981', '#f59e0b', '#6366f1', '#ec4899', '#06b6d4'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors: ['#10b981', '#f59e0b', '#6366f1', '#ec4899', '#06b6d4'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    // Initial center burst
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.55 },
    });

    frame();
  }, [isMounted, screen]);

  // --------------------------------------------------------------------------
  // RESUME OR START FRESH HANDLERS
  // --------------------------------------------------------------------------
  const handleResumeSavedGame = () => {
    if (!savedGameCache) return;
    setPlayers(savedGameCache.players || []);
    setCurrentRound(savedGameCache.currentRound || 1);
    setCurrentPlayerIndex(savedGameCache.currentPlayerIndex || 0);
    setHistory(savedGameCache.history || []);
    setUndoStack(savedGameCache.undoStack || []);
    setPreEndGameSnapshot(savedGameCache.preEndGameSnapshot || null);
    setScreen(savedGameCache.screen || 'DASHBOARD');
    setShowResumeModal(false);
    setSavedGameCache(null);
  };

  const handleStartFreshGame = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
    setSavedGameCache(null);
    setShowResumeModal(false);
    resetToSetupScreen();
  };

  const resetToSetupScreen = () => {
    setPlayers([]);
    setCurrentRound(1);
    setCurrentPlayerIndex(0);
    setHistory([]);
    setUndoStack([]);
    setPreEndGameSnapshot(null);
    setWordEntries([createEmptyWordEntry('primary')]);
    setIsBingo(false);
    setTurnError('');
    setEndGameStep(null);
    setShowFullHistoryModal(false);
    setScreen('SETUP');
  };

  // --------------------------------------------------------------------------
  // SCREEN 1: GAME SETUP HANDLERS
  // --------------------------------------------------------------------------
  const handlePlayerCountSelect = (count) => {
    setPlayerCount(count);
    setSetupError('');
    setSetupNames((prev) => {
      const updated = [...prev];
      for (let i = 0; i < count; i++) {
        if (!updated[i] || updated[i].trim() === '') {
          updated[i] = `Player ${i + 1}`;
        }
      }
      return updated;
    });
  };

  const handleSetupNameChange = (idx, value) => {
    setSetupError('');
    setSetupNames((prev) => {
      const copy = [...prev];
      copy[idx] = value;
      return copy;
    });
  };

  const handleStartGame = (e) => {
    e.preventDefault();
    const activeNames = setupNames.slice(0, playerCount).map((n) => n.trim());

    // Check for empty names
    if (activeNames.some((n) => !n)) {
      setSetupError('All player names must be filled out.');
      return;
    }

    // Check for duplicate names (case-insensitive)
    const lowerNames = activeNames.map((n) => n.toLowerCase());
    const uniqueNames = new Set(lowerNames);
    if (uniqueNames.size !== activeNames.length) {
      setSetupError('Player names must be unique. Duplicate names are not allowed.');
      return;
    }

    const initializedPlayers = activeNames.map((name, idx) => ({
      id: `player_${idx + 1}_${Date.now()}`,
      name,
      colorIndex: idx % PLAYER_COLORS.length,
      score: 0,
      gameScoreBeforeLeftovers: 0,
      leftoverDeduction: 0,
      leftoverBonus: 0,
      leftoverTiles: '',
    }));

    setPlayers(initializedPlayers);
    setCurrentRound(1);
    setCurrentPlayerIndex(0);
    setHistory([]);
    setUndoStack([]);
    setPreEndGameSnapshot(null);
    setWordEntries([createEmptyWordEntry('primary')]);
    setIsBingo(false);
    setTurnError('');
    setScreen('DASHBOARD');
  };

  // --------------------------------------------------------------------------
  // SCREEN 2: TURN INPUT & TILE MODIFIER HANDLERS
  // --------------------------------------------------------------------------
  const handleWordTextChange = (wordId, rawValue) => {
    setTurnError('');
    // Auto-capitalize and allow only standard A-Z letters
    const sanitized = rawValue.toUpperCase().replace(/[^A-Z]/g, '');

    setWordEntries((prevEntries) =>
      prevEntries.map((entry) => {
        if (entry.id !== wordId) return entry;

        // Preserve existing tile modifiers where letter matches at the same index
        const newTiles = sanitized.split('').map((char, idx) => {
          const existingTile = entry.tiles[idx];
          if (existingTile && existingTile.letter === char) {
            return existingTile;
          }
          return {
            id: `${wordId}_tile_${idx}_${char}`,
            letter: char,
            modifier: existingTile ? existingTile.modifier : 'NORMAL',
          };
        });

        return {
          ...entry,
          text: sanitized,
          tiles: newTiles,
        };
      })
    );
  };

  const handleAddIntersectingWord = () => {
    setTurnError('');
    setWordEntries((prev) => [
      ...prev,
      createEmptyWordEntry(`intersect_${prev.length + 1}`),
    ]);
  };

  const handleRemoveIntersectingWord = (wordId) => {
    setWordEntries((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((w) => w.id !== wordId);
    });
    if (activeTilePicker && activeTilePicker.wordId === wordId) {
      setActiveTilePicker(null);
    }
  };

  const handleApplyTileModifier = (modifierKey) => {
    if (!activeTilePicker) return;
    const { wordId, tileIndex } = activeTilePicker;

    setWordEntries((prevEntries) =>
      prevEntries.map((entry) => {
        if (entry.id !== wordId) return entry;
        const updatedTiles = entry.tiles.map((tile, idx) =>
          idx === tileIndex ? { ...tile, modifier: modifierKey } : tile
        );
        return {
          ...entry,
          tiles: updatedTiles,
        };
      })
    );

    setActiveTilePicker(null);
  };

  // Live Turn Score Preview Calculation
  const liveTurnCalculation = useMemo(() => {
    return calculateTurnScore(wordEntries, isBingo);
  }, [wordEntries, isBingo]);

  const currentPlayer = players[currentPlayerIndex] || null;

  // Submit Turn (Played Word(s))
  const handleSubmitTurn = () => {
    if (!currentPlayer) return;

    const nonEmptyWords = wordEntries.filter((w) => w.text.trim().length > 0);
    if (nonEmptyWords.length === 0) {
      setTurnError('Please enter at least one word, or tap "Pass Turn (0 pts)".');
      return;
    }

    const calc = calculateTurnScore(nonEmptyWords, isBingo);

    // Save current state to undoStack before mutating
    const snapshot = {
      players: JSON.parse(JSON.stringify(players)),
      currentRound,
      currentPlayerIndex,
      history: JSON.parse(JSON.stringify(history)),
    };

    const updatedPlayers = players.map((p, idx) =>
      idx === currentPlayerIndex
        ? { ...p, score: p.score + calc.netTurnScore }
        : p
    );

    const historyEntry = {
      id: `turn_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      round: currentRound,
      playerId: currentPlayer.id,
      playerName: currentPlayer.name,
      playerColorIndex: currentPlayer.colorIndex,
      type: 'PLAY',
      isBingo,
      words: calc.wordDetails,
      netScore: calc.netTurnScore,
      cumulativeScoreAfter: currentPlayer.score + calc.netTurnScore,
      timestamp: Date.now(),
    };

    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    const nextRound =
      nextPlayerIndex === 0 ? currentRound + 1 : currentRound;

    setUndoStack((prev) => [...prev, snapshot]);
    setPlayers(updatedPlayers);
    setHistory((prev) => [historyEntry, ...prev]);
    setCurrentPlayerIndex(nextPlayerIndex);
    setCurrentRound(nextRound);

    // Reset console for next player
    setWordEntries([createEmptyWordEntry('primary')]);
    setIsBingo(false);
    setTurnError('');
    setActiveTilePicker(null);
  };

  // Pass Turn (0 pts)
  const handlePassTurn = () => {
    if (!currentPlayer) return;

    const snapshot = {
      players: JSON.parse(JSON.stringify(players)),
      currentRound,
      currentPlayerIndex,
      history: JSON.parse(JSON.stringify(history)),
    };

    const historyEntry = {
      id: `turn_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      round: currentRound,
      playerId: currentPlayer.id,
      playerName: currentPlayer.name,
      playerColorIndex: currentPlayer.colorIndex,
      type: 'PASS',
      isBingo: false,
      words: [],
      netScore: 0,
      cumulativeScoreAfter: currentPlayer.score,
      timestamp: Date.now(),
    };

    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    const nextRound =
      nextPlayerIndex === 0 ? currentRound + 1 : currentRound;

    setUndoStack((prev) => [...prev, snapshot]);
    setHistory((prev) => [historyEntry, ...prev]);
    setCurrentPlayerIndex(nextPlayerIndex);
    setCurrentRound(nextRound);

    // Reset console
    setWordEntries([createEmptyWordEntry('primary')]);
    setIsBingo(false);
    setTurnError('');
    setActiveTilePicker(null);
  };

  // Undo Last Turn
  const handleUndoLastTurn = () => {
    if (undoStack.length === 0) return;

    const lastSnapshot = undoStack[undoStack.length - 1];
    setPlayers(lastSnapshot.players);
    setCurrentRound(lastSnapshot.currentRound);
    setCurrentPlayerIndex(lastSnapshot.currentPlayerIndex);
    setHistory(lastSnapshot.history);
    setUndoStack((prev) => prev.slice(0, -1));
    setWordEntries([createEmptyWordEntry('primary')]);
    setIsBingo(false);
    setTurnError('');
    setActiveTilePicker(null);
  };

  // Group history chronologically by Round for the Round History Log
  const historyGroupedByRound = useMemo(() => {
    const groupsMap = new Map();
    // history is stored newest-first; reverse a copy to group chronologically inside each round
    const chronological = [...history].reverse();

    chronological.forEach((item) => {
      if (!groupsMap.has(item.round)) {
        groupsMap.set(item.round, []);
      }
      groupsMap.get(item.round).push(item);
    });

    // Return rounds in descending order (latest round on top) or ascending
    return Array.from(groupsMap.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([roundNumber, turns]) => ({
        roundNumber,
        turns,
      }));
  }, [history]);

  // --------------------------------------------------------------------------
  // SCREEN 3: END GAME & LEFTOVERS LOGIC
  // --------------------------------------------------------------------------
  const handleOpenEndGameModal = () => {
    const initialInputs = {};
    players.forEach((p) => {
      initialInputs[p.id] = '';
    });
    setLeftoverInputs(initialInputs);
    setEndGameStep('CONFIRM');
  };

  const handleLeftoverInputChange = (playerId, value) => {
    const sanitized = value.toUpperCase().replace(/[^A-Z]/g, '');
    setLeftoverInputs((prev) => ({
      ...prev,
      [playerId]: sanitized,
    }));
  };

  // Live preview of End Game Leftover Adjustments
  const leftoverPreview = useMemo(() => {
    if (!players || players.length === 0) {
      return { totalDeducted: 0, playerBreakdowns: [] };
    }

    let totalDeducted = 0;
    const rawBreakdowns = players.map((p) => {
      const rawStr = leftoverInputs[p.id] || '';
      const { cleaned, sum, tiles } = calculateLeftoverStringPoints(rawStr);
      totalDeducted += sum;
      return {
        playerId: p.id,
        name: p.name,
        colorIndex: p.colorIndex,
        baseScore: p.score,
        leftoverTiles: cleaned,
        parsedTiles: tiles,
        deduction: sum,
        wentOut: cleaned.length === 0,
      };
    });

    // Per official rules & prompt:
    // 1. Calculate leftover points for each player based on tile values.
    // 2. Deduct that amount from their total score.
    // 3. Sum all deducted points across all players, and ADD that sum to the player who went out (0 leftovers).
    const playerBreakdowns = rawBreakdowns.map((item) => {
      const bonus = item.wentOut ? totalDeducted : 0;
      const finalScore = item.baseScore - item.deduction + bonus;
      return {
        ...item,
        bonus,
        finalScore,
      };
    });

    return {
      totalDeducted,
      playerBreakdowns,
    };
  }, [players, leftoverInputs]);

  const handleConfirmAndCrownWinner = () => {
    // Save snapshot so "Undo & Resume Game" on Screen 4 can revert cleanly
    const snapshotBeforeEnd = {
      players: JSON.parse(JSON.stringify(players)),
      currentRound,
      currentPlayerIndex,
      history: JSON.parse(JSON.stringify(history)),
      undoStack: JSON.parse(JSON.stringify(undoStack)),
    };

    const adjustedPlayers = players.map((p) => {
      const breakdown = leftoverPreview.playerBreakdowns.find(
        (b) => b.playerId === p.id
      );
      if (!breakdown) return p;

      return {
        ...p,
        gameScoreBeforeLeftovers: p.score,
        leftoverDeduction: breakdown.deduction,
        leftoverBonus: breakdown.bonus,
        leftoverTiles: breakdown.leftoverTiles,
        score: breakdown.finalScore,
      };
    });

    setPreEndGameSnapshot(snapshotBeforeEnd);
    setPlayers(adjustedPlayers);
    setEndGameStep(null);
    setScreen('PODIUM');
  };

  // Screen 4: Undo & Resume Game
  const handleUndoEndGameAndResume = () => {
    if (preEndGameSnapshot) {
      setPlayers(preEndGameSnapshot.players);
      setCurrentRound(preEndGameSnapshot.currentRound);
      setCurrentPlayerIndex(preEndGameSnapshot.currentPlayerIndex);
      setHistory(preEndGameSnapshot.history);
      setUndoStack(preEndGameSnapshot.undoStack);
      setPreEndGameSnapshot(null);
    }
    setShowFullHistoryModal(false);
    setScreen('DASHBOARD');
  };

  // Ranked players for Podium screen
  const rankedPlayers = useMemo(() => {
    return [...players].sort((a, b) => b.score - a.score);
  }, [players]);

  // Lookup currently selected tile for the Modifier Popover Modal
  const selectedTileContext = useMemo(() => {
    if (!activeTilePicker) return null;
    const wordObj = wordEntries.find((w) => w.id === activeTilePicker.wordId);
    if (!wordObj) return null;
    const tileObj = wordObj.tiles[activeTilePicker.tileIndex];
    if (!tileObj) return null;
    return {
      wordObj,
      tileObj,
      tileIndex: activeTilePicker.tileIndex,
      basePoints: SCRABBLE_LETTER_VALUES[tileObj.letter] ?? 0,
    };
  }, [activeTilePicker, wordEntries]);

  // --------------------------------------------------------------------------
  // HYDRATION GUARD RENDER
  // --------------------------------------------------------------------------
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 border-2 border-amber-400 flex items-center justify-center animate-pulse">
            <span className="font-mono font-bold text-xl text-amber-800 dark:text-amber-300">
              S
            </span>
          </div>
          <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
            Loading Scorekeeper...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* =================================================================== */}
      {/* STICKY TOP BAR */}
      {/* =================================================================== */}
      <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4">
        <div className="max-w-3xl mx-auto h-full flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#FDF6E2] border-2 border-[#E5D3B3] shadow-sm flex items-center justify-center relative select-none">
              <span className="font-bold text-lg text-slate-900 leading-none">
                S
              </span>
              <span className="absolute bottom-0.5 right-1 text-[9px] font-bold text-slate-700 leading-none">
                1
              </span>
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base tracking-tight leading-tight">
                Scrabble Tracker
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Official Tournament Scoring
              </p>
            </div>
          </div>

          {/* Center / Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {screen === 'DASHBOARD' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 dark:bg-amber-500/20 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Round {currentRound}</span>
              </div>
            )}

            <button
              type="button"
              onClick={toggleDarkMode}
              aria-label="Toggle Dark Mode"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {screen === 'DASHBOARD' && (
              <button
                type="button"
                onClick={handleOpenEndGameModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs sm:text-sm font-semibold shadow-sm transition-colors"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>End Game</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* =================================================================== */}
      {/* SCREEN 1: GAME SETUP */}
      {/* =================================================================== */}
      {screen === 'SETUP' && (
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
            {/* Setup Header Banner */}
            <div className="p-6 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border-b border-slate-200 dark:border-slate-800">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs font-semibold mb-2">
                <Users className="w-3.5 h-3.5" />
                <span>New Match Setup</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                Configure Your Players
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Select between 2 and 6 players and customize their display names.
              </p>
            </div>

            <form onSubmit={handleStartGame} className="p-6 space-y-6">
              {/* Segmented Player Count Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                  Number of Players
                </label>
                <div className="grid grid-cols-5 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  {[2, 3, 4, 5, 6].map((num) => {
                    const active = playerCount === num;
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handlePlayerCountSelect(num)}
                        className={`py-2.5 rounded-lg font-bold text-sm transition-all ${
                          active
                            ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {num}P
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Player Name Inputs */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Player Names & Badges
                </label>

                <div className="space-y-2.5">
                  {Array.from({ length: playerCount }).map((_, idx) => {
                    const colorTheme = PLAYER_COLORS[idx % PLAYER_COLORS.length];
                    const nameVal = setupNames[idx] || '';
                    const initial =
                      nameVal.trim().charAt(0).toUpperCase() || `${idx + 1}`;

                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-amber-500 transition-all"
                      >
                        <div
                          className={`w-10 h-10 rounded-lg ${colorTheme.bg} text-white font-bold flex items-center justify-center shrink-0 shadow-sm`}
                        >
                          {initial}
                        </div>
                        <div className="flex-1 min-w-0">
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            Player {idx + 1} ({colorTheme.name})
                          </label>
                          <input
                            type="text"
                            maxLength={20}
                            value={nameVal}
                            onChange={(e) =>
                              handleSetupNameChange(idx, e.target.value)
                            }
                            placeholder={`Enter Player ${idx + 1} name...`}
                            className="w-full bg-transparent text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Validation Error Banner */}
              {setupError && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                  <span>{setupError}</span>
                </div>
              )}

              {/* Submit Action */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-base shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Start Game</span>
              </button>
            </form>
          </div>
        </main>
      )}

      {/* =================================================================== */}
      {/* SCREEN 2: MAIN GAME DASHBOARD (FIXED, NON-GLITCHY LAYOUT) */}
      {/* =================================================================== */}
      {screen === 'DASHBOARD' && (
        <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto">
          {/* 1. SCOREBOARD BAR (FIXED HEIGHT, HORIZONTAL SCROLL) */}
          <section
            aria-label="Scoreboard"
            className="h-28 shrink-0 bg-slate-100/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center overflow-x-auto no-scrollbar"
          >
            <div className="flex items-center gap-3 min-w-full py-2">
              {players.map((player, idx) => {
                const isCurrentTurn = idx === currentPlayerIndex;
                const colorTheme =
                  PLAYER_COLORS[player.colorIndex % PLAYER_COLORS.length];
                const initial =
                  player.name.trim().charAt(0).toUpperCase() || '?';

                return (
                  <div
                    key={player.id}
                    className={`relative flex-1 min-w-[140px] sm:min-w-[155px] h-20 rounded-xl p-3 flex items-center gap-3 transition-all select-none ${
                      isCurrentTurn
                        ? `bg-white dark:bg-slate-900 ring-2 ${colorTheme.ring} shadow-md`
                        : 'bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 opacity-80'
                    }`}
                  >
                    {/* Pulsing Turn Badge */}
                    {isCurrentTurn && (
                      <span className="absolute -top-2 right-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white shadow-sm animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        Turn
                      </span>
                    )}

                    {/* Avatar */}
                    <div
                      className={`w-11 h-11 rounded-xl ${colorTheme.bg} text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-sm`}
                    >
                      {initial}
                    </div>

                    {/* Name & Score */}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                        {player.name}
                      </p>
                      <p className="font-mono text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                        {player.score}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 2. TURN INPUT CONSOLE (CENTER STAGE) */}
          <main className="flex-1 p-4 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 sm:p-5 space-y-5">
              {/* Console Top Header: Current Player + Live Score Preview Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  {currentPlayer && (
                    <span
                      className={`w-3 h-3 rounded-full ${
                        PLAYER_COLORS[
                          currentPlayer.colorIndex % PLAYER_COLORS.length
                        ].bg
                      }`}
                    />
                  )}
                  <h2 className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-200">
                    Current Player:{' '}
                    <span className="text-slate-950 dark:text-white underline decoration-amber-500/60 decoration-2 underline-offset-4">
                      {currentPlayer ? currentPlayer.name : ''}
                    </span>
                  </h2>
                </div>

                {/* Live Score Preview Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/15 dark:bg-amber-500/20 border border-amber-500/30">
                  <span className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                    Turn Score:
                  </span>
                  <span className="font-mono text-base sm:text-lg font-extrabold text-amber-700 dark:text-amber-300">
                    {liveTurnCalculation.netTurnScore} pts
                  </span>
                </div>
              </div>

              {/* Word Input List (Primary + Intersecting Words) */}
              <div className="space-y-5">
                {wordEntries.map((entry, entryIdx) => {
                  const singleCalc = calculateSingleWordScore(entry.tiles);

                  return (
                    <div
                      key={entry.id}
                      className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {entryIdx === 0
                            ? 'Primary Word Played'
                            : `Intersecting Word #${entryIdx}`}
                        </label>

                        <div className="flex items-center gap-2">
                          {entry.tiles.length > 0 && (
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                              {singleCalc.baseWordScore}
                              {singleCalc.wordMultiplier > 1
                                ? ` × ${singleCalc.wordMultiplier} = ${singleCalc.totalWordScore}`
                                : ''}{' '}
                              pts
                            </span>
                          )}

                          {entryIdx > 0 && (
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveIntersectingWord(entry.id)
                              }
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="Remove Intersecting Word"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Text Box for Word */}
                      <div className="relative">
                        <input
                          type="text"
                          value={entry.text}
                          maxLength={15}
                          onChange={(e) =>
                            handleWordTextChange(entry.id, e.target.value)
                          }
                          placeholder={
                            entryIdx === 0
                              ? 'Type played word (e.g. QUARTZ)...'
                              : 'Type intersecting word...'
                          }
                          className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-lg sm:text-xl font-bold tracking-widest uppercase text-slate-900 dark:text-white placeholder:font-sans placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:normal-case placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        {entry.text.length > 0 && (
                          <button
                            type="button"
                            onClick={() => handleWordTextChange(entry.id, '')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            title="Clear word"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* UNIFIED TILE MODIFIER SYSTEM */}
                      <div className="min-h-[84px] flex flex-col justify-center">
                        {entry.tiles.length === 0 ? (
                          <div className="h-[80px] rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center px-4 text-center">
                            <p className="text-xs text-slate-400 dark:text-slate-500">
                              Type letters above to generate interactive Scrabble
                              tiles. Tap any tile to apply DL, TL, DW, TW, ★, or
                              Blank modifiers.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                Tap any tile below to set letter or word
                                multipliers:
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-1 pb-1">
                              {entry.tiles.map((tile, tIdx) => {
                                const modConfig =
                                  TILE_MODIFIERS[tile.modifier] ||
                                  TILE_MODIFIERS.NORMAL;
                                const rawVal =
                                  SCRABBLE_LETTER_VALUES[tile.letter] ?? 0;
                                const displayPts =
                                  tile.modifier === 'BLANK' ? 0 : rawVal;

                                return (
                                  <button
                                    key={tile.id || tIdx}
                                    type="button"
                                    onClick={() =>
                                      setActiveTilePicker({
                                        wordId: entry.id,
                                        tileIndex: tIdx,
                                      })
                                    }
                                    className={`group relative w-14 h-16 sm:w-16 sm:h-[72px] rounded-xl bg-[#FDF6E2] dark:bg-[#2A241D] border-2 ${modConfig.tileBorderClass} shadow-tile active:shadow-tile-active active:translate-y-0.5 flex flex-col items-center justify-center transition-all select-none`}
                                  >
                                    {/* Active Modifier Badge */}
                                    <span
                                      className={`absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold uppercase tracking-tighter border ${modConfig.badgeClass} whitespace-nowrap`}
                                    >
                                      {modConfig.shortLabel}
                                    </span>

                                    {/* Tile Letter */}
                                    <span className="font-mono text-2xl sm:text-3xl font-black text-slate-900 dark:text-amber-100 leading-none mt-1">
                                      {tile.letter}
                                    </span>

                                    {/* Tile Base Value */}
                                    <span className="absolute bottom-1 right-1.5 font-mono text-[10px] sm:text-[11px] font-bold text-slate-700 dark:text-amber-300/80 leading-none">
                                      {displayPts}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* + Add Intersecting Word Button */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleAddIntersectingWord}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-500 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Intersecting Word</span>
                  </button>

                  {/* Bingo! (+50 pts) Toggle */}
                  <button
                    type="button"
                    onClick={() => setIsBingo((prev) => !prev)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-xs sm:text-sm transition-all ${
                      isBingo
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20 ring-2 ring-emerald-500/40'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Bingo! (+50 pts)</span>
                    {isBingo && <CheckCircle2 className="w-4 h-4 ml-0.5" />}
                  </button>
                </div>
              </div>

              {/* Validation Error Message */}
              {turnError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{turnError}</span>
                </div>
              )}

              {/* Turn Action Controls */}
              <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={handleSubmitTurn}
                  className="col-span-2 py-3.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-sm sm:text-base shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>
                    Submit Turn ({liveTurnCalculation.netTurnScore} pts)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handlePassTurn}
                  className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <SkipForward className="w-4 h-4" />
                  <span>Pass Turn (0 pts)</span>
                </button>

                <button
                  type="button"
                  onClick={handleUndoLastTurn}
                  disabled={undoStack.length === 0}
                  className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Undo2 className="w-4 h-4" />
                  <span>Undo Last Turn</span>
                </button>
              </div>
            </div>

            {/* 3. ROUND HISTORY LOG (BOUNDED SCROLL CONTAINER) */}
            <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Round History Log
                  </h3>
                </div>
                <span className="text-xs font-medium text-slate-400">
                  {history.length} {history.length === 1 ? 'turn' : 'turns'}{' '}
                  recorded
                </span>
              </div>

              <div className="max-h-60 overflow-y-auto custom-scrollbar divide-y divide-slate-100 dark:divide-slate-800/70">
                {historyGroupedByRound.length === 0 ? (
                  <div className="py-10 px-4 text-center">
                    <p className="text-sm text-slate-400 dark:text-slate-500">
                      No turns played yet. Submit a word or pass a turn to
                      populate the match log.
                    </p>
                  </div>
                ) : (
                  historyGroupedByRound.map((group) => (
                    <div key={group.roundNumber} className="p-3 sm:p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                          Round {group.roundNumber}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {group.turns.map((turn) => {
                          const pColor =
                            PLAYER_COLORS[
                              turn.playerColorIndex % PLAYER_COLORS.length
                            ];

                          return (
                            <div
                              key={turn.id}
                              className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50/90 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs sm:text-sm"
                            >
                              {/* Player & Words */}
                              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                <span
                                  className={`w-6 h-6 rounded-md ${pColor.bg} text-white font-bold text-xs flex items-center justify-center shrink-0`}
                                >
                                  {turn.playerName.charAt(0).toUpperCase()}
                                </span>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-slate-800 dark:text-slate-200">
                                      {turn.playerName}
                                    </span>

                                    {turn.type === 'PASS' ? (
                                      <span className="italic text-slate-400">
                                        Passed Turn
                                      </span>
                                    ) : (
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        {turn.words.map((w, wIdx) => {
                                          const activeMods = w.tiles
                                            .filter(
                                              (t) => t.modifier !== 'NORMAL'
                                            )
                                            .map(
                                              (t) =>
                                                `${t.letter}:${
                                                  TILE_MODIFIERS[t.modifier]
                                                    ?.shortLabel || t.modifier
                                                }`
                                            );

                                          return (
                                            <span
                                              key={wIdx}
                                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 font-mono font-bold text-amber-900 dark:text-amber-300"
                                            >
                                              <span>{w.wordText}</span>
                                              <span className="text-[10px] text-amber-700/80 dark:text-amber-400/80">
                                                ({w.totalWordScore})
                                              </span>
                                              {activeMods.length > 0 && (
                                                <span className="text-[10px] font-sans px-1 rounded bg-amber-500/20 text-amber-950 dark:text-amber-200">
                                                  {activeMods.join(', ')}
                                                </span>
                                              )}
                                            </span>
                                          );
                                        })}
                                        {turn.isBingo && (
                                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                                            BINGO +50
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Net Score Earned */}
                              <div className="text-right shrink-0">
                                <span
                                  className={`font-mono font-extrabold text-sm ${
                                    turn.netScore > 0
                                      ? 'text-emerald-600 dark:text-emerald-400'
                                      : 'text-slate-400'
                                  }`}
                                >
                                  +{turn.netScore} pts
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </main>
        </div>
      )}

      {/* =================================================================== */}
      {/* SCREEN 4: WINNER PODIUM & POST-GAME NAVIGATION */}
      {/* =================================================================== */}
      {screen === 'PODIUM' && (
        <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 space-y-6">
          {/* Podium Hero Banner */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Trophy className="w-9 h-9" />
            </div>

            <p className="text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Official Match Complete
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
              {rankedPlayers[0]?.name} Wins!
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Final Score:{' '}
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {rankedPlayers[0]?.score} points
              </span>{' '}
              across {history.length} total turns
            </p>

            {/* Ranked Podium Cards */}
            <div className="mt-8 space-y-3 text-left">
              {rankedPlayers.map((player, rankIdx) => {
                const rank = rankIdx + 1;
                const colorTheme =
                  PLAYER_COLORS[player.colorIndex % PLAYER_COLORS.length];

                const badgeStyles =
                  rank === 1
                    ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300'
                    : rank === 2
                    ? 'bg-slate-300 text-slate-900'
                    : rank === 3
                    ? 'bg-amber-700 text-amber-100'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400';

                return (
                  <div
                    key={player.id}
                    className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                      rank === 1
                        ? 'bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/50 shadow-md'
                        : 'bg-slate-50/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Rank Pill */}
                      <div
                        className={`w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center shrink-0 ${badgeStyles}`}
                      >
                        {rank === 1 ? <Crown className="w-5 h-5" /> : `#${rank}`}
                      </div>

                      {/* Player Avatar */}
                      <div
                        className={`w-11 h-11 rounded-xl ${colorTheme.bg} text-white font-bold text-lg flex items-center justify-center shrink-0`}
                      >
                        {player.name.charAt(0).toUpperCase()}
                      </div>

                      {/* Name & Leftover Adjustment Breakdown */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base sm:text-lg truncate">
                            {player.name}
                          </h3>
                          {rank === 1 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500 text-white">
                              Champion
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          <span>
                            In-Game:{' '}
                            <strong className="font-mono text-slate-700 dark:text-slate-200">
                              {player.gameScoreBeforeLeftovers ?? player.score}
                            </strong>
                          </span>
                          {player.leftoverDeduction > 0 && (
                            <span className="text-rose-600 dark:text-rose-400">
                              Leftovers ({player.leftoverTiles}):{' '}
                              <strong className="font-mono">
                                -{player.leftoverDeduction}
                              </strong>
                            </span>
                          )}
                          {player.leftoverBonus > 0 && (
                            <span className="text-emerald-600 dark:text-emerald-400">
                              Out Bonus:{' '}
                              <strong className="font-mono">
                                +{player.leftoverBonus}
                              </strong>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Final Score */}
                    <div className="text-right shrink-0">
                      <span className="block font-mono text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                        {player.score}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Final Pts
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* THREE REQUIRED POST-GAME ACTIONS */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 1. Review Full History */}
              <button
                type="button"
                onClick={() => setShowFullHistoryModal(true)}
                className="py-3.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span>Review Full History</span>
              </button>

              {/* 2. Undo & Resume Game */}
              <button
                type="button"
                onClick={handleUndoEndGameAndResume}
                className="py-3.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-indigo-500" />
                <span>Undo & Resume Game</span>
              </button>

              {/* 3. Start New Game */}
              <button
                type="button"
                onClick={handleStartFreshGame}
                className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-sm shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Start New Game</span>
              </button>
            </div>
          </div>
        </main>
      )}

      {/* =================================================================== */}
      {/* MODAL 1: ONGOING GAME RESUME DIALOG (APP ROOT PERSISTENCE FLOW) */}
      {/* =================================================================== */}
      {showResumeModal && savedGameCache && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
                <History className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Ongoing Game Found</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  We found a saved match in your browser storage.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {savedGameCache.screen === 'PODIUM'
                    ? 'Completed (Podium)'
                    : `Round ${savedGameCache.currentRound}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Players:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {savedGameCache.players.map((p) => p.name).join(', ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Turns Recorded:</span>
                <span className="font-mono font-bold">
                  {savedGameCache.history?.length || 0}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={handleStartFreshGame}
                className="py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-sm text-slate-700 dark:text-slate-300 transition-colors"
              >
                Start Fresh Game
              </button>
              <button
                type="button"
                onClick={handleResumeSavedGame}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-sm shadow-md shadow-amber-500/20 transition-all"
              >
                Resume Game
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 2: UNIFIED TILE MODIFIER PICKER POPOVER / MODAL */}
      {/* =================================================================== */}
      {selectedTileContext && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          onClick={() => setActiveTilePicker(null)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-12 rounded-xl bg-[#FDF6E2] border-2 border-[#E5D3B3] flex items-center justify-center relative shadow-sm">
                  <span className="font-mono text-xl font-black text-slate-900">
                    {selectedTileContext.tileObj.letter}
                  </span>
                  <span className="absolute bottom-0.5 right-1 font-mono text-[10px] font-bold text-slate-700">
                    {selectedTileContext.basePoints}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-base">
                    Tile Modifier for &ldquo;{selectedTileContext.tileObj.letter}
                    &rdquo;
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Base value: {selectedTileContext.basePoints} pts (Tile #
                    {selectedTileContext.tileIndex + 1})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTilePicker(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 7 Distinct Modifier Button Choices */}
            <div className="grid grid-cols-1 gap-2">
              {Object.values(TILE_MODIFIERS).map((mod) => {
                const isSelected =
                  selectedTileContext.tileObj.modifier === mod.key;
                return (
                  <button
                    key={mod.key}
                    type="button"
                    onClick={() => handleApplyTileModifier(mod.key)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      mod.buttonClass
                    } ${
                      isSelected
                        ? 'ring-2 ring-amber-500 font-bold'
                        : 'font-semibold'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-extrabold uppercase border ${mod.badgeClass}`}
                      >
                        {mod.shortLabel}
                      </span>
                      <div>
                        <p className="text-sm leading-tight">{mod.label}</p>
                        <p className="text-[11px] opacity-75 font-normal">
                          {mod.description}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 3: SCREEN 3 — END GAME CONFIRMATION & LEFTOVERS MODAL */}
      {/* =================================================================== */}
      {endGameStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
            {endGameStep === 'CONFIRM' ? (
              <div className="p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 flex items-center justify-center shrink-0">
                    <Flag className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">End Current Game?</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Are you sure you want to conclude the match and calculate
                      leftover tiles?
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEndGameStep(null)}
                    className="py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-sm text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setEndGameStep('LEFTOVERS')}
                    className="py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-colors"
                  >
                    Yes, Enter Leftovers
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-bold">
                      End Game: Remaining Unplayed Tiles
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Leave the field <strong>empty</strong> for the player who
                      went out. They will receive the sum of all deducted
                      leftover points!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEndGameStep(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Player Leftover Inputs */}
                <div className="space-y-3 max-h-[340px] overflow-y-auto custom-scrollbar pr-1">
                  {leftoverPreview.playerBreakdowns.map((item) => {
                    const colorTheme =
                      PLAYER_COLORS[item.colorIndex % PLAYER_COLORS.length];

                    return (
                      <div
                        key={item.playerId}
                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-6 h-6 rounded-md ${colorTheme.bg} text-white font-bold text-xs flex items-center justify-center`}
                            >
                              {item.name.charAt(0).toUpperCase()}
                            </span>
                            <span className="font-bold text-sm">
                              {item.name}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                              (Current: {item.baseScore} pts)
                            </span>
                          </div>

                          <div className="text-xs font-mono font-bold">
                            {item.wentOut ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                Went Out (+{item.bonus} pts)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400">
                                -{item.deduction} pts
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            value={leftoverInputs[item.playerId] || ''}
                            onChange={(e) =>
                              handleLeftoverInputChange(
                                item.playerId,
                                e.target.value
                              )
                            }
                            placeholder="Remaining unplayed tiles (e.g. EERX)"
                            className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono text-sm font-bold uppercase tracking-widest placeholder:font-sans placeholder:font-normal placeholder:tracking-normal placeholder:normal-case placeholder:text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />

                          <div className="text-right shrink-0 min-w-[75px]">
                            <span className="block text-[10px] uppercase text-slate-400">
                              Final Score
                            </span>
                            <span className="font-mono font-extrabold text-sm text-slate-900 dark:text-white">
                              {item.finalScore} pts
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEndGameStep(null)}
                    className="py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs sm:text-sm text-slate-600 dark:text-slate-300"
                  >
                    Back to Game
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmAndCrownWinner}
                    className="py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 flex items-center gap-2"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Confirm & Crown Winner</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 4: FULL MATCH HISTORY MODAL (FROM SCREEN 4 PODIUM) */}
      {/* =================================================================== */}
      {showFullHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="font-bold text-base sm:text-lg">
                    Complete Match Breakdown
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Every round, word, and multiplier recorded in this game
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowFullHistoryModal(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold text-xs hover:bg-amber-500/25 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Podium</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-5 space-y-4">
              {historyGroupedByRound.length === 0 ? (
                <p className="text-center py-12 text-sm text-slate-400">
                  No turns were recorded during this match.
                </p>
              ) : (
                [...historyGroupedByRound]
                  .reverse()
                  .map((group) => (
                    <div
                      key={group.roundNumber}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                    >
                      <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800/80 font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300">
                        Round {group.roundNumber}
                      </div>
                      <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {group.turns.map((turn) => {
                          const pColor =
                            PLAYER_COLORS[
                              turn.playerColorIndex % PLAYER_COLORS.length
                            ];
                          return (
                            <div
                              key={turn.id}
                              className="p-3 flex items-center justify-between gap-3 text-xs sm:text-sm"
                            >
                              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                <span
                                  className={`w-6 h-6 rounded-md ${pColor.bg} text-white font-bold text-xs flex items-center justify-center shrink-0`}
                                >
                                  {turn.playerName.charAt(0).toUpperCase()}
                                </span>
                                <span className="font-bold shrink-0">
                                  {turn.playerName}
                                </span>

                                {turn.type === 'PASS' ? (
                                  <span className="italic text-slate-400">
                                    Passed Turn
                                  </span>
                                ) : (
                                  <div className="flex flex-wrap gap-1.5">
                                    {turn.words.map((w, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 font-mono font-bold text-amber-800 dark:text-amber-300"
                                      >
                                        {w.wordText} ({w.totalWordScore})
                                      </span>
                                    ))}
                                    {turn.isBingo && (
                                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                                        BINGO +50
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>

                              <div className="text-right font-mono shrink-0">
                                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                                  +{turn.netScore}
                                </span>
                                <span className="text-[11px] text-slate-400 ml-2">
                                  (Total: {turn.cumulativeScoreAfter})
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}