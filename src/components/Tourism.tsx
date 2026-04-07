import { useKiosk } from '@/context/KioskContext';
import { ArrowLeft, MapPin, Camera, Bus, ShoppingBag, Building, Car, Flower2 } from 'lucide-react';

interface TourismProps {
  onBack: () => void;
}

const tourismData = {
  en: [
    { icon: Camera, title: "Burnham Park", desc: "Baguio's iconic park with a man-made lake, gardens, and recreational areas. Open daily.", color: "from-pine to-pine-light" },
    { icon: Flower2, title: "Panagbenga Festival", desc: "Annual Flower Festival every February. Features grand float parade, street dancing, and flower exhibits.", color: "from-gold to-gold-light" },
    { icon: Camera, title: "Mines View Park", desc: "Panoramic views of Benguet mining towns. Souvenir shops and photo opportunities.", color: "from-secondary to-sky-light" },
    { icon: ShoppingBag, title: "Baguio City Market", desc: "The go-to market for fresh produce, strawberries, handicrafts, and local goods.", color: "from-pine-light to-secondary" },
    { icon: Camera, title: "The Mansion", desc: "Official summer residence of the Philippine President. Beautiful gardens open to public.", color: "from-gold to-pine" },
    { icon: Camera, title: "Camp John Hay", desc: "Former US military rest camp, now an eco-tourism zone with trails, hotels, and restaurants.", color: "from-sky to-pine-light" },
    { icon: Bus, title: "Transport Terminals", desc: "Victory Liner, Genesis, and other bus terminals. Jeepney and taxi stands throughout the city.", color: "from-pine to-secondary" },
    { icon: Building, title: "Hospitals & Emergency", desc: "Baguio General Hospital, Notre Dame Hospital, Pines City Doctors Hospital. For emergencies dial 911.", color: "from-destructive to-destructive" },
    { icon: Car, title: "Parking Areas", desc: "Burnham Park parking, SM Baguio, Session Road parking buildings. Rates vary.", color: "from-secondary to-gold" },
  ],
  fil: [
    { icon: Camera, title: "Burnham Park", desc: "Sikat na parke ng Baguio na may lawa, hardin, at lugar ng libangan. Bukas araw-araw.", color: "from-pine to-pine-light" },
    { icon: Flower2, title: "Panagbenga Festival", desc: "Taunang Festival ng Bulaklak tuwing Pebrero. May grand float parade at street dancing.", color: "from-gold to-gold-light" },
    { icon: Camera, title: "Mines View Park", desc: "Magandang tanawin ng mga mining town sa Benguet. May mga tindahan ng souvenir.", color: "from-secondary to-sky-light" },
    { icon: ShoppingBag, title: "Baguio City Market", desc: "Pangunahing palengke para sa sariwang produkto, strawberry, handicrafts.", color: "from-pine-light to-secondary" },
    { icon: Camera, title: "The Mansion", desc: "Opisyal na summer residence ng Pangulo. Magandang hardin na bukas sa publiko.", color: "from-gold to-pine" },
    { icon: Camera, title: "Camp John Hay", desc: "Dating military rest camp, ngayon ay eco-tourism zone na may trails at restaurants.", color: "from-sky to-pine-light" },
    { icon: Bus, title: "Mga Terminal ng Transportasyon", desc: "Victory Liner, Genesis, at iba pang bus terminal. Jeepney at taxi sa buong lungsod.", color: "from-pine to-secondary" },
    { icon: Building, title: "Mga Ospital at Emerhensiya", desc: "Baguio General Hospital, Notre Dame Hospital, Pines City Doctors. Para sa emerhensiya, tumawag sa 911.", color: "from-destructive to-destructive" },
    { icon: Car, title: "Mga Paradahan", desc: "Burnham Park parking, SM Baguio, Session Road parking buildings.", color: "from-secondary to-gold" },
  ],
};

const Tourism = ({ onBack }: TourismProps) => {
  const { language } = useKiosk();
  const items = tourismData[language];

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 glass-card px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="kiosk-button p-2 rounded-xl bg-muted">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h2 className="text-2xl font-display font-bold text-foreground">
          {language === 'en' ? 'Tourism & Public Info' : 'Turismo at Impormasyon'}
        </h2>
      </div>

      <div className="p-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
        {items.map((item, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-5 opacity-0 animate-fade-in-up kiosk-button text-left">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
              <item.icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tourism;
