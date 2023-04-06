import type { XmltvDomNode } from "./types";
import { dateToXmltvUtcTimestamp } from "./utils.js";
import {
  xmltvAttributeTranslationsReversed,
  xmltvTagTranslationsReversed,
} from "./xmltvTranslations.js";
import { XmltvAttributes, xmltvAttributes } from "./xmltvTagsAttributes.js";

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

  const translatedTagName = xmltvTagTranslationsReversed.get(key) || key;

  const DomNode: XmltvDomNode = {
    tagName: translatedTagName,
    attributes: {},
    children: [],
  };

  for (let childKey in obj) {
    const translatedAttributeName =
      xmltvAttributeTranslationsReversed.get(childKey) || childKey;

    if (obj[childKey].tagName === "new") {
      obj[translatedTagName].children = [];
      continue;
    }

    if (
      (xmltvAttributes.indexOf(translatedAttributeName as XmltvAttributes) >=
        0 &&
        typeof obj[childKey] !== "object") ||
      obj[childKey] instanceof Date
    ) {
      if (DomNode.tagName === "credits" && childKey === "guest") {
        continue;
      }
      if (DomNode.tagName === "programme" && childKey === "channel") {
        DomNode.attributes[translatedAttributeName] = obj[childKey];
        continue;
      }

      if (DomNode.tagName === "tv" && childKey === "date") {
        DomNode.attributes[translatedAttributeName] = dateToXmltvUtcTimestamp(
          obj[childKey]
        );
        continue;
      }

      if (DomNode.tagName === "programme" && childKey === "date") {
        DomNode.children.push({
          tagName: translatedAttributeName,
          attributes: {},
          children: [dateToXmltvUtcTimestamp(obj[childKey])],
        });
        continue;
      }

      const childJsType = typeof obj[childKey];

      if (childJsType === "number") {
        DomNode.attributes[translatedAttributeName] = obj[childKey].toString();
        continue;
      }

      if (childJsType === "boolean") {
        DomNode.attributes[translatedAttributeName] = obj[childKey]
          ? "yes"
          : "no";
        continue;
      }

      if (childJsType === "object" && !Array.isArray(obj[childKey])) {
        if (obj[childKey] instanceof Date) {
          obj[childKey] = dateToXmltvUtcTimestamp(obj[childKey]);
          DomNode.attributes[translatedAttributeName] = obj[childKey];
          continue;
        }

        const normalizedAttrs = Object.keys(obj[childKey]).map((key) => {
          obj[childKey][key] = obj[childKey][key].toString();
        });

        DomNode.attributes[translatedAttributeName] = normalizedAttrs;
        continue;
      }
      DomNode.attributes[translatedAttributeName] = obj[childKey];
    } else {
      const childNode = objectToDom(obj[childKey], childKey);
      if (Array.isArray(childNode)) {
        for (let i = 0, x = childNode.length; i < x; i++) {
          DomNode.children.push(childNode[i]);
        }
      } else {
        if (childKey !== "_value") {
          DomNode.children.push({
            tagName: translatedAttributeName,
            attributes: {},
            children: [childNode],
          });
          continue;
        }
        DomNode.children.push(childNode);
      }
    }
  }

  return isArrayChild ? DomNode : [DomNode];
}
