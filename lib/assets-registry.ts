/**
 * Centralized Visual Asset Registry for Foody Cloud
 * Maps food slugs to their verified, high-quality descriptive filenames.
 */

export interface AssetMapping {
  url: string;
  alt: string;
  filename: string;
}

export const assetsRegistry: Record<string, AssetMapping> = {
  'fulka-without-ghee': {
    url: '/images/menu/fulka-without-ghee.webp',
    filename: 'fulka-without-ghee.webp',
    alt: 'Soft warm plain homestyle fulka roti puffed up without ghee',
  },
  'ghee-fulka': {
    url: '/images/menu/ghee-fulka.webp',
    filename: 'ghee-fulka.webp',
    alt: 'Soft warm homestyle fulka roti brushed with pure golden desi ghee',
  },
  'plain-paratha': {
    url: '/images/menu/plain-paratha.webp',
    filename: 'plain-paratha.webp',
    alt: 'Golden flaky layered pan-fried plain wheat paratha',
  },
  'paneer-paratha': {
    url: '/images/menu/paneer-paratha.webp',
    filename: 'paneer-paratha.webp',
    alt: 'Crispy whole wheat paratha stuffed with seasoned spiced grated paneer cottage cheese',
  },
  'mix-paratha': {
    url: '/images/menu/mix-paratha.webp',
    filename: 'mix-paratha.webp',
    alt: 'Golden brown paratha stuffed with a flavorful mix of mashed vegetables and spices',
  },
  'sattu-paratha': {
    url: '/images/menu/sattu-paratha.webp',
    filename: 'sattu-paratha.webp',
    alt: 'Traditional paratha stuffed with seasoned roasted black gram flour sattu and spices',
  },
  'papad-bhujia-paratha': {
    url: '/images/menu/papad-bhujia-paratha.webp',
    filename: 'papad-bhujia-paratha.webp',
    alt: 'Crisp paratha with a unique crunchy stuffing of crushed papad and spicy bhujia sev',
  },
  'bhujia-paratha': {
    url: '/images/menu/bhujia-paratha.webp',
    filename: 'bhujia-paratha.webp',
    alt: 'Golden pan-fried flatbread stuffed with crunchy spicy Bikaneri bhujia sev',
  },
  'jeera-aloo': {
    url: '/images/menu/jeera-aloo.webp',
    filename: 'jeera-aloo.webp',
    alt: 'Dry potato dish sautéed with roasted cumin seeds, turmeric, and fresh coriander',
  },
  'aloo-matar': {
    url: '/images/menu/aloo-matar.webp',
    filename: 'aloo-matar.webp',
    alt: 'Comforting home-style curry made with potatoes and tender green peas in tomato-onion gravy',
  },
  'matar-paneer': {
    url: '/images/menu/matar-paneer.webp',
    filename: 'matar-paneer.webp',
    alt: 'Soft paneer cottage cheese cubes and green peas in a rich spiced onion tomato gravy',
  },
  'paneer-butter-masala': {
    url: '/images/menu/paneer-butter-masala.webp',
    filename: 'paneer-butter-masala.webp',
    alt: 'Rich, creamy, buttery tomato gravy loaded with soft fresh paneer cottage cheese cubes',
  },
  'malai-kofta': {
    url: '/images/menu/malai-kofta.webp',
    filename: 'malai-kofta.webp',
    alt: 'Deep fried cottage cheese and potato dumplings served in a velvety, rich cashew cream gravy',
  },
  'dal-fry': {
    url: '/images/menu/dal-fry.webp',
    filename: 'dal-fry.webp',
    alt: 'Slow-cooked yellow lentils tempered with ghee, cumin seeds, garlic, onions, and dry red chillies',
  },
  'aloo-dum': {
    url: '/images/menu/aloo-dum.webp',
    filename: 'aloo-dum.webp',
    alt: 'Slow-cooked baby potatoes in a spicy, rich, aromatic gravy flavored with spices',
  },
  'paneer-pakoda': {
    url: '/images/menu/paneer-pakoda.webp',
    filename: 'paneer-pakoda.webp',
    alt: 'Golden crispy gram flour coated fritters stuffed with soft spiced paneer cottage cheese slices',
  },
  'mix-pakoda': {
    url: '/images/menu/mix-pakoda.webp',
    filename: 'mix-pakoda.webp',
    alt: 'Assorted vegetable fritters made of onions, potatoes, spinach coated in seasoned gram flour batter',
  },
  'cheese-ball': {
    url: '/images/menu/cheese-ball.webp',
    filename: 'cheese-ball.webp',
    alt: 'Deep fried golden breadcrumb coated balls with a melted mozzarella cheese centre',
  },
  'bread-cheese-pakoda': {
    url: '/images/menu/bread-cheese-pakoda.webp',
    filename: 'bread-cheese-pakoda.webp',
    alt: 'Golden fried bread slices coated in chickpea batter, stuffed with spiced potato and melted cheese',
  },
  'bread-pakoda': {
    url: '/images/menu/bread-pakoda.webp',
    filename: 'bread-pakoda.webp',
    alt: 'Classic street-style golden deep fried bread fritters stuffed with seasoned potato mash',
  },
  'plain-rice': {
    url: '/images/menu/plain-rice.webp',
    filename: 'plain-rice.webp',
    alt: 'Fluffy, steam-cooked long-grain white basmati rice',
  },
  'jeera-rice': {
    url: '/images/menu/jeera-rice.webp',
    filename: 'jeera-rice.webp',
    alt: 'Fragrant basmati rice sautéed with cumin seeds jeera and aromatic whole spices',
  },
  'veg-pulao': {
    url: '/images/menu/veg-pulao.webp',
    filename: 'veg-pulao.webp',
    alt: 'Aromatic basmati rice cooked with fresh seasonal garden vegetables and mild herbs',
  },
  'special-thali': {
    url: '/images/menu/special-thali.webp',
    filename: 'special-thali.webp',
    alt: 'Complete grand meal thali with Paneer butter masala, dal fry, plain rice, four fulka rotis, papad, pickle',
  },
  'poha': {
    url: '/images/menu/poha.webp',
    filename: 'poha.webp',
    alt: 'Light, healthy flattened rice flakes tempered with mustard seeds, turmeric, peanuts, and curry leaves',
  },
  'bread-roll': {
    url: '/images/menu/bread-roll.webp',
    filename: 'bread-roll.webp',
    alt: 'Crispy deep-fried bread rolls stuffed with seasoned potato and green pea filling',
  },
  'aloo-sandwich': {
    url: '/images/menu/aloo-sandwich.webp',
    filename: 'aloo-sandwich.webp',
    alt: 'Grilled sandwich layered with spiced mashed potato filling, coriander mint chutney, and butter',
  },
  'aloo-veggies-sandwich': {
    url: '/images/menu/aloo-veggies-sandwich.webp',
    filename: 'aloo-veggies-sandwich.webp',
    alt: 'Crisp grilled sandwich loaded with spiced potatoes and sliced cucumbers, tomatoes, and onions',
  },
  'corn-cheese-sandwich': {
    url: '/images/menu/corn-cheese-sandwich.webp',
    filename: 'corn-cheese-sandwich.webp',
    alt: 'Golden grilled sandwich stuffed with sweet corn kernels, mixed herbs, and abundant melted cheese',
  },
};

/**
 * Returns the mapped visual asset configuration for a given food slug.
 * Returns null if no exact mapping exists.
 */
export function getAssetMapping(slug: string): AssetMapping | null {
  const normalizedSlug = slug.toLowerCase().trim();
  const mapping = assetsRegistry[normalizedSlug];
  if (mapping) return mapping;
  return null;
}
