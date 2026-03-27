import React, { createContext, useContext, useEffect, useState } from 'react';

export interface ThemeColors {
  bgPrimary: string;
  sidebarBg: string;
  sidebarBorder: string;
  headerBg: string;
  contentBg: string;
  surfaceCard: string;
  surfaceCardRaised: string;
  surfaceInset: string;
  border: string;
  borderPrimary: string;
  text: string;
  textMuted: string;
  textSoft: string;
  primary: string;
  primaryBtn: string;
  primaryBtnHover: string;
  primaryLight: string;
  activeItemBg: string;
  activeItemBorder: string;
  activeIconBg: string;
  activeStripe: string;
  hoverBg: string;
  notifBadge: string;
  dropdownBg: string;
  dropdownBorder: string;
  avatarBg: string;
  divider: string;
  shadowCard: string;
  inputBg: string;
  inputBorder: string;
  loaderOverlay: string;
}

export const darkColors: ThemeColors = {
  bgPrimary:        '#0c0b18',
  sidebarBg:        '#0e0d1e',
  sidebarBorder:    'rgba(255,255,255,0.08)',
  headerBg:         'rgba(12,11,24,0.96)',
  contentBg:        '#131320',
  surfaceCard:      '#131320',
  surfaceCardRaised:'#1a1b2e',
  surfaceInset:     '#10111d',
  border:           'rgba(255,255,255,0.08)',
  borderPrimary:    'rgba(167,139,250,0.28)',
  text:             '#f4f4f5',
  textMuted:        '#a1a1aa',
  textSoft:         '#d7d8df',
  primary:          '#a78bfa',   // violet-400 — brighter, more vivid
  primaryBtn:       '#8b5cf6',   // violet-500 for solid button backgrounds
  primaryBtnHover:  '#7c3aed',
  primaryLight:     '#c4b5fd',   // violet-300
  activeItemBg:     'rgba(167,139,250,0.14)',
  activeItemBorder: 'rgba(167,139,250,0.28)',
  activeIconBg:     'rgba(167,139,250,0.22)',
  activeStripe:     '#a78bfa',
  hoverBg:          'rgba(255,255,255,0.04)',
  notifBadge:       '#e879f9',
  dropdownBg:       '#18182a',
  dropdownBorder:   'rgba(255,255,255,0.09)',
  avatarBg:         '#8b5cf6',
  divider:          'rgba(255,255,255,0.08)',
  shadowCard:       '0 8px 32px rgba(0,0,0,0.5)',
  inputBg:          '#111117',
  inputBorder:      'rgba(255,255,255,0.08)',
  loaderOverlay:    'rgba(12,11,24,0.75)',
};

export const lightColors: ThemeColors = {
  bgPrimary:        '#f6f4ff',
  sidebarBg:        '#fdfcff',
  sidebarBorder:    'rgba(0,0,0,0.08)',
  headerBg:         'rgba(253,252,255,0.96)',
  contentBg:        '#ffffff',
  surfaceCard:      '#ffffff',
  surfaceCardRaised:'#fbf9ff',
  surfaceInset:     '#f5f1ff',
  border:           'rgba(0,0,0,0.09)',
  borderPrimary:    'rgba(124,58,237,0.22)',
  text:             '#18181b',
  textMuted:        '#71717a',
  textSoft:         '#3f3f46',
  primary:          '#7c3aed',   // violet-700 — sufficient contrast on white
  primaryBtn:       '#7c3aed',
  primaryBtnHover:  '#6d28d9',
  primaryLight:     '#6d28d9',
  activeItemBg:     'rgba(124,58,237,0.10)',
  activeItemBorder: 'rgba(124,58,237,0.25)',
  activeIconBg:     'rgba(124,58,237,0.14)',
  activeStripe:     '#7c3aed',
  hoverBg:          'rgba(0,0,0,0.04)',
  notifBadge:       '#a21caf',
  dropdownBg:       '#ffffff',
  dropdownBorder:   'rgba(0,0,0,0.10)',
  avatarBg:         '#7c3aed',
  divider:          'rgba(0,0,0,0.08)',
  shadowCard:       '0 4px 20px rgba(0,0,0,0.10)',
  inputBg:          '#ffffff',
  inputBorder:      'rgba(0,0,0,0.12)',
  loaderOverlay:    'rgba(246,244,255,0.80)',
};

interface ThemeContextValue {
  isDark: boolean;
  toggle: () => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark: true,
  toggle: () => {},
  colors: darkColors,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('parkluxe-theme');
    return saved !== 'light';
  });

  useEffect(() => {
    // Inject smooth transition styles for theme change
    let styleEl = document.getElementById('theme-transition-styles');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'theme-transition-styles';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `
      * {
        transition: background-color 300ms ease, 
                    color 300ms ease, 
                    border-color 300ms ease, 
                    box-shadow 300ms ease !important;
      }
    `;

    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('parkluxe-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggle = () => setIsDark(d => !d);

  return (
    <ThemeContext.Provider value={{ isDark, toggle, colors: isDark ? darkColors : lightColors }}>
      {children}
    </ThemeContext.Provider>
  );
};
