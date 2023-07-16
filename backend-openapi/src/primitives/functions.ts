/**
 * Current time in `YYYY-MM-DD HH:MM:SS.MMM` format.
 */
export function getCurrentTime(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.${d.getMilliseconds()}`;
}
