import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, LayoutAnimation, UIManager, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { AppBar } from '../../components/ui/AppBar/AppBar';
import {
  ChevronUp, ChevronDown, MessageSquare, ZoomIn, BookOpen, Search,
  HelpCircle, RefreshCw, Bookmark, Edit3, Star, List, FilePlus,
  AlertTriangle, XCircle, Gift, Clock, Shield, ChevronLeft,
  Folder,
  Trash2,
  Share2,
  Copy,
  Type,
  Moon,
  Sliders,
  HardDrive
} from 'lucide-react-native';
import { useTheme } from '../../theme/useTheme';

// LayoutAnimation is enabled by default in the New Architecture (Fabric)
// on React Native 0.76+, so we don't need to manually enable it.

type FAQItem = {
  question: string;
  answer: string;
  icon: any;
};

type FAQGroup = {
  category: string;
  items: FAQItem[];
};

const FAQ_DATA: FAQGroup[] = [
  {
    category: 'View & Navigate',
    items: [
      { icon: ZoomIn, question: 'How do I zoom in on a page?', answer: 'Pinch with two fingers anywhere on the page to zoom in or out. Double-tap to quickly zoom to a comfortable reading level.' },
      { icon: BookOpen, question: 'How do I jump to a specific page or chapter?', answer: 'Tap the table of contents icon in the reader toolbar to see all chapters/sections, or tap the page indicator at the bottom to type a page number directly.' },
      { icon: Search, question: 'Can I search inside a document?', answer: 'Yes. Tap the search icon in the reader toolbar to find text within the open document. For PDFs, results show by page; for text-based formats, matches are highlighted directly.' },
      { icon: HelpCircle, question: "Why won't my file open?", answer: 'The file may be corrupted, password-protected, or in a format the app doesn\u2019t support yet. Supported formats are PDF, TXT, DOCX, and EPUB.' },
      { icon: RefreshCw, question: 'Why does my document open where I left off?', answer: 'DocReader automatically remembers your last-read page for every document, so you can pick up right where you stopped without searching for your place.' },
    ]
  },
  {
    category: 'Highlights & Bookmarks',
    items: [
      { icon: Bookmark, question: 'How do I bookmark a page?', answer: 'Tap the bookmark icon in the reader toolbar while viewing any page. You can find all your bookmarks later in the Bookmarks tab.' },
      { icon: Edit3, question: 'How do I highlight text?', answer: 'For text-based documents (TXT, DOCX, EPUB), select any text and choose a highlight color from the menu that appears. For PDFs, use page bookmarks with notes instead \u2014 full text highlighting isn\u2019t currently supported for PDF.' },
      { icon: Star, question: 'How do I mark a document as a favorite?', answer: 'Long-press any document in your Library and tap the star icon, or tap the star inside the document\u2019s info screen.' },
      { icon: List, question: 'Where can I see all my highlights for a document?', answer: 'Open the document and tap the highlights icon in the reader toolbar to see every highlight and note you\u2019ve made in that document.' },
    ]
  },
  {
    category: 'Manage Documents',
    items: [
      { icon: FilePlus, question: 'How do I import a document?', answer: 'Tap the Import button on your Library screen and select one or more files from your device. Supported formats are PDF, TXT, DOCX, and EPUB.' },
      { icon: Folder, question: 'Can I organize documents into folders?', answer: 'Yes. Create a folder from the Library screen and assign documents to it via the document\u2019s context menu (long-press) or the Document Info screen.' },
      { icon: Trash2, question: 'How do I delete a document?', answer: 'Long-press the document in your Library and select Delete, or open the Document Info screen and tap Delete there. This removes it from the app permanently \u2014 it does not affect any copy of the file elsewhere on your device.' },
      { icon: Share2, question: 'Can I share a document from the app?', answer: 'Yes. Open the document\u2019s context menu or Document Info screen and tap Share to send it via email, messaging apps, or any other app on your device.' },
      { icon: Copy, question: 'What happens if I import the same file twice?', answer: 'DocReader detects duplicate files and asks whether you\u2019d like to open the existing copy or import it again as a new entry \u2014 it won\u2019t silently create duplicates.' },
    ]
  },
  {
    category: 'Reading Preferences',
    items: [
      { icon: Type, question: 'Can I change the font or text size?', answer: 'Yes. Open the reader settings from the toolbar to adjust font family, size, line spacing, and margins. Changes apply immediately and are remembered for future reading sessions.' },
      { icon: Moon, question: 'Does the app have a night mode?', answer: 'Yes. You can switch between Light, Sepia, and Dark reading themes from the reader settings \u2014 useful for reading comfortably in different lighting.' },
      { icon: Sliders, question: 'Can I set default reading preferences for all documents?', answer: 'Yes. Go to Settings > Reading to set your default font, size, and theme, which will apply automatically whenever you open a new document.' },
    ]
  },
  {
    category: 'Storage & Data',
    items: [
      { icon: HardDrive, question: 'How much storage is my library using?', answer: 'Go to Settings > Storage to see a full breakdown of space used by your documents, thumbnails, and cached data.' },
      { icon: RefreshCw, question: 'What does "Clear cache" actually delete?', answer: 'Clearing the cache removes generated thumbnails and search-indexing data only. It never deletes your documents, bookmarks, or highlights \u2014 thumbnails simply regenerate the next time you view your Library.' },
      { icon: AlertTriangle, question: 'What happens if I choose "Delete all documents"?', answer: 'This permanently removes every document, bookmark, and highlight from the app. It cannot be undone, which is why it requires a confirmation step before it runs.' },
    ]
  },
  {
    category: 'About the App',
    items: [
      { icon: XCircle, question: 'Why do I see ads?', answer: 'DocReader is completely free to use, with no accounts and no subscriptions. Ads support the app\u2019s development. Ads never appear while you\u2019re actively reading a document \u2014 only on the Library, Search, Bookmarks, and Settings screens.' },
      { icon: Gift, question: 'Can I remove ads?', answer: 'Yes \u2014 you can watch a short rewarded ad from the Settings screen to remove ads for 1 hour, or to unlock additional reading themes. There is no paid subscription; this is entirely optional and free.' },
      { icon: Clock, question: 'Why does a large document open slowly?', answer: 'Very large files, especially high-resolution scanned PDFs, take longer to process. Once opened, page navigation should be smooth \u2014 if it isn\u2019t, try closing other apps to free up memory.' },
      { icon: Shield, question: 'Does the app collect my personal data?', answer: 'No accounts are required to use DocReader. Your documents are stored privately on your device only. See our full Privacy Policy in Settings > About for details on what limited data ads require.' },
    ]
  }
];

function AccordionItem({ icon: IconComponent, question, answer }: { icon: any; question: string; answer: string }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View className="mb-2 bg-bg-elevated rounded-xl overflow-hidden border border-border-subtle">
      <TouchableOpacity
        className="flex-row items-center p-4"
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <IconComponent color="#9CA3AF" size={20} />
        <Text className="flex-1 text-text-primary text-base font-semibold mx-3">{question}</Text>
        {expanded ? <ChevronUp color="#9CA3AF" size={20} /> : <ChevronDown color="#9CA3AF" size={20} />}
      </TouchableOpacity>
      {expanded && (
        <View className="px-4 pb-4 pt-1">
          <Text className="text-text-secondary text-sm leading-5 ml-8">{answer}</Text>
        </View>
      )}
    </View>
  );
}

export default function FAQScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = FAQ_DATA.map(group => group.category);

  const filteredData = selectedCategory === 'All'
    ? FAQ_DATA
    : FAQ_DATA.filter(group => group.category === selectedCategory);

  return (
    <Screen>
      <AppBar leadingSlot={<BackButton />} title="FAQ" />

      {/* Category Pills */}
      <View className="px-4 py-3 flex-row">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
          <TouchableOpacity
            onPress={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-full ${selectedCategory === 'All' ? 'bg-accent-primary' : 'bg-elevated border border-border-subtle'}`}
          >
            <Text className={`font-semibold ${selectedCategory === 'All' ? 'text-white' : 'text-text-primary'}`}>All</Text>
          </TouchableOpacity>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full ${selectedCategory === cat ? 'bg-accent-primary' : 'bg-elevated border border-border-subtle'}`}
            >
              <Text className={`font-semibold ${selectedCategory === cat ? 'text-white' : 'text-text-primary'}`}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-4 py-4" contentContainerStyle={{ paddingBottom: 100 }}>
        {filteredData.map((group) => (
          <View key={group.category} className="mb-6">
            <Text className="text-text-secondary text-sm font-bold uppercase tracking-wider mb-3 ml-2">
              {group.category}
            </Text>
            {group.items.map((item, idx) => (
              <AccordionItem
                key={idx}
                icon={item.icon}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Floating Feedback Button */}
      <View className="absolute bottom-6 left-0 right-0 items-center">
        <TouchableOpacity
          className="bg-accent-primary flex-row items-center px-6 py-3.5 rounded-full shadow-lg"
          activeOpacity={0.8}
        >
          <MessageSquare color="white" size={20} />
          <Text className="text-white text-base font-bold ml-2">Feedback or suggestion</Text>
        </TouchableOpacity>
      </View>

    </Screen>
  );
}
function BackButton() {
  const router = useRouter();
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={() => router.back()} className="p-2 ml-2">
      <ChevronLeft size={24} color={colors.text.primary} />
    </TouchableOpacity>
  );
}
