import { TestIds } from '../services/ads/admobWrapper';

export const ADMOB_CONFIG = {
  // Google Mobile Ads App ID: ca-app-pub-7583323986111464~4214692699
  androidAppId: 'ca-app-pub-7583323986111464~4214692699',

  // Banner_Main_Bottom Ad Unit ID
  bannerMainBottom: __DEV__ 
    ? TestIds.BANNER 
    : 'ca-app-pub-7583323986111464/9822242593',

  // Interstitial Ad Unit ID (Interstitial_Doc_Open)
  interstitialDocOpen: __DEV__ 
    ? TestIds.INTERSTITIAL 
    : 'ca-app-pub-7583323986111464/9102243200',

  // Rewarded Interstitial Ad Unit ID (Rewarded_Remove_Ads)
  rewardedRemoveAds: __DEV__ 
    ? TestIds.REWARDED_INTERSTITIAL 
    : 'ca-app-pub-7583323986111464/1839810795',
};
