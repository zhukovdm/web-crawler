type DaysHoursMinutesType = {
  dd: number;
  hh: number;
  mm: number;
};

const minutesInHH = 60;
const minutesInDD = 24 * minutesInHH;

export function minutesToDdhhmm(minutes: number): DaysHoursMinutesType {

  const dd = Math.floor(minutes / minutesInDD);
  const hh = Math.floor((minutes - dd * minutesInDD) / minutesInHH);
  const mm = minutes - dd * minutesInDD - hh * minutesInHH;

  return { dd: dd, hh: hh, mm: mm };
}

export function ddhhmmToMinutes(ddhhmm: DaysHoursMinutesType): number {
  const { dd, hh, mm } = ddhhmm;
  return dd * minutesInDD + hh * minutesInHH + mm;
}
