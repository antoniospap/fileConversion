"use client";

import { useState } from "react";
import Button from "@/components/Button";
import Panel from "@/components/Panel";
import { convertLinesToXml, convertXmlToLines } from "@/utils/converter";

export default function Home() {
  const [lineInput, setLineInput] = useState("");
  const [xmlInput, setXmlInput] = useState("");

  const handleToXml = () => {
    const lines = lineInput.trim().split(/\r?\n/);
    setXmlInput(convertLinesToXml(lines));
  };

  const handleToLines = () => {
    setLineInput(convertXmlToLines(xmlInput));
  };

  const handleDownloadXml = () => {
    const blob = new Blob([xmlInput], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'people.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Radbaserat XML-konverterare</h1>
      <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto">
        <Panel title="Radbaserat">
          <textarea
            className="flex-1 w-full min-h-[300px] p-3 border border-gray-300 rounded font-mono text-sm resize-y"
            value={lineInput}
            onChange={(e) => setLineInput(e.target.value)}
            placeholder="P|Victoria|Bernadotte&#10;T|070-0101010|0459-123456&#10;…"
          />
          <Button
            onClick={handleToXml}
            className="mt-4"
          >
            Konvertera till XML
          </Button>
        </Panel>
        
        <Panel title="XML">
          <textarea
            className="flex-1 w-full min-h-[300px] p-3 border border-gray-300 rounded font-mono text-sm resize-y"
            value={xmlInput}
            onChange={(e) => setXmlInput(e.target.value)}
            placeholder="<people>…</people>"
          />
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleToLines}
              className="flex-1"
            >
              Konvertera till radbaserat
            </Button>
            <Button
              onClick={handleDownloadXml}
              color="green"
              className="flex-1"
            >
              Ladda ner XML-fil
            </Button>
          </div>
        </Panel>
      </div>
    </div>
  );
}
