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

function cleanAssistantText(value: string) {
  return value
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function splitAssistantParagraphs(content: string) {
  return content
    .split(/\n{2,}/)
    .map(cleanAssistantText)
    .filter(Boolean);
}

function sentenceFromParagraph(paragraph: string) {
  const match = paragraph.match(/^(.+?[.!?])(?:\s|$)/);
  return (match?.[1] ?? paragraph).trim();
}

function resolvePeakHeadline(paragraph: string) {
  if (/peak|highest|most power|most energy|load/i.test(paragraph)) {
    return "Today's Power Peak";
  }
  if (/stable|steady|consistent/i.test(paragraph)) {
    return "Consistent Energy Usage";
  }
  if (/recommend|should|if you|consider/i.test(paragraph)) {
    return "Recommended Next Step";
  }
  return "Key Insight";
}

export function deriveAiResponseCardsFromText(
  content: string,
): AiResponseCard[] {
  const trimmed = content.trim();
  if (trimmed.length < 120) return [];
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) return [];

  const paragraphs = splitAssistantParagraphs(trimmed);
  if (paragraphs.length === 0) return [];

  const cards: AiResponseCard[] = [];
  const first = paragraphs[0];
  cards.push({
    type: "summary",
    headline: resolvePeakHeadline(first),
    description: sentenceFromParagraph(first),
  });

  const insightParagraph =
    paragraphs.find((paragraph, index) => {
      if (index === 0) return false;
      return /between|peak|stable|steady|highest|lowest|kwh|kw|today/i.test(
        paragraph,
      );
    }) ?? paragraphs[1];

  if (insightParagraph) {
    cards.push({
      type: "insight",
      headline: resolvePeakHeadline(insightParagraph),
      description: insightParagraph,
    });
  }

  const recommendationParagraph = paragraphs.find((paragraph, index) => {
    if (index < 1) return false;
    return /if you|consider|recommend|should|try|avoid|turn/i.test(paragraph);
  });

  if (recommendationParagraph) {
    cards.push({
      type: "recommendation",
      headline: "What To Do Next",
      description: recommendationParagraph,
    });
  }

  return cards.slice(0, 3);
}
