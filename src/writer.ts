import type { XmltvDom, XmltvDomNode } from './types';

export function writer(xmltvDom: XmltvDom): string {
  let out = '';
  function writeChildren(node: XmltvDom) {
    if (node)
      for (var i = 0; i < node.length; i++) {
        if (typeof node[i] === 'string') {
          if ((node[i] as string).includes('!DOCTYPE')) {
            out += '<' + (node[i] as string).trim() + '>';
            continue;
          }
          out += (node[i] as string).trim();
        } else {
          writeNode(node[i]);
        }
      }
  }
  function writeNode(node: XmltvDomNode) {
    if (typeof node === 'string') return;
    out += '<' + node.tagName;
    for (const attr in node.attributes) {
      if (typeof node.attributes[attr] === 'string' && node.attributes[attr].indexOf('"') === -1) {
        out += ' ' + attr + '="' + node.attributes[attr].trim() + '"';
      } else if (typeof node.attributes[attr] === 'boolean') {
        out += ' ' + attr + '="' + (node.attributes[attr] ? 'yes' : 'no') + '"';
      } else {
        out += ' ' + attr + "='" + node.attributes[attr] + "'";
      }
    }

    if (['new', 'icon', 'previously-shown'].indexOf(node.tagName) >= 0) {
      out += '/>';
      return;
    }

    if (node.tagName === '?xml') {
      out += '?>';
      return;
    }
    out += '>';
    if (typeof node.children === 'boolean') {
      out += node.children ? 'yes' : 'no';
      return;
    }
    writeChildren(node.children);
    out += '</' + node.tagName + '>';
  }

  writeChildren(xmltvDom);

  let header = '';

  if (out.indexOf('?xml') === -1) {
    header += '<?xml version="1.0" encoding="UTF-8"?>';
  }
  if (out.indexOf('!DOCTYPE') === -1) {
    header += '<!DOCTYPE tv SYSTEM "xmltv.dtd">';
  }

  return header + out;
}
