import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { AppBar } from '../../components/ui/AppBar/AppBar';

export default function PrivacyScreen() {
  return (
    <Screen>
      <AppBar leadingSlot={<BackButton />} title="Privacy policy" />
      <ScrollView className="flex-1 px-5 py-6 bg-bg-base" contentContainerStyle={{ paddingBottom: 60 }}>

        {/* Main Title */}
        <Text className="text-text-primary text-2xl font-bold text-center mb-6">
          Privacy Policy for DocReader
        </Text>

        {/* Subheading */}
        <Text className="text-text-primary text-base mb-8">
          Last updated: 28th, July 2026
        </Text>

        {/* Table of Contents */}
        <Text className="text-text-primary text-xl font-bold mb-4 uppercase">
          Table of Contents
        </Text>
        <View className="ml-4 mb-8">
          {[
            '1. General.',
            '2. Data Collection and Usage.',
            '3. Data Security and Storage.',
            "4. User's Rights.",
            '5. External Links.',
            '6. Age Requirement.',
            '7. Updates to the Privacy Policy.',
            '8. Contact Details.',
          ].map((item, index) => (
            <Text key={index} className="text-text-primary text-base font-bold mb-1">
              {item}
            </Text>
          ))}
        </View>

        {/* 1. General */}
        <Text className="text-text-primary text-2xl font-bold mb-4">1. General</Text>
        <Text className="text-text-primary text-base leading-6 mb-4">
          Thank you for choosing <Text className="font-bold">DocReader</Text> ("we", "us",
          "our"). We built this app to be a simple, private way to read your own documents —
          and we designed it, from the ground up, to work entirely on your device without
          requiring an account or sending your files anywhere.
        </Text>
        <Text className="text-text-primary text-base leading-6 mb-4">
          This Policy explains what information the app interacts with, how it's used, and
          what choices you have. It applies to the DocReader mobile application ("the app")
          and to any support communications you send us directly.
        </Text>
        <Text className="text-text-primary text-base leading-6 mb-8">
          Please read this policy carefully.{' '}
          <Text className="font-bold">
            If you do not agree with our policies and practices, please do not use the app.
          </Text>
        </Text>

        {/* 2. Data Collection and Usage */}
        <Text className="text-text-primary text-2xl font-bold mb-4">
          2. Data Collection and Usage
        </Text>

        <Text className="text-text-primary text-lg font-bold mb-2">2.1 Your Documents</Text>
        <Text className="text-text-primary text-base leading-6 mb-4">
          Documents you import into DocReader (PDF, TXT, DOCX, EPUB) are copied into private
          storage on your own device. We do not upload your documents to any server, we do
          not have access to them, and we cannot view their content. Deleting a document, or
          uninstalling the app, permanently removes it from your device.
        </Text>

        <Text className="text-text-primary text-lg font-bold mb-2">2.2 Reading Data</Text>
        <Text className="text-text-primary text-base leading-6 mb-4">
          To provide features like resuming where you left off, bookmarks, and highlights, the
          app stores information such as document titles, page numbers, reading positions,
          bookmark locations, and highlighted text — all locally, in a private database on
          your device. This information never leaves your device and is not accessible to us.
        </Text>

        <Text className="text-text-primary text-lg font-bold mb-2">2.3 Permissions We Request</Text>
        <Text className="text-text-primary text-base leading-6 mb-2">
          DocReader requests only the device permissions needed to function as a document
          reader:
        </Text>
        <View className="ml-4 mb-4">
          <Text className="text-text-primary text-base leading-6 mb-2">
            • <Text className="font-bold">Storage / files access</Text> — required to let you
            select and import documents from your device, and to save files you choose to
            share out of the app.
          </Text>
          <Text className="text-text-primary text-base leading-6 mb-2">
            • We do not request access to your camera, contacts, microphone, or precise
            location. DocReader has no feature that requires any of these.
          </Text>
        </View>

        <Text className="text-text-primary text-lg font-bold mb-2">2.4 Advertising</Text>
        <Text className="text-text-primary text-base leading-6 mb-4">
          DocReader is free to use and supported by ads served through Google AdMob. AdMob and
          its partner networks may automatically collect certain information to serve and
          measure ads, including your device's advertising identifier, general device
          information (such as device model and operating system version), approximate
          location derived from your IP address (not GPS or precise location, since the app
          does not request location permission), and information about how you interact with
          ads. This data is collected and processed by Google in accordance with{' '}
          <Text className="font-bold">Google's own Privacy Policy</Text>, available at
          https://policies.google.com/privacy. We do not control, and are not responsible for,
          how Google or its advertising partners use this data beyond what is disclosed there.
        </Text>
        <Text className="text-text-primary text-base leading-6 mb-4">
          You can opt out of personalized advertising, or reset your advertising identifier, at
          any time through your device's system settings (typically found under Settings &gt;
          Privacy &gt; Ads, or Settings &gt; Google &gt; Ads, depending on your device and
          Android version).
        </Text>

        <Text className="text-text-primary text-lg font-bold mb-2">2.5 App Performance Data</Text>
        <Text className="text-text-primary text-base leading-6 mb-8">
          The app may use Google Firebase services (such as Remote Config) to adjust certain
          app behavior — for example, ad display frequency — without requiring an app update.
          These services may collect limited, non-personally-identifying technical data (such
          as app version and general usage counts) as described in{' '}
          <Text className="font-bold">Google's Privacy Policy</Text>. We do not use this data
          to identify you personally.
        </Text>

        {/* 3. Data Security and Storage */}
        <Text className="text-text-primary text-2xl font-bold mb-4">
          3. Data Security and Storage
        </Text>
        <Text className="text-text-primary text-base leading-6 mb-4">
          Because your documents and reading data are stored locally on your own device rather
          than on servers we operate, the security of that data depends primarily on your
          device's own security (screen lock, encryption, and physical access controls).
        </Text>
        <Text className="text-text-primary text-base leading-6 mb-4">
          We do not operate a backend server that stores your documents or personal
          information, which means there is no central database of user content for us to
          secure — or that could be exposed in the event of a breach on our end. Third-party
          services we rely on for advertising (Google AdMob) and app configuration (Google
          Firebase) maintain their own security practices, described in their respective
          privacy policies.
        </Text>
        <Text className="text-text-primary text-base leading-6 mb-8">
          No method of electronic storage is 100% secure, and while we've designed the app to
          minimize what leaves your device in the first place, we cannot guarantee absolute
          security of any information processed by third-party services referenced in this policy.
        </Text>

        {/* 4. User's Rights */}
        <Text className="text-text-primary text-2xl font-bold mb-4">4. User's Rights</Text>
        <Text className="text-text-primary text-base leading-6 mb-2">
          Because DocReader does not require an account and does not collect personal
          information on our own servers, most data-related rights are already in your direct
          control on your device:
        </Text>
        <View className="ml-4 mb-4">
          <Text className="text-text-primary text-base leading-6 mb-2">
            • <Text className="font-bold">Access &amp; deletion</Text> — you can view, export
            (via Share), or delete any document, bookmark, or highlight at any time directly
            within the app.
          </Text>
          <Text className="text-text-primary text-base leading-6 mb-2">
            • <Text className="font-bold">Full data removal</Text> — uninstalling the app, or
            using the "Delete all documents" option in Settings, permanently removes all
            locally stored app data from your device.
          </Text>
          <Text className="text-text-primary text-base leading-6 mb-2">
            • <Text className="font-bold">Advertising choices</Text> — you may opt out of
            personalized ads or reset your advertising identifier through your device settings
            at any time, as described in Section 2.4.
          </Text>
        </View>
        <Text className="text-text-primary text-base leading-6 mb-8">
          If you are located in a region with additional statutory privacy rights (such as the
          EU/UK under GDPR, or California under the CCPA/CPRA), and you believe any data
          processed by our third-party ad or analytics providers on our behalf concerns you
          directly, you may contact us using the details in Section 8, and we will assist to
          the extent we are able, or direct you to the relevant third party.
        </Text>

        {/* 5. External Links */}
        <Text className="text-text-primary text-2xl font-bold mb-4">5. External Links</Text>
        <Text className="text-text-primary text-base leading-6 mb-8">
          The app may allow you to share a document to other apps installed on your device
          (such as email or messaging apps), or may contain links to external resources (such
          as our support contact or third-party privacy policies referenced in this document).
          We are not responsible for the privacy practices or content of any third-party app or
          website you are directed to. We encourage you to review the privacy policy of any
          service before providing it with information.
        </Text>

        {/* 6. Age Requirement */}
        <Text className="text-text-primary text-2xl font-bold mb-4">6. Age Requirement</Text>
        <Text className="text-text-primary text-base leading-6 mb-8">
          DocReader is not directed at children under the age of 13 (or the equivalent minimum
          age in your jurisdiction), and we do not knowingly collect personal information from
          children. Because the app does not require account creation or collect personal
          information beyond the automated advertising data described in Section 2.4, this
          risk is limited by design — however, if you believe a child has provided information
          through the app in a way that concerns you, please contact us using the details in
          Section 8.
        </Text>

        {/* 7. Updates to the Privacy Policy */}
        <Text className="text-text-primary text-2xl font-bold mb-4">
          7. Updates to the Privacy Policy
        </Text>
        <Text className="text-text-primary text-base leading-6 mb-8">
          We may update this Privacy Policy from time to time to reflect changes in the app's
          functionality, legal requirements, or our own practices. When we do, we will revise
          the "Last updated" date at the top of this page. We encourage you to review this
          policy periodically. Continued use of the app after changes are posted constitutes
          your acceptance of the updated policy.
        </Text>

        {/* 8. Contact Details */}
        <Text className="text-text-primary text-2xl font-bold mb-4">8. Contact Details</Text>
        <Text className="text-text-primary text-base leading-6 mb-2">
          If you have any questions, concerns, or requests regarding this Privacy Policy or
          your data, please contact us at:
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