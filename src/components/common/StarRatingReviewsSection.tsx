import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Star, ShieldCheck, MessageSquarePlus, CheckCircle2, Sparkles, Award } from 'lucide-react';

interface StarRatingReviewsSectionProps {
  targetId: string;
  targetType: 'walker' | 'kennel';
  targetName: string;
  baseRating: number;
  baseReviewCount: number;
  defaultServiceType?: string;
  compact?: boolean;
}

export const StarRatingReviewsSection: React.FC<StarRatingReviewsSectionProps> = ({
  targetId,
  targetType,
  targetName,
  baseRating,
  baseReviewCount,
  defaultServiceType,
  compact = false,
}) => {
  const {
    getProviderRatingStats,
    addServiceReview,
    activeHouseholdMember,
    dogs,
  } = useMarketplace();

  const stats = getProviderRatingStats(targetId, baseRating, baseReviewCount);

  const [showWriteForm, setShowWriteForm] = useState(false);
  const [selectedStars, setSelectedStars] = useState<number>(5);
  const [hoverStars, setHoverStars] = useState<number>(0);
  const [serviceType, setServiceType] = useState(
    defaultServiceType || (targetType === 'walker' ? 'Group Pack Walk (60m)' : 'Overnight Boarding Suite')
  );
  const [selectedDog, setSelectedDog] = useState(dogs[0]?.name || 'Buster');
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    addServiceReview({
      targetId,
      targetType,
      targetName,
      reviewerName: activeHouseholdMember?.name || 'Verified Dog Owner',
      reviewerAvatar:
        activeHouseholdMember?.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      dogName: selectedDog,
      dogNames: [selectedDog],
      rating: selectedStars,
      serviceName: serviceType,
      serviceType,
      comment: comment.trim(),
    });

    setComment('');
    setSelectedStars(5);
    setShowWriteForm(false);
  };

  return (
    <div className="rounded-2xl border border-amber-200/90 bg-gradient-to-br from-amber-50/60 via-white to-emerald-50/30 p-4 sm:p-5 space-y-4 shadow-2xs">
      {/* Top Aggregated Rating Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200/60">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 flex flex-col items-center justify-center shadow-xs shrink-0 border border-amber-500/40">
            <span className="text-xl font-black tabular-nums leading-none">
              {stats.averageRating.toFixed(2)}
            </span>
            <div className="flex items-center gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-2.5 h-2.5 ${
                    s <= Math.round(stats.averageRating)
                      ? 'text-slate-950 fill-slate-950'
                      : 'text-slate-950/30'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-700" />
                <span>Aggregated Star Score</span>
              </span>
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{stats.totalReviews} Verified Reviews</span>
              </span>
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">
              {targetName} — Verified Service Rating ({stats.averageRating.toFixed(2)} / 5.00 ★)
            </h4>
            <p className="text-[11px] text-slate-600">
              Calculated live from verified dog owner star ratings and completed bookings.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowWriteForm(!showWriteForm)}
          className="px-3.5 py-2 rounded-xl bg-[#0f5132] hover:bg-[#0c3e29] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-center shrink-0 cursor-pointer"
        >
          <MessageSquarePlus className="w-3.5 h-3.5 text-amber-400" />
          <span>{showWriteForm ? 'Cancel Review' : 'Leave a Star Rating'}</span>
        </button>
      </div>

      {/* 5-Star Distribution Bars */}
      {!compact && (
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 bg-white/80 p-3 rounded-xl border border-slate-200/80">
          {stats.starBreakdown.map((row) => (
            <div
              key={row.stars}
              className="flex items-center justify-between sm:flex-col sm:items-start gap-1.5 p-2 rounded-lg bg-slate-50/80 border border-slate-100 text-[11px]"
            >
              <div className="flex items-center gap-1 font-bold text-slate-800">
                <span>{row.stars}</span>
                <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                <span className="text-slate-400 font-normal">({row.count})</span>
              </div>
              <div className="w-28 sm:w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-300"
                  style={{ width: `${row.percentage}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-slate-500 tabular-nums">
                {row.percentage}%
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Star Review Submission Form */}
      {showWriteForm && (
        <form
          onSubmit={handleSubmit}
          className="p-4 rounded-2xl bg-white border-2 border-emerald-500/40 space-y-3 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Rate {targetName} (1 to 5 Stars)</span>
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Updates Average Score Immediately
            </span>
          </div>

          {/* Interactive Star Picker */}
          <div className="flex items-center gap-2 py-1">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((starVal) => {
                const active = (hoverStars || selectedStars) >= starVal;
                return (
                  <button
                    key={starVal}
                    type="button"
                    onMouseEnter={() => setHoverStars(starVal)}
                    onMouseLeave={() => setHoverStars(0)}
                    onClick={() => setSelectedStars(starVal)}
                    className="p-1 rounded-lg hover:bg-amber-50 transition-transform hover:scale-110 cursor-pointer"
                    title={`Rate ${starVal} Star${starVal > 1 ? 's' : ''}`}
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        active ? 'text-amber-500 fill-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <span className="text-xs font-extrabold text-slate-900 ml-1">
              {selectedStars}.0 / 5.0 Stars
              {selectedStars === 5
                ? ' — Outstanding Care!'
                : selectedStars === 4
                ? ' — Very Good'
                : selectedStars === 3
                ? ' — Satisfactory'
                : ' — Needs Improvement'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Service Used
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-semibold text-slate-900"
              >
                {targetType === 'walker' ? (
                  <>
                    <option value="Group Pack Walk (60m)">Group Pack Walk (60m)</option>
                    <option value="Solo 1-to-1 Walk (45m)">Solo 1-to-1 Walk (45m)</option>
                    <option value="Puppy Drop-In & Play">Puppy Drop-In & Play</option>
                    <option value="Recurring Weekly Walk Plan">Recurring Weekly Walk Plan</option>
                  </>
                ) : (
                  <>
                    <option value="Overnight Luxury Boarding Suite">Overnight Luxury Boarding Suite</option>
                    <option value="Daytime Dog Sitting & Paddock Play">Daytime Dog Sitting & Paddock Play</option>
                    <option value="Weekend Countryside Retreat">Weekend Countryside Retreat</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Your Dog
              </label>
              <select
                value={selectedDog}
                onChange={(e) => setSelectedDog(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-semibold text-slate-900"
              >
                {dogs.map((d) => (
                  <option key={d.id} value={d.name}>
                    🐾 {d.name} ({d.breed})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Your Review & Experience *
            </label>
            <textarea
              rows={2}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={`Share how ${targetName} cared for ${selectedDog} (e.g., live GPS updates, photo messages, punctuality, suite cleanliness)...`}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowWriteForm(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-[#0f5132] hover:bg-[#0c3e29] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              Submit {selectedStars}-Star Review
            </button>
          </div>
        </form>
      )}

      {/* List of Recent Verified Reviews */}
      <div className="space-y-2.5">
        {stats.reviews.slice(0, compact ? 2 : 5).map((rev) => (
          <div
            key={rev.id}
            className="p-3 rounded-xl bg-white border border-slate-200/90 space-y-1.5 text-xs"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <img
                  src={
                    rev.reviewerAvatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                  }
                  alt={rev.reviewerName}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">{rev.reviewerName}</span>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                      Verified
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Dog:{' '}
                    <strong>
                      {Array.isArray(rev.dogNames) && rev.dogNames.length > 0
                        ? rev.dogNames.join(', ')
                        : rev.dogName || 'Buster'}
                    </strong>{' '}
                    · {rev.serviceType || rev.serviceName || 'Verified Service'} · {rev.date}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-0.5 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg shrink-0">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3 h-3 ${
                      s <= rev.rating ? 'text-amber-500 fill-amber-400' : 'text-slate-300'
                    }`}
                  />
                ))}
                <span className="ml-1 font-extrabold text-slate-900 text-[11px] tabular-nums">
                  {rev.rating}.0
                </span>
              </div>
            </div>

            <p className="text-slate-700 leading-relaxed text-[11px] pl-9">{rev.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
