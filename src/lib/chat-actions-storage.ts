export interface StoredChatActions {
  deletedIds: string[];
  archivedIds: string[];
  pinnedIds: string[];
  renamedTitles: Record<string, string>;
}

const CHAT_ACTIONS_STORAGE_KEY = "energyiq-ai-chat-actions";

export const EMPTY_CHAT_ACTIONS: StoredChatActions = {
  deletedIds: [],
  archivedIds: [],
  pinnedIds: [],
  renamedTitles: {},
};

export function getChatActionsStorageKey(userId?: string): string {
  return userId
    ? `${CHAT_ACTIONS_STORAGE_KEY}:${userId}`
    : CHAT_ACTIONS_STORAGE_KEY;
}

function readStoredChatActions(storageKey: string): StoredChatActions {
  if (typeof window === "undefined") return EMPTY_CHAT_ACTIONS;
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return EMPTY_CHAT_ACTIONS;
    const parsed = JSON.parse(raw) as Partial<StoredChatActions>;
    return {
      deletedIds: Array.isArray(parsed.deletedIds) ? parsed.deletedIds : [],
      archivedIds: Array.isArray(parsed.archivedIds) ? parsed.archivedIds : [],
      pinnedIds: Array.isArray(parsed.pinnedIds) ? parsed.pinnedIds : [],
      renamedTitles:
        parsed.renamedTitles && typeof parsed.renamedTitles === "object"
          ? parsed.renamedTitles
          : {},
    };
  } catch {
    return EMPTY_CHAT_ACTIONS;
  }
}

export function loadStoredChatActions(storageKey: string): StoredChatActions {
  const actions = readStoredChatActions(storageKey);
  if (storageKey === CHAT_ACTIONS_STORAGE_KEY) return actions;

  const legacyActions = readStoredChatActions(CHAT_ACTIONS_STORAGE_KEY);
  return {
    ...actions,
    renamedTitles: {
      ...legacyActions.renamedTitles,
      ...actions.renamedTitles,
    },
  };
}

export function saveStoredChatActions(
  storageKey: string,
  actions: StoredChatActions,
) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(actions));
  } catch {
    // Keep UI state in memory when persistence is unavailable.
  }
}

export function createLocalChatTitle(message: string) {
  const normalized = message.trim().replace(/\s+/g, " ");
  if (normalized.length <= 70) return normalized;
  return `${normalized.slice(0, 67).trimEnd()}...`;
}

export function saveLocalChatTitle(
  storageKey: string,
  chatId: string,
  title: string,
) {
  const actions = loadStoredChatActions(storageKey);
  saveStoredChatActions(storageKey, {
    ...actions,
    renamedTitles: {
      ...actions.renamedTitles,
      [chatId]: title,
    },
  });
}
