import { useKiosk } from '@/context/KioskContext';
import { ArrowLeft, Megaphone, CloudRain, AlertTriangle, Calendar, Construction } from 'lucide-react';

interface AnnouncementsProps {
  onBack: () => void;
}

const announcementsData = {
  en: [
    { icon: Megaphone, type: "City Notice", title: "Tax Payment Deadline Extended", desc: "The deadline for Real Property Tax payment has been extended to March 31, 2026. Avail of discounts for early payments.", date: "March 15, 2026", color: "bg-primary" },
    { icon: CloudRain, type: "Weather Advisory", title: "Heavy Rainfall Warning", desc: "PAGASA has issued a heavy rainfall advisory for the Cordillera region. Residents in landslide-prone areas are advised to evacuate.", date: "Today", color: "bg-destructive" },
    { icon: Calendar, type: "Public Event", title: "Panagbenga Festival 2026", desc: "The annual Flower Festival will be held from February 1-28, 2026. Street dancing and float parade schedules available at Tourism Office.", date: "Feb 2026", color: "bg-gold" },
    { icon: Construction, type: "Road Notice", title: "Session Road Repairs", desc: "Session Road will undergo repairs from April 1-15. Expect partial road closures. Alternative routes via Magsaysay Avenue.", date: "April 1-15, 2026", color: "bg-secondary" },
    { icon: AlertTriangle, type: "Emergency", title: "Emergency Hotlines Active 24/7", desc: "CDRRMO: (074) 442-8802 | PNP: (074) 442-5700 | BFP: (074) 442-2222 | Baguio General Hospital: (074) 442-4216", date: "Always", color: "bg-destructive" },
  ],
  fil: [
    { icon: Megaphone, type: "Abiso ng Lungsod", title: "Pinalawig ang Deadline ng Buwis", desc: "Ang deadline ng pagbabayad ng Real Property Tax ay pinalawig hanggang Marso 31, 2026.", date: "Marso 15, 2026", color: "bg-primary" },
    { icon: CloudRain, type: "Abiso sa Panahon", title: "Babala sa Malakas na Ulan", desc: "Naglabas ang PAGASA ng babala sa malakas na pag-ulan sa Cordillera region.", date: "Ngayon", color: "bg-destructive" },
    { icon: Calendar, type: "Okasyon", title: "Panagbenga Festival 2026", desc: "Ang taunang Festival ng Bulaklak ay gaganapin mula Pebrero 1-28, 2026.", date: "Peb 2026", color: "bg-gold" },
    { icon: Construction, type: "Abiso sa Kalsada", title: "Pagkukumpuni ng Session Road", desc: "Ang Session Road ay sasailalim sa pagkukumpuni mula Abril 1-15. Alternatibong ruta sa Magsaysay Avenue.", date: "Abril 1-15, 2026", color: "bg-secondary" },
    { icon: AlertTriangle, type: "Emerhensiya", title: "Emergency Hotlines 24/7", desc: "CDRRMO: (074) 442-8802 | PNP: (074) 442-5700 | BFP: (074) 442-2222", date: "Palagi", color: "bg-destructive" },
  ],
};

const Announcements = ({ onBack }: AnnouncementsProps) => {
  const { language } = useKiosk();
  const items = announcementsData[language];

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 glass-card px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="kiosk-button p-2 rounded-xl bg-muted">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h2 className="text-2xl font-display font-bold text-foreground">
          {language === 'en' ? 'Announcements' : 'Mga Anunsyo'}
        </h2>
      </div>

      <div className="p-6 max-w-3xl mx-auto space-y-4 stagger-children">
        {items.map((item, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-5 opacity-0 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center`}>
                <item.icon className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{item.type}</span>
              <span className="ml-auto text-xs text-muted-foreground">{item.date}</span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
