import React, { useState, useEffect } from 'react';
import { Map, AdvancedMarker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { LocalBusinessAd } from '../../types';
import {
  DEFAULT_MAP_ID,
  getCoordinatesForUkAddressAndPostcode,
} from '../../services/googleMapsConfig';
import { ASSET_PATHS } from '../../data/initialData';
import { Phone, Tag, Star, Home, Radio, MapPin } from 'lucide-react';

declare const google: any;

interface LiveGpsWalkGoogleMapProps {
  nearbyBusinesses: LocalBusinessAd[];
  showBusinesses: boolean;
  selectedBusiness: LocalBusinessAd | null;
  onSelectBusiness: (b: LocalBusinessAd | null) => void;
}

// Hampstead Heath Walk Route Polyline
const WALK_ROUTE_COORDS: { lat: number; lng: number }[] = [
  { lat: 51.5540, lng: -0.1700 }, // Home pickup (Heath St)
  { lat: 51.5565, lng: -0.1685 }, // Sandy Road entry
  { lat: 51.5595, lng: -0.1660 }, // East Meadow trail
  { lat: 51.5620, lng: -0.1635 }, // Viaduct Pond
  { lat: 51.5645, lng: -0.1620 }, // Highgate Ponds crossing
  { lat: 51.5670, lng: -0.1635 }, // Kenwood boundary trail
  { lat: 51.5685, lng: -0.1645 }, // Current Live Walker position
];

// Helper to render Google Maps Polyline
const RoutePolyline: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Draw main walk path
    const polyline = new google.maps.Polyline({
      path: WALK_ROUTE_COORDS,
      geodesic: true,
      strokeColor: '#10b981',
      strokeOpacity: 0.9,
      strokeWeight: 5,
      map,
    });

    return () => {
      polyline.setMap(null);
    };
  }, [map]);

  return null;
};

export const LiveGpsWalkGoogleMap: React.FC<LiveGpsWalkGoogleMapProps> = ({
  nearbyBusinesses,
  showBusinesses,
  selectedBusiness,
  onSelectBusiness,
}) => {
  const [activeWindow, setActiveWindow] = useState<LocalBusinessAd | null>(selectedBusiness);

  useEffect(() => {
    setActiveWindow(selectedBusiness);
  }, [selectedBusiness]);

  const resolveCoords = (b: LocalBusinessAd) => {
    if (b.coordinates && typeof b.coordinates.lat === 'number' && typeof b.coordinates.lng === 'number') {
      return b.coordinates;
    }
    if (b.mapCoordinates && typeof b.mapCoordinates.lat === 'number' && typeof b.mapCoordinates.lng === 'number') {
      return b.mapCoordinates;
    }
    return getCoordinatesForUkAddressAndPostcode(
      b.address || '',
      b.postcode || b.postcodeArea || 'NW3',
      b.businessName
    );
  };

  const walkerPos = WALK_ROUTE_COORDS[WALK_ROUTE_COORDS.length - 1];
  const pickupPos = WALK_ROUTE_COORDS[0];

  return (
    <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-inner">
      <Map
        mapId={DEFAULT_MAP_ID}
        defaultCenter={{ lat: 51.5615, lng: -0.1665 }}
        defaultZoom={14.5}
        gestureHandling="greedy"
        disableDefaultUI={false}
        mapTypeControl={false}
        streetViewControl={false}
        className="w-full h-full"
      >
        <RoutePolyline />

        {/* Home Pickup Point Marker */}
        <AdvancedMarker position={pickupPos} title="Pickup Point: 10:32 AM">
          <div className="flex items-center gap-1.5 bg-slate-900 text-white px-2 py-1 rounded-full shadow-lg border-2 border-emerald-400 text-xs font-bold">
            <Home className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px]">Pickup 10:32 AM</span>
          </div>
        </AdvancedMarker>

        {/* Live Walker Pin (Sarah Jenkins & Buster) */}
        <AdvancedMarker position={walkerPos} title="Sarah Jenkins & Buster (Live)">
          <div className="relative cursor-pointer group">
            {/* Animated sonar ripple */}
            <span className="absolute -inset-2 rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <div className="relative flex items-center gap-1.5 bg-[#0f5132] text-white pl-1 pr-2.5 py-1 rounded-full shadow-2xl border-2 border-white ring-2 ring-emerald-500">
              <img
                src={ASSET_PATHS.sarah}
                alt="Sarah"
                referrerPolicy="no-referrer"
                className="w-6 h-6 rounded-full object-cover border border-white"
              />
              <div className="flex flex-col">
                <span className="text-[10px] font-black leading-none text-white">Sarah & Buster</span>
                <span className="text-[8px] font-bold text-emerald-300 flex items-center gap-0.5">
                  <Radio className="w-2.5 h-2.5 animate-pulse" /> LIVE
                </span>
              </div>
            </div>
          </div>
        </AdvancedMarker>

        {/* Dog-Friendly Venues & Vets Pins */}
        {showBusinesses &&
          nearbyBusinesses.map((b) => {
            const isSelected = activeWindow?.id === b.id;
            const pos = resolveCoords(b);
            let icon = '🐾';
            let badgeColor = 'bg-emerald-600';
            if (b.category === 'Dog Friendly Places to Eat') {
              icon = '🍽️';
              badgeColor = 'bg-amber-600';
            } else if (b.category === 'Dog Friendly Places to Stay') {
              icon = '🏨';
              badgeColor = 'bg-indigo-600';
            } else if (b.category === 'Dog Friendly Shopping') {
              icon = '🛍️';
              badgeColor = 'bg-emerald-600';
            } else if (b.category === 'Veterinary Hospital') {
              icon = '🏥';
              badgeColor = 'bg-rose-600';
            }

            return (
              <AdvancedMarker
                key={b.id}
                position={pos}
                onClick={() => {
                  setActiveWindow(b);
                  onSelectBusiness(b);
                }}
                title={`${b.businessName} — ${b.address}`}
              >
                <div
                  className={`flex items-center gap-1 text-white px-2 py-0.5 rounded-full shadow-md text-[10px] font-bold border border-white cursor-pointer transition-transform ${badgeColor} ${
                    isSelected ? 'scale-125 ring-2 ring-white z-30' : 'hover:scale-110 z-10'
                  }`}
                >
                  <span>{icon}</span>
                  <span className="max-w-[70px] truncate">{b.businessName.split(' ')[0]}</span>
                </div>
              </AdvancedMarker>
            );
          })}

        {/* Selected Business InfoWindow */}
        {activeWindow && (
          <InfoWindow
            position={resolveCoords(activeWindow)}
            onCloseClick={() => {
              setActiveWindow(null);
              onSelectBusiness(null);
            }}
            className="p-0 max-w-[260px] rounded-xl overflow-hidden"
          >
            <div className="p-1 space-y-1.5 text-slate-900">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                  {activeWindow.category}
                </span>
                <div className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{activeWindow.rating}</span>
                </div>
              </div>

              <h4 className="font-bold text-xs leading-tight text-slate-900">
                {activeWindow.businessName}
              </h4>
              <p className="text-[11px] text-slate-600 line-clamp-1">{activeWindow.tagline}</p>

              {activeWindow.promoOffer && (
                <div className="p-1.5 bg-amber-50 border border-amber-200 rounded text-[10px] text-amber-900 font-semibold flex items-center gap-1">
                  <Tag className="w-3 h-3 text-amber-700 shrink-0" />
                  <span className="truncate">{activeWindow.promoOffer}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                  {activeWindow.address}
                </span>
                <a
                  href={`tel:${activeWindow.phone}`}
                  className="px-2 py-0.5 text-[10px] font-bold text-white bg-[#0f5132] hover:bg-[#0c3e29] rounded flex items-center gap-1"
                >
                  <Phone className="w-2.5 h-2.5" />
                  <span>Call</span>
                </a>
              </div>
            </div>
          </InfoWindow>
        )}
      </Map>

      {/* Floating GPS telemetry badge */}
      <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-xl px-3 py-1.5 text-white flex items-center gap-4 text-xs z-10 shadow-lg">
        <div>
          <div className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Speed</div>
          <div className="font-mono font-bold text-white text-xs">4.2 km/h</div>
        </div>
        <div className="w-px h-5 bg-slate-700" />
        <div>
          <div className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Elevation</div>
          <div className="font-mono font-bold text-white text-xs">98 m</div>
        </div>
        <div className="w-px h-5 bg-slate-700" />
        <div>
          <div className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">GPS Signal</div>
          <div className="font-semibold text-emerald-300 text-xs flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Strong HDOP
          </div>
        </div>
      </div>
    </div>
  );
};
