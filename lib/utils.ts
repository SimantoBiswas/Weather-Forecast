type ClassValue = string | number | null | false | undefined | ClassValue[];

/** Lightweight className combiner (avoids pulling in clsx as a dependency). */
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) out.push(nested);
    } else {
      out.push(String(input));
    }
  }
  return out.join(' ');
}

/** Format a temperature value, rounding to the nearest whole degree. */
export function formatTemp(value: number, unit: 'C' | 'F' = 'C'): string {
  return `${Math.round(value)}°${unit}`;
}

export function celsiusToFahrenheit(c: number): number {
  return (c * 9) / 5 + 32;
}

/** Format an ISO timestamp as a short hour label, e.g. "3 PM". */
export function formatHour(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString('en-US', { hour: 'numeric' });
}

/** Format an ISO timestamp as a clock time, e.g. "6:42 AM". */
export function formatClock(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

/** Format an ISO date string as a weekday label, e.g. "Mon". */
export function formatWeekday(iso: string, index: number): string {
  if (index === 0) return 'Today';
  const date = new Date(iso);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

/** Format an ISO date string as "Mon, 15 Jun". */
export function formatLongDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

/** Convert meters/sec wind speed (Open-Meteo default) is already km/h with our units param. */
export function formatWindSpeed(value: number): string {
  return `${Math.round(value)} km/h`;
}

/** Convert visibility from meters to a readable km string. */
export function formatVisibility(meters: number): string {
  const km = meters / 1000;
  return `${km >= 10 ? Math.round(km) : km.toFixed(1)} km`;
}

/** Convert wind degrees into a compass direction. */
export function windDirectionLabel(deg: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
}

/** Simple debounce for search input. */
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}
