import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system/legacy';
import { useTheme } from '../../../theme/useTheme';

interface ExcelViewerEngineProps {
  filePath: string;
  format: string;
}

export function ExcelViewerEngine({ filePath, format }: ExcelViewerEngineProps) {
  const { colors } = useTheme();
  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  useEffect(() => {
    async function loadSpreadsheet() {
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=0.3, maximum-scale=5.0, user-scalable=yes" />
  <script src="https://cdn.sheetjs.com/xlsx-0.19.3/package/dist/xlsx.full.min.js"></script>
  <style>
    * { box-sizing: border-box; -webkit-text-size-adjust: 100%; }
    html, body { margin: 0; padding: 0; height: 100%; background: #ffffff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }

    .sheet-tabs {
      display: flex;
      overflow-x: auto;
      background: #f2f2f7;
      border-bottom: 1px solid #d1d1d6;
      padding: 0;
      -webkit-overflow-scrolling: touch;
    }
    .sheet-tab {
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 600;
      color: #6e6e73;
      white-space: nowrap;
      cursor: pointer;
      border: none;
      background: transparent;
      border-bottom: 2px solid transparent;
    }
    .sheet-tab.active {
      color: #059669;
      background: #ffffff;
      border-bottom: 2px solid #059669;
      border-radius: 4px 4px 0 0;
    }

    .grid-container {
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      flex: 1;
    }

    table {
      border-collapse: collapse;
      width: max-content;
      min-width: 100%;
    }

    /* Row number column */
    .row-num {
      background: #f2f2f7;
      color: #8e8e93;
      text-align: center;
      font-size: 11px;
      font-weight: 500;
      padding: 6px 8px;
      border: 1px solid #d1d1d6;
      min-width: 36px;
      position: sticky;
      left: 0;
      z-index: 1;
    }

    /* Column header (A, B, C...) */
    .col-hdr {
      background: #f2f2f7;
      color: #6e6e73;
      text-align: center;
      font-size: 11px;
      font-weight: 600;
      padding: 6px 8px;
      border: 1px solid #d1d1d6;
      min-width: 80px;
      position: sticky;
      top: 0;
      z-index: 2;
    }
    .col-hdr.corner {
      z-index: 3;
      left: 0;
      position: sticky;
    }

    td {
      border: 1px solid #e5e5ea;
      padding: 6px 10px;
      font-size: 13px;
      color: #1c1c1e;
      white-space: nowrap;
      min-width: 80px;
      background: #ffffff;
    }
    tr:nth-child(even) td { background: #fafafa; }

    .empty-cell { color: transparent; }

    #loading-state {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 60vh;
      color: #8e8e93;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div id="tabs-container"></div>
  <div class="grid-container" id="grid-container">
    <div id="loading-state">Loading spreadsheet...</div>
  </div>

  <script>
    var sheets = {};
    var sheetNames = [];

    function colLetter(n) {
      var s = '';
      while (n >= 0) {
        s = String.fromCharCode(65 + (n % 26)) + s;
        n = Math.floor(n / 26) - 1;
      }
      return s;
    }

    function renderSheet(name) {
      // Highlight active tab
      var tabs = document.querySelectorAll('.sheet-tab');
      tabs.forEach(function(t) {
        t.classList.toggle('active', t.dataset.name === name);
      });

      var data = sheets[name];
      if (!data || data.length === 0) {
        document.getElementById('grid-container').innerHTML = '<div id="loading-state">Sheet is empty</div>';
        return;
      }

      var maxCols = 0;
      data.forEach(function(row) { if (row.length > maxCols) maxCols = row.length; });
      // Extend to at least visible columns
      maxCols = Math.max(maxCols, 6);

      // Extend rows to fill screen
      var totalRows = Math.max(data.length, 50);

      var html = '<table>';
      // Column headers row
      html += '<tr><th class="col-hdr corner"></th>';
      for (var c = 0; c < maxCols; c++) {
        html += '<th class="col-hdr">' + colLetter(c) + '</th>';
      }
      html += '</tr>';

      for (var r = 0; r < totalRows; r++) {
        html += '<tr>';
        html += '<td class="row-num">' + (r + 1) + '</td>';
        for (var c2 = 0; c2 < maxCols; c2++) {
          var val = (data[r] && data[r][c2] != null) ? String(data[r][c2]) : '';
          if (val) {
            html += '<td>' + val.replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</td>';
          } else {
            html += '<td class="empty-cell">&nbsp;</td>';
          }
        }
        html += '</tr>';
      }
      html += '</table>';

      document.getElementById('grid-container').innerHTML = html;
    }

    function renderTabs() {
      var tabsHtml = '';
      sheetNames.forEach(function(name, idx) {
        tabsHtml += '<button class="sheet-tab' + (idx === 0 ? ' active' : '') + '" data-name="' + name.replace(/"/g,'&quot;') + '" onclick="renderSheet(this.dataset.name)">' + name.replace(/</g,'&lt;') + '</button>';
      });
      document.getElementById('tabs-container').innerHTML = '<div class="sheet-tabs">' + tabsHtml + '</div>';
    }

    function loadExcel() {
      try {
        if (typeof XLSX !== 'undefined') {
          var wb = XLSX.read('${base64}', { type: 'base64' });
          sheetNames = wb.SheetNames;

          sheetNames.forEach(function(name) {
            var ws = wb.Sheets[name];
            sheets[name] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
          });

          renderTabs();
          if (sheetNames.length > 0) renderSheet(sheetNames[0]);
        } else {
          document.getElementById('grid-container').innerHTML = '<div id="loading-state">Could not load spreadsheet engine.</div>';
        }
      } catch(e) {
        document.getElementById('grid-container').innerHTML = '<div id="loading-state">Error parsing spreadsheet.</div>';
      }
    }

    setTimeout(loadExcel, 100);
  </script>
</body>
</html>
        `;
        setHtmlContent(html);
      } catch (err) {
        console.error('Excel Engine error:', err);
      }
    }
    loadSpreadsheet();
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
        />
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={{ color: colors.text.secondary, fontSize: 12, marginTop: 12 }}>
            Loading spreadsheet...
          </Text>
        </View>
      )}
    </View>
  );
}
