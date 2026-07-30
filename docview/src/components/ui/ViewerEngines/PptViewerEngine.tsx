import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import * as FileSystem from 'expo-file-system/legacy';
import { useTheme } from '../../../theme/useTheme';

interface PptViewerEngineProps {
  filePath: string;
  format: string;
}

const HTML_SHELL = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=0.3, maximum-scale=5.0, user-scalable=yes" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
  <style>
    * { box-sizing: border-box; -webkit-text-size-adjust: 100%; }
    html, body { margin: 0; padding: 0; height: 100%; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #f2f2f7;
      color: #1c1c1e;
      padding-bottom: 56px;
      -webkit-overflow-scrolling: touch;
    }

    /* Each slide = full-width card, stacked vertically */
    .slide {
      background: #ffffff;
      margin: 0 0 6px 0;
      overflow: hidden;
    }

    /* Slide image area — full width, actual slide graphic */
    .slide-graphic {
      width: 100%;
      background: #e5e5ea;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 180px;
      overflow: hidden;
      position: relative;
    }
    .slide-graphic img {
      width: 100%;
      height: auto;
      display: block;
    }

    /* Slide metadata bar */
    .slide-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: #e5e5ea;
      font-size: 10px;
      color: #8e8e93;
    }
    .slide-meta-dot {
      width: 14px; height: 14px;
      background: #3454D1;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .slide-meta-dot svg { width: 8px; height: 8px; }

    /* Blue title banner */
    .slide-title {
      background: #3b82f6;
      color: #ffffff;
      padding: 12px 16px;
      font-size: 17px;
      font-weight: 700;
      line-height: 1.3;
    }

    /* Bullet body */
    .slide-body {
      padding: 14px 16px;
      background: #ffffff;
    }
    .slide-bullet {
      display: flex;
      align-items: flex-start;
      margin-bottom: 6px;
      font-size: 14px;
      color: #374151;
      line-height: 1.5;
    }
    .slide-bullet::before {
      content: "\\2022";
      color: #1c1c1e;
      font-weight: bold;
      font-size: 16px;
      margin-right: 8px;
      flex-shrink: 0;
    }

    /* Page pill */
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
      height: 80vh;
      color: #8e8e93;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div id="slides-container"><div id="loading-state">Loading presentation...</div></div>
  <div class="page-pill" id="page-pill">Loading...</div>

  <script>
    var rendered = false;
    var fallbackTimer = null;
    var slideCount = 0;

    function notifyRN(payload) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify(payload));
      }
    }

    function escapeHtml(s) {
      return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    function updatePill() {
      document.getElementById('page-pill').innerText = '1 / ' + slideCount;
    }

    function finishRender(count) {
      rendered = true;
      if (fallbackTimer) { clearTimeout(fallbackTimer); fallbackTimer = null; }
      slideCount = count > 0 ? count : 1;
      updatePill();
      notifyRN({ type: 'COUNT', count: slideCount });
    }

    function showError(msg) {
      rendered = true;
      if (fallbackTimer) { clearTimeout(fallbackTimer); fallbackTimer = null; }
      document.getElementById('slides-container').innerHTML = '<div id="loading-state">' + escapeHtml(msg) + '</div>';
      document.getElementById('page-pill').style.display = 'none';
    }

    function renderFallback(base64) {
      if (rendered) return;
      try {
        var raw = window.atob(base64);
        var matches = raw.match(/[A-Za-z0-9\\s.,;:'"!?()\\-]{4,}/g);
        var html = '';
        var count = 0;
        if (matches && matches.length > 0) {
          var filtered = matches.filter(function(m) { return m.trim().length > 3 && !m.includes('PK') && !m.includes('xml'); });
          var idx = 1;
          for (var i = 0; i < filtered.length; i += 3) {
            var title = filtered[i] ? filtered[i].trim() : ('Slide ' + idx);
            var b1 = filtered[i+1] ? filtered[i+1].trim() : '';
            var b2 = filtered[i+2] ? filtered[i+2].trim() : '';
            html += '<div class="slide">';
            html += '<div class="slide-title">' + escapeHtml(title) + '</div>';
            html += '<div class="slide-body">';
            if (b1) html += '<div class="slide-bullet">' + escapeHtml(b1) + '</div>';
            if (b2) html += '<div class="slide-bullet">' + escapeHtml(b2) + '</div>';
            html += '</div></div>';
            idx++;
          }
          count = idx - 1;
        }
        if (count === 0) { showError('Could not preview this presentation.'); return; }
        document.getElementById('slides-container').innerHTML = html;
        finishRender(count);
      } catch(e) { showError('Could not preview this presentation.'); }
    }

    function resolveTarget(base, target) {
      var bp = base.split('/'), tp = target.split('/');
      for (var i = 0; i < tp.length; i++) {
        if (tp[i] === '..') bp.pop();
        else if (tp[i] !== '.') bp.push(tp[i]);
      }
      return bp.join('/');
    }

    async function parsePpt(base64) {
      try {
        if (typeof JSZip === 'undefined') { renderFallback(base64); return; }

        var zip = await JSZip.loadAsync(base64, { base64: true });

        // Load media images
        var imageMap = {};
        var mediaFolder = zip.folder('ppt/media');
        if (mediaFolder) {
          var loads = [];
          mediaFolder.forEach(function(path, file) {
            var ext = path.split('.').pop().toLowerCase();
            var mime = ext === 'png' ? 'image/png' : (ext === 'gif' ? 'image/gif' : (ext === 'svg' ? 'image/svg+xml' : 'image/jpeg'));
            loads.push(file.async('base64').then(function(b64) {
              imageMap['ppt/media/' + path] = 'data:' + mime + ';base64,' + b64;
            }));
          });
          await Promise.all(loads);
        }

        var slidesFolder = zip.folder('ppt/slides');
        if (!slidesFolder) { renderFallback(base64); return; }

        var slideFiles = [];
        slidesFolder.forEach(function(path, file) {
          if (/^slide\\d+\\.xml$/.test(path)) slideFiles.push({ name: path, path: 'ppt/slides/' + path, file: file });
        });
        if (slideFiles.length === 0) { renderFallback(base64); return; }

        slideFiles.sort(function(a, b) {
          return (parseInt(a.name.replace(/\\D/g,''),10)||0) - (parseInt(b.name.replace(/\\D/g,''),10)||0);
        });

        var parser = new DOMParser();
        var container = document.getElementById('slides-container');
        var html = '';

        for (var i = 0; i < slideFiles.length; i++) {
          var entry = slideFiles[i];

          // Get image relationships for this slide
          var ridToImg = {};
          var relsFile = zip.file('ppt/slides/_rels/' + entry.name + '.rels');
          if (relsFile) {
            try {
              var relsXml = await relsFile.async('string');
              var relsDoc = parser.parseFromString(relsXml, 'text/xml');
              var rels = relsDoc.getElementsByTagName('Relationship');
              for (var r = 0; r < rels.length; r++) {
                var type = rels[r].getAttribute('Type') || '';
                if (type.indexOf('/image') === -1) continue;
                var rid = rels[r].getAttribute('Id');
                var target = rels[r].getAttribute('Target');
                if (!rid || !target) continue;
                var resolved = resolveTarget('ppt/slides', target);
                if (imageMap[resolved]) ridToImg[rid] = imageMap[resolved];
              }
            } catch(e) {}
          }

          var xmlText = await entry.file.async('string');
          var xmlDoc = parser.parseFromString(xmlText, 'text/xml');

          // Extract text
          var textNodes = xmlDoc.getElementsByTagName('a:t');
          var slideTexts = [];
          for (var j = 0; j < textNodes.length; j++) {
            var txt = textNodes[j].textContent;
            if (txt && txt.trim()) slideTexts.push(txt.trim());
          }

          // Extract images
          var blips = xmlDoc.getElementsByTagName('a:blip');
          var slideImgs = [];
          for (var k = 0; k < blips.length; k++) {
            var embed = blips[k].getAttribute('r:embed');
            if (embed && ridToImg[embed]) slideImgs.push(ridToImg[embed]);
          }

          var titleText = slideTexts.length > 0 ? slideTexts[0] : ('Slide ' + (i + 1));
          var bodyTexts = slideTexts.slice(1);

          html += '<div class="slide">';

          // Slide graphic area (images)
          if (slideImgs.length > 0) {
            html += '<div class="slide-graphic">';
            slideImgs.forEach(function(src) {
              html += '<img src="' + src + '" />';
            });
            html += '</div>';
          }

          // Metadata bar
          html += '<div class="slide-meta">';
          html += '<span class="slide-meta-dot"><svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><circle cx="12" cy="12" r="4"/></svg></span>';
          html += '<span>Slide ' + (i+1) + ' of ' + slideFiles.length + '</span>';
          html += '</div>';

          // Title banner
          html += '<div class="slide-title">' + escapeHtml(titleText) + '</div>';

          // Body bullets
          if (bodyTexts.length > 0) {
            html += '<div class="slide-body">';
            bodyTexts.forEach(function(bt) {
              html += '<div class="slide-bullet">' + escapeHtml(bt) + '</div>';
            });
            html += '</div>';
          }

          html += '</div>';
        }

        container.innerHTML = html;
        finishRender(slideFiles.length);
      } catch(e) { renderFallback(base64); }
    }

    function handleIncoming(base64) {
      if (!base64) { showError('No presentation data received.'); return; }
      fallbackTimer = setTimeout(function() { renderFallback(base64); }, 4000);
      parsePpt(base64);
    }

    function onMessage(event) {
      try {
        var data = JSON.parse(event.data);
        if (data.type === 'FILE_DATA') handleIncoming(data.base64);
      } catch(e) {}
    }

    document.addEventListener('message', onMessage);
    window.addEventListener('message', onMessage);

    // Scroll-based page pill update
    window.addEventListener('scroll', function() {
      if (slideCount <= 1) return;
      var slides = document.querySelectorAll('.slide');
      var scrollY = window.pageYOffset + window.innerHeight * 0.3;
      var cur = 1;
      slides.forEach(function(el, idx) {
        if (el.offsetTop <= scrollY) cur = idx + 1;
      });
      document.getElementById('page-pill').innerText = cur + ' / ' + slideCount;
    });

    notifyRN({ type: 'READY' });
  </script>
</body>
</html>
`;

export function PptViewerEngine({ filePath, format }: PptViewerEngineProps) {
  const { colors } = useTheme();
  const webViewRef = useRef<WebView>(null);

  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [webViewReady, setWebViewReady] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [totalSlides, setTotalSlides] = useState(1);

  useEffect(() => {
    let cancelled = false;

    async function loadFile() {
      setStatus('loading');
      setBase64Data(null);
      setWebViewReady(false);
      setTotalSlides(1);

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
          } else {
            throw err;
          }
        }

        if (!cancelled) setBase64Data(base64);
      } catch (err) {
        console.error('PPT Engine error reading file:', err);
        if (!cancelled) {
          setStatus('error');
          setErrorMessage('Could not read this file from disk.');
        }
      }
    }

    loadFile();
    return () => { cancelled = true; };
  }, [filePath, format]);

  useEffect(() => {
    if (webViewReady && base64Data && webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({ type: 'FILE_DATA', base64: base64Data }));
    }
  }, [webViewReady, base64Data]);

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'READY') {
        setWebViewReady(true);
      } else if (data.type === 'COUNT') {
        setTotalSlides(data.count || 1);
        setStatus('ready');
      } else if (data.type === 'ERROR') {
        setStatus('error');
        setErrorMessage(data.message || 'Could not render this presentation.');
      }
    } catch (_) {}
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg.base }}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: HTML_SHELL }}
        style={{ flex: 1 }}
        javaScriptEnabled
        domStorageEnabled
        scalesPageToFit={false}
        onMessage={handleMessage}
      />

      {status === 'loading' && (
        <View
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.bg.base,
          }}
        >
          <ActivityIndicator size="large" color={colors.accent.primary} />
          <Text style={{ color: colors.text.secondary, fontSize: 12, marginTop: 12 }}>
            Rendering presentation...
          </Text>
        </View>
      )}

      {status === 'error' && (
        <View
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            backgroundColor: colors.bg.base,
          }}
        >
          <Text style={{ color: colors.text.secondary, fontSize: 14, textAlign: 'center' }}>
            {errorMessage ?? 'Could not render this presentation.'}
          </Text>
        </View>
      )}
    </View>
  );
}