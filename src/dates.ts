export function xmltvTimestampToUtcDate(timestamp: string) {
  const cleanTimestamp = timestamp.replace(/[- :Zz]/g, "");

  const year = parseInt(cleanTimestamp.slice(0, 4), 10);
  const month = parseInt(cleanTimestamp.slice(4, 6), 10) - 1 || 0;
  const day = parseInt(cleanTimestamp.slice(6, 8), 10) || 1;
  const hours = parseInt(cleanTimestamp.slice(8, 10), 10) || 0;
  const minutes = parseInt(cleanTimestamp.slice(10, 12), 10) || 0;
  const seconds = parseInt(cleanTimestamp.slice(12, 14), 10) || 0;
  const timeZone = cleanTimestamp.length > 14 ? cleanTimestamp.slice(-5) : null;

  const date = new Date(Date.UTC(year, month, day, hours, minutes, seconds));

  if (timeZone) {
    const offsetSign = timeZone.slice(0, 1);
    const offsetHours = parseInt(timeZone.slice(1, 3), 10);
    const offsetMinutes = parseInt(timeZone.slice(3, 5), 10);
    const totalOffsetMinutes = offsetHours * 60 + offsetMinutes;

    if (offsetSign === "+") {
      date.setUTCMinutes(date.getUTCMinutes() - totalOffsetMinutes);
    } else if (offsetSign === "-") {
      date.setUTCMinutes(date.getUTCMinutes() + totalOffsetMinutes);
    }
  }

  return date;
}

export function dateToXmltvUtcTimestamp(date: Date) {
  const padZeroes = (num: number) => (num < 10 ? `0${num}` : num.toString());

  const year = padZeroes(date.getUTCFullYear());
  const month = padZeroes(date.getUTCMonth() + 1);
  const day = padZeroes(date.getUTCDate());
  const hours = padZeroes(date.getUTCHours());
  const minutes = padZeroes(date.getUTCMinutes());
  const seconds = padZeroes(date.getUTCSeconds());

  return `${year}${month}${day}${hours}${minutes}${seconds} +0000`;
}
