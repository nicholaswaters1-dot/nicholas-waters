import React, { useState, useEffect } from 'react';
import { Map, AdvancedMarker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { LocalBusinessAd } from '../../types';
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ID,
  getCoordinatesForUkAddressAndPostcode,
} from '../../services/googleMapsConfig';
import { Star, Phone, ExternalLink, MapPin, Tag, X, Sparkles, Navigation } from 'lucide-react';

interface DogFriendlyGoogleMapProps {
  businesses: LocalBusinessAd[];
  selectedBusiness: LocalBusinessAd | null;
  onSelectBusiness: (b: LocalBusinessAd | null) => void;
  heightClass?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
}

const CategoryMarkerIcon: React.FC<{ category: string; isSelected: boolean }> = ({ category, isSelected }) => {
  let bgColor = 'bg-emerald-600';
  let emoji = '🐾';

  if (category === 'Dog Friendly Places to Eat') {
    bgColor = 'bg-amber-600';
    emoji = '🍽️';
  } else if (category === 'Dog Friendly Places to Stay') {
    bgColor = 'bg-indigo-600';
    emoji = '🏨';
  } else if (category === 'Dog Friendly Shopping') {
    bgColor = 'bg-emerald-600';
    emoji = '🛍️';
  } else if (category === 'Veterinary Hospital') {
    bgColor = 'bg-rose-600';
    emoji = '🏥';
  } else if (category === 'Grooming & Spa') {
    bgColor = 'bg-purple-600';
    emoji = '✂️';
  }

  return (
    <div
      className={`relative flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'scale-125 ring-4 ring-white shadow-2xl z-30'
          : 'hover:scale-110 shadow-md z-10'
      } ${bgColor} text-white px-2.5 py-1 text-xs font-bold border-2 border-white`}
    >
      <span className="mr-1 text-sm">{emoji}</span>
      <span className="hidden sm:inline text-[11px] truncate max-w-[100px]">{category.replace('Dog Friendly Places to ', '').replace('Dog Friendly ', '')}</span>
      {isSelected && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-inherit border-r-2 border-b-2 border-white" />
      )}
    </div>
  );
};

// Pan to selected business when clicked from list or added
const MapPanController: React.FC<{ targetCoords: { lat: number; lng: number } | null }> = ({ targetCoords }) => {
  const map = useMap();
  useEffect(() => {
    if (map && targetCoords) {
      map.panTo(targetCoords);
      map.setZoom(15);
    }
  }, [map, targetCoords]);
  return null;
};

export const DogFriendlyGoogleMap: React.FC<DogFriendlyGoogleMapProps> = ({
  businesses,
  selectedBusiness,
  onSelectBusiness,
  heightClass = 'h-[440px]',
  center = DEFAULT_MAP_CENTER,
  zoom = 13.5,
}) => {
  const [activeWindowBusiness, setActiveWindowBusiness] = useState<LocalBusinessAd | null>(selectedBusiness);

  useEffect(() => {
    setActiveWindowBusiness(selectedBusiness);
  }, [selectedBusiness]);

  const resolveBusinessCoords = (b: LocalBusinessAd) => {
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

  const targetCoords = selectedBusiness ? resolveBusinessCoords(selectedBusiness) : null;

  return (
    <div className={`relative w-full ${heightClass} rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100`}>
      <Map
        mapId={DEFAULT_MAP_ID}
        defaultCenter={center}
        defaultZoom={zoom}
        gestureHandling="greedy"
        disableDefaultUI={false}
        mapTypeControl={false}
        streetViewControl={false}
        className="w-full h-full"
      >
        <MapPanController targetCoords={targetCoords} />

        {/* Render markers for all active businesses positioned by address & postcode */}
        {businesses
          .filter((b) => b.status === 'Active')
          .map((business) => {
            const isSelected = activeWindowBusiness?.id === business.id;
            const pos = resolveBusinessCoords(business);
            return (
              <AdvancedMarker
                key={business.id}
                position={pos}
                onClick={() => {
                  setActiveWindowBusiness(business);
                  onSelectBusiness(business);
                }}
                title={`${business.businessName} — ${business.address} (${business.postcode || business.postcodeArea})`}
              >
                <CategoryMarkerIcon category={business.category} isSelected={isSelected} />
              </AdvancedMarker>
            );
          })}

        {/* InfoWindow for clicked venue */}
        {activeWindowBusiness && (
          <InfoWindow
            position={resolveBusinessCoords(activeWindowBusiness)}
            onCloseClick={() => {
              setActiveWindowBusiness(null);
              onSelectBusiness(null);
            }}
            className="p-0 max-w-[280px] sm:max-w-[320px] rounded-xl overflow-hidden"
          >
            <div className="text-slate-900 p-1">
              {activeWindowBusiness.imageUrl && (
                <div className="relative h-28 w-full -mx-1 -mt-1 mb-2.5 overflow-hidden rounded-t-lg">
                  <img
                    src={activeWindowBusiness.imageUrl}
                    alt={activeWindowBusiness.businessName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-950/80 text-white backdrop-blur-xs">
                    {activeWindowBusiness.postcodeArea}
                  </span>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md">
                    {activeWindowBusiness.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{activeWindowBusiness.rating}</span>
                    <span className="text-slate-400 font-normal">({activeWindowBusiness.reviewCount})</span>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-tight">
                  {activeWindowBusiness.businessName}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {activeWindowBusiness.description}
                </p>

                {/* Dog amenities list */}
                {activeWindowBusiness.dogAmenities && activeWindowBusiness.dogAmenities.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {activeWindowBusiness.dogAmenities.slice(0, 3).map((amenity, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                        🐾 {amenity}
                      </span>
                    ))}
                  </div>
                )}

                {/* Promo offer */}
                {activeWindowBusiness.promoOffer && (
                  <div className="p-1.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 font-semibold flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span className="truncate">{activeWindowBusiness.promoOffer}</span>
                  </div>
                )}

                {/* Address & Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500 truncate max-w-[150px]">
                    {activeWindowBusiness.address}
                  </span>
                  <a
                    href={`tel:${activeWindowBusiness.phone}`}
                    className="px-2.5 py-1 text-xs font-bold text-white bg-[#0f5132] hover:bg-[#0c3e29] rounded-lg transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            </div>
          </InfoWindow>
        )}
      </Map>

      {/* Floating Map Legend Pill */}
      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm text-xs font-semibold text-slate-800 flex items-center gap-3 z-10">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-[11px]">Eat</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          <span className="text-[11px]">Stay</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-[11px]">Shop</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span className="text-[11px]">Vet ER</span>
        </span>
      </div>
    </div>
  );
};
