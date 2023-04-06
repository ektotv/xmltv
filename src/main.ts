import { parser } from "./parser.js";
import { writer } from "./writer.js";
import { objectToDom } from "./objectToDom.js";
import { toObject } from "./toObject.js";
import type {
  Xmltv,
  XmltvAudio,
  XmltvChannel,
  XmltvCreditImage,
  XmltvCredits,
  XmltvDOM,
  XmltvDisplayName,
  XmltvEpisodeNumber,
  XmltvIcon,
  XmltvImage,
  XmltvLength,
  XmltvPerson,
  XmltvPreviouslyShown,
  XmltvProgramme,
  XmltvRating,
  XmltvReview,
  XmltvStarRating,
  XmltvSubtitle,
  XmltvUrl,
  XmltvVideo,
} from "./types";

type ParseXmltvOptions = {
  asDom: boolean;
};

type WriteXmltvOptions = {
  fromDom: boolean;
};

/**
 * parseXmltv
 *
 * Parses an xmltv file and returns an `Xmltv` object or a DOM tree
 *
 * @param xmltvString The xmltv file content as a string
 * @param options Options to parse the xmltv file
 * @param options.asDom If true, the xmltv file will be returned as a DOM tree
 */
function parseXmltv(
  xmltvString: string,
  options: ParseXmltvOptions & { asDom: true }
): XmltvDOM;
function parseXmltv(
  xmltvString: string,
  options: ParseXmltvOptions & { asDom: false }
): XmltvDOM;
function parseXmltv(xmltvString: string): Xmltv;

function parseXmltv(
  xmltvString: string,
  options: ParseXmltvOptions = { asDom: false }
): Xmltv | XmltvDOM {
  const parsed = parser(xmltvString);
  if (options.asDom) {
    return parsed;
  }

  return <Xmltv>toObject(parsed);
}

/**
 * writeXmltv
 *
 * Writes an `Xmltv` object or a DOM tree to an xmltv string
 *
 * @param xmltv The `Xmltv` object or a DOM tree
 * @param options Options to write the xmltv file
 * @param options.fromDom If true, the xmltv file will be written from a DOM tree
 * @returns The xmltv file content as a string
 * @throws If `options.fromDom` is true and `xmltv` is an `Xmltv` object
 */
function writeXmltv(
  xmltv: XmltvDOM,
  options: WriteXmltvOptions & { fromDom: true }
): string;
function writeXmltv(
  xmltv: Xmltv,
  options: WriteXmltvOptions & { fromDom: false }
): string;
function writeXmltv(xmltv: Xmltv): string;

function writeXmltv(
  xmltv: Xmltv | XmltvDOM,
  options: WriteXmltvOptions = { fromDom: false }
): string {
  if (options.fromDom) {
    if (typeof xmltv === "object" && !Array.isArray(xmltv)) {
      throw new Error(
        "Cannot write XMLTV from a DOM object that has been converted to an object"
      );
    }
    return writer(xmltv);
  }
  const dom = objectToDom(xmltv);
  return writer(dom);
}

export { parseXmltv, writeXmltv, writer, objectToDom, parser };

export type {
  Xmltv,
  XmltvChannel,
  XmltvDisplayName,
  XmltvProgramme,
  XmltvAudio,
  XmltvCreditImage,
  XmltvCredits,
  XmltvEpisodeNumber,
  XmltvIcon,
  XmltvImage,
  XmltvLength,
  XmltvPerson,
  XmltvPreviouslyShown,
  XmltvRating,
  XmltvReview,
  XmltvStarRating,
  XmltvSubtitle,
  XmltvUrl,
  XmltvVideo,
};
