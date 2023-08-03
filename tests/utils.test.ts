import { describe, expect, test } from 'vitest';
import { dateToXmltvUtcTimestamp, xmltvTimestampToUtcDate } from '../src/utils';

describe('dateToXmltvUtcTimestamp', () => {
  test('should return a valid xmltv UTC timestamp', () => {
    const date = new Date('2022-01-01T00:00:00Z');
    const expected = '20220101000000 +0000';
    const result = dateToXmltvUtcTimestamp(date);
    expect(result).toEqual(expected);
  });
});

describe('xmltvTimestampToUtcDate', () => {
  test('should return a valid UTC date', () => {
    const timestamp = '20220101000000 +0000';
    const expected = new Date('2022-01-01T00:00:00Z');
    const result = xmltvTimestampToUtcDate(timestamp);
    expect(result).toEqual(expected);
  });

  test('should handle positive timezones', () => {
    const timestamp = '20220101000000 +0100';
    const expected = new Date('2021-12-31T23:00:00Z');
    const result = xmltvTimestampToUtcDate(timestamp);
    expect(result).toEqual(expected);
  });

  test('should handle negative timezones ', () => {
    const timestamp = '20220101000000 -0400';
    const expected = new Date('2022-01-01T04:00:00Z');
    const result = xmltvTimestampToUtcDate(timestamp);
    expect(result).toEqual(expected);
  });

  test('should handle misformatted timestamps ', () => {
    const timestamp = '2022 01 01 000000    -0400';
    const expected = new Date('2022-01-01T04:00:00Z');
    const result = xmltvTimestampToUtcDate(timestamp);
    expect(result).toEqual(expected);
  });

  test('should handle iso formatted timestamps without spaces ', () => {
    const timestamp = '2022-01-01T00:00:00.000-0400';
    const expected = new Date('2022-01-01T04:00:00Z');
    const result = xmltvTimestampToUtcDate(timestamp);
    expect(result).toEqual(expected);
  });

  test('should handle iso formatted timestamps with Z timezone', () => {
    const timestamp = '2022-01-01T00:00:00.000Z';
    const expected = new Date('2022-01-01T00:00:00Z');
    const result = xmltvTimestampToUtcDate(timestamp);
    expect(result).toEqual(expected);
  });
});
