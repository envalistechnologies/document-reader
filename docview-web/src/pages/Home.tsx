import React from 'react';
import Layout, { APP_NAME } from './Layout';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: '📄',
    title: 'Read PDF, DOCX, TXT & EPUB',
    description: 'One reader for every document format you already have — no converting, no juggling multiple apps.',
  },
  {
    icon: '🔖',
    title: 'Bookmarks & Highlights',
    description: 'Mark your place, highlight what matters, and pick up exactly where you left off — automatically.',
  },
  {
    icon: '🌙',
    title: 'Light, Sepia & Dark Themes',
    description: 'Read comfortably in any lighting, with font, size, and spacing controls tuned for long reading sessions.',
  },
  {
    icon: '🔒',
    title: 'No Account, No Cloud',
    description: 'Your documents stay on your device. No sign-up, no server, no one but you has access to what you read.',
  },
  {
    icon: '📁',
    title: 'Folders & Search',
    description: 'Organize your library your way, and find any document — or any word inside it — in seconds.',
  },
  {
    icon: '🆓',
    title: 'Free, Ad-Supported',
    description: 'No subscriptions, no paywalls. Ads keep the app free, and they never show while you\u2019re actually reading.',
  },
];

// Update this once the app is live on the Play Store
const PLAY_STORE_URL = '#';

const Home: React.FC = () => {
  return (
    <Layout>
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Your documents.<br />
          <span className="text-blue-600">One simple reader.</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto mb-10 leading-relaxed">
          {APP_NAME} is a fast, private way to read PDFs, Word documents, text files, and
          EPUBs on Android — with no account, no cloud, and nothing leaving your device.
        </p>
        <a
          href={PLAY_STORE_URL}
          className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-full hover:bg-blue-700 transition-colors"
        >
          Get it on Google Play
        </a>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors"
            >
              <div className="text-3xl mb-3" aria-hidden="true">
                {feature.icon}
              </div>
              <h3 className="font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-bold mb-3">No account. No cloud. No catch.</h2>
          <p className="text-gray-600 max-w-lg mx-auto leading-relaxed">
            Everything you import stays on your device. We can't see your documents, and we
            don't want to — {APP_NAME} was built to be a reader, not a data collector.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Home;