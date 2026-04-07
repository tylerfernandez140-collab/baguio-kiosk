import { useKiosk } from '@/context/KioskContext';
import { ArrowLeft, Phone, ShieldAlert, Flame, Building, Siren, MapPin, Radio } from 'lucide-react';

interface EmergencyProps {
  onBack: () => void;
}

const Emergency = ({ onBack }: EmergencyProps) => {
  const { language } = useKiosk();

  const hotlines = [
    { icon: Siren, name: "National Emergency", number: "911", color: "bg-destructive" },
    { icon: ShieldAlert, name: "CDRRMO Baguio", number: "(074) 442-8802", color: "bg-destructive" },
    { icon: ShieldAlert, name: "PNP Baguio", number: "(074) 442-5700", color: "bg-secondary" },
    { icon: Flame, name: "BFP Baguio", number: "(074) 442-2222", color: "bg-gold" },
    { icon: Building, name: "Baguio General Hospital", number: "(074) 442-4216", color: "bg-pine" },
    { icon: Radio, name: "Red Cross Baguio", number: "(074) 442-3374", color: "bg-destructive" },
  ];

  const evacuationSites = [
    "Burnham Park Open Grounds",
    "Baguio Convention Center",
    "Athletic Bowl",
    "Teachers Camp",
    "Session Road (designated areas)",
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 glass-card px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="kiosk-button p-2 rounded-xl bg-muted">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h2 className="text-2xl font-display font-bold text-foreground">
          {language === 'en' ? 'Emergency Hotlines' : 'Mga Hotline sa Emerhensiya'}
        </h2>
      </div>

      <div className="p-6 max-w-3xl mx-auto space-y-6">
        {/* Hotlines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 stagger-children">
          {hotlines.map((h, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 opacity-0 animate-fade-in-up">
              <div className={`w-12 h-12 rounded-xl ${h.color} flex items-center justify-center flex-shrink-0`}>
                <h.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{h.name}</p>
                <p className="text-xl font-bold text-foreground">{h.number}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Evacuation Sites */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-destructive" />
            {language === 'en' ? 'Evacuation Sites' : 'Mga Evacuation Site'}
          </h3>
          <div className="space-y-2">
            {evacuationSites.map((site, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <div className="w-2 h-2 rounded-full bg-destructive flex-shrink-0" />
                <span className="text-foreground">{site}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disaster Alert Banner */}
        <div className="bg-destructive/10 border-2 border-destructive/30 rounded-2xl p-6 text-center">
          <ShieldAlert className="w-10 h-10 text-destructive mx-auto mb-3" />
          <p className="font-semibold text-foreground">
            {language === 'en'
              ? 'In case of emergency, proceed to the nearest evacuation site and call 911.'
              : 'Sa oras ng emerhensiya, pumunta sa pinakamalapit na evacuation site at tumawag sa 911.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Emergency;
