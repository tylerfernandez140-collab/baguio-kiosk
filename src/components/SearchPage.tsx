import { useState } from 'react';
import { useKiosk } from '@/context/KioskContext';
import { translations, cityHallFloors } from '@/data/kioskData';
import { ArrowLeft, Search as SearchIcon, MapPin, FileText, Building2 } from 'lucide-react';

interface SearchPageProps {
  onBack: () => void;
  onNavigateToOffice: (officeId: string) => void;
}

const SearchPage = ({ onBack, onNavigateToOffice }: SearchPageProps) => {
  const { language, offices } = useKiosk();
  const t = translations[language];
  const [query, setQuery] = useState('');

  const results = query.length > 1
    ? offices.filter(o => {
        const q = query.toLowerCase();
        const name = (language === 'fil' ? (o.name_fil || o.name) : o.name).toLowerCase();
        const services = Array.isArray(o.services) ? (language === 'fil' ? (o.services_fil || o.services) : o.services).join(' ').toLowerCase() : '';
        const room = String(o.room || '').toLowerCase();
        const officer = String(o.officer || '').toLowerCase();
        return name.includes(q) || services.includes(q) || room.includes(q) || officer.includes(q);
      })
    : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 glass-card px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="kiosk-button p-2 rounded-xl bg-muted">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t.search}
            className="w-full pl-12 pr-4 py-3 bg-muted rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-lg"
            autoFocus
          />
        </div>
      </div>

      <div className="p-6 max-w-3xl mx-auto space-y-3">
        {query.length > 1 && results.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            {language === 'en' ? 'No results found.' : 'Walang nahanap na resulta.'}
          </p>
        )}
        {results.map(office => {
          const floorNum = office.floor;
          const floorName = language === 'fil' ? (floorNum === 1 ? "Unang Palapag" : `Ika-${floorNum} Palapag`) : (floorNum === 1 ? "Ground Floor" : `${floorNum}${getOrdinal(floorNum)} Floor`);
          
          return (
            <button
              key={office.id}
              onClick={() => onNavigateToOffice(office.id)}
              className="w-full bg-card border border-border rounded-xl p-4 flex items-start gap-4 kiosk-button text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">{language === 'fil' ? (office.name_fil || office.name) : office.name}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{floorName} - {office.room}</span>
                  <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{office.services?.length || 0} services</span>
                </div>
              </div>
            </button>
          );
        })}

        {query.length <= 1 && (
          <div className="text-center py-12">
            <SearchIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {language === 'en' ? 'Type to search offices, services, or staff' : 'Mag-type upang maghanap ng tanggapan, serbisyo, o kawani'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
  function getOrdinal(n: number) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  }
};

export default SearchPage;
