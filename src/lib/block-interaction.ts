import type { KeyboardEvent, SyntheticEvent } from "react";

export function blockClick(event: SyntheticEvent) {
  event.preventDefault();
  event.stopPropagation();
}

export function blockKeyPress(event: KeyboardEvent) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    event.stopPropagation();
  }
}

