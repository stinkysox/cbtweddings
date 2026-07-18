"use client";

import React from "react";
import { SectionWrapper } from "../../components/SectionWrapper";

export default function PrivacyPolicy() {
  return (
    <div className="pt-32 pb-24 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <SectionWrapper className="mb-16">
          <h1 className="text-6xl font-serif mb-6 italic">Privacy Policy</h1>
          <p className="text-gray-500 uppercase tracking-widest text-sm">
            Effective Date: February 4, 2026
          </p>
        </SectionWrapper>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8 text-gray-600 dark:text-gray-400 font-light leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif text-gray-900 dark:text-white mb-4">1. Introduction</h2>
            <p>
              At CBT Weddings, we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website and use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-gray-900 dark:text-white mb-4">2. Information We Collect</h2>
            <p>
              We may collect personal information such as your name, email address, phone number, and event details when you fill out our contact or booking forms. This information is used solely to provide our photography and cinematic services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-gray-900 dark:text-white mb-4">3. Use of Your Information</h2>
            <p>
              We use your information to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Respond to your inquiries and booking requests.</li>
              <li>Provide and manage our services.</li>
              <li>Communicate with you about your event.</li>
              <li>Improve our website and customer service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-gray-900 dark:text-white mb-4">4. Lead Collection Compliance</h2>
            <p>
              In compliance with advertising platforms like Meta (Facebook/Instagram), we ensure that your data is collected with your explicit consent. We do not sell or rent your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-gray-900 dark:text-white mb-4">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              <strong>Email:</strong> archives@cbtweddings.com
              <br />
              <strong>Location:</strong> New Rajinder Nagar, New Delhi
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
