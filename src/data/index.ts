import {IconNode} from 'lucide-react-native';
import {
  pie,
  cheese,
  coffee,
  appleCore,
  avocado,
  barbecue,
  bacon,
  jar,
  peach,
} from '@lucide/lab';

export type DataType = {
  id: string;
  name: string;
  icon: IconNode;
  color: string;
  longName: string;
};

export type Data = DataType[];

export const data: Data = [
  {
    id: '10',
    name: 'Gastronomía',
    icon: pie,
    color: '#FFADAD', // pastel soft red
    longName: 'El arte de comer bien',
  },
  {
    id: '11',
    name: 'Quesos',
    icon: cheese,
    color: '#FFC3A0', // pastel coral
    longName: 'Variedades y sabores de quesos',
  },
  {
    id: '12',
    name: 'Café y Té',
    icon: coffee,
    color: '#BEE3DB', // pastel mint
    longName: 'Energía líquida para el día a día',
  },
  {
    id: '13',
    name: 'Frutas',
    icon: appleCore,
    color: '#FFDAC1', // pastel peach
    longName: 'Disfruta de frutas frescas y saludables',
  },
  {
    id: '14',
    name: 'Aguacates',
    icon: avocado,
    color: '#FFE156', // pastel lemon
    longName: 'Todo sobre los aguacates',
  },
  {
    id: '15',
    name: 'Barbacoa',
    icon: barbecue,
    color: '#D4A5A5', // pastel pinkish-brown
    longName: 'Preparaciones a la parrilla',
  },
  {
    id: '16',
    name: 'Bacon',
    icon: bacon,
    color: '#FFB7B2', // pastel coral
    longName: 'El favorito en los desayunos',
  },
  {
    id: '17',
    name: 'Conservas',
    icon: jar,
    color: '#C8C8A9', // pastel olive
    longName: 'Comidas en conserva para todos los gustos',
  },
  {
    id: '18',
    name: 'Melocotones',
    icon: peach,
    color: '#B5EAD7', // pastel light green
    longName: 'El sabor dulce del melocotón',
  },
];
