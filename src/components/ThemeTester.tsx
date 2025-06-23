/**
 * Theme Tester Component
 * 
 * A developer/designer tool for testing different themes quickly.
 * Shows all available themes with preview colors and allows instant switching.
 * Can be temporarily added to any page for theme testing.
 */

import React from 'react';
import { useTheme } from '../hooks/use-theme';

const ThemeTester: React.FC = () => {
  const { currentThemeId, availableThemes, setTheme } = useTheme();

  return (
    <div className="fixed top-4 right-4 z-[100] bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-4 max-w-xs">
      <h3 className="text-white text-sm font-bold mb-3">Theme Tester</h3>
      <div className="space-y-2">
        {availableThemes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            className={`w-full text-left p-3 rounded-md transition-all duration-200 ${
              currentThemeId === theme.id
                ? 'bg-white/20 border border-white/40'
                : 'bg-white/5 border border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white text-sm font-medium">{theme.name}</div>
                <div className="text-white/60 text-xs">{theme.description}</div>
              </div>
              <div className="flex space-x-1">
                {/* Color preview dots */}
                <div 
                  className="w-3 h-3 rounded-full border border-white/20"
                  style={{ backgroundColor: theme.gameStyle.menuHoverColor }}
                />
                <div 
                  className="w-3 h-3 rounded-full border border-white/20"
                  style={{ backgroundColor: theme.gameStyle.titleColor }}
                />
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-white/20">
        <div className="text-white/60 text-xs">
          Current: <span className="text-white">{currentThemeId}</span>
        </div>
      </div>
    </div>
  );
};

export default ThemeTester;
