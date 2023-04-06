import { XmltvDom } from "./types";

/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Tobias Nickel
 *
 * Copyright (c) 2023 Liam Potter
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
 * NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * @author: Tobias Nickel
 * @created: 06.04.2015
 * I needed a small xml parser that can be used in a worker.
 *
 * @author: Liam Potter
 * @created: 03.04.2023
 * Based on the original work of Tobias Nickel (txml)
 * I removed the more generic parts of the parser to focus on working with the XMLTV format
 * Outputs a more fluent object structure matching the Xmltv types
 */

export function parser(xmltvString: string): XmltvDom {
  let pos = 0;

  const openBracket = "<";
  const closeBracket = ">";
  const openBracketCC = openBracket.charCodeAt(0);
  const closeBracketCC = closeBracket.charCodeAt(0);
  const minusCC = "-".charCodeAt(0);
  const slashCC = "/".charCodeAt(0);
  const exclamationCC = "!".charCodeAt(0);
  const singleQuoteCC = "'".charCodeAt(0);
  const doubleQuoteCC = '"'.charCodeAt(0);
  const openCornerBracketCC = "[".charCodeAt(0);
  const closeCornerBracketCC = "]".charCodeAt(0);
  const questionMarkCC = "?".charCodeAt(0);
  const nameSpacer = "\r\n\t>/= ";
  const noChildNodes = ["new", "icon", "previously-shown"];

  /**
   * parsing a list of entries
   */
  function parseChildren(tagName: string): XmltvDom {
    const children: XmltvDom = [];
    while (xmltvString[pos]) {
      if (xmltvString.charCodeAt(pos) == openBracketCC) {
        if (xmltvString.charCodeAt(pos + 1) === slashCC) {
          const closeStart = pos + 2;
          pos = xmltvString.indexOf(closeBracket, pos);

          const closeTag = xmltvString.substring(closeStart, pos);
          if (closeTag.indexOf(tagName) == -1) {
            const parsedText = xmltvString.substring(0, pos).split("\n");
            throw new Error(
              "Unexpected close tag\nLine: " +
                (parsedText.length - 1) +
                "\nColumn: " +
                (parsedText[parsedText.length - 1].length + 1) +
                "\nChar: " +
                xmltvString[pos]
            );
          }

          if (pos + 1) pos += 1;

          return children;
        } else if (xmltvString.charCodeAt(pos + 1) === exclamationCC) {
          if (xmltvString.charCodeAt(pos + 2) == minusCC) {
            //comment support
            while (
              pos !== -1 &&
              !(
                xmltvString.charCodeAt(pos) === closeBracketCC &&
                xmltvString.charCodeAt(pos - 1) == minusCC &&
                xmltvString.charCodeAt(pos - 2) == minusCC &&
                pos != -1
              )
            ) {
              pos = xmltvString.indexOf(closeBracket, pos + 1);
            }
            if (pos === -1) {
              pos = xmltvString.length;
            }
          } else {
            // doctype support
            const startDoctype = pos + 1;
            pos += 2;
            let encapsulated = false;
            while (
              (xmltvString.charCodeAt(pos) !== closeBracketCC ||
                encapsulated === true) &&
              xmltvString[pos]
            ) {
              if (xmltvString.charCodeAt(pos) === openCornerBracketCC) {
                encapsulated = true;
              } else if (
                encapsulated === true &&
                xmltvString.charCodeAt(pos) === closeCornerBracketCC
              ) {
                encapsulated = false;
              }
              pos++;
            }
            children.push(xmltvString.substring(startDoctype, pos));
          }
          pos++;
          continue;
        }
        const node = parseNode();
        children.push(node);
        if (node.tagName.charCodeAt(0) === questionMarkCC) {
          for (let i = 0, x = node.children.length; i < x; i++) {
            children.push(node.children[i]);
          }
          node.children = [];
        }
      } else {
        const text = parseText().trim();

        if (text.length > 0) {
          children.push(text);
        }
        pos++;
      }
    }
    return children;
  }

  /**
   *    returns the text outside of texts until the first '<'
   */
  function parseText() {
    const start = pos;
    pos = xmltvString.indexOf(openBracket, pos) - 1;
    if (pos === -2) pos = xmltvString.length;
    return xmltvString.slice(start, pos + 1);
  }
  /**
   *    returns text until the first nonAlphabetic letter
   */

  function parseName() {
    const start = pos;
    while (nameSpacer.indexOf(xmltvString[pos]) === -1 && xmltvString[pos]) {
      pos++;
    }
    return xmltvString.slice(start, pos);
  }

  function parseNode() {
    pos++;
    const tagName = parseName();
    const attributes: Record<string, any> = {};
    let children: XmltvDom = [];

    // parsing attributes
    while (xmltvString.charCodeAt(pos) !== closeBracketCC && xmltvString[pos]) {
      const c = xmltvString.charCodeAt(pos);
      if ((c > 64 && c < 91) || (c > 96 && c < 123)) {
        const name = parseName();
        // search beginning of the string
        let code = xmltvString.charCodeAt(pos);
        let value;
        while (
          code &&
          code !== singleQuoteCC &&
          code !== doubleQuoteCC &&
          !((code > 64 && code < 91) || (code > 96 && code < 123)) &&
          code !== closeBracketCC
        ) {
          pos++;
          code = xmltvString.charCodeAt(pos);
        }
        if (code === singleQuoteCC || code === doubleQuoteCC) {
          value = parseString();
          if (pos === -1) {
            return {
              tagName,
              attributes,
              children,
            };
          }
        } else {
          value = null;
          pos--;
        }
        attributes[name] = value;
      }
      pos++;
    }
    // optional parsing of children
    if (xmltvString.charCodeAt(pos - 1) !== slashCC) {
      if (noChildNodes.indexOf(tagName) === -1) {
        pos++;
        children = parseChildren(tagName);
      } else {
        pos++;
      }
    } else {
      pos++;
    }
    return {
      tagName,
      attributes,
      children,
    };
  }

  function parseString(): string {
    const startChar = xmltvString[pos];
    const start = pos + 1;
    pos = xmltvString.indexOf(startChar, start);
    return xmltvString.slice(start, pos);
  }

  return parseChildren("");
}
