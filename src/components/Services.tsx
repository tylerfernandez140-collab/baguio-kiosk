import { useKiosk } from '@/context/KioskContext';
import { ArrowLeft, FileText, Building2, CreditCard, Heart, Shield, TreePine, CalendarCheck, ScrollText } from 'lucide-react';

interface ServicesProps {
  onBack: () => void;
}

const servicesData = {
  en: [
    { icon: Building2, title: "Business Permit Registration", desc: "Requirements: DTI/SEC Registration, Barangay Clearance, Lease Contract, ID, 2x2 photos. Visit BPLO at 3rd Floor Room 3-303.", color: "from-pine to-pine-light" },
    { icon: CreditCard, title: "Real Property Tax Payment", desc: "Bring latest tax declaration and previous receipt. Pay at Treasury Office, Ground Floor Room G-101.", color: "from-secondary to-sky-light" },
    { icon: FileText, title: "Community Tax Certificate (Cedula)", desc: "Requirements: Valid ID, proof of income. Available at Treasury Office year-round.", color: "from-gold to-gold-light" },
    { icon: Heart, title: "Health Certificate", desc: "Requirements: Valid ID, lab results. Visit City Health Office, 4th Floor Room 4-401. Processing: 1-2 days.", color: "from-pine-light to-secondary" },
    { icon: Shield, title: "Barangay Clearance", desc: "Visit your barangay hall. Requirements: Valid ID, proof of residency. Used for employment, business, and legal purposes.", color: "from-sky to-pine" },
    { icon: TreePine, title: "Tourism & Event Permits", desc: "For events and tourism activities. Requirements: Event plan, insurance, barangay endorsement. Visit Tourism Office.", color: "from-pine to-gold" },
    { icon: CalendarCheck, title: "Civil Registry Services", desc: "Birth, marriage, death certificates. Requirements: Valid ID, request form. Processing: 3-5 working days.", color: "from-secondary to-pine-light" },
    { icon: ScrollText, title: "Local Ordinances & Forms", desc: "Download or view local ordinances, official forms, and regulatory documents at the Public Assistance desk.", color: "from-gold to-pine" },
  ],
  fil: [
    { icon: Building2, title: "Pagpaparehistro ng Permiso sa Negosyo", desc: "Mga Kailangan: DTI/SEC Registration, Barangay Clearance, Lease Contract, ID, 2x2 photos. Pumunta sa BPLO, 3rd Floor.", color: "from-pine to-pine-light" },
    { icon: CreditCard, title: "Pagbabayad ng Buwis sa Ari-arian", desc: "Dalhin ang pinakabagong tax declaration at resibo. Magbayad sa Treasury Office, Ground Floor.", color: "from-secondary to-sky-light" },
    { icon: FileText, title: "Sedula", desc: "Mga Kailangan: Valid ID, patunay ng kita. Available sa Treasury Office buong taon.", color: "from-gold to-gold-light" },
    { icon: Heart, title: "Sertipiko ng Kalusugan", desc: "Mga Kailangan: Valid ID, resulta ng laboratoryo. Pumunta sa City Health Office, 4th Floor.", color: "from-pine-light to-secondary" },
    { icon: Shield, title: "Barangay Clearance", desc: "Pumunta sa inyong barangay hall. Mga Kailangan: Valid ID, patunay ng tirahan.", color: "from-sky to-pine" },
    { icon: TreePine, title: "Permiso sa Turismo at Okasyon", desc: "Para sa mga event at aktibidad. Mga Kailangan: Event plan, insurance, endorso ng barangay.", color: "from-pine to-gold" },
    { icon: CalendarCheck, title: "Serbisyo ng Civil Registry", desc: "Sertipiko ng kapanganakan, kasal, pagkamatay. Mga Kailangan: Valid ID, request form.", color: "from-secondary to-pine-light" },
    { icon: ScrollText, title: "Mga Ordinansa at Porma", desc: "Mag-download o tingnan ang mga ordinansa at opisyal na porma sa Public Assistance desk.", color: "from-gold to-pine" },
  ],
};

const Services = ({ onBack }: ServicesProps) => {
  const { language } = useKiosk();
  const items = servicesData[language];

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 glass-card px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="kiosk-button p-2 rounded-xl bg-muted">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h2 className="text-2xl font-display font-bold text-foreground">
          {language === 'en' ? 'Citizen Services' : 'Serbisyo sa Mamamayan'}
        </h2>
      </div>

      <div className="p-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
        {items.map((item, i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-2xl p-5 opacity-0 animate-fade-in-up kiosk-button text-left"
          >
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

export default Services;
