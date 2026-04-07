export interface Office {
  id: string;
  name: string;
  nameFil: string;
  description: string;
  descriptionFil: string;
  floor: number;
  room: string;
  contact: string;
  hours: string;
  officer: string;
  services: string[];
  servicesFil: string[];
  icon: string;
}

export interface FloorData {
  floor: number;
  name: string;
  nameFil: string;
  offices: Office[];
  amenities: string[];
}

export const cityHallFloors: FloorData[] = [
  {
    floor: 1,
    name: "Ground Floor",
    nameFil: "Unang Palapag",
    amenities: ["Lobby", "Public Assistance", "Restrooms", "Elevator", "Stairs", "Help Desk", "Exit"],
    offices: [
      {
        id: "treasury",
        name: "City Treasury Office",
        nameFil: "Tanggapan ng Tesorero ng Lungsod",
        description: "Handles collection of taxes, fees, and other revenues. Manages city funds and disbursements.",
        descriptionFil: "Namamahala sa koleksyon ng buwis, bayarin, at iba pang kita. Namamahala sa pondo ng lungsod.",
        floor: 1, room: "G-101", contact: "(074) 442-8795",
        hours: "Mon-Fri 8:00 AM - 5:00 PM", officer: "City Treasurer",
        services: ["Tax Payments", "Real Property Tax", "Business Tax", "Clearances"],
        servicesFil: ["Pagbabayad ng Buwis", "Buwis sa Ari-arian", "Buwis sa Negosyo", "Mga Clearance"],
        icon: "Landmark"
      },
      {
        id: "cashier",
        name: "Cashier's Office",
        nameFil: "Tanggapan ng Kahera",
        description: "Processes all payments for city government services and transactions.",
        descriptionFil: "Nagpoproseso ng lahat ng bayad para sa mga serbisyo ng pamahalaan ng lungsod.",
        floor: 1, room: "G-102", contact: "(074) 442-8796",
        hours: "Mon-Fri 8:00 AM - 5:00 PM", officer: "City Cashier",
        services: ["Payment Processing", "Receipt Issuance", "Fee Collection"],
        servicesFil: ["Pagpoproseso ng Bayad", "Pagbibigay ng Resibo", "Koleksyon ng Bayarin"],
        icon: "CreditCard"
      },
      {
        id: "public-assistance",
        name: "Public Assistance & Complaints",
        nameFil: "Tulong Publiko at mga Reklamo",
        description: "Frontline service for public inquiries, complaints, and general assistance.",
        descriptionFil: "Serbisyo para sa mga katanungan, reklamo, at pangkalahatang tulong sa publiko.",
        floor: 1, room: "G-103", contact: "(074) 442-8790",
        hours: "Mon-Fri 8:00 AM - 5:00 PM", officer: "Public Assistance Officer",
        services: ["Information Desk", "Complaints", "General Inquiries", "Document Request"],
        servicesFil: ["Tanggapan ng Impormasyon", "Mga Reklamo", "Mga Katanungan", "Kahilingan ng Dokumento"],
        icon: "HelpCircle"
      }
    ]
  },
  {
    floor: 2,
    name: "2nd Floor",
    nameFil: "Ikalawang Palapag",
    amenities: ["Elevator", "Stairs", "Restrooms", "Waiting Area"],
    offices: [
      {
        id: "mayor",
        name: "Office of the City Mayor",
        nameFil: "Tanggapan ng Alkalde ng Lungsod",
        description: "The chief executive office of Baguio City. Oversees all city operations and governance.",
        descriptionFil: "Ang punong ehekutibong tanggapan ng Lungsod ng Baguio.",
        floor: 2, room: "2-201", contact: "(074) 442-7014",
        hours: "Mon-Fri 8:00 AM - 5:00 PM", officer: "Hon. City Mayor",
        services: ["Executive Orders", "City Programs", "Public Audiences", "Endorsements"],
        servicesFil: ["Mga Kautusan", "Mga Programa ng Lungsod", "Mga Pagdinig", "Mga Endorso"],
        icon: "Crown"
      },
      {
        id: "vice-mayor",
        name: "Office of the Vice Mayor",
        nameFil: "Tanggapan ng Bise Alkalde",
        description: "Presides over the City Council and assists the Mayor in governance.",
        descriptionFil: "Namamahala sa Konseho ng Lungsod at tumutulong sa Alkalde sa pamamahala.",
        floor: 2, room: "2-202", contact: "(074) 442-7015",
        hours: "Mon-Fri 8:00 AM - 5:00 PM", officer: "Hon. Vice Mayor",
        services: ["Legislative Affairs", "Council Sessions", "Resolutions", "Ordinances"],
        servicesFil: ["Mga Gawaing Pambatas", "Mga Sesyon ng Konseho", "Mga Resolusyon", "Mga Ordinansa"],
        icon: "Users"
      },
      {
        id: "council",
        name: "City Council / Sangguniang Panlungsod",
        nameFil: "Sangguniang Panlungsod",
        description: "The legislative body of Baguio City. Enacts ordinances and resolutions.",
        descriptionFil: "Ang lehislatura ng Lungsod ng Baguio. Gumagawa ng mga ordinansa at resolusyon.",
        floor: 2, room: "2-203", contact: "(074) 442-7016",
        hours: "Mon-Fri 8:00 AM - 5:00 PM", officer: "SP Secretary",
        services: ["Ordinances", "Resolutions", "Public Hearings", "Committee Meetings"],
        servicesFil: ["Mga Ordinansa", "Mga Resolusyon", "Mga Pagdinig Publiko", "Mga Pulong ng Komite"],
        icon: "Building2"
      }
    ]
  },
  {
    floor: 3,
    name: "3rd Floor",
    nameFil: "Ikatlong Palapag",
    amenities: ["Elevator", "Stairs", "Restrooms"],
    offices: [
      {
        id: "engineering",
        name: "City Engineering Office",
        nameFil: "Tanggapan ng Inhinyero ng Lungsod",
        description: "Manages infrastructure projects, building permits, and public works.",
        descriptionFil: "Namamahala sa mga proyektong imprastraktura, permiso sa gusali, at pampublikong gawa.",
        floor: 3, room: "3-301", contact: "(074) 442-8797",
        hours: "Mon-Fri 8:00 AM - 5:00 PM", officer: "City Engineer",
        services: ["Building Permits", "Electrical Permits", "Infrastructure Projects", "Road Maintenance"],
        servicesFil: ["Permiso sa Gusali", "Permiso sa Elektrisidad", "Mga Proyektong Imprastraktura", "Pagmamantini ng Kalsada"],
        icon: "Wrench"
      },
      {
        id: "assessor",
        name: "City Assessor's Office",
        nameFil: "Tanggapan ng Tagapagtasa ng Lungsod",
        description: "Assesses real property for taxation purposes. Maintains property records.",
        descriptionFil: "Nagtatasa ng ari-arian para sa buwis. Nagpapanatili ng rekord ng ari-arian.",
        floor: 3, room: "3-302", contact: "(074) 442-8798",
        hours: "Mon-Fri 8:00 AM - 5:00 PM", officer: "City Assessor",
        services: ["Property Assessment", "Tax Declaration", "Property Records", "Land Classification"],
        servicesFil: ["Pagtatasa ng Ari-arian", "Deklarasyon ng Buwis", "Rekord ng Ari-arian", "Klasipikasyon ng Lupa"],
        icon: "FileText"
      },
      {
        id: "bplo",
        name: "Business Permits & Licensing",
        nameFil: "Permiso sa Negosyo at Lisensya",
        description: "Processes business permits, licenses, and regulatory compliance for businesses in Baguio.",
        descriptionFil: "Nagpoproseso ng mga permiso sa negosyo, lisensya, at pagsunod sa regulasyon.",
        floor: 3, room: "3-303", contact: "(074) 442-8799",
        hours: "Mon-Fri 8:00 AM - 5:00 PM", officer: "BPLO Head",
        services: ["New Business Permit", "Renewal", "Special Permits", "Licensing"],
        servicesFil: ["Bagong Permiso sa Negosyo", "Pag-renew", "Espesyal na Permiso", "Lisensya"],
        icon: "Briefcase"
      }
    ]
  },
  {
    floor: 4,
    name: "4th Floor",
    nameFil: "Ikaapat na Palapag",
    amenities: ["Elevator", "Stairs", "Restrooms", "Archives"],
    offices: [
      {
        id: "health",
        name: "City Health Services Office",
        nameFil: "Tanggapan ng Serbisyong Pangkalusugan",
        description: "Provides public health services, health certificates, and medical programs.",
        descriptionFil: "Nagbibigay ng mga serbisyong pangkalusugan, sertipiko, at programang medikal.",
        floor: 4, room: "4-401", contact: "(074) 442-8800",
        hours: "Mon-Fri 8:00 AM - 5:00 PM", officer: "City Health Officer",
        services: ["Health Certificates", "Vaccination", "Medical Check-up", "Public Health Programs"],
        servicesFil: ["Sertipiko ng Kalusugan", "Bakuna", "Check-up", "Mga Programang Pangkalusugan"],
        icon: "Heart"
      },
      {
        id: "social-welfare",
        name: "City Social Welfare & Development",
        nameFil: "Kagawaran ng Sosyal na Kapakanan",
        description: "Provides social services, assistance programs, and welfare support for citizens.",
        descriptionFil: "Nagbibigay ng mga serbisyong panlipunan at programa ng tulong para sa mga mamamayan.",
        floor: 4, room: "4-402", contact: "(074) 442-8801",
        hours: "Mon-Fri 8:00 AM - 5:00 PM", officer: "CSWD Head",
        services: ["Social Assistance", "PWD Services", "Senior Citizen Services", "Youth Programs"],
        servicesFil: ["Tulong Panlipunan", "Serbisyo sa PWD", "Serbisyo sa Senior", "Programa sa Kabataan"],
        icon: "HandHeart"
      },
      {
        id: "drrmo",
        name: "Disaster Risk Reduction & Management",
        nameFil: "Pagbabawas ng Panganib sa Sakuna",
        description: "Manages disaster preparedness, response, and emergency operations for Baguio City.",
        descriptionFil: "Namamahala sa paghahanda sa sakuna, tugon, at mga operasyong pang-emerhensiya.",
        floor: 4, room: "4-403", contact: "(074) 442-8802",
        hours: "24/7 Operations Center", officer: "CDRRMO Head",
        services: ["Emergency Response", "Evacuation Plans", "Disaster Alerts", "Training Programs"],
        servicesFil: ["Tugon sa Emerhensiya", "Plano sa Paglikas", "Alerto sa Sakuna", "Mga Pagsasanay"],
        icon: "ShieldAlert"
      }
    ]
  }
];

export const translations = {
  en: {
    welcome: "Welcome to Baguio City Hall",
    touchToBegin: "Touch Screen to Begin",
    directory: "City Hall Directory",
    floorMap: "Building Map",
    services: "Citizen Services",
    announcements: "Announcements",
    tourism: "Tourism",
    emergency: "Emergency",
    search: "Search offices, services...",
    language: "Filipino",
    allFloors: "All Floors",
    offices: "Offices",
    amenities: "Amenities",
    exitRoutes: "Exit Routes",
    floor: "Floor",
    room: "Room",
    contact: "Contact",
    hours: "Hours",
    officer: "Officer in Charge",
    servicesOffered: "Services Offered",
    back: "Back",
    home: "Home",
    youAreHere: "You Are Here",
    groundFloor: "Ground Floor",
    dayMode: "Day Mode",
    nightMode: "Night Mode",
  },
  fil: {
    welcome: "Maligayang Pagdating sa Baguio City Hall",
    touchToBegin: "Pindutin ang Screen upang Magsimula",
    directory: "Direktoryo ng City Hall",
    floorMap: "Mapa ng Gusali",
    services: "Serbisyo sa Mamamayan",
    announcements: "Mga Anunsyo",
    tourism: "Turismo",
    emergency: "Emerhensiya",
    search: "Maghanap ng tanggapan, serbisyo...",
    language: "English",
    allFloors: "Lahat ng Palapag",
    offices: "Mga Tanggapan",
    amenities: "Mga Pasilidad",
    exitRoutes: "Mga Labasan",
    floor: "Palapag",
    room: "Silid",
    contact: "Kontak",
    hours: "Oras",
    officer: "Opisyal na Namamahala",
    servicesOffered: "Mga Serbisyong Iniaalok",
    back: "Bumalik",
    home: "Bahay",
    youAreHere: "Nandito Ka",
    groundFloor: "Unang Palapag",
    dayMode: "Mode sa Araw",
    nightMode: "Mode sa Gabi",
  }
};
