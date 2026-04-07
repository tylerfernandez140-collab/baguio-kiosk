import { useKiosk } from '@/context/KioskContext';
import { translations } from '@/data/kioskData';
import { Sun, Moon, Globe } from 'lucide-react';

const TopBar = () => {
  const { language, setLanguage, theme, toggleTheme } = useKiosk();
  const t = translations[language];

  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-end px-8 py-4">
      <div className="flex items-center gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLanguage(language === 'en' ? 'fil' : 'en');
          }}
          className="glass-card px-4 py-2 flex items-center gap-2 kiosk-button text-sm"
        >
          <Globe className="w-4 h-4 text-secondary" />
          <span className="text-foreground">{t.language}</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleTheme();
          }}
          className="glass-card px-4 py-2 flex items-center gap-2 kiosk-button text-sm"
        >
          {theme === 'day' ? (
            <Moon className="w-4 h-4 text-secondary" />
          ) : (
            <Sun className="w-4 h-4 text-gold" />
          )}
          <span className="text-foreground">{theme === 'day' ? t.nightMode : t.dayMode}</span>
        </button>
      </div>
    </div>
  );
};

export default TopBar;
