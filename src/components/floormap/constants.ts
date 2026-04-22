export const floorColors = [
  { bg: 'from-pine/20 to-pine/5', border: 'border-pine/30', accent: 'bg-pine' },
  { bg: 'from-secondary/20 to-secondary/5', border: 'border-secondary/30', accent: 'bg-secondary' },
  { bg: 'from-gold/20 to-gold/5', border: 'border-gold/30', accent: 'bg-gold' },
  { bg: 'from-pine-light/20 to-pine-light/5', border: 'border-pine-light/30', accent: 'bg-pine-light' },
];

export const getFilters = (t: any) => [
  { id: 'all', label: t.allFloors },
  { id: '1', label: t.groundFloor },
  { id: '2', label: '2nd Floor' },
  { id: '3', label: '3rd Floor' },
  { id: '4', label: '4th Floor' },
  { id: 'offices', label: t.offices },
  { id: 'amenities', label: t.amenities },
  { id: 'exits', label: t.exitRoutes },
];
