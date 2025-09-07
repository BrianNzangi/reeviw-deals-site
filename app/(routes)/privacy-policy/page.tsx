import React from 'react';
import LegalContent from '@/components/ui/LegalContent';
import privacyPolicyData from '@/data/privacy-policy.json';

export const metadata = {
  title: 'Privacy Policy | Reeviw',
  description: 'Our privacy policy outlines how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  // Transform the privacy policy data to match the expected format for LegalContent
  const formatSections = () => {
    const sections = [];
    
    // Process introduction section
    sections.push({
      heading: 'Introduction',
      content: Object.values(privacyPolicyData.introduction).join('\n\n')
    });
    
    // Process all other sections with title property
    const sectionKeys = [
      'informationCollection',
      'informationUse',
      'cookiesAndTracking',
      'informationDisclosure',
      'onlineIdentifiers',
      'deidentifiedInformation',
      'thirdPartyCollection',
      'marketingChoices',
      'interestBasedAdvertising',
      'securityAndRetention',
      'businessVisitors',
      'internationalVisitors',
      'childrensPrivacy',
      'statePrivacyRights',
      'verificationAndAgents',
      'policyChanges',
      'contactInformation'
    ];
    
    sectionKeys.forEach(key => {
      if (key in privacyPolicyData) {
        const section = privacyPolicyData[key as keyof typeof privacyPolicyData];
        const heading = typeof section === 'object' && 'title' in section ? section.title : key;
        // Filter out the title property and join the rest
        const contentValues = Object.entries(section)
          .filter(([k]) => k !== 'title')
          .map(([, v]) => {
            if (typeof v === 'string') return v;
            if (Array.isArray(v)) return v.join('\n- ');
            return JSON.stringify(v);
          });
        
        sections.push({
          heading,
          content: contentValues.join('\n\n')
        });
      }
    });
    
    return sections;
  };
  
  return (
    <main className="bg-white min-h-screen">
      <LegalContent 
        title="Privacy Policy"
        lastUpdated={privacyPolicyData.effectiveDate}
        sections={formatSections()}
      />
    </main>
  );
}