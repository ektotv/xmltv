import type { Xmltv, XmltvDomNode } from './types';
import { xmltvTimestampToUtcDate } from './utils.js';
import type { XmltvAttributes, XmltvTags } from './xmltvTagsAttributes.js';
import { xmltvAttributeTranslations, xmltvTagTranslations } from './xmltvTranslations.js';

const questionMarkCC = '?'.charCodeAt(0);

/**
 * Elements that can only be used once wherever they appear.
 * eg <credits> can only be used once in a <programme> element
 * but <actor> can be used multiple times in a <credits> element
 */
const singleUseElements: XmltvTags[] = [
  'credits',
  'date',
  'language',
  'orig-language',
  'length',
  'country',
  'previously-shown',
  'premiere',
  'last-chance',
  'new',
  'video',
  'audio',
  // Sub-elements of 'video'
  'present',
  'colour',
  'aspect',
  'quality',
  // Sub-elements of 'audio'
  'present',
  'stereo',

  //sub-elements of rating and star rating
  'value',
];

/**
 * Elements that do not have children or attributes so can be rendered as a scalar
 *
 * eg <date>2020-01-01</date> should render as
 * { date: "2020-01-01" }
 *    instead of
 * { date: { _value: "2020-01-01" } }
 */
const elementsAsScalar: XmltvTags[] = ['date', 'value', 'aspect', 'present', 'colour', 'quality', 'stereo'];

/**
 * Convert an XmltvDom tree to a plain object
 *
 * @param children The XmltvDom tree to convert
 */
type Out = Record<string, any>;
export function toObject(
  children: any[],
  parent: XmltvDomNode = { tagName: 'tv', attributes: {}, children: [] },
): Out | boolean | string | Xmltv {
  let out: Out = {};
  if (!children.length) {
    return out;
  }

  if (children.length === 1 && typeof children[0] === 'string' && (children[0] === 'yes' || children[0] === 'no')) {
    return children[0] === 'yes';
  }

  if (children.length === 1 && typeof children[0] === 'string' && typeof parent !== 'string') {
    if (Object.keys(parent.attributes).length) {
      return {
        _value: children[0],
      };
    }
    return children[0];
  }

  // map each object

  for (let i = 0, n = children.length; i < n; i++) {
    let child = children[i];

    if (typeof parent !== 'string' && parent.tagName === 'actor' && typeof child === 'string') {
      out._value = child;
    }

    if (typeof child !== 'object') {
      continue;
    }

    if (child.tagName.charCodeAt(0) === questionMarkCC) continue;

    if (child.tagName === 'new') {
      out[child.tagName] = true;
      continue;
    }

    if (child.tagName === 'tv') {
      out = {};
    }

    const translatedName = xmltvTagTranslations.get(child.tagName) || child.tagName;

    if (!out[translatedName] && singleUseElements.indexOf(child.tagName) === -1) {
      out[translatedName] = [];
    }

    let kids: any = toObject(child.children || [], child);

    if (Object.keys(child.attributes).length) {
      if (!Array.isArray(kids)) {
        if (child.attributes.size) {
          child.attributes.size = Number(child.attributes.size);
        }

        if (translatedName === 'programmes') {
          if (child.attributes.stop) {
            child.attributes.stop = xmltvTimestampToUtcDate(child.attributes.stop);
          }

          if (child.attributes['pdc-start']) {
            child.attributes['pdc-start'] = xmltvTimestampToUtcDate(child.attributes['pdc-start']);
          }

          if (child.attributes['vps-start']) {
            child.attributes['vps-start'] = xmltvTimestampToUtcDate(child.attributes['vps-start']);
          }
        } else if (translatedName === 'icon') {
          if (child.attributes.width) {
            child.attributes.width = Number(child.attributes.width);
          }

          if (child.attributes.height) {
            child.attributes.height = Number(child.attributes.height);
          }
        } else if (child.attributes.units) {
          kids._value = Number(kids._value);
        } else if (child.attributes.guest) {
          child.attributes.guest = child.attributes.guest === 'yes';
        }

        if (child.attributes.date) {
          child.attributes.date = xmltvTimestampToUtcDate(child.attributes.date);
        }

        if (child.attributes.start) {
          child.attributes.start = xmltvTimestampToUtcDate(child.attributes.start);
        }

        const translatedAttributes = Object.keys(child.attributes).reduce(
          (acc: Record<string, string>, key: string) => {
            acc[xmltvAttributeTranslations.get(key as XmltvAttributes) || key] = child.attributes[key];
            return acc;
          },
          {},
        );

        Object.assign(kids, translatedAttributes);
      }
    }

    if (translatedName === 'subtitles') {
      if (typeof kids.language === 'string') {
        kids.language = { _value: kids.language };
      }
      out[translatedName].push(kids);
      continue;
    }

    if (translatedName === 'tv') {
      out = kids;
      continue;
    }

    if (translatedName === 'date') {
      out[translatedName] = xmltvTimestampToUtcDate(kids);
      continue;
    }

    if (typeof kids === 'string' && elementsAsScalar.indexOf(child.tagName) === -1) {
      kids = {
        _value: kids,
      };
    }

    if (Array.isArray(out[translatedName])) {
      out[translatedName].push(kids);
      continue;
    }

    out[translatedName] = kids;
  }

  return out as Xmltv;
}
