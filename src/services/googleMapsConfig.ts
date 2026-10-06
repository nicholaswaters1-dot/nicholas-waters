export const GOOGLE_MAPS_API_KEY =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) ||
  'AIzaSyA2s60BL9y9TFXWG0TmCOUw9XnW6ICoKmo';

export const DEFAULT_MAP_CENTER = { lat: 51.5606, lng: -0.1631 }; // Hampstead Heath, London NW3
export const DEFAULT_MAP_ZOOM = 14;
export const DEFAULT_MAP_ID = 'DEMO_MAP_ID';

export const UK_POSTCODE_CENTERS: Record<string, { lat: number; lng: number }> = {
  NW3: { lat: 51.5582, lng: -0.1755 },
  NW1: { lat: 51.5390, lng: -0.1426 },
  SW19: { lat: 51.4214, lng: -0.2064 },
  SW8: { lat: 51.4785, lng: -0.1436 },
  TW9: { lat: 51.4613, lng: -0.3037 },
  SE10: { lat: 51.4826, lng: -0.0077 },
  N1: { lat: 51.5362, lng: -0.1033 },
  E8: { lat: 51.5465, lng: -0.0553 },
  W11: { lat: 51.5152, lng: -0.2055 },
  M1: { lat: 53.4808, lng: -2.2426 },
  EH1: { lat: 55.9533, lng: -3.1883 },
  BS8: { lat: 51.4553, lng: -2.6177 },
  CF10: { lat: 51.4816, lng: -3.1791 },
};

export function getCoordinatesForUkPostcode(
  postcode: string,
  seedString: string = ''
): { lat: number; lng: number } {
  const clean = (postcode || 'NW3').trim().toUpperCase();
  const outcode = clean.split(' ')[0] || 'NW3';

  let base = UK_POSTCODE_CENTERS[outcode];
  if (!base) {
    const prefixMatch = Object.keys(UK_POSTCODE_CENTERS).find(
      (key) => clean.startsWith(key) || outcode.startsWith(key.slice(0, 2))
    );
    base = prefixMatch ? UK_POSTCODE_CENTERS[prefixMatch] : DEFAULT_MAP_CENTER;
  }

  const combined = `${clean}:${seedString}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash * 31 + combined.charCodeAt(i)) % 10000;
  }
  const latOffset = ((hash % 100) - 50) * 0.00016;
  const lngOffset = ((Math.floor(hash / 100) % 100) - 50) * 0.00022;

  return {
    lat: Number((base.lat + latOffset).toFixed(5)),
    lng: Number((base.lng + lngOffset).toFixed(5)),
  };
}

