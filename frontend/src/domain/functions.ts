const minutesInHH = 60;
const minutesInDD = 24 * minutesInHH;

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
