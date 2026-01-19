
import { Category, Comment, Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Spiral Notebook',
    description: 'Spiral on the right side prevents smudging and wire interference.',
    category: Category.OFFICE,
    price: '$12.99',
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=800',
    isReal: true,
    features: [
      { text: 'Right-side spiral', icon: 'menu_book' }, 
      { text: 'Smudge-resistant paper', icon: 'verified' }, 
      { text: 'Perforated pages', icon: 'content_cut' }
    ],
    longDescription: 'Traditional spiral notebooks are a nightmare for lefties. The wire digs into your palm as you write. Our notebook reverses the spiral so your hand rests comfortably on the page.'
  },
  {
    id: '2',
    name: 'Mirrored Tape Measure',
    description: 'A conceptual tool with numbers printed in reverse for right-to-left measuring.',
    category: Category.WORKSHOP,
    price: 'N/A',
    image: 'https://images.unsplash.com/photo-1530124566582-aa61dd3c9dca?auto=format&fit=crop&q=80&w=800',
    isReal: false,
    features: [
      { text: 'Reverse numbering', icon: 'swap_horiz' }, 
      { text: 'Southpaw lock mechanism', icon: 'lock' }, 
      { text: 'Friction-less draw', icon: 'speed' }
    ],
    longDescription: 'Have you ever tried to read a tape measure while holding it in your left hand? The numbers are upside down! This concept flip-measures from right-to-left, making measurements intuitive for the 10%.'
  },
  {
    id: '3',
    name: 'Precision Scissors',
    description: 'Blades are physically reversed to provide a clear sightline.',
    category: Category.WORKSHOP,
    price: '$24.50',
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=800',
    isReal: true,
    features: [
      { text: 'Reversed blades', icon: 'compare_arrows' }, 
      { text: 'Ergonomic grip', icon: 'back_hand' }, 
      { text: 'High-carbon steel', icon: 'diamond' }
    ],
    longDescription: 'Standard scissors push paper away when used with the left hand. These precision tools have reversed blades, so the upper blade is on the left, giving you a perfect view of the cutting line.'
  },
  {
    id: '4',
    name: 'The Sinister Opener',
    description: 'Utilizes a counter-clockwise helical gear system for natural biology.',
    category: Category.KITCHEN,
    price: 'N/A',
    image: 'https://images.unsplash.com/photo-1591261730799-ee4e6c2d16d7?auto=format&fit=crop&q=80&w=800',
    isReal: false,
    features: [
      { text: 'Anti-Clockwise Drive', icon: 'rotate_left' }, 
      { text: 'Sinistral Grip', icon: 'handshake' }, 
      { text: 'Magnetic Lid Lifter', icon: 'attraction' }
    ],
    longDescription: 'Rotating a can opener clockwise is a dominant right-hand motion. The Sinister Opener reverses the gears, allowing left-handers to use their natural rotational torque.'
  }
];

export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    productId: '4',
    userName: 'Prof_Sinistra',
    userAvatar: 'https://picsum.photos/seed/1/100/100',
    content: 'Actually, the torque required here is impossible without a reinforced titanium hub. We need a lever-based assist.',
    timestamp: '2 hours ago',
    likes: 214
  },
  {
    id: 'c2',
    productId: '4',
    userName: 'LeftyMechanic',
    userAvatar: 'https://picsum.photos/seed/2/100/100',
    content: "You're forgetting the Coriolis effect on the liquid inside the can. I've simulated this, it works.",
    timestamp: '1 hour ago',
    likes: 89
  }
];
