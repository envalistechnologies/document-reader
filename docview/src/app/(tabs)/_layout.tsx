import React from 'react';
import { Tabs } from 'expo-router';
import { TabBar } from '../../components/layout/TabBar';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs tabBar={(props: any) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('common.home'),
          tabBarLabel: t('common.home'),
        }}
      />
      <Tabs.Screen
        name="documents"
        options={{
          title: t('common.documents'),
          tabBarLabel: t('common.documents'),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: t('common.search'),
          tabBarLabel: t('common.search'),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: t('common.favorites'),
          tabBarLabel: t('common.favorites'),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('common.settings'),
          tabBarLabel: t('common.settings'),
        }}
      />
    </Tabs>
  );
}
