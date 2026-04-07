import { useState } from 'react';
import { useKiosk } from '@/context/KioskContext';
import { translations, cityHallFloors, type Office } from '@/data/kioskData';
import { ArrowLeft, Phone, Clock, User, MapPin, ChevronRight } from 'lucide-react';

interface DirectoryProps {
  onBack: () => void;
  onSelectOffice?: (office: Office) => void;
}

const Directory = ({ onBack, onSelectOffice }: DirectoryProps) => {
  const { language } = useKiosk();
  const t = translations[language];
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);

  const allOffices = cityHallFloors.flatMap(f => f.offices);

  if (selectedOffice) {
    const name = language === 'fil' ? selectedOffice.nameFil : selectedOffice.name;
    const desc = language === 'fil' ? selectedOffice.descriptionFil : selectedOffice.description;
    const services = language === 'fil' ? selectedOffice.servicesFil : selectedOffice.services;
    const floorData = cityHallFloors.find(f => f.floor === selectedOffice.floor);
    const floorName = language === 'fil' ? floorData?.nameFil : floorData?.name;

    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-10 glass-card px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSelectedOffice(null)} className="kiosk-button p-2 rounded-xl bg-muted">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h2 className="text-xl font-display font-bold text-foreground">{name}</h2>
        </div>

        <div className="p-6 space-y-4 max-w-3xl mx-auto">
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
            <p className="text-muted-foreground leading-relaxed">{desc}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InfoCard icon={<MapPin className="w-5 h-5 text-secondary" />} label={`${floorName} - ${t.room} ${selectedOffice.room}`} />
            <InfoCard icon={<Phone className="w-5 h-5 text-pine" />} label={selectedOffice.contact} />
            <InfoCard icon={<Clock className="w-5 h-5 text-gold" />} label={selectedOffice.hours} />
            <InfoCard icon={<User className="w-5 h-5 text-primary" />} label={selectedOffice.officer} />
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
            <h3 className="font-semibold text-foreground mb-3">{t.servicesOffered}</h3>
            <div className="flex flex-wrap gap-2">
              {services.map((s, i) => (
                <span key={i} className="px-3 py-1.5 bg-muted text-muted-foreground rounded-full text-sm">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => onSelectOffice?.(selectedOffice)}
            className="w-full bg-primary text-primary-foreground rounded-2xl py-4 font-semibold text-lg kiosk-button"
          >
            {language === 'en' ? 'View on Floor Map' : 'Tingnan sa Mapa'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 glass-card px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="kiosk-button p-2 rounded-xl bg-muted">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h2 className="text-2xl font-display font-bold text-foreground">{t.directory}</h2>
      </div>

      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        {cityHallFloors.map((floor) => (
          <div key={floor.floor}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pine to-pine-light flex items-center justify-center">
                <span className="text-primary-foreground font-bold">{floor.floor === 1 ? 'G' : floor.floor}</span>
              </div>
              <h3 className="font-display font-bold text-lg text-foreground">
                {language === 'fil' ? floor.nameFil : floor.name}
              </h3>
            </div>
            <div className="space-y-2">
              {floor.offices.map((office) => (
                <button
                  key={office.id}
                  onClick={() => setSelectedOffice(office)}
                  className="w-full bg-card border border-border rounded-xl p-4 flex items-center justify-between kiosk-button text-left group"
                >
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {language === 'fil' ? office.nameFil : office.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{t.room} {office.room}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
    {icon}
    <span className="text-sm text-foreground">{label}</span>
  </div>
);

export default Directory;
