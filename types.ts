
export enum Category {
  KITCHEN = 'Kitchen Gear',
  OFFICE = 'Office Supplies',
  WORKSHOP = 'Workshop Tools',
  SPORTS = 'Sports Equipment',
  LAB = 'Lab Prototype'
}

export interface Comment {
  id: string;
  productId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
}

export interface Product {
  id: string;
  name: string;
  slug?: string; // Strapi friendly URL
  description: string;
  category: Category;
  price: string | 'N/A';
  image: string;
  isReal: boolean;
  features: string[];
  longDescription?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}
