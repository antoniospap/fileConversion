import React from 'react';

interface PanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function Panel({ title, children, className = '' }: PanelProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 flex-1 flex flex-col ${className}`}>
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
}
