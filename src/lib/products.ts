export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  dataAiHint: string;
}

export const Categories: Categories[] = [
  {
    id: 1,
    name: 'Milk',
    description: 'perfectly served with creamy and delicious,.',
    price: 24,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'Toned Milk',
    category: 'Diary',
  },
  {
    id: 2,
    name: 'Artisan Sourdough Bread',
    description: 'Freshly baked with a crispy crust and soft interior.',
    price: 5.49,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'sourdough bread',
    category: 'Bakery',
  },
  {
    id: 3,
    name: 'Free-Range Eggs',
    description: 'A dozen large brown eggs from pasture-raised chickens.',
    price: 6.99,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'eggs carton',
    category: 'Dairy & Eggs',
  },
  {
    id: 4,
    name: 'Organic Whole Milk',
    description: 'Rich and creamy Grade A organic milk.',
    price: 4.29,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'milk carton',
    category: 'Dairy & Eggs',
  },
  {
    id: 5,
    name: 'Fresh Salmon Fillet',
    description: 'Sustainably sourced Atlantic salmon, rich in Omega-3.',
    price: 12.99,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'salmon fillet',
    category: 'Meat & Seafood',
  },
  {
    id: 6,
    name: 'Organic Baby Spinach',
    description: 'Tender and flavorful spinach, pre-washed and ready to eat.',
    price: 3.99,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'spinach greens',
    category: 'Fruits & Vegetables',
  },
  {
    id: 7,
    name: 'Kombucha',
    description: 'Ginger and lemon flavored fermented tea.',
    price: 3.49,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'kombucha bottle',
    category: 'Beverages',
  },
  {
    id: 8,
    name: 'Almond Butter',
    description: 'Creamy almond butter made with 100% roasted almonds.',
    price: 8.99,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'almond butter',
    category: 'Pantry',
  },
];
