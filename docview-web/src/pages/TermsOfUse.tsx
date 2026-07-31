import React from 'react';

interface TermsSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

const CONTACT_EMAIL = 'envalistechnologies@gmail.com';
const COMPANY_NAME = 'Envalis Technologies';
const LAST_UPDATED = 'July 28, 2026';
const GOVERNING_COUNTRY = 'India';
const GOVERNING_JURISDICTION = 'Ahmedabad, Gujarat, India';

const TERMS_SECTIONS: TermsSection[] = [
  {
    id: 'introduction',
    title: '1. Introduction and Acceptance',
    content: (
      <>
        <p className="leading-relaxed mb-4">
          These Terms of Use ("Terms") constitute an agreement between{' '}
          <strong>{COMPANY_NAME}</strong> ("we", "us", "our") and you, regarding your use of
          the DocReader mobile application ("the app") and this website.
        </p>
        <p className="leading-relaxed">
          Please read these Terms carefully. By downloading, installing, or using the app, you
          confirm that you have read, understood, and agree to be bound by these Terms.{' '}
          <strong>If you do not agree to all of these Terms, you may not use the app.</strong>
        </p>
      </>
    ),
  },
  {
    id: 'updates',
    title: '2. Updates to These Terms',
    content: (
      <>
        <p className="leading-relaxed mb-4">
          We may modify these Terms from time to time. If we make substantial changes, we will
          update the "last updated" date above, and such modifications become effective as of
          that update. Your continued use of the app after a change is posted constitutes your
          agreement to the revised Terms. We are not obligated to individually notify you of
          minor corrections or clarifications — please review these Terms periodically.
        </p>
        <p className="leading-relaxed">
          We may also update the app itself from time to time to improve performance, add
          features, reflect operating system changes, or address security issues. If you
          choose not to install such updates, some or all of the app's functionality may stop
          working correctly.
        </p>
      </>
    ),
  },
  {
    id: 'license',
    title: '3. License to Use the App',
    content: (
      <>
        <p className="leading-relaxed mb-4">
          Subject to your compliance with these Terms, we grant you a limited, non-exclusive,
          non-transferable, revocable license to download and use the app on a device that you
          own or control, solely for your own personal, non-commercial use.
        </p>
        <p className="leading-relaxed">
          This license does not permit you to: copy, modify, or create derivative works of the
          app; reverse-engineer, decompile, or disassemble the app except where permitted by
          applicable law; rent, lease, sell, sublicense, or otherwise transfer the app to any
          third party; or remove, obscure, or alter any proprietary notices on the app.
        </p>
      </>
    ),
  },
  {
    id: 'content',
    title: '4. Your Documents and Content',
    content: (
      <>
        <p className="leading-relaxed mb-4">
          DocReader is a document <strong>reader</strong>. It does not create, edit, or modify
          the content of any document you import. Any files you import into the app — and all
          rights, title, and interest in them — remain entirely yours. We claim no ownership
          over, and do not access, view, or transmit, the content of your documents.
        </p>
        <p className="leading-relaxed">
          You are solely responsible for ensuring you have the legal right to possess and read
          any document you import into the app, and for complying with any copyright or other
          intellectual property rights that apply to that content. You agree not to use the
          app to store or handle any content that is illegal, infringing, or that you do not
          have the right to possess.
        </p>
      </>
    ),
  },
  {
    id: 'acceptable-use',
    title: '5. Acceptable Use',
    content: (
      <>
        <p className="leading-relaxed mb-3">When using the app, you agree that you will not:</p>
        <ul className="list-disc pl-6 space-y-2 leading-relaxed">
          <li>
            Attempt to gain unauthorized access to the app's underlying code, infrastructure,
            or any systems or networks connected to it;
          </li>
          <li>
            Use the app in any way that violates applicable local, national, or international
            law or regulation;
          </li>
          <li>
            Interfere with or disrupt the app's advertising mechanisms, including through
            automated clicking, ad fraud, or tampering with ad display behavior;
          </li>
          <li>
            Use the app to store, view, or distribute content that is unlawful, infringing, or
            that you do not have the right to possess, as described in Section 4.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'ip',
    title: '6. Intellectual Property',
    content: (
      <p className="leading-relaxed">
        The app itself — including its design, user interface, icons, branding, and underlying
        code (but explicitly excluding any documents or content you import, which remain
        yours as described in Section 4) — is owned by {COMPANY_NAME} and is protected by
        copyright, trademark, and other intellectual property laws. Nothing in these Terms
        transfers any ownership of the app itself to you beyond the limited license described
        in Section 3.
      </p>
    ),
  },
  {
    id: 'third-party',
    title: '7. Third-Party Services and Advertising',
    content: (
      <>
        <p className="leading-relaxed mb-4">
          The app is free to use and supported by advertising served through Google AdMob, and
          may use Google Firebase services to configure certain app behavior. Your use of the
          app constitutes acknowledgment of, and agreement to, the data practices described in
          our <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>,
          which explains what information these services collect and how it's used.
        </p>
        <p className="leading-relaxed">
          We are not responsible for the content of any advertisements shown within the app,
          or for any third-party website, app, or service you may reach by interacting with an
          advertisement or a share/export action from within the app.
        </p>
      </>
    ),
  },
  {
    id: 'warranties',
    title: '8. Disclaimer of Warranties',
    content: (
      <p className="leading-relaxed">
        The app is provided <strong>"as is"</strong> and <strong>"as available"</strong>,
        without warranties of any kind, whether express or implied, including but not limited
        to implied warranties of merchantability, fitness for a particular purpose, and
        non-infringement. We do not warrant that the app will be uninterrupted, error-free, or
        fully compatible with every device or every document you attempt to open —
        particularly with unusually large, complex, or non-standard document files, as
        described in the app's documentation and FAQ.
      </p>
    ),
  },
  {
    id: 'liability',
    title: '9. Limitation of Liability',
    content: (
      <p className="leading-relaxed">
        To the maximum extent permitted by applicable law, {COMPANY_NAME} shall not be liable
        for any indirect, incidental, special, consequential, or punitive damages, or any loss
        of data, arising out of or related to your use of, or inability to use, the app —
        including, without limitation, any loss of documents stored locally on your device.
        Because your documents are stored only on your own device and not backed up by us, you
        are solely responsible for maintaining your own backups of any content that matters to
        you.
      </p>
    ),
  },
  {
    id: 'termination',
    title: '10. Termination',
    content: (
      <p className="leading-relaxed">
        You may stop using the app, and terminate this agreement, at any time by uninstalling
        it from your device. We reserve the right to suspend or discontinue the app, or your
        access to it, at any time, including in response to a violation of these Terms, though
        as a locally-run app with no account system, this would generally take the form of
        discontinuing updates or removing the app from distribution rather than disabling an
        individual account.
      </p>
    ),
  },
  {
    id: 'governing-law',
    title: '11. Governing Law',
    content: (
      <p className="leading-relaxed">
        These Terms shall be governed by and construed in accordance with the laws of{' '}
        {GOVERNING_COUNTRY}, without regard to its conflict of law provisions. Any disputes
        arising under these Terms shall be subject to the exclusive jurisdiction of the courts
        located in {GOVERNING_JURISDICTION}, except where applicable consumer protection law
        in your country of residence provides otherwise.
      </p>
    ),
  },
  {
    id: 'contact',
    title: '12. Contact Details',
    content: (
      <>
        <p className="leading-relaxed mb-3">
          If you have any questions about these Terms, please contact us at:
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
          <p className="font-bold mb-1">{COMPANY_NAME}</p>
          <p>Email: {CONTACT_EMAIL}</p>
        </div>
      </>
    ),
  },
];

const TermsOfUse: React.FC = () => {
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
        <h1 className="text-3xl font-bold mb-3">Terms of Use</h1>
        <p className="text-gray-600 mb-10">These Terms of Use were last updated on {LAST_UPDATED}.</p>

        <nav className="mb-12 border border-gray-200 rounded-lg p-6 bg-gray-50">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">
            Table of Contents
          </h2>
          <ol className="space-y-1 text-blue-600">
            {TERMS_SECTIONS.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="hover:underline">
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {TERMS_SECTIONS.map((section) => (
          <section key={section.id} id={section.id} className="mb-10">
            <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
            {section.content}
          </section>
        ))}
      </main>

      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-3xl mx-auto px-6 py-8 text-sm text-gray-500 flex justify-between">
          <span>© {new Date().getFullYear()} {COMPANY_NAME}</span>
          <a href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
        </div>
      </footer>
    </div>
  );
};

export default TermsOfUse;