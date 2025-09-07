'use client';

import React, { useState } from 'react';

export default function ContactForm() {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    
    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        setShowSuccess(true);
        form.reset();
        // Hide success message after 5 seconds
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        console.error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <>
      {showSuccess && (
        <div className="max-w-2xl mx-auto mb-6 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="ml-3 text-sm font-medium text-green-800">Your request has been submitted successfully! We'll get back to you soon.</p>
          </div>
        </div>
      )}
      
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} action="https://formspree.io/f/xrbarlwn" method="POST" className="space-y-6">
          <div>
            <label htmlFor="supportReason" className="block text-sm font-medium text-gray-700">Please select an option below</label>
            <select 
              id="supportReason" 
              name="supportReason"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              required
            >
              <option value="">-</option>
              <option value="cashback">Cashback Rewards</option>
              <option value="product">Product Information</option>
              <option value="account">Account Issues</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Your email address</label>
            <input
              type="email"
              name="email"
              id="email"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
              placeholder="email@example.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason for your support request</label>
            <select 
              id="reason" 
              name="reason"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              required
            >
              <option value="">-</option>
              <option value="question">Question</option>
              <option value="feedback">Feedback</option>
              <option value="problem">Problem</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              name="subject"
              id="subject"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
              required
            ></textarea>
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </>
  );
}