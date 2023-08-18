import fs from 'node:fs';
import path from 'node:path';
import epgParser from 'epg-parser';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import { bench, describe } from 'vitest';
import xmltv from 'xmltv';
import { parser, parseXmltv, writeXmltv } from '../src/main.js';
import type { XmltvAttributes, XmltvTags } from '../src/xmltvTagsAttributes.js';
import { xmltvAttributeTranslations, xmltvTagTranslations } from '../src/xmltvTranslations.js';

const files = ['example.xml'];
const file = files[0];
const xmltvString = fs.readFileSync(`./tests/fixtures/${file}`, {
  encoding: 'utf-8',
});

const preParsed = parser(xmltvString);

// these options bring it to feature parity with @iptv/xmltv
const fxpParser = new XMLParser({
  ignoreAttributes: false,
  alwaysCreateTextNode: true,
  parseTagValue: true,
  preserveOrder: true,
  trimValues: true,
  transformTagName: (tag) => xmltvTagTranslations.get(tag as XmltvTags) || tag,
  transformAttributeName: (tag) => xmltvAttributeTranslations.get(tag as XmltvAttributes) || tag,
});

// unable to transform tags and attributes with XMLBuilder
const fxpBuilder = new XMLBuilder({
  ignoreAttributes: false,
  preserveOrder: true,
});
const fxpParsed = fxpParser.parse(xmltvString);

describe('Writing XML Files', () => {
  bench('@iptv/xmltv', () => {
    writeXmltv(preParsed, { fromDom: true });
  });

  bench('fast-xml-parser', () => {
    fxpBuilder.build(fxpParsed);
  });
});

describe('Parsing XML Files', () => {
  bench('@iptv/xmltv parseXmltv', () => {
    parseXmltv(xmltvString);
  });

  bench('@iptv/xmltv parser', () => {
    parser(xmltvString);
  });

  bench('fast-xml-parser', () => {
    fxpParser.parse(xmltvString);
  });

  bench('epg-parser', () => {
    epgParser.parse(xmltvString);
  });

  bench('xmltv', async () => {
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
  });
});
