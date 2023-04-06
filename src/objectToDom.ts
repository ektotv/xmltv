import type { XmltvDOMNode } from "./types";
import { dateToXmltvUtcTimestamp } from "./dates.js";
import {
  ReversedXmlTranslations,
  xmltvTranslationsReversed,
  xmltvTagAttributes,
} from "./xmltvTagsAttributes.js";

/**
 * Converts an XMLTV object to a DOM tree
 *
 * @param obj The XMLTV object to convert to a DOM tree
 * @param key The current key to loop over
 * @param isArrayChild Controls if the return is an array or not
 * @returns The DOM tree
 */
export function objectToDom(obj: any, key = "tv", isArrayChild = false): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => objectToDom(item, key, true));
  }

  if (typeof obj === "number") {
    return obj.toString();
  }

  if (typeof obj === "string") {
    return obj;
  }

  if (obj instanceof Date && key !== "date") {
    return dateToXmltvUtcTimestamp(obj);
  }

  if (typeof obj === "boolean" && key !== "new") {
    return obj ? "yes" : "no";
  }

  const translatedTagName =
    xmltvTranslationsReversed.tags[
      key as keyof ReversedXmlTranslations["tags"]
    ] || key;

  const xmltvDOMNode: XmltvDOMNode = {
    tagName: translatedTagName,
    attributes: {},
    children: [],
  };

  for (let childKey in obj) {
    const translatedAttributeName =
      xmltvTranslationsReversed.attributes[
        childKey as keyof ReversedXmlTranslations["attributes"]
      ] || childKey;

    if (obj[childKey].tagName === "new") {
      obj[translatedTagName].children = [];
      continue;
    }

    if (
      (xmltvTagAttributes.indexOf(translatedAttributeName) >= 0 &&
        typeof obj[childKey] !== "object") ||
      obj[childKey] instanceof Date
    ) {
      if (xmltvDOMNode.tagName === "credits" && childKey === "guest") {
        continue;
      }
      if (xmltvDOMNode.tagName === "programme" && childKey === "channel") {
        xmltvDOMNode.attributes[translatedAttributeName] = obj[childKey];
        continue;
      }

      if (xmltvDOMNode.tagName === "tv" && childKey === "date") {
        xmltvDOMNode.attributes[translatedAttributeName] =
          dateToXmltvUtcTimestamp(obj[childKey]);
        continue;
      }

      if (xmltvDOMNode.tagName === "programme" && childKey === "date") {
        xmltvDOMNode.children.push({
          tagName: translatedAttributeName,
          attributes: {},
          children: [dateToXmltvUtcTimestamp(obj[childKey])],
        });
        continue;
      }

      const childJsType = typeof obj[childKey];

      if (childJsType === "number") {
        xmltvDOMNode.attributes[translatedAttributeName] =
          obj[childKey].toString();
        continue;
      }

      if (childJsType === "boolean") {
        xmltvDOMNode.attributes[translatedAttributeName] = obj[childKey]
          ? "yes"
          : "no";
        continue;
      }

      if (childJsType === "object" && !Array.isArray(obj[childKey])) {
        if (obj[childKey] instanceof Date) {
          obj[childKey] = dateToXmltvUtcTimestamp(obj[childKey]);
          xmltvDOMNode.attributes[translatedAttributeName] = obj[childKey];
          continue;
        }

        const normalizedAttrs = Object.keys(obj[childKey]).map((key) => {
          obj[childKey][key] = obj[childKey][key].toString();
        });

        xmltvDOMNode.attributes[translatedAttributeName] = normalizedAttrs;
        continue;
      }
      xmltvDOMNode.attributes[translatedAttributeName] = obj[childKey];
    } else {
      const childNode = objectToDom(obj[childKey], childKey);
      if (Array.isArray(childNode)) {
        xmltvDOMNode.children = [...xmltvDOMNode.children, ...childNode];
      } else {
        if (childKey !== "_value") {
          xmltvDOMNode.children.push({
            tagName: translatedAttributeName,
            attributes: {},
            children: [childNode],
          });
          continue;
        }
        xmltvDOMNode.children.push(childNode);
      }
    }
  }

  return isArrayChild ? xmltvDOMNode : [xmltvDOMNode];
}
