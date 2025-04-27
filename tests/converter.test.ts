import { convertLinesToXml, convertXmlToLines } from '../src/utils/converter';

describe('converter', () => {
  const sampleLines = [
    'P|Foo|Bar',
    'T|070-111|08-222',
    'P|Victoria|Bernadotte',
    'T|070-0101010|0459-123456',
    'A|Haga Slott|Stockholm|101',
    'F|Estelle|2012',
    'A|Solliden|Öland|10002',
    'F|Oscar|2016',
    'T|0702-020202|02-202020',
    'P|Joe|Biden',
    'A|White House|Washington, DC'
  ];

  it('Convert lines to XML and back check', () => {
    const xml = convertLinesToXml(sampleLines);
    const back = convertXmlToLines(xml).split('\n');
    expect(back).toEqual(sampleLines);
  });

  it('empty input check', () => {
    expect(convertLinesToXml([])).toBe('<people>\n</people>');
    expect(convertXmlToLines('<people></people>')).toBe('');
  });

  it('handles missing optional fields', () => {
    const incompleteLines = [
      'P||OnlyLastName',
      'P|OnlyFirstName|',
      'T||08-123456',
      'T|070-123456|',
      'A||City|12345',
      'A|Street||',
      'A|Street|City|',
      'F||2010',
      'F|NoYearChild|'
    ];
    
    const xml = convertLinesToXml(incompleteLines);
    const back = convertXmlToLines(xml).split('\n');
    expect(back).toEqual(incompleteLines);
  });
  
  it('handles international characters', () => {
    const internationalChars = [
      'P|José|García',
      'A|Calle 123|Madrid|28001',
      'P|François|Müller',
      'A|Straße 42|München|80331',
      'P|Søren|Jørgensen',
      'A|Strøget 7|København|1161',
      'P|雪|李',
      'A|北京路123号|上海|200000'
    ];
    
    const xml = convertLinesToXml(internationalChars);
    const back = convertXmlToLines(xml).split('\n');
    expect(back).toEqual(internationalChars);
  });
  
  
  it('handles real-world complex example', () => {
    const realWorldExample = [
      'P|Smith|John',
      'T|+1-555-123-4567|+1-555-987-6543',
      'A|123 Main St, Apt 4B|New York City|NY 10001',
      'F|Emma|2005',
      'T|+1-555-234-5678|',
      'A|University Housing, Box 42|Boston|MA 02215',
      'F|Michael|2008',
      'A|Boarding School|Chicago|IL 60601',
      'P|Jones|Sarah',
      'T|+1-555-333-4444|',
      'A|456 Oak Ave|San Francisco|CA 94102',
      'F|Thomas|2010',
      'F|Lily|2012',
      'T|+1-555-555-6666|',
      'A|Grandparents Home|Tampa|FL 33601'
    ];
    
    const xml = convertLinesToXml(realWorldExample);
    const back = convertXmlToLines(xml).split('\n');
    expect(back).toEqual(realWorldExample);
  });
});
