export interface LoggedEvent {
  timestamp: string;
  direction: "in" | "out";
  event: string;
  payload?: unknown;
}

const MAX_EVENTS = 500;
const events: LoggedEvent[] = [];

export const logEvent = (
  direction: "in" | "out",
  event: string,
  payload?: unknown
): void => {
  events.push({
    timestamp: new Date().toISOString(),
    direction,
    event,
    payload: safeClone(payload),
  });
  if (events.length > MAX_EVENTS) {
    events.splice(0, events.length - MAX_EVENTS);
  }
};

export const getEventLog = (): LoggedEvent[] => events.slice();

export const clearEventLog = (): void => {
  events.length = 0;
};

const safeClone = (value: unknown): unknown => {
  if (value === undefined || value === null) {
    return value;
  }
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return String(value);
  }
};
