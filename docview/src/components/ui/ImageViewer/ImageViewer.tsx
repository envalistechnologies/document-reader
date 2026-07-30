import React, { useState } from 'react';
import { View, Text, ActivityIndicator, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../../../theme/useTheme';

interface ImageViewerProps {
  filePath: string;
}

export function ImageViewer({ filePath }: ImageViewerProps) {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Use a WebView-based viewer for cross-platform pinch-to-zoom support.
  // Android ScrollView doesn't support minimumZoomScale / maximumZoomScale.
  const imageUri = filePath.startsWith('file://') ? filePath : `file://${filePath}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=0.3, maximum-scale=10.0, user-scalable=yes" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      height: 100%;
      background: #000000;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      -webkit-overflow-scrolling: touch;
    }
    img {
      max-width: 100%;
      max-height: 100vh;
      object-fit: contain;
      display: block;
    }
    #error-state {
      color: #ef4444;
      font-family: -apple-system, sans-serif;
      font-size: 14px;
      text-align: center;
      padding: 20px;
      display: none;
    }
  </style>
</head>
<body>
  <img
    id="main-image"
    src="${imageUri}"
    onerror="document.getElementById('main-image').style.display='none'; document.getElementById('error-state').style.display='block'; window.ReactNativeWebView && window.ReactNativeWebView.postMessage('ERROR');"
    onload="window.ReactNativeWebView && window.ReactNativeWebView.postMessage('LOADED');"
  />
  <div id="error-state">Unable to load image</div>
</body>
</html>
  `;

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      {loading && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.accent.primary} />
          <Text style={{ color: '#ffffff', fontSize: 12, marginTop: 8 }}>Loading Image...</Text>
        </View>
      )}

      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={{ flex: 1, backgroundColor: '#000000' }}
        javaScriptEnabled={true}
        scalesPageToFit={false}
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
        onMessage={(event) => {
          const msg = event.nativeEvent.data;
          if (msg === 'LOADED') {
            setLoading(false);
          } else if (msg === 'ERROR') {
            setLoading(false);
            setError(true);
          }
        }}
      />

      {error && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Text style={{ color: '#ef4444', fontWeight: '700', fontSize: 15, textAlign: 'center' }}>Unable to load image</Text>
          <Text style={{ color: '#6b7280', fontSize: 11, marginTop: 6, textAlign: 'center' }}>{filePath}</Text>
        </View>
      )}
    </View>
  );
}
