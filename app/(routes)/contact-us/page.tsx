import React from 'react';
import ContactForm from '@/components/contact/contact-form';

export const metadata = {
  title: 'Contact Us | Reeviw',
  description: 'Get in touch with our support team for any questions or concerns.',
};

export default function ContactUsPage() {
  return (
    <div className="max-w-4xl border border-gray-200 border-t-gray-900 border-t-4 mt-16 mx-auto py-8 px-4 sm:px-6 lg:px-8 mb-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Contact Us</h1>
        <p className="mt-2 text-sm text-gray-500">
          We're here to help with any questions or concerns
        </p>
      </div>
      
      <ContactForm />
    </div>
  );
}