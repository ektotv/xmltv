import type { ReverseMap } from "./types";

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
 * @todo Add a way for a user to provide their own map
 */
const xmltvTranslations = {
  attributes: {
    channel: "channel",
    clumpidx: "clumpidx",
    date: "date",
    "generator-info-name": "generatorInfoName",
    "generator-info-url": "generatorInfoUrl",
    guest: "guest",
    height: "height",
    id: "id",
    lang: "lang",
    orient: "orient",
    "pdc-start": "pdcStart",
    reviewer: "reviewer",
    role: "role",
    showview: "showview",
    size: "size",
    source: "source",
    src: "src",
    start: "start",
    stop: "stop",
    "source-data-url": "sourceDataUrl",
    "source-info-name": "sourceInfoName",
    "source-info-url": "sourceInfoUrl",
    system: "system",
    type: "type",
    units: "units",
    videoplus: "videoplus",
    "vps-start": "vpsStart",
    width: "width",
  },
  tags: {
    audio: "audio",
    aspect: "aspect",
    colour: "colour",
    actor: "actor",
    category: "category",
    channel: "channels",
    composer: "composer",
    adapter: "adapter",
    producer: "producer",
    editor: "editor",
    presenter: "presenter",
    commentator: "commentator",
    guest: "guest",
    stereo: "stereo",
    country: "country",
    credits: "credits",
    date: "date",
    desc: "desc",
    "display-name": "displayName",
    director: "director",
    "episode-num": "episodeNum",
    icon: "icon",
    image: "image",
    new: "new",
    length: "length",
    keyword: "keyword",
    "last-chance": "lastChance",
    language: "language",
    "orig-language": "origLanguage",
    premiere: "premiere",
    present: "present",
    "previously-shown": "previouslyShown",
    programme: "programmes",
    quality: "quality",
    rating: "rating",
    review: "review",
    subtitles: "subtitles",
    "star-rating": "starRating",
    "sub-title": "subTitle",
    title: "title",
    tv: "tv",
    url: "url",
    value: "value",
    video: "video",
    writer: "writer",
  },
} as const;

type XmltvTag = keyof typeof xmltvTranslations.tags;
type XmltvTagAttribute = keyof typeof xmltvTranslations.attributes;
type XmltvTranslationMap = typeof xmltvTranslations;
type ReversedTagTranslations = ReverseMap<XmltvTranslationMap["tags"]>;
type ReversedAttributeTranslations = ReverseMap<
  XmltvTranslationMap["attributes"]
>;

type ReversedXmlTranslations = {
  tags: ReversedTagTranslations;
  attributes: ReversedAttributeTranslations;
};

/**
 * Reverses the xmltvTranslations object. So that we can convert from
 * camelCase to the xmltv format.
 */
function reverseXmlTranslations<
  T extends ReversedTagTranslations | ReversedAttributeTranslations
>(obj: Record<string, any>): T {
  const reversedObj: any = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key as keyof XmltvTranslationMap];
      reversedObj[value] = key as keyof XmltvTranslationMap;
    }
  }

  return <T>reversedObj;
}

const xmltvTranslationsReversed: ReversedXmlTranslations = {
  attributes: reverseXmlTranslations<ReversedAttributeTranslations>(
    xmltvTranslations.attributes
  ),
  tags: reverseXmlTranslations<ReversedTagTranslations>(xmltvTranslations.tags),
};

const xmltvTagAttributes: XmltvTagAttribute[] = Object.keys(
  xmltvTranslations.attributes
).map((x) => x as XmltvTagAttribute);

export { xmltvTagAttributes, xmltvTranslations, xmltvTranslationsReversed };

export type { XmltvTag, ReversedXmlTranslations };
