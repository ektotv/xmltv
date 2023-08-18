#!/usr/bin/env -S ts-node --esm
import fs from 'node:fs';
import path from 'node:path';
import { add, complete, cycle, save, suite } from 'benny';
import epgParser from 'epg-parser';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import xmltv from 'xmltv';
import { parseXmltv, writeXmltv } from '../src/main.js';
import type { XmltvAttributes, XmltvTags } from '../src/xmltvTagsAttributes.js';
import { xmltvAttributeTranslations, xmltvTagTranslations } from '../src/xmltvTranslations.js';
import { files } from '../tests/fixtures/files.js';

// These options bring fast-xml-parser to feature parity with @iptv/xmltv
const fxpParser = new XMLParser({
  ignoreAttributes: false,
  alwaysCreateTextNode: true,
  parseTagValue: true,
  preserveOrder: true,
  trimValues: true,
  transformTagName: (tag) => {
    return xmltvTagTranslations.get(tag as XmltvTags) || tag;
  },
  transformAttributeName: (tag) => {
    return xmltvAttributeTranslations.get(tag as XmltvAttributes) || tag;
  },
});

const file = files[0];
const xmltvString = fs.readFileSync(`./tests/fixtures/${file}`, {
  encoding: 'utf-8',
});

const parsed = parseXmltv(xmltvString, { asDom: true });

const fxpParsed = fxpParser.parse(xmltvString);

suite(
  'XMLTV Parsing',
  add('@iptv/xmltv full parse', () => {
    parseXmltv(xmltvString);
  }),
  add('@iptv/xmltv DOM parse', () => {
    parseXmltv(xmltvString, { asDom: true });
  }),
  // add("txml", () => {
  //   txml.parse(xmltvString);
  // }),
  add('epg-parser', () => {
    epgParser.parse(xmltvString);
  }),
  add('fast-xml-parser', () => {
    fxpParser.parse(xmltvString);
  }),
  add('xmltv', async () => {
    await new Promise<void>((resolve) => {
      const xmltvparser = new xmltv.Parser() as any;
      const readable = fs.createReadStream(path.resolve(path.resolve(`./tests/fixtures/${file}`)));

      readable.pipe(xmltvparser);

      const obj: { programmes: any[] } = {
        programmes: [],
      };

      xmltvparser.on('programme', function (programme: any) {
        obj.programmes.push(programme);
      });

      xmltvparser.on('end', () => {
        resolve();
      });
    });
  }),
  cycle(),
  complete(),
  save({ file: 'xmltv-parse-benchmark', version: '1.0.0' }),
  save({ file: 'xmltv-parse-benchmark', format: 'chart.html' }),
);

suite(
  'Creating XML',
  add('@iptv/xmltv creating xml', () => {
    writeXmltv(parsed, { fromDom: true });
  }),
  add('fast-xml-parser XMLBuilder', () => {
    const builder = new XMLBuilder({
      ignoreAttributes: false,
      preserveOrder: true,
    });
    builder.build(fxpParsed);
  }),
  cycle(),
  complete(),
  save({ file: 'xmltv-creation-benchmark', version: '1.0.0' }),
  save({ file: 'xmltv-creation-benchmark', format: 'chart.html' }),
);
