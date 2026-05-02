import store from "../../redux/reduxStore";
import { State } from "../../redux/state";
import { SessionStorage } from "../sessionStorage/sessionStorage";

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
