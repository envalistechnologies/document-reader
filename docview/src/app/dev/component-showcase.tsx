import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { AppBar } from '../../components/ui/AppBar/AppBar';
import { Button, IconButton, TextField, SearchBar, Card, DocumentCard, ListItem, Chip, Switch, Slider, EmptyState, FAB, Divider, SegmentedControl, Avatar, Badge, Skeleton, ProgressBar } from '../../components/ui';
import { Settings, Search } from 'lucide-react-native';

import { useSettingsStore } from '../../store/useSettingsStore';

export default function ComponentShowcaseScreen() {
  const { theme, setTheme } = useSettingsStore();

  return (
    <Screen>
      <AppBar title="Component Showcase" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="mb-8">
          <Text className="text-xl font-bold text-text-primary mb-4">Themes</Text>
          <SegmentedControl
            segments={['Light', 'Dark', 'Sepia']}
            selectedIndex={['light', 'dark', 'sepia'].indexOf(theme)}
            onChange={(index) => setTheme(['light', 'dark', 'sepia'][index] as any)}
          />
        </View>

        <View className="mb-8">
          <Text className="text-xl font-bold text-text-primary mb-4">Buttons</Text>
          <Button label="Primary Button" className="mb-2" />
          <Button label="Secondary Button" variant="secondary" className="mb-2" />
          <Button label="Destructive Button" variant="destructive" className="mb-2" />
          <Button label="Text Button" variant="text" className="mb-2" />
          <View className="flex-row items-center gap-4 mt-2">
            <IconButton icon={Settings} />
            <IconButton icon={Search} variant="filled-circle" />
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-xl font-bold text-text-primary mb-4">Inputs</Text>
          <TextField label="Standard Input" placeholder="Type here..." />
          <TextField label="Error Input" placeholder="Type here..." error="This field is required" />
          <SearchBar placeholder="Search documents..." className="mb-4" />
          <Switch label="Toggle Feature" description="Enable this awesome feature" value={true} />
          <Slider label="Zoom Level" value={0.5} showValue />
        </View>

        <View className="mb-8">
          <Text className="text-xl font-bold text-text-primary mb-4">Cards & Lists</Text>
          <Card className="mb-4">
            <Text className="text-text-primary font-medium">Standard Card</Text>
            <Text className="text-text-secondary text-sm mt-1">Some card content here.</Text>
          </Card>
          <DocumentCard title="Annual Report.pdf" subtitle="1.2 MB • Opened 2h ago" format="pdf" />
          <DocumentCard title="Project Plan.docx" subtitle="45 KB • Opened 1d ago" format="docx" variant="grid" />
          <ListItem title="Account Settings" subtitle="Manage your profile" leadingIcon={Settings} showChevron />
        </View>

        <View className="mb-8">
          <Text className="text-xl font-bold text-text-primary mb-4">Feedback & Status</Text>
          <View className="flex-row gap-2 mb-4">
            <Chip label="Filter: All" selected />
            <Chip label="Filter: PDFs" />
            <Chip label="Status: Syncing" variant="status" />
          </View>
          <View className="flex-row items-center gap-4 mb-4">
            <Avatar initials="JD" />
            <View>
              <Badge count={5} />
            </View>
            <View>
              <Badge status />
            </View>
          </View>
          <ProgressBar progress={0.6} className="mb-4" />
          <Skeleton variant="card" />
        </View>

      </ScrollView>
    </Screen>
  );
}
