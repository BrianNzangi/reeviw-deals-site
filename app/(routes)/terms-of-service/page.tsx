import React from 'react';
import LegalContent from '@/components/ui/LegalContent';
import termsOfServiceData from '@/data/terms-of-service.json';

export const metadata = {
  title: 'Terms of Service | Reeviw',
  description: 'Our terms of service outline the rules and guidelines for using our platform.',
};

export default function TermsOfServicePage() {
  // Transform the terms of service data to match the expected format for LegalContent
  const formatSections = () => {
    const sections = [];
    const tos = termsOfServiceData.terms_of_service;
    
    // Add introduction section
    sections.push({
      heading: 'Introduction',
      content: tos.introduction
    });
    
    // Add changes section
    sections.push({
      heading: 'Changes to Terms',
      content: tos.changes
    });
    
    // Add accounts section
    sections.push({
      heading: 'Accounts',
      content: Object.values(tos.accounts).join('\n\n')
    });
    
    // Add offers section
    sections.push({
      heading: 'Offers',
      content: Object.values(tos.offers).join('\n\n')
    });
    
    // Add disclaimers section
    sections.push({
      heading: 'Disclaimers',
      content: tos.disclaimers
    });
    
    // Add limitation of liability section
    sections.push({
      heading: 'Limitation of Liability',
      content: Object.values(tos.limitation_of_liability).join('\n\n')
    });
    
    // Add governing law section
    const governingLaw = {
      heading: 'Governing Law and Dispute Resolution',
      content: tos.governing_law_and_dispute_resolution.law + '\n\n' + 
               tos.governing_law_and_dispute_resolution.process.join('\n\n')
    };
    sections.push(governingLaw);
    
    // Add termination section
    sections.push({
      heading: 'Termination',
      content: Object.values(tos.termination).join('\n\n')
    });
    
    // Add any remaining sections
    if (tos.miscellaneous) {
      sections.push({
        heading: 'Miscellaneous',
        content: typeof tos.miscellaneous === 'string' ? 
          tos.miscellaneous : 
          Object.values(tos.miscellaneous).join('\n\n')
      });
    }
    
    return sections;
  };
  
  return (
    <main className="bg-white min-h-screen">
      <LegalContent 
        title="Terms of Service"
        lastUpdated={termsOfServiceData.terms_of_service.effective_date}
        sections={formatSections()}
      />
    </main>
  );
}