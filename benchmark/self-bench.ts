#!/usr/bin/env -S ts-node --esm
import fs from 'node:fs';
import { add, complete, cycle, suite } from 'benny';
import { parseXmltv } from '../src/main.js';
import { files } from '../tests/fixtures/files.js';

files.unshift('example.xml');

const file = files[0];
const xmltvString = fs.readFileSync(`./tests/fixtures/${file}`, {
  encoding: 'utf-8',
});

suite(
  'XMLTV Parsing',
  add('@iptv/xmltv DOM parse', () => {
    parseXmltv(xmltvString, { asDom: true });
  }),
  add('@iptv/xmltv DOM parse', () => {
    parseXmltv(xmltvString, { asDom: true });
  }),
  add('@iptv/xmltv DOM parse', () => {
    parseXmltv(xmltvString, { asDom: true });
  }),
  add('@iptv/xmltv DOM parse', () => {
    parseXmltv(xmltvString, { asDom: true });
  }),
  add('@iptv/xmltv DOM parse', () => {
    parseXmltv(xmltvString, { asDom: true });
  }),
  cycle(),
  complete(),
);
