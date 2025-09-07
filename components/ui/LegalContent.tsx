'use client';

import React from 'react';

interface Section {
  heading: string;
  content: string;
}

interface LegalContentProps {
  title: string;
  lastUpdated: string;
  sections: Section[];
}

const LegalContent: React.FC<LegalContentProps> = ({ title, lastUpdated, sections }) => {
  return (
    <div className="max-w-4xl border border-gray-200 border-t-gray-900 border-t-4 mt-16 mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-gray-500">
          Last updated: {lastUpdated}
        </p>
      </div>
      
      <div className="prose prose-indigo prose-lg text-gray-500 mx-auto">
        {sections.map((section, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{section.heading}</h2>
            <p className="text-base">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LegalContent;