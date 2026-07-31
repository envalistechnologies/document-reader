import React from 'react';

interface PolicySection {
  id: string;
  title: string;
  content: React.ReactNode;
}

const CONTACT_EMAIL = 'envalistechnologies@gmail.com';
const COMPANY_NAME = 'Envalis Technologies';
const LAST_UPDATED = 'July 28, 2026';

const POLICY_SECTIONS: PolicySection[] = [
  {
    id: 'general',
    title: '1. General',
    content: (
      <>
        <p className="leading-relaxed mb-4">
          Thank you for choosing <strong>DocReader</strong> ("we", "us", "our"). We built this
          app to be a simple, private way to read and organize your own documents — designed,
          from the ground up, to work primarily on your device without requiring an account or
          sending your files to a server we operate.
        </p>
        <p className="leading-relaxed mb-4">
          This Policy explains what information the app interacts with, how it's used, and
          what choices you have. It applies to the DocReader mobile application ("the app"),
          this website, and any support communications you send us directly.
        </p>
        <p className="leading-relaxed">
          Please read this policy carefully.{' '}
          <strong>If you do not agree with our policies and practices, please do not use the app.</strong>
        </p>
      </>
    ),
  },
  {
    id: 'data-collection',
    title: '2. Data Collection and Usage',
    content: (
      <>
        <h3 className="text-lg font-bold mb-2">2.1 Your Documents</h3>
        <p className="leading-relaxed mb-4">
          Documents you manually import into DocReader (PDF, TXT, DOCX, EPUB) are copied into
          private storage on your own device. We do not upload your documents to any server,
          we do not have access to them, and we cannot view their content. Deleting a
          document, or uninstalling the app, permanently removes any copy the app holds.
        </p>

        <h3 className="text-lg font-bold mb-2">2.2 Reading Data</h3>
        <p className="leading-relaxed mb-4">
          To provide features like resuming where you left off, bookmarks, and highlights, the
          app stores information such as document titles, page numbers, reading positions,
          bookmark locations, and highlighted text — all locally, in a private database on
          your device. This information never leaves your device and is not accessible to us.
        </p>

        <h3 className="text-lg font-bold mb-2">2.3 Permissions We Request</h3>
        <ul className="list-disc pl-6 space-y-2 mb-4 leading-relaxed">
          <li>
            <strong>Storage / files access</strong> — required to let you select and import
            documents, and to save files you choose to share out of the app.
          </li>
          <li>
            We do not request access to your camera, contacts, or microphone. DocReader has no
            feature that requires any of these.
          </li>
        </ul>

        <h3 className="text-lg font-bold mb-2">2.4 Advertising</h3>
        <p className="leading-relaxed mb-4">
          DocReader is free to use and supported by ads served through Google AdMob. AdMob and
          its partner networks may automatically collect certain information to serve and
          measure ads, including your device's advertising identifier, general device
          information, approximate location derived from your IP address, and information
          about how you interact with ads. This data is processed by Google in accordance
          with{' '}
          <a
            href="https://policies.google.com/privacy"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Google's own Privacy Policy
          </a>
          . We do not control, and are not responsible for, how Google or its advertising
          partners use this data beyond what is disclosed there.
        </p>
        <p className="leading-relaxed mb-4">
          You can opt out of personalized advertising, or reset your advertising identifier,
          at any time through your device's system settings.
        </p>

        <h3 className="text-lg font-bold mb-2">2.5 App Performance Data</h3>
        <p className="leading-relaxed">
          The app may use Google Firebase services (such as Remote Config) to adjust certain
          app behavior — for example, ad display frequency — without requiring an app update.
          These services may collect limited, non-personally-identifying technical data as
          described in Google's Privacy Policy. We do not use this data to identify you
          personally.
        </p>
      </>
    ),
  },
  {
    id: 'device-scan',
    title: '3. Document Discovery & Folder Scanning',
    content: (
      <>
        <p className="leading-relaxed mb-4">
          DocReader includes an optional feature to help you find documents already saved
          elsewhere on your device, so you don't have to manually import each one. This
          feature only activates for specific folders you explicitly choose, and works as
          follows:
        </p>

        <h3 className="text-lg font-bold mb-2">3.1 Folder Access You Grant</h3>
        <p className="leading-relaxed mb-4">
          When you use "Scan Device," you'll be shown Android's own system folder picker to
          select a specific folder (for example, Documents or Download). You choose exactly
          which folder to grant access to — the app cannot access any folder you have not
          explicitly selected, and Android itself does not allow granting access to your
          entire storage root in this way. Once granted, this access is remembered so you
          don't need to repeat the selection every time you open the app; you can review or
          revoke any granted folder at any time in your device's app permission settings.
        </p>

        <h3 className="text-lg font-bold mb-2">3.2 How Discovered Files Are Handled</h3>
        <p className="leading-relaxed mb-4">
          Documents found this way are <strong>not copied</strong> into the app's private
          storage. The app reads them directly from their original location using the access
          you've granted. If you move or delete a file from its original location outside the
          app, DocReader will no longer be able to open it.
        </p>

        <h3 className="text-lg font-bold mb-2">3.3 Optional Broader Device Access</h3>
        <p className="leading-relaxed text-gray-500 italic">
          [Include this section only if the "Advanced: scan everywhere" MANAGE_EXTERNAL_STORAGE
          toggle ships. Remove entirely if that feature is not built.]
        </p>
      </>
    ),
  },
  {
    id: 'security',
    title: '4. Data Security and Storage',
    content: (
      <>
        <p className="leading-relaxed mb-4">
          Because your documents and reading data are stored locally on your own device rather
          than on servers we operate, the security of that data depends primarily on your
          device's own security (screen lock, encryption, and physical access controls).
        </p>
        <p className="leading-relaxed mb-4">
          We do not operate a backend server that stores your documents or personal
          information, which means there is no central database of user content for us to
          secure. Third-party services we rely on for advertising (Google AdMob) and app
          configuration (Google Firebase) maintain their own security practices, described in
          their respective privacy policies.
        </p>
        <p className="leading-relaxed">
          No method of electronic storage is 100% secure, and while we've designed the app to
          minimize what leaves your device in the first place, we cannot guarantee absolute
          security of any information processed by third-party services referenced in this
          policy.
        </p>
      </>
    ),
  },
  {
    id: 'rights',
    title: '5. Your Rights',
    content: (
      <>
        <p className="leading-relaxed mb-3">
          Because DocReader does not require an account and does not collect personal
          information on our own servers, most data-related rights are already in your direct
          control on your device:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4 leading-relaxed">
          <li>
            <strong>Access &amp; deletion</strong> — view, export (via Share), or delete any
            document, bookmark, or highlight at any time directly within the app.
          </li>
          <li>
            <strong>Revoke folder access</strong> — remove any granted folder permission at
            any time in your device's app settings, or from within the app's Settings screen.
          </li>
          <li>
            <strong>Full data removal</strong> — uninstalling the app, or using "Delete all
            documents" in Settings, permanently removes all locally stored app data.
          </li>
          <li>
            <strong>Advertising choices</strong> — opt out of personalized ads or reset your
            advertising identifier through your device settings at any time.
          </li>
        </ul>
        <p className="leading-relaxed">
          If you are located in a region with additional statutory privacy rights (such as the
          EU/UK under GDPR, or California under the CCPA/CPRA), and you believe any data
          processed by our third-party providers on our behalf concerns you directly, you may
          contact us using the details in Section 9.
        </p>
      </>
    ),
  },
  {
    id: 'links',
    title: '6. External Links',
    content: (
      <p className="leading-relaxed">
        The app and this website may contain links to external resources, including
        third-party privacy policies referenced in this document, or allow you to share a
        document to other apps installed on your device. We are not responsible for the
        privacy practices or content of any third-party service you are directed to.
      </p>
    ),
  },
  {
    id: 'age',
    title: '7. Age Requirement',
    content: (
      <p className="leading-relaxed">
        DocReader is not directed at children under the age of 13 (or the equivalent minimum
        age in your jurisdiction), and we do not knowingly collect personal information from
        children. If you believe a child has provided information through the app in a way
        that concerns you, please contact us using the details in Section 9.
      </p>
    ),
  },
  {
    id: 'updates',
    title: '8. Updates to This Policy',
    content: (
      <p className="leading-relaxed">
        We may update this Privacy Policy from time to time to reflect changes in the app's
        functionality, legal requirements, or our own practices. When we do, we will revise
        the "Last updated" date at the top of this page. Continued use of the app after
        changes are posted constitutes your acceptance of the updated policy.
      </p>
    ),
  },
  {
    id: 'contact',
    title: '9. Contact Details',
    content: (
      <>
        <p className="leading-relaxed mb-3">
          If you have any questions, concerns, or requests regarding this Privacy Policy or
          your data, please contact us at:
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
          <p className="font-bold mb-1">{COMPANY_NAME}</p>
          <p>Email: {CONTACT_EMAIL}</p>
        </div>
      </>
    ),
  },
];

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
          <a href="/" className="text-lg font-bold text-gray-900">
            DocReader
          </a>
          <a href="/" className="text-sm text-blue-600 hover:underline">
            ← Back to home
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-3">Privacy Policy for DocReader</h1>
        <p className="text-gray-600 mb-10">Last updated: {LAST_UPDATED}</p>

        <nav className="mb-12 border border-gray-200 rounded-lg p-6 bg-gray-50">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">
            Table of Contents
          </h2>
          <ol className="space-y-1 text-blue-600">
            {POLICY_SECTIONS.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="hover:underline">
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {POLICY_SECTIONS.map((section) => (
          <section key={section.id} id={section.id} className="mb-10">
            <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
            {section.content}
          </section>
        ))}
      </main>

      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-3xl mx-auto px-6 py-8 text-sm text-gray-500 flex justify-between">
          <span>© {new Date().getFullYear()} {COMPANY_NAME}</span>
          <a href="/terms" className="text-blue-600 hover:underline">
            Terms of Use
          </a>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;