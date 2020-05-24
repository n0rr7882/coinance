export function toTimestamp(date: Date) {
  return Math.floor(date.valueOf() / 1000);
}

export function fromTimestamp(timestamp: number) {
  return new Date(timestamp * 1000);
}

export function toMsTimestamp(date: Date) {
  return date.valueOf();
}

export function fromMsTimestamp(timestamp: number) {
  return new Date(timestamp);
}