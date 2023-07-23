const minutesInHH = 60;
const minutesInDD = 24 * minutesInHH;

/**
 * Present the content safely.
 * - https://stackoverflow.com/a/4835406
 */
export function escapeHtml(text: string): string {
  const map = new Map<string, string>([
    ["&", "&amp;"], ["<", "&lt;"], [">", "&gt;"], ["\"", "&quot;"], ["'", "&#039;"]
  ]);
  return text.replace(/[&<>"']/g, (m) => { return map.get(m)!; });
}

export function minutesToDdhhmm(minutes: number): [number, number, number] {
  const dd = Math.floor(minutes / minutesInDD);
  const hh = Math.floor((minutes - dd * minutesInDD) / minutesInHH);
  const mm = minutes - dd * minutesInDD - hh * minutesInHH;

  return [dd, hh, mm];
}

export function ddhhmmToMinutes(ddhhmm: [number, number, number]): number {
  const [dd, hh, mm] = ddhhmm;
  return dd * minutesInDD + hh * minutesInHH + mm;
}

export function stringToTags(str: string): string[] {
  return str.split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

export function tagsToString(tags: string[]): string {
  return tags.join(", ");
}
