import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { Sparkles, Gift, Clock, CheckCircle2, PlayCircle } from 'lucide-react-native';
import { useRewardedInterstitialAd, isAdMobAvailable } from '../../../services/ads/admobWrapper';
import { ADMOB_CONFIG } from '../../../config/ads';
import { useSettingsStore } from '../../../store/useSettingsStore';
import { useTheme } from '../../../theme/useTheme';

interface RemoveAdsCardProps {
  className?: string;
  variant?: 'full' | 'compact';
}

export function RemoveAdsCard({ className = '', variant = 'full' }: RemoveAdsCardProps) {
  const { colors } = useTheme();
  const { adFreeUntil, grantAdFreeHours } = useSettingsStore();

  const [loadingAd, setLoadingAd] = useState(false);
  const [adEarned, setAdEarned] = useState(false);

  const { isLoaded, isEarnedReward, isClosed, load, show } = useRewardedInterstitialAd(
    ADMOB_CONFIG.rewardedRemoveAds,
    { requestNonPersonalizedAdsOnly: false }
  );

  // Calculate remaining time
  const now = Date.now();
  const isAdFreeActive = adFreeUntil !== null && adFreeUntil > now;
  const hoursLeft = isAdFreeActive ? Math.ceil((adFreeUntil - now) / (1000 * 60 * 60)) : 0;

  useEffect(() => {
    if (Platform.OS !== 'web') {
      load();
    }
  }, [load]);

  // When reward is earned
  useEffect(() => {
    if (isEarnedReward || adEarned) {
      grantAdFreeHours(1);
      setAdEarned(false);
      Alert.alert(
        '🎉 Reward Claimed!',
        'You have unlocked 1 hour of completely Ad-Free reading! Enjoy your clean workspace.',
        [{ text: 'Great!' }]
      );
    }
  }, [isEarnedReward, adEarned, grantAdFreeHours]);

  // Reload ad when closed
  useEffect(() => {
    if (isClosed && Platform.OS !== 'web') {
      load();
    }
  }, [isClosed, load]);

  const handleWatchAd = () => {
    if (Platform.OS === 'web' || !isAdMobAvailable || __DEV__) {
      // Dev / Web / Expo Go simulation fallback for testing
      setLoadingAd(true);
      setTimeout(() => {
        setLoadingAd(false);
        grantAdFreeHours(1);
        Alert.alert('✨ Ad-Free Activated', 'Ad-Free pass granted for 1 hour (Dev mode test).');
      }, 1000);
      return;
    }

    if (isLoaded) {
      show();
    } else {
      setLoadingAd(true);
      load();
      setTimeout(() => {
        setLoadingAd(false);
        if (isLoaded) {
          show();
        } else {
          Alert.alert('Ad Loading', 'The rewarded ad is currently loading. Please try again in a few seconds.');
        }
      }, 2000);
    }
  };

  if (variant === 'compact') {
    return (
      <TouchableOpacity
        onPress={handleWatchAd}
        activeOpacity={0.8}
        className={`bg-indigo-600/10 border border-indigo-500/30 rounded-xl p-3 flex-row items-center justify-between ${className}`}
      >
        <View className="flex-row items-center flex-1 mr-2">
          <Gift size={18} color="#6366F1" className="mr-2" />
          <Text className="text-text-primary text-xs font-semibold">
            {isAdFreeActive ? `Ad-Free Active (${hoursLeft}h left)` : 'Watch 1 Video = 1h No Ads'}
          </Text>
        </View>
        <View className="bg-indigo-600 px-2.5 py-1 rounded-lg">
          <Text className="text-white text-xs font-bold">
            {isAdFreeActive ? 'Extend' : 'Watch'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View 
      className={`p-5 rounded-2xl border bg-bg-elevated border-border-subtle shadow-sm ${className}`}
      style={{
        backgroundColor: colors.bg.surface,
      }}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-xl bg-indigo-500/15 items-center justify-center mr-3">
            <Sparkles size={22} color={colors.accent.primary} />
          </View>
          <View>
            <Text className="text-text-primary font-bold text-base">
              {isAdFreeActive ? 'Ad-Free Pass Active ✨' : 'Remove Ads for 1 Hour'}
            </Text>
            <Text className="text-text-secondary text-xs mt-0.5">
              {isAdFreeActive 
                ? `Enjoying an uninterrupted document reader experience`
                : 'Watch a single short video to disable all banner and screen ads'}
            </Text>
          </View>
        </View>
      </View>

      {isAdFreeActive ? (
        <View className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-3 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <CheckCircle2 size={18} color="#10B981" />
            <Text className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs ml-2">
              Ad-Free for next {hoursLeft} hour{hoursLeft > 1 ? 's' : ''}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Clock size={14} color="#10B981" />
          </View>
        </View>
      ) : null}

      <TouchableOpacity
        onPress={handleWatchAd}
        disabled={loadingAd}
        activeOpacity={0.8}
        className="bg-accent-primary py-3 px-4 rounded-xl flex-row items-center justify-center shadow-sm"
      >
        {loadingAd ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <>
            <PlayCircle size={18} color="#FFFFFF" className="mr-2" />
            <Text className="text-white font-bold text-sm ml-2">
              {isAdFreeActive ? 'Extend Ad-Free (+1 Hour)' : 'Watch Video & Remove Ads'}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
