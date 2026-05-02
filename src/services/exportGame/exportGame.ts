import store from "../../redux/reduxStore";
import { State } from "../../redux/state";
import { SessionStorage } from "../sessionStorage/sessionStorage";
import { getEventLog, LoggedEvent } from "../eventLog/eventLog";
import { HistoryEntry } from "../gameManager/gameManager";
import { ChatMessage } from "../../models/chatMessage";
import { CardType } from "../../models/card";

export interface DebugExport {
  exportedAt: string;
  app: {
    location: string;
    userAgent: string;
    viewport: { width: number; height: number };
  };
  session: {
    playerName: string | null;
  };
  redux: State;
  history: {
    gameHistory: HistoryEntry[];
    chatMessages: ChatMessage[];
    discardPile: CardType[];
    bottomDiscardPile: CardType[];
    lastCardsPlayed: CardType[];
  };
  eventLog: LoggedEvent[];
  rawHandValues: Array<Record<string, unknown>>;
}

const safeReadStorage = (): string | null => {
  try {
    return SessionStorage.GetPlayerName();
  } catch {
    return null;
  }
};

export const buildDebugExport = (): DebugExport => {
  const reduxState = store.getState() as State;
  const hand = reduxState.playerState?.playerState?.hand ?? [];
  const gameState = reduxState.gameState;

  return {
    exportedAt: new Date().toISOString(),
    app: {
      location: typeof window !== "undefined" ? window.location.href : "",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      viewport: {
        width: typeof window !== "undefined" ? window.innerWidth : 0,
        height: typeof window !== "undefined" ? window.innerHeight : 0,
      },
    },
    session: {
      playerName: safeReadStorage(),
    },
    redux: reduxState,
    history: {
      gameHistory: gameState?.history ?? [],
      chatMessages: reduxState.messages ?? [],
      discardPile: gameState?.discardPile ?? [],
      bottomDiscardPile: gameState?.bottomDiscardPile ?? [],
      lastCardsPlayed: gameState?.lastCardsPlayed ?? [],
    },
    eventLog: getEventLog(),
    rawHandValues: hand.map((card, index) => ({
      index,
      card: (card as { card?: unknown })?.card,
      suit: (card as { suit?: unknown })?.suit,
      typeofCard: typeof (card as { card?: unknown })?.card,
      typeofSuit: typeof (card as { suit?: unknown })?.suit,
      raw: card,
    })),
  };
};

export const exportGameStateAsJson = (): void => {
  const data = buildDebugExport();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const roomName = data.redux?.room?.roomName ?? "no-room";

  const a = document.createElement("a");
  a.href = url;
  a.download = `danish-game-debug-${roomName}-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
