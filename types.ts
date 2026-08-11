export enum Category {
  KITCHEN = 'Kitchen',
  OFFICE = 'Office',
  WORKSHOP = 'Workshop',
  SPORT = 'Sport',
  LAB = 'Idea Lab',
}

export interface Comment {
  id: string;
  who: string;
  when: string;
  text: string;
}

export interface Product {
  id: string;
  slug?: string;
  name: string;
  category: Category;
  isReal: boolean;
  price: string;
  blurb: string;
  longDescription: string;
  features: string[];
  cost: string;
  imgLabel: string;
  /** Absolute URL (e.g. from the Garage S3 bucket via Strapi's upload provider). Falls back to the imgLabel placeholder when unset. */
  imageUrl?: string;
  /** Seed counts an admin sets in Strapi. Likes on top of this are local-only, per visitor. */
  viewsSeed: number;
  likesSeed: number;
}

export interface Stat {
  n: string;
  t: string;
}

export interface Principle {
  h: string;
  p: string;
}
