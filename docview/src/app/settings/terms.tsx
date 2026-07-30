import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { AppBar } from '../../components/ui/AppBar/AppBar';

export default function TermsScreen() {
  return (
    <Screen>
      <AppBar leadingSlot={<BackButton />} title="Terms of use" />
      <ScrollView className="flex-1 px-5 py-6 bg-bg-base" contentContainerStyle={{ paddingBottom: 60 }}>

        {/* Main Title */}
        <Text className="text-text-primary text-2xl font-bold text-center mb-6">
          Terms of Use
        </Text>

        {/* Subheading */}
        <Text className="text-text-primary text-lg font-bold mb-8">
          These Terms of Use were last updated on 28th July 2026.
        </Text>

        {/* Table of Contents */}
        <Text className="text-text-primary text-xl font-bold mb-4 uppercase">
          Table of Contents
        </Text>
        <View className="ml-4 mb-8">
          {[
            '1. Introduction and Acceptance.',
            '2. Updates to These Terms.',
            '3. License to Use the App.',
            '4. Your Documents and Content.',
            '5. Acceptable Use.',
            '6. Intellectual Property.',
            '7. Third-Party Services and Advertising.',
            '8. Disclaimer of Warranties.',
            '9. Limitation of Liability.',
            '10. Termination.',
            '11. Governing Law.',
            '12. Contact Details.',
          ].map((item, index) => (
            <Text key={index} className="text-text-primary text-base font-bold mb-1">
              {item}
            </Text>
          ))}
        </View>

        {/* 1. Introduction and Acceptance */}
        <Text className="text-text-primary text-xl font-bold mb-4">
          1. Introduction and Acceptance
        </Text>
        <Text className="text-text-primary text-base leading-6 mb-4">
          These Terms of Use ("Terms") constitute an agreement between{' '}
          <Text className="font-bold">Envalis Technologies</Text> ("we", "us", "our") and you,
          regarding your use of the DocReader mobile application ("the app").
        </Text>
        <Text className="text-text-primary text-base leading-6 mb-8">
          Please read these Terms carefully. By downloading, installing, or using the app, you
          confirm that you have read, understood, and agree to be bound by these Terms.{' '}
          <Text className="font-bold">
            If you do not agree to all of these Terms, you may not use the app.
          </Text>
        </Text>

        {/* 2. Updates to These Terms */}
        <Text className="text-text-primary text-xl font-bold mb-4">
          2. Updates to These Terms
        </Text>
        <Text className="text-text-primary text-base leading-6 mb-4">
          We may modify these Terms from time to time. If we make substantial changes, we will
          update the "last updated" date above, and such modifications become effective as of
          that update. Your continued use of the app after a change is posted constitutes your
          agreement to the revised Terms. We are not obligated to individually notify you of
          minor corrections or clarifications — please review these Terms periodically.
        </Text>
        <Text className="text-text-primary text-base leading-6 mb-8">
          We may also update the app itself from time to time to improve performance, add
          features, reflect operating system changes, or address security issues. If you
          choose not to install such updates, some or all of the app's functionality may stop
          working correctly.
        </Text>

        {/* 3. License to Use the App */}
        <Text className="text-text-primary text-xl font-bold mb-4">
          3. License to Use the App
        </Text>
        <Text className="text-text-primary text-base leading-6 mb-4">
          Subject to your compliance with these Terms, we grant you a limited, non-exclusive,
          non-transferable, revocable license to download and use the app on a device that you
          own or control, solely for your own personal, non-commercial use.
        </Text>
        <Text className="text-text-primary text-base leading-6 mb-8">
          This license does not permit you to: copy, modify, or create derivative works of the
          app; reverse-engineer, decompile, or disassemble the app except where permitted by
          applicable law; rent, lease, sell, sublicense, or otherwise transfer the app to any
          third party; or remove, obscure, or alter any proprietary notices on the app.
        </Text>

        {/* 4. Your Documents and Content */}
        <Text className="text-text-primary text-xl font-bold mb-4">
          4. Your Documents and Content
        </Text>
        <Text className="text-text-primary text-base leading-6 mb-4">
          DocReader is a document <Text className="font-bold">reader</Text>. It does not
          create, edit, or modify the content of any document you import. Any files you import
          into the app — and all rights, title, and interest in them — remain entirely yours.
          We claim no ownership over, and do not access, view, or transmit, the content of
          your documents.
        </Text>
        <Text className="text-text-primary text-base leading-6 mb-8">
          You are solely responsible for ensuring you have the legal right to possess and read
          any document you import into the app, and for complying with any copyright or other
          intellectual property rights that apply to that content. You agree not to use the
          app to store or handle any content that is illegal, infringing, or that you do not
          have the right to possess.
        </Text>

        {/* 5. Acceptable Use */}
        <Text className="text-text-primary text-xl font-bold mb-4">5. Acceptable Use</Text>
        <Text className="text-text-primary text-base leading-6 mb-2">
          When using the app, you agree that you will not:
        </Text>
        <View className="ml-4 mb-8">
          <Text className="text-text-primary text-base leading-6 mb-2">
            • Attempt to gain unauthorized access to the app's underlying code, infrastructure,
            or any systems or networks connected to it;
          </Text>
          <Text className="text-text-primary text-base leading-6 mb-2">
            • Use the app in any way that violates applicable local, national, or international
            law or regulation;
          </Text>
          <Text className="text-text-primary text-base leading-6 mb-2">
            • Interfere with or disrupt the app's advertising mechanisms, including through
            automated clicking, ad fraud, or tampering with ad display behavior;
          </Text>
          <Text className="text-text-primary text-base leading-6 mb-2">
            • Use the app to store, view, or distribute content that is unlawful, infringing,
            or that you do not have the right to possess, as described in Section 4.
          </Text>
        </View>

        {/* 6. Intellectual Property */}
        <Text className="text-text-primary text-xl font-bold mb-4">6. Intellectual Property</Text>
        <Text className="text-text-primary text-base leading-6 mb-8">
          The app itself — including its design, user interface, icons, branding, and
          underlying code (but explicitly excluding any documents or content you import, which
          remain yours as described in Section 4) — is owned by Envalis Technologies and is
          protected by copyright, trademark, and other intellectual property laws. Nothing in
          these Terms transfers any ownership of the app itself to you beyond the limited
          license described in Section 3.
        </Text>

        {/* 7. Third-Party Services and Advertising */}
        <Text className="text-text-primary text-xl font-bold mb-4">
          7. Third-Party Services and Advertising
        </Text>
        <Text className="text-text-primary text-base leading-6 mb-4">
          The app is free to use and supported by advertising served through Google AdMob, and
          may use Google Firebase services to configure certain app behavior. Your use of the
          app constitutes acknowledgment of, and agreement to, the data practices described in
          our <Text className="font-bold">Privacy Policy</Text>, which explains what
          information these services collect and how it's used.
        </Text>
        <Text className="text-text-primary text-base leading-6 mb-8">
          We are not responsible for the content of any advertisements shown within the app, or
          for any third-party website, app, or service you may reach by interacting with an
          advertisement or a share/export action from within the app.
        </Text>

        {/* 8. Disclaimer of Warranties */}
        <Text className="text-text-primary text-xl font-bold mb-4">
          8. Disclaimer of Warranties
        </Text>
        <Text className="text-text-primary text-base leading-6 mb-8">
          The app is provided <Text className="font-bold">"as is"</Text> and{' '}
          <Text className="font-bold">"as available"</Text>, without warranties of any kind,
          whether express or implied, including but not limited to implied warranties of
          merchantability, fitness for a particular purpose, and non-infringement. We do not
          warrant that the app will be uninterrupted, error-free, or fully compatible with
          every device or every document you attempt to open — particularly with unusually
          large, complex, or non-standard document files, as described in the app's
          documentation and FAQ.
        </Text>

        {/* 9. Limitation of Liability */}
        <Text className="text-text-primary text-xl font-bold mb-4">
          9. Limitation of Liability
        </Text>
        <Text className="text-text-primary text-base leading-6 mb-8">
          To the maximum extent permitted by applicable law, Envalis Technologies shall not be
          liable for any indirect, incidental, special, consequential, or punitive damages, or
          any loss of data, arising out of or related to your use of, or inability to use, the
          app — including, without limitation, any loss of documents stored locally on your
          device. Because your documents are stored only on your own device and not backed up
          by us, you are solely responsible for maintaining your own backups of any content
          that matters to you.
        </Text>

        {/* 10. Termination */}
        <Text className="text-text-primary text-xl font-bold mb-4">10. Termination</Text>
        <Text className="text-text-primary text-base leading-6 mb-8">
          You may stop using the app, and terminate this agreement, at any time by uninstalling
          it from your device. We reserve the right to suspend or discontinue the app, or your
          access to it, at any time, including in response to a violation of these Terms,
          though as a locally-run app with no account system, this would generally take the
          form of discontinuing updates or removing the app from distribution rather than
          disabling an individual account.
        </Text>

        {/* 11. Governing Law */}
        <Text className="text-text-primary text-xl font-bold mb-4">11. Governing Law</Text>
        <Text className="text-text-primary text-base leading-6 mb-8">
          These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in Ahmedabad, Gujarat, India, except where applicable consumer protection law in your country of residence provides otherwise.
        </Text>

        {/* 12. Contact Details */}
        <Text className="text-text-primary text-xl font-bold mb-4">12. Contact Details</Text>
        <Text className="text-text-primary text-base leading-6 mb-2">
          If you have any questions about these Terms, please contact us at:
        </Text>
        <View className="ml-4 mb-8">
          <Text className="text-text-primary text-base leading-6 mb-1 font-bold">
            Envalis Technologies
          </Text>
          <Text className="text-text-primary text-base leading-6 mb-1">
            Email: envalistechnologies@gmail.com
          </Text>
        </View>

      </ScrollView>
    </Screen>
  );
}

function BackButton() {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.back()} className="p-2 ml-2">
      <Text className="text-text-primary text-2xl font-bold">←</Text>
    </TouchableOpacity>
  );
}