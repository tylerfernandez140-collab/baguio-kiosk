import { Home, Map, Info } from 'lucide-react';

export const floors = [
  {
    id: 'first',
    name: 'FIRST FLOOR',
    model: '/models/first_floor.glb',
    description: 'Public Services & Reception',
    offset: [0, 0, 0],
  },
  {
    id: 'second',
    name: 'SECOND FLOOR',
    model: '/models/sekand_floor.glb',
    description: 'City Council & Chambers',
    offset: [0, 0, 0],
  },
  {
    id: 'third',
    name: 'THIRD FLOOR',
    model: '/models/attic.glb',
    description: 'Administrative Offices',
    offset: [0, 0, 0],
  },
  {
    id: 'basement',
    name: 'BASEMENT',
    model: '/models/basement.glb',
    description: 'Parking & Facilities',
    offset: [0, 0, 0],
  },
];

export const categories = [
  { id: 'home', name: 'Home', icon: Home },
  { id: 'maps', name: 'Directory', icon: Map },
  { id: 'info', name: 'Info', icon: Info },
];
