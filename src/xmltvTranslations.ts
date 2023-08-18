import { reverseMap } from './utils.js';
import { xmltvAttributes, xmltvTags } from './xmltvTagsAttributes.js';
import type { XmltvAttributes, XmltvTags } from './xmltvTagsAttributes.js';

/**
 * The map of XMLTV strings to preferred JS strings
 *
 * Why use a map?
 *
 * Instead of using a function to convert to camelCase, we use a map.
 * This is because performance is important in this library, and picking
 * from a map is faster than running a function. It also allows us to
 * translate by any rule we want, pluralisation, internationalisation, etc.
 *
 * Here are the results of running a benchmark comparing picking from a
 * map vs running a transform function:
 *       map: 6 470 122 ops/s, ±0.21%   | fastest
 *   convert: 232 614 ops/s, ±0.27%     | slowest, 96.4% slower
 *
 */

type XmltvTagTranslations = Map<XmltvTags, string>;
type XmltvAttributeTranslations = Map<XmltvAttributes, string>;
type XmltvTagTranslationsReversed = Map<string, XmltvTags>;
type XmltvAttributeTranslationsReversed = Map<string, XmltvAttributes>;

const xmltvTagTranslations: XmltvTagTranslations = new Map([...xmltvTags.map((x) => [x, x] as [XmltvTags, string])]);

const xmltvAttributeTranslations: XmltvAttributeTranslations = new Map([
  ...xmltvAttributes.map((x) => [x, x] as [XmltvAttributes, string]),
]);

const xmltvTagTranslationsReversed = reverseMap<XmltvTagTranslationsReversed>(xmltvTagTranslations);
const xmltvAttributeTranslationsReversed = reverseMap<XmltvAttributeTranslationsReversed>(xmltvAttributeTranslations);

/**
 * Adds or modifies a translation for a XMLTV tag
 *
 * @param key A valid Xmltv tag string
 * @param value Your translation
 */
function addTagTranslation(key: XmltvTags, value: string) {
  if (!xmltvTags.includes(key)) {
    throw new Error(`Invalid tag: ${key}`);
  }

  const map: XmltvTagTranslations = xmltvTagTranslations;
  const reverse: XmltvTagTranslationsReversed = xmltvTagTranslationsReversed;

  if (map && reverse) {
    map.set(key, value);
    reverse.set(value, key);
  }
}

/**
 * Adds or modifies a translation for a XMLTV attribute
 *
 * @param key A valid Xmltv attribute string
 * @param value Your translation
 */
function addAttributeTranslation(key: XmltvAttributes, value: string) {
  if (!xmltvAttributes.includes(key)) {
    throw new Error(`Invalid attribute: ${key}`);
  }

  const map: XmltvAttributeTranslations = xmltvAttributeTranslations;
  const reverse: XmltvAttributeTranslationsReversed = xmltvAttributeTranslationsReversed;

  if (map && reverse) {
    map.set(key, value);
    reverse.set(value, key);
  }
}

addTagTranslation('display-name', 'displayName');
addTagTranslation('episode-num', 'episodeNum');
addTagTranslation('last-chance', 'lastChance');
addTagTranslation('orig-language', 'origLanguage');
addTagTranslation('previously-shown', 'previouslyShown');
addTagTranslation('star-rating', 'starRating');
addTagTranslation('sub-title', 'subTitle');
addTagTranslation('channel', 'channels');
addTagTranslation('programme', 'programmes');

addAttributeTranslation('generator-info-name', 'generatorInfoName');
addAttributeTranslation('generator-info-url', 'generatorInfoUrl');
addAttributeTranslation('pdc-start', 'pdcStart');
addAttributeTranslation('vps-start', 'vpsStart');
addAttributeTranslation('source-data-url', 'sourceDataUrl');
addAttributeTranslation('source-info-name', 'sourceInfoName');
addAttributeTranslation('source-info-url', 'sourceInfoUrl');

export {
  xmltvTagTranslations,
  xmltvTagTranslationsReversed,
  xmltvAttributeTranslations,
  xmltvAttributeTranslationsReversed,
  addTagTranslation,
  addAttributeTranslation,
};

export type { XmltvTagTranslations, XmltvAttributeTranslations };
