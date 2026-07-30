import React from 'react';
import { Text } from 'react-native';
import { Screen } from '../../../components/layout/Screen';
import { AppBar } from '../../../components/ui/AppBar/AppBar';

export default function TOCScreen() {
  return (
    <Screen>
      <AppBar title="Table of Contents" />
      <Text className="text-text-primary p-4">TOC Placeholder</Text>
    </Screen>
  );
}
