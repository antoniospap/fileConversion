export const convertLinesToXml = (lines: string[]) => {
  let xml = '<people>\n';
  let context: null | 'person' | 'family' = null;
  
  const escapeXml = (str: string) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };
  
  lines.forEach(line => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return; // Skip empty lines
    
    const parts = trimmedLine.split('|');
    const type = parts[0];
    
    if (type === 'P') {
      // handle person
      if (context === 'family') {
        xml += '    </family>\n  </person>\n';
      } else if (context === 'person') {
        xml += '  </person>\n';
      }
      
      xml += '  <person>\n';
      xml += `    <firstname>${escapeXml(parts[1] || '')}</firstname>\n`;
      xml += `    <lastname>${escapeXml(parts[2] || '')}</lastname>\n`;
      context = 'person';
    } 
    else if (type === 'T') {
      xml += `    <phone><mobile>${escapeXml(parts[1] || '')}</mobile><landline>${escapeXml(parts[2] || '')}</landline></phone>\n`;
    } 
    else if (type === 'A') {
      xml += `    <address><street>${escapeXml(parts[1] || '')}</street><city>${escapeXml(parts[2] || '')}</city>`;
      if (parts.length > 3) {
        xml += `<zip>${escapeXml(parts[3] || '')}</zip>`;
      }
      xml += `</address>\n`;
    } 
    // handle family
    else if (type === 'F') {
      if (context === 'family') {
        xml += '    </family>\n';
      }
      xml += '    <family>\n';
      xml += `      <n>${escapeXml(parts[1] || '')}</n>\n`;
      xml += `      <born>${escapeXml(parts[2] || '')}</born>\n`;
      context = 'family';
    }
  });
  
  if (context === 'family') {
    xml += '    </family>\n  </person>\n';
  } else if (context === 'person') {
    xml += '  </person>\n';
  }
  
  xml += '</people>';
  return xml;
};

// get the content of an xml element
export const getElementContent = (parent: Element, tagName: string) => {
  const element = parent.getElementsByTagName(tagName)[0];
  return element ? element.textContent || '' : '';
};

export const convertXmlToLines = (xmlString: string) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
  const people = xmlDoc.getElementsByTagName('person');
  const lines: string[] = [];
  
  // loop through all people
  Array.from(people).forEach(person => {
    const firstName = getElementContent(person, 'firstname');
    const lastName = getElementContent(person, 'lastname');
    lines.push(`P|${firstName}|${lastName}`);
    
    // Process a person's children items
    const childNodes = Array.from(person.childNodes);
    for (const node of childNodes) {
      if (node.nodeType !== Node.ELEMENT_NODE) continue;
      const element = node as Element;
      
      if (element.tagName === 'phone') {
        const mobile = getElementContent(element, 'mobile');
        const landline = getElementContent(element, 'landline');
        lines.push(`T|${mobile}|${landline}`);
      } else if (element.tagName === 'address') {
        const street = getElementContent(element, 'street');
        const city = getElementContent(element, 'city');
        const zipElement = element.getElementsByTagName('zip')[0];
        
        if (zipElement) {
          const zip = zipElement.textContent || '';
          lines.push(`A|${street}|${city}|${zip}`);
        } else {
          lines.push(`A|${street}|${city}`);
        }
      } else if (element.tagName === 'family') {
        const name = getElementContent(element, 'n');
        const born = getElementContent(element, 'born');
        lines.push(`F|${name}|${born}`);
        
        // Process family's children items
        const familyChildNodes = Array.from(element.childNodes);
        for (const familyNode of familyChildNodes) {
          if (familyNode.nodeType !== Node.ELEMENT_NODE) continue;
          const familyElement = familyNode as Element;
          
          if (familyElement.tagName === 'phone') {
            const mobile = getElementContent(familyElement, 'mobile');
            const landline = getElementContent(familyElement, 'landline');
            lines.push(`T|${mobile}|${landline}`);
          } else if (familyElement.tagName === 'address') {
            const street = getElementContent(familyElement, 'street');
            const city = getElementContent(familyElement, 'city');
            const zipElement = familyElement.getElementsByTagName('zip')[0];
            
            if (zipElement) {
              const zip = zipElement.textContent || '';
              lines.push(`A|${street}|${city}|${zip}`);
            } else {
              lines.push(`A|${street}|${city}`);
            }
          }
        }
      }
    }
  });
  
  return lines.join('\n');
};
