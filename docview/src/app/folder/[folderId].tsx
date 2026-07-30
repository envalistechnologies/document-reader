import React from 'react';
import { Text } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { AppBar } from '../../components/ui/AppBar/AppBar';

export default function FolderScreen() {
  return (
    <Screen>
      <AppBar title="Folder" />
      <Text className="text-text-primary p-4">Folder View Placeholder</Text>
    </Screen>
  );
}
