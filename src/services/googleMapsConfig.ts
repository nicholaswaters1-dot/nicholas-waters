export const GOOGLE_MAPS_API_KEY =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) ||
  'AIzaSyA2s60BL9y9TFXWG0TmCOUw9XnW6ICoKmo';

export const DEFAULT_MAP_CENTER = { lat: 51.5606, lng: -0.1631 }; // Hampstead Heath, London NW3
export const DEFAULT_MAP_ZOOM = 14;
export const DEFAULT_MAP_ID = 'DEMO_MAP_ID';

export const UK_POSTCODE_CENTERS: Record<string, { lat: number; lng: number }> = {
  NW3: { lat: 51.5582, lng: -0.1755 },
  NW1: { lat: 51.5390, lng: -0.1426 },
  NW6: { lat: 51.5473, lng: -0.1912 },
  NW8: { lat: 51.5321, lng: -0.1728 },
  SW19: { lat: 51.4214, lng: -0.2064 },
  SW8: { lat: 51.4785, lng: -0.1436 },
  SW1: { lat: 51.4975, lng: -0.1357 },
  SW3: { lat: 51.4900, lng: -0.1621 },
  SW11: { lat: 51.4654, lng: -0.1650 },
  TW9: { lat: 51.4613, lng: -0.3037 },
  SE10: { lat: 51.4826, lng: -0.0077 },
  SE1: { lat: 51.5045, lng: -0.0865 },
  N1: { lat: 51.5362, lng: -0.1033 },
  N6: { lat: 51.5716, lng: -0.1462 },
  E8: { lat: 51.5465, lng: -0.0553 },
  E1: { lat: 51.5176, lng: -0.0594 },
  W11: { lat: 51.5152, lng: -0.2055 },
  W1: { lat: 51.5142, lng: -0.1494 },
  W8: { lat: 51.5009, lng: -0.1925 },
  WC1: { lat: 51.5229, lng: -0.1231 },
  EC1: { lat: 51.5245, lng: -0.1021 },
  M1: { lat: 53.4808, lng: -2.2426 },
  EH1: { lat: 55.9533, lng: -3.1883 },
  BS8: { lat: 51.4553, lng: -2.6177 },
  CF10: { lat: 51.4816, lng: -3.1791 },
  B1: { lat: 52.4796, lng: -1.9026 },
  LS1: { lat: 53.7974, lng: -1.5438 },
  G1: { lat: 55.8609, lng: -4.2514 },
  L1: { lat: 53.4048, lng: -2.9818 },
  OX1: { lat: 51.7520, lng: -1.2577 },
  CB1: { lat: 52.2053, lng: 0.1218 },
  BN1: { lat: 50.8225, lng: -0.1372 },
};

const UK_POSTCODE_REGEX = /\b([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})?\b/i;

export function extractUkPostcode(text: string, fallbackPostcode: string = 'NW3'): string {
  const candidate = (fallbackPostcode || '').trim().toUpperCase();
  if (candidate && candidate !== 'ALL') {
    const matchCandidate = candidate.match(UK_POSTCODE_REGEX);
    if (matchCandidate) {
      return matchCandidate[2]
        ? `${matchCandidate[1].toUpperCase()} ${matchCandidate[2].toUpperCase()}`
        : matchCandidate[1].toUpperCase();
    }
  }
  const matchAddress = (text || '').toUpperCase().match(UK_POSTCODE_REGEX);
  if (matchAddress) {
    return matchAddress[2]
      ? `${matchAddress[1].toUpperCase()} ${matchAddress[2].toUpperCase()}`
      : matchAddress[1].toUpperCase();
  }
  return candidate || 'NW3';
}

export function getCoordinatesForUkPostcode(
  postcode: string,
  seedString: string = ''
): { lat: number; lng: number } {
  const clean = extractUkPostcode(seedString, postcode);
  const outcode = clean.split(' ')[0] || 'NW3';

  let base = UK_POSTCODE_CENTERS[outcode];
  if (!base) {
    const prefixMatch = Object.keys(UK_POSTCODE_CENTERS).find(
      (key) => clean.startsWith(key) || outcode.startsWith(key.slice(0, 2))
    );
    base = prefixMatch ? UK_POSTCODE_CENTERS[prefixMatch] : DEFAULT_MAP_CENTER;
  }

  const combined = `${clean}:${seedString.trim().toUpperCase()}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash * 31 + combined.charCodeAt(i)) % 10000;
  }
  const latOffset = ((hash % 100) - 50) * 0.00014;
  const lngOffset = ((Math.floor(hash / 100) % 100) - 50) * 0.00019;

  return {
    lat: Number((base.lat + latOffset).toFixed(5)),
    lng: Number((base.lng + lngOffset).toFixed(5)),
  };
}

export function getCoordinatesForUkAddressAndPostcode(
  address: string,
  postcode: string,
  businessName: string = ''
): { lat: number; lng: number } {
  const resolvedPostcode = extractUkPostcode(address, postcode);
  return getCoordinatesForUkPostcode(resolvedPostcode, `${address.trim()} ${businessName.trim()}`);
}


