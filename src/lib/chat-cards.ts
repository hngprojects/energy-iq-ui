import type { AiResponseCard, AiResponseCardType } from "@/types/chat";

export interface BackendAiCardPayload {
  cardType?: string;
  type?: string;
  title?: string;
  headline?: string;
  content?: string;
  description?: string;
  severity?: string;
  dataPoint?: string;
  actionLabel?: string;
  action?: { label?: string; url?: string; href?: string };
}

const CARD_TYPE_MAP: Record<string, AiResponseCardType> = {
  summary: "summary",
  insight: "insight",
  anomaly: "anomaly",
  recommendation: "recommendation",
  alert: "alert",
};

export function normalizeCardType(raw?: string): AiResponseCardType {
  const key = (raw ?? "").trim().toLowerCase();
  return CARD_TYPE_MAP[key] ?? "insight";
}

export function normalizeSeverity(
  raw?: string,
): "critical" | "warning" | "info" | undefined {
  const key = (raw ?? "").trim().toLowerCase();
  if (key === "critical" || key === "high") return "critical";
  if (key === "warning" || key === "medium") return "warning";
  if (key === "info" || key === "low") return "info";
  return undefined;
}

export function normalizeBackendCard(
  payload: BackendAiCardPayload,
): AiResponseCard | null {
  const description = (payload.content ?? payload.description ?? "").trim();
  const headline = (payload.title ?? payload.headline ?? "").trim();

  if (!headline && !description) return null;

  const actionLabel =
    payload.actionLabel?.trim() ||
    payload.action?.label?.trim() ||
    undefined;

  return {
    type: normalizeCardType(payload.cardType ?? payload.type),
    headline: headline || "Details",
    description,
    severity: normalizeSeverity(payload.severity),
    dataPoint: payload.dataPoint?.trim() || undefined,
    actionLabel,
    actionHref:
      payload.action?.url?.trim() || payload.action?.href?.trim() || undefined,
  };
}

export function normalizeBackendCards(
  cards: BackendAiCardPayload[] | undefined,
): AiResponseCard[] {
  if (!Array.isArray(cards)) return [];

  return cards
    .map(normalizeBackendCard)
    .filter((card): card is AiResponseCard => card !== null);
}

export function mergeAiResponseCards(
  existing: AiResponseCard[],
  incoming: AiResponseCard[],
): AiResponseCard[] {
  const merged = [...existing];

  for (const card of incoming) {
    const duplicate = merged.some(
      (item) =>
        item.type === card.type &&
        item.headline === card.headline &&
        item.description === card.description,
    );
    if (!duplicate) merged.push(card);
  }

  return merged;
}
