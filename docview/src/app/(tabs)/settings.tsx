import React from 'react';
import { View, Text, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/layout/Screen';
import { AppBar } from '../../components/ui/AppBar/AppBar';
import { useSettingsStore } from '../../store/useSettingsStore';
import { deleteAllData } from '../../services/storage/dataReset.service';
import { Sun, SquarePen, Settings, Search, Copy, Trash, ChevronRight } from 'lucide-react-native';
import { LanguageSelectorModal } from '../../components/ui/LanguageSelectorModal';
import { RemoveAdsCard } from '../../components/ui/RemoveAdsCard/RemoveAdsCard';
import { useTheme } from '../../theme/useTheme';

// --- Premium UI Components ---

function SettingsGroup({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <View className="mb-8 px-4">
      <Text className="text-text-secondary text-sm font-bold uppercase tracking-widest mb-3 ml-2">
        {title}
      </Text>
      <View className="bg-bg-elevated rounded-2xl overflow-hidden shadow-sm border border-border-subtle">
        {children}
      </View>
    </View>
  );
}

interface SettingsRowProps {
  icon: any;
  iconBg: string;
  title: string;
  value?: string;
  onPress: () => void;
  isDestructive?: boolean;
  showChevron?: boolean;
}

function SettingsRow({ icon: IconComponent, iconBg, title, value, onPress, isDestructive, showChevron = true }: SettingsRowProps) {
  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={onPress}
      className="flex-row items-center p-4 border-b border-border-subtle bg-bg-surface"
    >
      <View className={`w-9 h-9 rounded-xl items-center justify-center mr-4 ${iconBg}`}>
        <IconComponent color="white" size={20} />
      </View>
      <View className="flex-1">
        <Text className={`text-base font-semibold ${isDestructive ? 'text-danger' : 'text-text-primary'}`}>
          {title}
        </Text>
      </View>
      {value && (
        <Text className="text-text-secondary font-medium mr-2">{value}</Text>
      )}
      {showChevron && (
        <ChevronRight color="#9CA3AF" size={18} />
      )}
    </TouchableOpacity>
  );
}

// --- Main Screen ---

const LANG_MAP: Record<string, string> = {
  en: 'English',
  hi: 'हिंदी',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ar: 'العربية',
  fa: 'فارسی',
  zh: '中文',
};

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { theme, setTheme, language, setLanguage } = useSettingsStore();

  const [isLanguageModalVisible, setLanguageModalVisible] = React.useState(false);

  const handleLanguageSelect = (lang: string) => {
    setLanguage(lang);
    setLanguageModalVisible(false);
  };

  const handleDeleteAll = () => {
    Alert.alert(
      t('settings.deleteAllPrompt'),
      t('settings.deleteAllMsg'),
      [
        { text: t('settings.cancel'), style: 'cancel' },
        {
          text: t('settings.yesSure'),
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              t('settings.finalWarning'),
              t('settings.wipeMsg'),
              [
                { text: t('settings.cancel'), style: 'cancel' },
                {
                  text: t('settings.wipeEverything'),
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await deleteAllData();
                      Alert.alert(t('settings.success'), t('settings.wipedMsg'));
                    } catch (e) {
                      Alert.alert(t('settings.error'), t('settings.deleteFailed'));
                    }
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  return (
    <Screen>
      <AppBar title={t('common.settings')} />
      <ScrollView className="flex-1 py-6" contentContainerStyle={{ paddingBottom: 40 }}>
        
        <View className="mb-2">
          <RemoveAdsCard className="mx-4 mb-4" />
        </View>

        <SettingsGroup title={t('settings.general')}>
          <SettingsRow 
            icon={Sun} iconBg="bg-blue-500" 
            title={t('settings.appTheme')} 
            value={theme === 'dark' ? t('settings.dark') : t('settings.light')}
            onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          />
          <SettingsRow 
            icon={SquarePen} iconBg="bg-indigo-500" 
            title={t('settings.language')} 
            value={LANG_MAP[language] || 'English'}
            onPress={() => setLanguageModalVisible(true)}
          />
        </SettingsGroup>

        <SettingsGroup title={t('settings.storage')}>
          <SettingsRow 
            icon={Settings} iconBg="bg-emerald-500" 
            title={t('settings.storageBreakdown')}
            onPress={() => router.push('/settings/storage' as any)}
          />
        </SettingsGroup>

        <SettingsGroup title={t('settings.information')}>
          <SettingsRow 
            icon={Search} iconBg="bg-amber-500" 
            title={t('settings.faq')}
            onPress={() => router.push('/settings/faq' as any)}
          />
          <SettingsRow 
            icon={Copy} iconBg="bg-orange-500" 
            title={t('settings.terms')}
            onPress={() => router.push('/settings/terms' as any)}
          />
          <SettingsRow 
            icon={Settings} iconBg="bg-gray-600" 
            title={t('settings.privacy')}
            onPress={() => router.push('/settings/privacy' as any)}
          />
          <SettingsRow 
            icon={Settings} iconBg="bg-gray-500" 
            title={t('settings.version')} 
            value="1.0.1" 
            showChevron={false}
            onPress={() => {}}
          />
        </SettingsGroup>

        <SettingsGroup title={t('settings.dangerZone')}>
          <SettingsRow 
            icon={Trash} iconBg="bg-red-500" 
            title={t('settings.deleteAll')} 
            isDestructive 
            showChevron={false}
            onPress={handleDeleteAll}
          />
        </SettingsGroup>

      </ScrollView>

      <LanguageSelectorModal 
        visible={isLanguageModalVisible}
        currentLanguage={language}
        onClose={() => setLanguageModalVisible(false)}
        onSelect={handleLanguageSelect}
      />
    </Screen>
  );
}
