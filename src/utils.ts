/**
 * Converts an XMLTV timestamp string to a UTC Date object.
 * @param timestamp The XMLTV timestamp string to convert.
 * @returns A Date object representing the UTC time of the timestamp.
 */
export function xmltvTimestampToUtcDate(timestamp: string) {
  timestamp = timestamp.replace(/[\s]/g, '');
  let mainPart, timeZone;

  const numberOnlyTimestamp = timestamp.replace(/\D+/g, '');

  if (numberOnlyTimestamp.length <= 8) {
    if (numberOnlyTimestamp.length === 8) {
      const year = parseInt(numberOnlyTimestamp.slice(0, 4), 10);
      const month = parseInt(numberOnlyTimestamp.slice(4, 6), 10) - 1 || 0;
      const day = parseInt(numberOnlyTimestamp.slice(6, 8), 10) || 1;

      return new Date(Date.UTC(year, month, day));
    }

    if (numberOnlyTimestamp.length === 6) {
      const year = parseInt(numberOnlyTimestamp.slice(0, 4), 10);
      const month = parseInt(numberOnlyTimestamp.slice(4, 6), 10) - 1 || 0;

      return new Date(Date.UTC(year, month));
    }

    if (numberOnlyTimestamp.length === 4) {
      return new Date(numberOnlyTimestamp);
    }
  }

  if (timestamp.endsWith('Z')) {
    mainPart = timestamp.slice(0, -1);
    timeZone = null; // No adjustment needed for UTC
  } else {
    mainPart = timestamp.slice(0, -5);
    timeZone = timestamp.slice(-5);
  }

  const cleanTimestamp = mainPart.replace(/[-:Zz]/g, '');

  const year = parseInt(cleanTimestamp.slice(0, 4), 10);
  const month = parseInt(cleanTimestamp.slice(4, 6), 10) - 1 || 0;
  const day = parseInt(cleanTimestamp.slice(6, 8), 10) || 1;
  const hours = parseInt(cleanTimestamp.slice(8, 10), 10) || 0;
  const minutes = parseInt(cleanTimestamp.slice(10, 12), 10) || 0;
  const seconds = parseInt(cleanTimestamp.slice(12, 14), 10) || 0;

  const date = new Date(Date.UTC(year, month, day, hours, minutes, seconds));

  if (timeZone) {
    const offsetSign = timeZone.slice(0, 1);
    const offsetHours = parseInt(timeZone.slice(1, 3), 10);
    const offsetMinutes = parseInt(timeZone.slice(3, 5), 10);
    const totalOffsetMinutes = offsetHours * 60 + offsetMinutes;

    if (offsetSign === '+') {
      date.setUTCMinutes(date.getUTCMinutes() - totalOffsetMinutes);
    } else if (offsetSign === '-') {
      date.setUTCMinutes(date.getUTCMinutes() + totalOffsetMinutes);
    }
  }

  return date;
}

/**
 * Converts a UTC Date object to an XMLTV timestamp string.
 * @param date The Date object to convert.
 * @returns An XMLTV timestamp string representing the UTC time of the date.
 */
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

/**
 * Reverses the xmltvTranslations. So that we can convert from
 * camelCase to the XMLTV format.
 * @param map The map to reverse.
 * @returns A new map with the keys and values reversed.
 */
export function reverseMap<T extends Map<any, any>>(map: Map<any, any>) {
  const reversedMap = new Map<any, any>();

  for (const [key, value] of map.entries()) {
    reversedMap.set(value, key);
  }

  return reversedMap as T;
}
