import fs from 'node:fs';
import { describe, expect, test } from 'vitest';
import { objectToDom, parseXmltv, writeXmltv } from '../src/main';

const fileAsString = fs.readFileSync(`./tests/fixtures/example.xml`, {
  encoding: 'utf-8',
});

const fileWithOnlyChannelData = fs.readFileSync(`./tests/fixtures/channel-only.xml`, {
  encoding: 'utf-8',
});

describe('Parses a XMLTV file', () => {
  test('Fully parses to a JS object', async () => {
    const parsed = parseXmltv(fileAsString);
    expect(parsed).toMatchSnapshot();
  });

  test('it can convert back to xml', () => {
    const parsed = parseXmltv(fileAsString);
    const xml = writeXmltv(parsed);
    expect(xml).toMatchSnapshot();
  });

  test('it can convert an object into the dom structure', () => {
    const obj = parseXmltv(fileAsString);
    const dom = objectToDom(obj);

    expect(dom).toMatchSnapshot();
  });

  test('convertToDom produces the same DOM as an xml file parse', () => {
    const [, , exampleOutput] = parseXmltv(fileAsString, { asDom: true });
    const xml = parseXmltv(fileAsString);
    const [dom] = objectToDom(xml);

    expect(exampleOutput).toEqual(dom);
  });

  test('Handles empty input string gracefully', () => {
    const parsed = parseXmltv('');
    expect(parsed).toEqual({});
  });

  test('Throws error on malformed XML input string', () => {
    const malformedXml = '<tv><channel></tv>';
    expect(() => parseXmltv(malformedXml)).toThrowError(`Unexpected close tag
Line: 0
Column: 18
Char: >`);
  });

  test('Parses a XMLTV file with only channel data', () => {
    const parsed = parseXmltv(fileWithOnlyChannelData);

    expect(parsed).toEqual({
      channels: [{ displayName: [{ _value: 'Channel 1' }], id: '1' }],
    });
  });
});
