import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { LocalBusinessAd, BusinessCategory } from '../../types';
import { DogFriendlyGoogleMap } from '../maps/DogFriendlyGoogleMap';
import {
  getCoordinatesForUkPostcode,
  getCoordinatesForUkAddressAndPostcode,
} from '../../services/googleMapsConfig';
import {
  Sparkles,
  MapPin,
  Phone,
  ExternalLink,
  Star,
  CheckCircle,
  PlusCircle,
  CreditCard,
  Building2,
  Search,
  Filter,
  X,
  ShieldCheck,
  Tag,
  Map as MapIcon,
  List,
  UtensilsCrossed,
  Hotel,
  ShoppingBag,
  HeartPulse,
  Scissors,
  Check,
  Layers,
} from 'lucide-react';

export const LocalDirectoryAdvertisers: React.FC = () => {
  const {
    localBusinesses,
    addBusinessAd,
    advertiseModalOpen,
    setAdvertiseModalOpen,
    selectedPostcodeArea,
    setSelectedPostcodeArea,
    showToast,
  } = useMarketplace();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState<LocalBusinessAd | null>(null);
  const [viewMode, setViewMode] = useState<'both' | 'map' | 'list'>('both');

  // New Business Sign-Up & Advertiser Form state (£9.99/mo Recurring Subscription Required — No Free Option)
  const [ownerContactName, setOwnerContactName] = useState('');
  const [accountEmail, setAccountEmail] = useState('');
  const [accountPassword, setAccountPassword] = useState('');
  const [createBusinessAccount, setCreateBusinessAccount] = useState(true);
  const [newBizName, setNewBizName] = useState('');
  const [newCategory, setNewCategory] = useState<BusinessCategory>('Dog Friendly Places to Eat');
  const [newTagline, setNewTagline] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPostcode, setNewPostcode] = useState('NW3 1EN');
  const [newAddress, setNewAddress] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newWebsite, setNewWebsite] = useState('');
  const [newPromo, setNewPromo] = useState('10% off for My Paws Walks members with code PAWS10');
  const [newAmenities, setNewAmenities] = useState('Water Bowls Provided, Free Dog Treats, Dogs Welcome Inside');
  const [newLogoUrl, setNewLogoUrl] = useState<string>('');
  const [newGalleryPhotos, setNewGalleryPhotos] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'Card / Direct Debit' | 'Apple Pay' | 'Google Pay' | 'PayPal Business'>('Card / Direct Debit');
  const [cardLast4, setCardLast4] = useState('4242');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setNewLogoUrl(reader.result);
        showToast('Business logo uploaded!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryPhotosUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = 4 - newGalleryPhotos.length;
    if (remainingSlots <= 0) {
      showToast('Maximum of 4 business pictures reached. Remove a picture to upload another.', 'warning');
      return;
    }

    const filesToProcess = files.slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      showToast(`Only the first ${remainingSlots} photo(s) were added (maximum 4 pictures allowed).`, 'info');
    }

    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewGalleryPhotos((prev) => {
            if (prev.length >= 4) return prev;
            return [...prev, reader.result as string];
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryPhoto = (idx: number) => {
    setNewGalleryPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const filteredBusinesses = localBusinesses.filter((b) => {
    const matchPostcode =
      selectedPostcodeArea === 'All' || b.postcodeArea === selectedPostcodeArea;
    const matchCategory =
      activeCategory === 'All' || b.category === activeCategory;
    const matchSearch =
      b.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.dogAmenities && b.dogAmenities.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchPostcode && matchCategory && matchSearch;
  });

  const handleRegisterAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName || !newPhone || !newAddress || !newPostcode.trim()) {
      showToast('Please fill in business name, mandatory postcode, address, and phone number.', 'warning');
      return;
    }

    if (createBusinessAccount && (!ownerContactName.trim() || !accountEmail.trim())) {
      showToast('Please enter your contact name and email to sign up your business account.', 'warning');
      return;
    }

    if (!paymentConfirmed) {
      showToast('Please complete and confirm the £9.99/month recurring subscription payment before publishing your business advertisement.', 'warning');
      return;
    }

    const parsedAmenities = newAmenities
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);

    const cleanFullPostcode = newPostcode.trim().toUpperCase();
    const outcode = cleanFullPostcode.split(' ')[0] || 'NW3';
    const fullAddress = newAddress.includes(cleanFullPostcode)
      ? newAddress.trim()
      : `${newAddress.trim()}, ${cleanFullPostcode}`;
    const mappedCoords = getCoordinatesForUkAddressAndPostcode(
      fullAddress,
      cleanFullPostcode,
      newBizName
    );

    const newAdPayload = {
      businessName: newBizName,
      category: newCategory,
      tagline: newTagline || 'Friendly local dog-welcoming establishment',
      description: newDescription || 'Dedicated professional pet-friendly venue.',
      postcode: cleanFullPostcode,
      postcodeArea: outcode,
      address: fullAddress,
      phone: newPhone,
      website: newWebsite || 'https://mypawswalks.co.uk',
      logoUrl:
        newLogoUrl ||
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
      imageUrl:
        newGalleryPhotos[0] ||
        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
      galleryPhotos: newGalleryPhotos.slice(0, 4),
      promoOffer: newPromo,
      subscriptionTier: 'Pet Business Ad (£9.99/mo)' as const,
      billingCadence: 'Monthly' as const,
      monthlyFee: 9.99,
      paymentReceived: true,
      paymentMethod: `${paymentMethod} ${paymentMethod === 'Card / Direct Debit' ? `(•••• ${cardLast4})` : ''}`,
      rating: 5.0,
      reviewCount: 1,
      coordinates: mappedCoords,
      mapCoordinates: mappedCoords,
      dogAmenities: parsedAmenities.length > 0 ? parsedAmenities : ['Water Bowls Provided', 'Dogs Welcome Inside'],
      featuredBadge: `Verified ${newCategory} Partner`,
    };

    addBusinessAd(newAdPayload);

    // Ensure the map view is visible and pans directly to the newly added business coordinates
    if (selectedPostcodeArea !== 'All' && selectedPostcodeArea !== outcode) {
      setSelectedPostcodeArea('All');
    }
    if (viewMode === 'list') {
      setViewMode('both');
    }
    setSelectedBusiness({
      ...newAdPayload,
      id: `biz_preview_${Date.now()}`,
      status: 'Active',
    });

    if (createBusinessAccount && accountEmail.trim()) {
      showToast(
        `Business Account created for ${ownerContactName} (${accountEmail}) & ${newBizName} positioned on map at ${fullAddress}!`,
        'success'
      );
    }

    setOwnerContactName('');
    setAccountEmail('');
    setAccountPassword('');
    setNewBizName('');
    setNewTagline('');
    setNewDescription('');
    setNewAddress('');
    setNewPhone('');
    setNewWebsite('');
    setNewLogoUrl('');
    setNewGalleryPhotos([]);
    setPaymentConfirmed(false);
  };

  const categories = [
    { id: 'All', label: 'All Places', icon: Layers },
    { id: 'Dog Friendly Places to Eat', label: 'Places to Eat', icon: UtensilsCrossed },
    { id: 'Dog Friendly Places to Stay', label: 'Places to Stay', icon: Hotel },
    { id: 'Dog Friendly Shopping', label: 'Dog-Friendly Shopping', icon: ShoppingBag },
    { id: 'Veterinary Hospital', label: '24/7 Vets & ER', icon: HeartPulse },
    { id: 'Grooming & Spa', label: 'Grooming & Spas', icon: Scissors },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Directory Hero & Advertiser Call to Action */}
      <div className="bg-gradient-to-br from-[#0f5132] via-[#0d4229] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Google Maps Dog Directory</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Dog-Friendly Places to Eat, Stay & Shop
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed mb-5">
            Discover verified dog-welcoming pubs, outdoor brunch cafes, boutique pet hotels, and retail shops where dogs on leashes are welcomed with open arms, fresh water bowls, and treats!
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setAdvertiseModalOpen(true)}
              className="px-5 py-2.5 text-xs font-bold text-[#0f5132] bg-white hover:bg-emerald-50 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-emerald-700" />
              <span>Advertise Your Pet Business (£9.99/mo Recurring Subscription)</span>
            </button>
            <div className="flex items-center gap-1.5 text-xs text-emerald-200">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Includes Business Logo, Up to 4 Photos & Live GPS Map Pin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Business Account: Pup & Academy Points & Customer Rewards Studio */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Business Account: Pup & Academy Points & Customer Rewards</span>
            </h2>
            <p className="text-xs text-slate-500">
              Local businesses, groomers, dog cafes, and pet shops can configure what rewards are unlocked when dogs & owners complete training or visit tasks.
            </p>
          </div>
          <span className="text-[11px] font-bold text-amber-950 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full self-start">
            🏆 Official Business Rewards Partner
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
          {[
            {
              biz: 'The Spaniard’s Inn (Dog Pub)',
              task: 'Calm Under-Table Settle (30 Mins)',
              points: 50,
              reward: 'Free Whipped Puppuccino & Liver Biscuit Bowl',
            },
            {
              biz: 'Hampstead Paws & Bubbles Spa',
              task: 'Fear-Free Nail Trim & Brush Handling',
              points: 75,
              reward: '£10 Off Full Luxury Blueberry Facial & Deshed',
            },
            {
              biz: 'Bark & Boutique Organic Deli',
              task: 'Polite Sit-Wait at Shop Counter',
              points: 40,
              reward: '15% Off Natural Venison Chews & Air-Dried Treats',
            },
          ].map((perk, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 flex flex-col justify-between space-y-2.5"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black uppercase bg-amber-400/30 text-amber-950 px-2 py-0.5 rounded">
                    +{perk.points} Pup Points
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800">{perk.biz}</span>
                </div>
                <div className="font-bold text-slate-900">Task: {perk.task}</div>
                <div className="text-emerald-900 font-semibold mt-1">🎁 Reward: {perk.reward}</div>
              </div>
              <button
                onClick={() =>
                  showToast(`Claimed "${perk.reward}" (+${perk.points} Pup Points) at ${perk.biz}!`)
                }
                className="w-full py-1.5 bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl font-bold transition-colors"
              >
                Redeem / Configure Business Perk
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Search, Borough and Category Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
        {/* Top Controls: Search + Postcode + View Mode Switcher */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dog pubs, cafes, hotels, shops, vets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Postcode Segmented Pills (Wraps cleanly inside screen) */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl max-w-full">
            <span className="text-[11px] font-bold text-slate-400 px-2 shrink-0">Borough:</span>
            {[
              { code: 'All', label: 'All Areas' },
              { code: 'NW3', label: 'NW3 Hampstead' },
              { code: 'SW19', label: 'SW19 Wimbledon' },
              { code: 'TW9', label: 'TW9 Richmond' },
              { code: 'SE10', label: 'SE10 Greenwich' },
            ].map((pc) => (
              <button
                key={pc.code}
                onClick={() => setSelectedPostcodeArea(pc.code)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  selectedPostcodeArea === pc.code
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {pc.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle (Map, List, Both) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setViewMode('both')}
              className={`hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                viewMode === 'both' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Split View</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                viewMode === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>Map Only</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5 text-emerald-600" />
              <span>Directory List</span>
            </button>
          </div>
        </div>

        {/* Quick Category Buttons (Wraps cleanly inside screen) */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 pb-1 max-w-full">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0f5132] text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-300' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content: Google Maps + Listings Layout */}
      <div className="space-y-6">
        {/* Google Maps View */}
        {(viewMode === 'both' || viewMode === 'map') && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Google Maps GPS: Verified Dog-Friendly Venues ({filteredBusinesses.length} Pins)</span>
              </span>
              <span className="text-[11px] font-normal text-slate-500 hidden sm:inline">
                Click any pin to view dog amenities, menu & discount code
              </span>
            </div>

            <DogFriendlyGoogleMap
              businesses={filteredBusinesses}
              selectedBusiness={selectedBusiness}
              onSelectBusiness={setSelectedBusiness}
              heightClass={viewMode === 'map' ? 'h-[550px]' : 'h-[380px] sm:h-[440px]'}
            />
          </div>
        )}

        {/* Listings Cards Grid */}
        {(viewMode === 'both' || viewMode === 'list') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span className="font-semibold text-slate-700">
                Found {filteredBusinesses.length} dog-friendly venues
              </span>
              <span>Sorted by Postcode & Featured Partner status</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBusinesses.map((biz) => {
                const isSelected = selectedBusiness?.id === biz.id;
                return (
                  <div
                    key={biz.id}
                    onClick={() => setSelectedBusiness(biz)}
                    className={`bg-white rounded-2xl border overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                        : biz.subscriptionTier === 'Premier Borough Network'
                        ? 'border-emerald-300 ring-1 ring-emerald-100'
                        : 'border-slate-200'
                    }`}
                  >
                    <div>
                      {/* Optional Photo Header */}
                      {biz.imageUrl && (
                        <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                          <img
                            src={biz.imageUrl}
                            alt={biz.businessName}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                            <span className="text-[10px] font-black uppercase tracking-wide bg-[#0f5132] text-white px-2 py-0.5 rounded-full shadow-sm">
                              {biz.postcodeArea}
                            </span>
                            {biz.featuredBadge && (
                              <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full shadow-sm">
                                ★ {biz.featuredBadge}
                              </span>
                            )}
                          </div>
                          {biz.logoUrl && (
                            <img
                              src={biz.logoUrl}
                              alt={`${biz.businessName} logo`}
                              referrerPolicy="no-referrer"
                              className="w-11 h-11 rounded-xl object-cover border-2 border-white shadow-md bg-white absolute bottom-2.5 right-2.5"
                            />
                          )}
                        </div>
                      )}

                      <div className="p-4 space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5">
                            {biz.logoUrl && !biz.imageUrl && (
                              <img
                                src={biz.logoUrl}
                                alt={`${biz.businessName} logo`}
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                              />
                            )}
                            <div>
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mb-1">
                                {biz.category}
                              </span>
                              <h3 className="font-bold text-sm text-slate-900 leading-tight">
                                {biz.businessName}
                              </h3>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md shrink-0">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{biz.rating}</span>
                            <span className="text-slate-400 font-normal">({biz.reviewCount})</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2">
                          {biz.description}
                        </p>

                        {/* Up to 4 Gallery Pictures Thumbnail Strip */}
                        {biz.galleryPhotos && biz.galleryPhotos.length > 0 && (
                          <div className="grid grid-cols-4 gap-1.5 pt-1">
                            {biz.galleryPhotos.slice(0, 4).map((photoUrl, pIdx) => (
                              <img
                                key={pIdx}
                                src={photoUrl}
                                alt={`${biz.businessName} photo ${pIdx + 1}`}
                                referrerPolicy="no-referrer"
                                className="w-full h-14 object-cover rounded-lg border border-slate-200"
                              />
                            ))}
                          </div>
                        )}

                        {/* Dog Amenities Badges */}
                        {biz.dogAmenities && biz.dogAmenities.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {biz.dogAmenities.map((amenity, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-medium bg-emerald-50/80 text-emerald-900 px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-1"
                              >
                                🐾 {amenity}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Promo Offer */}
                        {biz.promoOffer && (
                          <div className="p-2 bg-amber-50/80 border border-amber-200 rounded-xl text-[11px] text-amber-900 font-semibold flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                            <span className="truncate">{biz.promoOffer}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer Address & Phone Action */}
                    <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between gap-2 bg-slate-50/50">
                      <span className="text-[11px] text-slate-500 truncate max-w-[150px]">
                        {biz.address}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${biz.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="px-2.5 py-1 text-xs font-bold text-white bg-[#0f5132] hover:bg-[#0c3e29] rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call</span>
                        </a>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBusiness(biz);
                            if (viewMode === 'list') setViewMode('both');
                            showToast(`Selected ${biz.businessName} on Google Map!`);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1"
                          title="Show on map"
                        >
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          <span className="hidden sm:inline">Map</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Advertiser Sign Up & £9.99/mo Recurring Payment Modal (No Free Option) */}
      {advertiseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 space-y-5 animate-in fade-in max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  Business Account Sign-Up & Advertising · £9.99/mo Recurring Subscription
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  Sign Up & Advertise Your Pet Business (£9.99/Month)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Create your business advertiser account right here, provide your postcode to position your business on the live Google Map, upload your business logo & up to 4 pictures, and activate your £9.99/mo subscription.
                </p>
              </div>
              <button
                onClick={() => setAdvertiseModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterAd} className="space-y-4 text-xs">
              {/* STEP 1: BUSINESS ACCOUNT SIGN-UP CREDENTIALS */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-[#0f5132] text-white px-2 py-0.5 rounded">
                      Step 1 · Business Account Sign-Up
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm mt-1">
                      Create Your Business Account Credentials
                    </h3>
                  </div>
                  <label className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-950 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={createBusinessAccount}
                      onChange={(e) => setCreateBusinessAccount(e.target.checked)}
                      className="rounded accent-[#0f5132]"
                    />
                    <span>Sign up as a new Business Account</span>
                  </label>
                </div>

                {createBusinessAccount && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Your Contact Name *</label>
                      <input
                        type="text"
                        required={createBusinessAccount}
                        placeholder="e.g. Emma Thornton"
                        value={ownerContactName}
                        onChange={(e) => setOwnerContactName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Business Login Email *</label>
                      <input
                        type="email"
                        required={createBusinessAccount}
                        placeholder="owner@yourpetbusiness.co.uk"
                        value={accountEmail}
                        onChange={(e) => setAccountEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Create Password *</label>
                      <input
                        type="password"
                        required={createBusinessAccount}
                        placeholder="••••••••"
                        value={accountPassword}
                        onChange={(e) => setAccountPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Business / Venue Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Spaniard's Inn, Bark & Brew Cafe"
                    value={newBizName}
                    onChange={(e) => setNewBizName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Short Tagline *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Artisanal dog treats & grooming spa"
                    value={newTagline}
                    onChange={(e) => setNewTagline(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as BusinessCategory)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                  >
                    <option value="Dog Friendly Places to Eat">Dog Friendly Places to Eat (Pubs & Cafes)</option>
                    <option value="Dog Friendly Places to Stay">Dog Friendly Places to Stay (Hotels & Inns)</option>
                    <option value="Dog Friendly Shopping">Dog Friendly Shopping (Boutiques & Stores)</option>
                    <option value="Veterinary Hospital">Veterinary Hospital & ER</option>
                    <option value="Grooming & Spa">Grooming & Canine Spa</option>
                    <option value="Pet Boutique & Food">Pet Boutique & Food</option>
                    <option value="Training & Behavior">Training & Behavior</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center justify-between">
                    <span>Business Postcode * (Positions Pin on Map)</span>
                    <span className="text-[10px] font-extrabold text-emerald-700">📍 Live GPS Pin</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NW3 1EN, SW19 5BA, TW9 1DH"
                    value={newPostcode}
                    onChange={(e) => setNewPostcode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-slate-50 border border-emerald-400 rounded-xl font-mono font-extrabold uppercase focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500">
                    Your business will be automatically positioned at this postcode on the interactive map.
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Business Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe your pet services, dog-friendly facilities, and why dog owners love visiting..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Full Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 24 Heath Street, Hampstead, London NW3 6SG"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+44 20 7435 0000"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Website URL</label>
                  <input
                    type="url"
                    placeholder="https://yourbusiness.co.uk"
                    value={newWebsite}
                    onChange={(e) => setNewWebsite(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                  />
                </div>
              </div>

              {/* BUSINESS LOGO & UP TO 4 PICTURES UPLOAD */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    {newLogoUrl ? (
                      <img
                        src={newLogoUrl}
                        alt="Business Logo Preview"
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-600 bg-white shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-bold text-lg shrink-0">
                        🏢
                      </div>
                    )}
                    <div>
                      <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
                        1. Upload Your Business Logo
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Displayed on your directory card and interactive Google Map pin.
                      </p>
                    </div>
                  </div>
                  <label className="px-3.5 py-2 bg-[#0f5132] hover:bg-[#0c3e29] text-white font-bold rounded-xl cursor-pointer inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{newLogoUrl ? 'Change Business Logo' : 'Upload Business Logo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                  </label>
                </div>

                {/* Maximum 4 Business Pictures Upload */}
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
                        2. Upload Business Pictures (Maximum 4 Pictures)
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Showcase your venue, products, or dog-friendly space ({newGalleryPhotos.length}/4 uploaded).
                      </p>
                    </div>
                    {newGalleryPhotos.length < 4 && (
                      <label className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl cursor-pointer inline-flex items-center gap-1.5 shrink-0">
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Upload Pictures ({4 - newGalleryPhotos.length} left)</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleGalleryPhotosUpload}
                        />
                      </label>
                    )}
                  </div>

                  {newGalleryPhotos.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                      {newGalleryPhotos.map((photo, idx) => (
                        <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-300 h-20 bg-white">
                          <img
                            src={photo}
                            alt={`Upload ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryPhoto(idx)}
                            className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-1 shadow hover:bg-rose-700 cursor-pointer"
                            title="Remove picture"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                            Photo {idx + 1}/4
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-white border border-dashed border-slate-300 text-center text-[11px] text-slate-400">
                      No pictures uploaded yet. You can upload up to 4 pictures of your pet business.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Dog Amenities (Comma separated)</label>
                <input
                  type="text"
                  placeholder="Water Bowls Provided, Free Dog Treats, Dogs Welcome Inside, Garden Seating"
                  value={newAmenities}
                  onChange={(e) => setNewAmenities(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Exclusive My Paws Walks Member Promo</label>
                <input
                  type="text"
                  placeholder="e.g. 15% off food bill or Free Puppuccino with code PAWS15"
                  value={newPromo}
                  onChange={(e) => setNewPromo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                />
              </div>

              {/* Mandatory £9.99/Month Recurring Subscription & Payment Confirmation */}
              <div className="p-4 rounded-2xl bg-emerald-950 text-white space-y-3 border border-emerald-700">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                      Mandatory Business Subscription · No Free Tier
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-white mt-1">
                      Pet Business Advertisement — £9.99 / Month (Recurring)
                    </h4>
                    <p className="text-[11px] text-emerald-200">
                      Billed monthly at £9.99/mo (1-month cancellation notice). Payment must be received before your advertisement goes live.
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-amber-400">£9.99</div>
                    <div className="text-[10px] text-emerald-200">per month</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {(['Card / Direct Debit', 'Apple Pay', 'Google Pay', 'PayPal Business'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 px-2.5 rounded-xl font-bold text-[11px] border transition-all cursor-pointer ${
                        paymentMethod === method
                          ? 'bg-white text-slate-950 border-white shadow-xs'
                          : 'bg-emerald-900/60 text-emerald-100 border-emerald-700 hover:bg-emerald-800'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>

                {paymentMethod === 'Card / Direct Debit' && (
                  <div className="flex items-center gap-2 bg-emerald-900/50 p-2.5 rounded-xl border border-emerald-800">
                    <CreditCard className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span className="text-[11px] text-emerald-100">Business Card Last 4 Digits:</span>
                    <input
                      type="text"
                      maxLength={4}
                      value={cardLast4}
                      onChange={(e) => setCardLast4(e.target.value.replace(/\D/g, ''))}
                      className="w-16 px-2 py-1 rounded bg-white text-slate-900 font-mono font-bold text-xs text-center"
                    />
                  </div>
                )}

                <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={paymentConfirmed}
                    onChange={(e) => setPaymentConfirmed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded accent-amber-400"
                  />
                  <span className="text-[11px] text-emerald-100 leading-snug">
                    <strong>Authorize £9.99/month recurring subscription payment now:</strong> I confirm immediate payment of <strong>£9.99</strong> today and recurring monthly billing of £9.99/mo via {paymentMethod}.
                  </span>
                </label>
              </div>

              <div className="pt-2 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdvertiseModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!paymentConfirmed}
                  className={`px-5 py-2.5 rounded-xl font-black transition-all shadow-sm flex items-center gap-1.5 ${
                    paymentConfirmed
                      ? 'bg-[#0f5132] hover:bg-[#0c3e29] text-white cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>Pay £9.99/mo & Publish Business Advertisement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
