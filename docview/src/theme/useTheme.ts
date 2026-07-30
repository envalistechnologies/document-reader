import { useSettingsStore } from '../store/useSettingsStore';
import { colors } from './colors';
import { typography } from './typography';
import { spacing, radii } from './spacing';

export function useTheme() {
  const themeMode = useSettingsStore((state) => state.theme);
  
  return {
    mode: themeMode,
    colors: colors[themeMode],
    typography,
    spacing,
    radii,
  };
}
