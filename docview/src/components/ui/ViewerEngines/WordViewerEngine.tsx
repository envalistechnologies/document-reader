import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system/legacy';
import { useTheme } from '../../../theme/useTheme';

interface WordViewerEngineProps {
  filePath: string;
  format: string;
}

export function WordViewerEngine({ filePath, format }: WordViewerEngineProps) {
  const { colors } = useTheme();
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState({ current: 1, total: 1 });

  useEffect(() => {
    async function loadWordDocument() {
      try {
        let base64 = '';
        try {
          base64 = await FileSystem.readAsStringAsync(filePath, {
            encoding: FileSystem.EncodingType.Base64,
          });
        } catch (err) {
          if (filePath.startsWith('file://')) {
            const cleanPath = decodeURIComponent(filePath.replace('file://', ''));
            base64 = await FileSystem.readAsStringAsync(cleanPath, {
              encoding: FileSystem.EncodingType.Base64,
            });
          }
        }

        const html = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=0.9, minimum-scale=0.3, maximum-scale=5.0, user-scalable=yes" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.21/mammoth.browser.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
  <style>
    * { box-sizing: border-box; -webkit-text-size-adjust: 100%; }
    html { background: #2c2c2e; }
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #2c2c2e;
      -webkit-overflow-scrolling: touch;
    }

    .page {
      background: #ffffff;
      width: 210mm;
      min-height: 297mm;
      padding: 25mm 20mm 30mm 20mm;
      margin: 8px auto;
      box-shadow: 0 2px 16px rgba(0,0,0,0.35);
      color: #1c1c1e;
      font-size: 11pt;
      line-height: 1.6;
      overflow-wrap: break-word;
      word-wrap: break-word;
    }

    h1 { font-size: 18pt; font-weight: 700; margin: 18pt 0 8pt 0; color: #1c1c1e; }
    h2 { font-size: 15pt; font-weight: 600; margin: 14pt 0 6pt 0; color: #1c1c1e; }
    h3 { font-size: 13pt; font-weight: 600; margin: 12pt 0 4pt 0; color: #1c1c1e; }
    p { margin: 0 0 8pt 0; }
    ul, ol { margin: 4pt 0 8pt 0; padding-left: 22pt; }
    li { margin-bottom: 3pt; }
    table { border-collapse: collapse; width: 100%; margin: 8pt 0; }
    th, td { border: 1px solid #d1d1d6; padding: 6pt 8pt; text-align: left; font-size: 10pt; }
    th { background: #f2f2f7; font-weight: 600; }
    img { max-width: 100%; height: auto; margin: 8pt 0; display: block; }
    a { color: #3454D1; }

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

    #loading-state {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 297mm;
      color: #8e8e93;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="page" id="doc-page">
    <div id="content"><div id="loading-state">Parsing document...</div></div>
  </div>
  <div class="page-pill" id="page-pill">1 / 1</div>

  <script>
    var rendered = false;

    function estimatePages() {
      var pageEl = document.getElementById('doc-page');
      var contentHeight = pageEl.scrollHeight;
      var onePageH = 297 * 3.78; // ~297mm in px at 96dpi
      var total = Math.max(1, Math.ceil(contentHeight / onePageH));
      document.getElementById('page-pill').innerText = '1 / ' + total;
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'PAGES', current: 1, total: total }));
      }
    }

    function renderFallback() {
      if (rendered) return;
      rendered = true;
      try {
        var raw = window.atob('${base64}');
        var matches = raw.match(/[A-Za-z0-9\\s.,;:'"!?()\\-]{5,}/g);
        var html = '';
        if (matches && matches.length > 0) {
          matches.filter(function(m) { return m.trim().length > 4 && !m.includes('PK') && !m.includes('xml'); })
            .forEach(function(s) { html += '<p>' + s.trim().replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</p>'; });
        }
        document.getElementById('content').innerHTML = html || '<p>Document content loaded.</p>';
        estimatePages();
      } catch(e) {
        document.getElementById('content').innerHTML = '<p>Document ready.</p>';
      }
    }

    async function parseWord() {
      try {
        function b64toAB(b64) {
          var bin = window.atob(b64), len = bin.length, bytes = new Uint8Array(len);
          for (var i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i);
          return bytes.buffer;
        }

        if (typeof mammoth !== 'undefined') {
          try {
            var result = await mammoth.convertToHtml({ arrayBuffer: b64toAB('${base64}') });
            if (result && result.value && result.value.trim().length > 0) {
              rendered = true;
              document.getElementById('content').innerHTML = result.value;
              estimatePages();
              return;
            }
          } catch(e) {}
        }

        if (typeof JSZip !== 'undefined') {
          try {
            var zip = await JSZip.loadAsync('${base64}', { base64: true });
            var docXml = zip.file("word/document.xml");
            if (docXml) {
              var xmlText = await docXml.async("string");
              var doc = new DOMParser().parseFromString(xmlText, "text/xml");
              var paragraphs = doc.getElementsByTagName("w:p");
              var html = '';
              for (var i = 0; i < paragraphs.length; i++) {
                var t = paragraphs[i].textContent;
                if (t && t.trim()) html += '<p>' + t.trim().replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</p>';
              }
              if (html.length > 0) {
                rendered = true;
                document.getElementById('content').innerHTML = html;
                estimatePages();
                return;
              }
            }
          } catch(e) {}
        }

        renderFallback();
      } catch(e) { renderFallback(); }
    }

    window.addEventListener('scroll', function() {
      var pill = document.getElementById('page-pill');
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var onePageH = 297 * 3.78;
      var cur = Math.max(1, Math.ceil((scrollTop + window.innerHeight * 0.5) / onePageH));
      var totalText = pill.innerText.split('/')[1];
      pill.innerText = cur + ' /' + totalText;
    });

    setTimeout(renderFallback, 3000);
    setTimeout(parseWord, 80);
  </script>
</body>
</html>
        `;
        setHtmlContent(html);
      } catch (err) {
        console.error('Word Engine error:', err);
      }
    }
    loadWordDocument();
  }, [filePath, format]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg.base }}>
      {htmlContent ? (
        <WebView
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          style={{ flex: 1 }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scalesPageToFit={false}
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === 'PAGES') {
                setPageInfo({ current: data.current, total: data.total });
              }
            } catch (_) {}
          }}
        />
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.accent.primary} />
          <Text style={{ color: colors.text.secondary, fontSize: 12, marginTop: 12 }}>
            Loading document...
          </Text>
        </View>
      )}
    </View>
  );
}
