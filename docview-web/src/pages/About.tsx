import React from 'react';
import Layout, { APP_NAME, COMPANY_NAME, CONTACT_EMAIL } from './Layout';

interface Principle {
  title: string;
  description: string;
}

const PRINCIPLES: Principle[] = [
  {
    title: 'Local-first, always',
    description:
      'We don\u2019t operate a server that stores your documents. Everything you import lives on your own device, under your own control.',
  },
  {
    title: 'No accounts, ever',
    description:
      'You shouldn\u2019t need to sign up for anything just to read a PDF. There\u2019s nothing to register, and nothing to lose access to.',
  },
  {
    title: 'Free means free',
    description:
      'No subscriptions, no paywalled features, no "premium" tier holding basic functionality hostage. Ads keep the lights on \u2014 that\u2019s the whole model.',
  },
  {
    title: 'Do one thing well',
    description:
      'We\u2019d rather ship a reader that\u2019s genuinely good at reading than a bloated app that does everything adequately.',
  },
];

const About: React.FC = () => {
  return (
    <Layout>
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-12">
        <h1 className="text-3xl font-bold mb-6">About {APP_NAME}</h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-4">
          {APP_NAME} is built by <strong>{COMPANY_NAME}</strong>, a small team building simple,
          no-nonsense mobile utilities. We got tired of document readers that ask for an
          account before you can open a single PDF, so we built one that doesn't.
        </p>
        <p className="text-lg text-gray-600 leading-relaxed">
          No sign-ups. No cloud sync you didn't ask for. No subscription to unlock highlighting.
          Just a reader that opens your files and gets out of the way.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-xl font-bold mb-6">What we believe</h2>
        <div className="space-y-6">
          {PRINCIPLES.map((principle) => (
            <div key={principle.title} className="border-l-2 border-blue-600 pl-5">
              <h3 className="font-bold mb-1">{principle.title}</h3>
              <p className="text-gray-600 leading-relaxed">{principle.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h2 className="text-xl font-bold mb-3">Get in touch</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Questions, feedback, or something not working right? We'd genuinely like to hear
            about it.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-block text-blue-600 font-bold hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default About;