import React from 'react';
import { NativeModules, TurboModuleRegistry, Platform } from 'react-native';

// Check if native RNGoogleMobileAdsModule is compiled into the binary
export const isAdMobAvailable = Platform.OS !== 'web' && !!(
  NativeModules?.RNGoogleMobileAdsModule ||
  (TurboModuleRegistry && typeof TurboModuleRegistry.get === 'function' && TurboModuleRegistry.get('RNGoogleMobileAdsModule'))
);

let MobileAds: any = null;

if (isAdMobAvailable) {
  try {
    MobileAds = require('react-native-google-mobile-ads');
  } catch (e) {
    console.warn('[AdMob] Failed to load native Google Mobile Ads module:', e);
    MobileAds = null;
  }
}

export const TestIds = MobileAds?.TestIds || {
  BANNER: 'ca-app-pub-3940256099942544/6300978111',
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
  REWARDED_INTERSTITIAL: 'ca-app-pub-3940256099942544/5354046379',
  REWARDED: 'ca-app-pub-3940256099942544/5224354917',
};

export const BannerAdSize = MobileAds?.BannerAdSize || {
  ANCHORED_ADAPTIVE_BANNER: 'ANCHORED_ADAPTIVE_BANNER',
  BANNER: 'BANNER',
  FULL_BANNER: 'FULL_BANNER',
  LARGE_BANNER: 'LARGE_BANNER',
  LEADERBOARD: 'LEADERBOARD',
  MEDIUM_RECTANGLE: 'MEDIUM_RECTANGLE',
};

export function BannerAd(props: any) {
  if (MobileAds?.BannerAd) {
    const RealBannerAd = MobileAds.BannerAd;
    return React.createElement(RealBannerAd, props);
  }
  return null;
}

export function useInterstitialAd(adUnitId: string | null, options?: any) {
  if (MobileAds?.useInterstitialAd && adUnitId) {
    return MobileAds.useInterstitialAd(adUnitId, options);
  }
  return {
    isLoaded: false,
    isClosed: false,
    isShowing: false,
    load: () => {},
    show: () => {},
  };
}

export function useRewardedInterstitialAd(adUnitId: string | null, options?: any) {
  if (MobileAds?.useRewardedInterstitialAd && adUnitId) {
    return MobileAds.useRewardedInterstitialAd(adUnitId, options);
  }
  return {
    isLoaded: false,
    isEarnedReward: false,
    isClosed: false,
    isShowing: false,
    load: () => {},
    show: () => {},
  };
}
