import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, isAdMobAvailable } from '../../../services/ads/admobWrapper';
import { ADMOB_CONFIG } from '../../../config/ads';
import { useTheme } from '../../../theme/useTheme';

import { useSettingsStore } from '../../../store/useSettingsStore';

interface AdBannerProps {
  unitId?: string;
  className?: string;
}

export function AdBanner({ unitId = ADMOB_CONFIG.bannerMainBottom, className = '' }: AdBannerProps) {
  const { colors } = useTheme();
  const adFreeUntil = useSettingsStore((state) => state.adFreeUntil);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  const isAdFree = adFreeUntil !== null && Date.now() < adFreeUntil;
  if (isAdFree) {
    return null;
  }

  // If on Web, native module missing (e.g. Expo Go), or ad failed to load, show non-intrusive container or placeholder in DEV
  if (Platform.OS === 'web' || !isAdMobAvailable || adError) {
    if (__DEV__) {
      return (
        <View 
          style={[styles.fallbackContainer, { backgroundColor: colors.bg.surface, borderColor: colors.border.subtle }]}
          className={className}
        >
          <Text style={[styles.fallbackText, { color: colors.text.secondary }]}>
            [AdMob Banner Placeholder - {unitId === ADMOB_CONFIG.bannerMainBottom ? 'Banner_Main_Bottom' : 'AdUnit'}]
          </Text>
        </View>
      );
    }
    return null;
  }

  return (
    <View style={styles.container} className={className}>
      <BannerAd
        unitId={unitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdLoaded={() => {
          setAdLoaded(true);
          setAdError(false);
        }}
        onAdFailedToLoad={(error: Error) => {
          console.log('AdBanner failed to load:', error);
          setAdError(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 4,
  },
  fallbackContainer: {
    width: '100%',
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
  },
  fallbackText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
