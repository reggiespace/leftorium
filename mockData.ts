import { Category, Comment, Principle, Product, Stat } from './types';

// Ported verbatim from the Claude Design export (Leftorium.dc.html).
// Used as the local fallback when Strapi has no products yet (or is
// unreachable) — see services/productService.ts.
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'notebook', name: 'Right-Spiral Notebook', category: Category.OFFICE, isReal: true, price: '$12.99',
    likesSeed: 412, viewsSeed: 5120,
    blurb: 'The wire sits on the far side, so your palm rests on paper instead of metal.',
    longDescription: 'A standard spiral notebook is a small daily injury for a left-hander: the coil digs into the side of your hand for the entire length of every line. This one puts the spiral on the opposite edge. That is the whole innovation, and it took the stationery industry about a century.',
    features: ['Spiral bound on the right edge', 'Fast-drying paper stock that resists smudging', 'Pages perforated from the correct side'],
    cost: 'Roughly forty minutes a week of resting your wrist on a metal coil, plus the grey stripe down the side of your hand in every photograph.',
    imgLabel: 'product shot — notebook, spiral facing camera',
  },
  {
    id: 'scissors', name: 'Reversed-Blade Shears', category: Category.WORKSHOP, isReal: true, price: '$24.50',
    likesSeed: 507, viewsSeed: 6890,
    blurb: 'Blades swapped so the cutting line is visible and the paper pulls together, not apart.',
    longDescription: 'So-called ambidextrous scissors only mirror the handle. The blades still cross the wrong way, which means a left-hander squeezes the paper open rather than closed. These reverse the blades themselves — the upper edge sits on the left and the line you are cutting is actually in view.',
    features: ['Truly reversed blade geometry, not just a symmetrical grip', 'Sightline down the cut', 'High-carbon steel, no thumb bruising'],
    cost: 'A childhood of crooked craft projects and being told you were bad at cutting.',
    imgLabel: 'product shot — open shears on black',
  },
  {
    id: 'corkscrew', name: "Waiter's Key, Left Thread", category: Category.KITCHEN, isReal: true, price: '$38.00',
    likesSeed: 288, viewsSeed: 3410,
    blurb: 'Counter-threaded worm and a mirrored lever, for people whose strong pull is the other way.',
    longDescription: 'Every corkscrew on earth assumes a right-handed twist. This one runs the other way, with the lever arm mirrored so the fulcrum sits against your left hand. It exists, it is made by two small companies, and it costs about three times a normal one.',
    features: ['Left-hand helical worm', 'Mirrored double-hinge lever', 'Foil blade on the opposite side'],
    cost: 'About double the price of the identical right-handed object, which is the tax on being a mirror image.',
    imgLabel: 'product shot — corkscrew, folded',
  },
  {
    id: 'nib', name: 'Oblique Reverse Nib', category: Category.OFFICE, isReal: true, price: '$52.00',
    likesSeed: 196, viewsSeed: 2280,
    blurb: 'A fountain-pen nib ground on the opposite angle so an underwriter gets a clean line.',
    longDescription: 'Nibs are ground for a hand approaching from the lower right. Come at the page from the other side and the tine catches and spits. A reverse oblique grind fixes the angle. Ask any left-handed person why they gave up on fountain pens.',
    features: ['Reverse oblique grind', 'Fast-drying ink recommended', 'Tuned for the overwriter or underwriter hook'],
    cost: 'One ruined page in three, and the permanent blue-grey smear along the little finger.',
    imgLabel: 'product shot — nib macro',
  },
  {
    id: 'jug', name: 'Inside-Marked Measuring Jug', category: Category.KITCHEN, isReal: true, price: '$16.00',
    likesSeed: 341, viewsSeed: 4020,
    blurb: 'Graduations printed on the inner wall, readable from either side of the handle.',
    longDescription: 'Pour with your left hand and the measurement markings rotate out of view behind the jug. This one prints them on the inside wall, so the number faces you whichever way the handle turns. Simple, cheap, and almost never done.',
    features: ['Dual-side graduations on the inner wall', 'Spout usable from both sides', 'Heat-resistant to 220°C'],
    cost: 'Every recipe you have ever measured by turning the jug around twice and guessing.',
    imgLabel: 'product shot — jug, three-quarter view',
  },
  {
    id: 'mouse', name: 'Southpaw Ergonomic Mouse', category: Category.OFFICE, isReal: true, price: '$89.00',
    likesSeed: 623, viewsSeed: 8740,
    blurb: 'A properly mirrored contoured shell — not a symmetrical one with the buttons flipped.',
    longDescription: 'The ergonomic mouse market is a wall of right-hand-contoured shells. Manufacturers produce a mirrored mould roughly once a decade, sell out, and discontinue it. This is one of the survivors.',
    features: ['Mirrored ergonomic shell', 'Thumb buttons on the correct side', 'Driver-free button remapping'],
    cost: 'Choosing between an ergonomic mouse that hurts and a flat one that hurts differently.',
    imgLabel: 'product shot — mouse, low angle',
  },
  {
    id: 'guitar', name: 'Left-Handed Acoustic, Standard Series', category: Category.SPORT, isReal: true, price: '$610.00',
    likesSeed: 455, viewsSeed: 5980,
    blurb: 'The same guitar, strung and braced the other way. Stocked in about one shop in twenty.',
    longDescription: 'Not a novelty — a full mirrored build with the bracing, nut and saddle cut for reversed string tension. Included here because availability, not existence, is the problem. Try finding one to actually hold before buying.',
    features: ['Mirrored body and bracing', 'Correctly compensated saddle', 'Controls reachable by the strumming hand'],
    cost: 'Learning on an upside-down right-handed guitar, like a surprising number of famous people did.',
    imgLabel: 'product shot — guitar body, dark',
  },
  {
    id: 'tape', name: 'Mirrored Tape Measure', category: Category.WORKSHOP, isReal: false, price: 'Concept',
    likesSeed: 388, viewsSeed: 5240,
    blurb: 'Numbers printed in reverse so the scale reads right-way-up when drawn with the left hand.',
    longDescription: 'Pull a tape with your left hand and the numbers face away from you. This concept prints the scale mirrored along the underside, with a lock lever on the opposite side of the housing. Genuinely useful. Nobody makes it.',
    features: ['Reverse-printed scale', 'Lock lever on the far side', 'Hook lip cut for a left-hand draw'],
    cost: 'Reading every measurement upside down, then reading it again to be sure.',
    imgLabel: 'concept render — tape measure, extended',
  },
  {
    id: 'opener', name: 'The Sinister Opener', category: Category.KITCHEN, isReal: false, price: 'Concept',
    likesSeed: 512, viewsSeed: 7010,
    blurb: 'A can opener geared to run counter-clockwise, driven by the natural left-hand rotation.',
    longDescription: 'Turning a crank clockwise is a right-hand motion; the left hand does it with the weak side of the wrist. This concept reverses the gear train so the same natural sweep drives the cutting wheel. The kitchen aisle has managed to produce exactly zero of these.',
    features: ['Counter-clockwise gear train', 'Grip moulded for the left palm', 'Magnetic lid lift on the near side'],
    cost: 'One awkward wrist rotation per can, forever.',
    imgLabel: 'concept render — can opener on a can',
  },
  {
    id: 'binder', name: 'Left-Threaded Jar Lids', category: Category.KITCHEN, isReal: false, price: 'Concept',
    likesSeed: 274, viewsSeed: 3860,
    blurb: 'A jar that opens with the stronger left-hand direction. Sold in a set, obviously incompatible.',
    longDescription: 'Righty-tighty is a convention, not a law of physics. This concept reverses the thread so the loosening motion is the one a left hand is strongest in. It would also cause total chaos in every shared kitchen on the planet, which is a feature.',
    features: ['Reverse thread on the jar and the lid', 'Bold warning ring so nobody breaks a wrist', 'Guaranteed to start an argument'],
    cost: 'Standing a jar on the counter and using your right hand like a tourist in your own kitchen.',
    imgLabel: 'concept render — jar and lid, exploded',
  },
  {
    id: 'screwdriver', name: 'The Left-Handed Screwdriver', category: Category.LAB, isReal: false, price: 'Concept',
    likesSeed: 901, viewsSeed: 12400,
    blurb: 'The apprentice prank, taken seriously and given a spec sheet.',
    longDescription: 'For a hundred years, new apprentices have been sent to the stores for a left-handed screwdriver. We built one. It has a counter-rotating internal flywheel, a handle knurled anti-clockwise, and absolutely no reason to exist. It is the most-viewed item in the catalogue, which tells you something about our audience.',
    features: ['Counter-rotating inertial flywheel', 'Anti-clockwise knurl', 'Ships with a certificate of apprenticeship'],
    cost: 'Nothing. This one is purely for the people who got sent to the stores.',
    imgLabel: 'concept render — screwdriver, glamour lighting',
  },
  {
    id: 'water', name: 'Levorotatory Bottled Water', category: Category.LAB, isReal: false, price: 'Concept',
    likesSeed: 664, viewsSeed: 9330,
    blurb: 'Water with a left-handed molecular twist. Tastes identical. Costs four times as much.',
    longDescription: 'A parody of the entire left-handed product market: an ordinary object, mirrored in a way that changes nothing, sold at a premium to a captive minority. The bottle cap is reverse-threaded. That part we would actually keep.',
    features: ['Chirally reversed, allegedly', 'Reverse-threaded cap', 'Label readable in a mirror'],
    cost: 'The novelty markup, which is the real subject of this entry.',
    imgLabel: 'concept render — water bottle on black',
  },
];

export const STATS: Stat[] = [
  { n: '10%', t: 'of people are left-handed. Roughly the same share as people who need glasses, and infinitely worse served by product design.' },
  { n: '800M', t: 'left-handers alive right now, using tools designed on the assumption they do not exist.' },
  { n: '2×', t: 'the typical price of an identical mirrored object, from scissors to guitars to corkscrews.' },
  { n: '0', t: 'years shorter your life is, despite the famous study everyone still quotes at parties. That one was a statistical artefact.' },
];

export const PRINCIPLES: Principle[] = [
  { h: 'Nothing is for sale', p: 'No cart, no affiliate links, no sponsorships. If a real product is good we name it and stop there.' },
  { h: 'The mark stays small', p: 'Real and invented items look the same at a glance. Deciding which is which is the exercise.' },
  { h: 'The joke has a point', p: 'Every fake product is a gap somebody could have filled and did not.' },
];

// Read-only flavor comments. In production these can come from the
// (unauthenticated, admin-curated) Leftorium Comment collection in Strapi —
// see services/strapiService.ts getComments(). This is the fallback.
export const MOCK_COMMENTS: Record<string, Comment[]> = {
  screwdriver: [
    { id: 'c1', who: 'Prof_Sinistra', when: '2 hours ago', text: 'I was sent for one of these in 1997. Three hours. Nobody stopped me.' },
    { id: 'c2', who: 'LeftyMechanic', when: '1 hour ago', text: 'The flywheel spec is wrong, you would need a reinforced titanium hub. Otherwise flawless.' },
  ],
  default: [
    { id: 'd1', who: 'ten_percent_club', when: '5 hours ago', text: 'Bought the right-handed version by accident twice. Twice.' },
    { id: 'd2', who: 'smudge_survivor', when: 'yesterday', text: 'Showed this to a right-handed colleague. He said "huh, I never thought about that." Every time.' },
  ],
};

export const getComments = (productId: string): Comment[] => MOCK_COMMENTS[productId] || MOCK_COMMENTS.default;
