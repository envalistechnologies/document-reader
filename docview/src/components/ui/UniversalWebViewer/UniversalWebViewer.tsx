import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system/legacy';
import { useTheme } from '../../../theme/useTheme';

interface UniversalWebViewerProps {
  filePath: string;
  format: string;
}

async function safeReadBase64(uri: string): Promise<string> {
  try {
    return await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
  } catch (err1) {
    if (uri.startsWith('file://')) {
      const cleanPath = decodeURIComponent(uri.replace('file://', ''));
      return await FileSystem.readAsStringAsync(cleanPath, {
        encoding: FileSystem.EncodingType.Base64,
      });
    }
    throw err1;
  }
}

export function UniversalWebViewer({ filePath, format }: UniversalWebViewerProps) {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();

  useEffect(() => {
    async function prepareDocument() {
      try {
        const fmt = format.toLowerCase();
        
        let base64Data = '';
        try {
          base64Data = await safeReadBase64(filePath);
        } catch (readErr) {
          console.warn('Base64 read warning:', readErr);
        }

        let html = '';

        if (fmt === 'pdf') {
          html = getPdfHtml(base64Data);
        } else {
          html = getUnsupportedHtml(fmt);
        }

        setHtmlContent(html);
      } catch (err) {
        console.error('Failed to prepare document for viewing', err);
        setError('Could not process this document format.');
      }
    }

    prepareDocument();
  }, [filePath, format]);

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <Text style={{ color: colors.danger, textAlign: 'center', fontWeight: '600' }}>{error}</Text>
      </View>
    );
  }

  if (!htmlContent) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.accent.primary} />
        <Text style={{ color: colors.text.secondary, marginTop: 16, fontWeight: '500' }}>Preparing Document View...</Text>
      </View>
    );
  }

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: htmlContent }}
      style={{ flex: 1, backgroundColor: colors.bg.base }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      mixedContentMode="always"
      scalesPageToFit={false}
      allowFileAccess={true}
      allowFileAccessFromFileURLs={true}
      allowUniversalAccessFromFileURLs={true}
    />
  );
}

// ---------------------------------------------------------------------------
// PDF Viewer — renders pages as canvas with pdf.js, pinch-to-zoom via viewport
// ---------------------------------------------------------------------------

function getPdfHtml(base64: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=0.3, maximum-scale=5.0, user-scalable=yes" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>
  <style>
    * { box-sizing: border-box; -webkit-text-size-adjust: 100%; }
    html { background: #2c2c2e; }
    body { margin: 0; background: #2c2c2e; display: flex; flex-direction: column; align-items: center; padding: 8px; padding-bottom: 56px; -webkit-overflow-scrolling: touch; }
    canvas { max-width: 100%; height: auto; margin-bottom: 8px; box-shadow: 0 2px 12px rgba(0,0,0,0.45); }
    .page-pill {
      position: fixed;
      bottom: 14px;
      left: 14px;
      background: rgba(0,0,0,0.72);
      color: #ffffff;
      padding: 5px 14px;
      border-radius: 14px;
      font-size: 12px;
      font-weight: 700;
      z-index: 100;
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
    }
    #status { margin-top: 40px; font-family: system-ui, -apple-system, sans-serif; color: #f3f4f6; text-align: center; }
  </style>
</head>
<body>
  <div id="status">Rendering PDF...</div>
  <div id="pdf-container"></div>
  <div class="page-pill" id="page-pill">Loading...</div>
  <script>
    try {
      function base64ToUint8Array(base64) {
        var raw = window.atob(base64);
        var rawLength = raw.length;
        var array = new Uint8Array(new ArrayBuffer(rawLength));
        for (var i = 0; i < rawLength; i++) {
          array[i] = raw.charCodeAt(i);
        }
        return array;
      }

      var pdfjsLib = window['pdfjs-dist/build/pdf'];
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

      var pdfData = base64ToUint8Array('${base64}');
      var loadingTask = pdfjsLib.getDocument({ data: pdfData });
      
      loadingTask.promise.then(function(pdf) {
        document.getElementById('status').style.display = 'none';
        var container = document.getElementById('pdf-container');
        var totalPages = pdf.numPages;
        document.getElementById('page-pill').innerText = '1 / ' + totalPages;
        
        for (var pageNum = 1; pageNum <= totalPages; pageNum++) {
          (function(num) {
            pdf.getPage(num).then(function(page) {
              var viewport = page.getViewport({ scale: 1.5 });
              var canvas = document.createElement('canvas');
              var context = canvas.getContext('2d');
              canvas.height = viewport.height;
              canvas.width = viewport.width;
              canvas.dataset.page = num;
              container.appendChild(canvas);
              
              page.render({ canvasContext: context, viewport: viewport });
            });
          })(pageNum);
        }

        // Scroll-based page pill
        window.addEventListener('scroll', function() {
          var canvases = container.querySelectorAll('canvas');
          var scrollY = window.pageYOffset + window.innerHeight * 0.3;
          var cur = 1;
          canvases.forEach(function(c) {
            if (c.offsetTop <= scrollY) cur = parseInt(c.dataset.page) || 1;
          });
          document.getElementById('page-pill').innerText = cur + ' / ' + totalPages;
        });

      }).catch(function(err) {
        document.getElementById('status').innerHTML = '<p style="color:#f87171">Error loading PDF: ' + err.message + '</p>';
        document.getElementById('page-pill').style.display = 'none';
      });
    } catch(e) {
      document.getElementById('status').innerHTML = '<p style="color:#f87171">Unable to parse PDF data.</p>';
      document.getElementById('page-pill').style.display = 'none';
    }
  </script>
</body>
</html>
  `;
}

function getUnsupportedHtml(format: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { margin: 0; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: -apple-system, sans-serif; background-color: #f9fafb; color: #4b5563; text-align: center; padding: 20px;}
    .card { background: white; padding: 32px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); max-width: 320px; width: 100%; }
    h3 { margin: 0 0 8px 0; color: #111827; }
    p { margin: 0; font-size: 14px; line-height: 1.5; color: #6b7280; }
  </style>
</head>
<body>
  <div class="card">
    <h3>.${format.toUpperCase()} Document</h3>
    <p>File loaded successfully into your manager.</p>
  </div>
</body>
</html>
  `;
}
