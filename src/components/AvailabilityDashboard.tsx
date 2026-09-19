import React from 'react';
import { TicketTier, TicketTierId } from '../types';
import { AlertCircle, Sparkles } from 'lucide-react';

interface AvailabilityDashboardProps {
  tiers: TicketTier[];
  onSelectTier: (tierId: TicketTierId) => void;
}

export const AvailabilityDashboard: React.FC<AvailabilityDashboardProps> = ({
  tiers,
  onSelectTier,
}) => {
  const totalCapacity = tiers.reduce((acc, t) => acc + t.totalCapacity, 0);
  const totalBooked = tiers.reduce((acc, t) => acc + t.bookedCount, 0);
  const totalRemaining = totalCapacity - totalBooked;
  const percentageBooked = Math.round((totalBooked / totalCapacity) * 100);

  return (
    <section id="availability" className="border-b border-neutral-800 bg-neutral-900/70 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-950/30 px-3 py-1 text-xs font-semibold text-amber-400 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Live Availability Tracker
            </div>
            <h2 className="font-serif-gala text-2xl sm:text-3xl font-bold text-neutral-100">
              Grace Assembly Auditorium Seating
            </h2>
            <p className="mt-1 text-sm text-neutral-400">
              Real-time allocation across gala tiers. Seating is strictly limited to a maximum of 400 registered tickets.
            </p>
          </div>

          {/* Live Status Badge */}
          <div className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950/90 px-3.5 py-2 text-xs text-neutral-300">
            <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-emerald-400 font-semibold">Official Registration Open: </span>
              <span className="text-neutral-300">All 400 auditorium seats are now open for delegate reservation</span>
            </div>
          </div>
        </div>

        {/* Big Summary Bar */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-neutral-400 font-medium">Overall Gala Capacity</div>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="font-display text-3xl font-extrabold text-neutral-100">
                  {totalBooked} <span className="text-lg font-normal text-neutral-400">/ {totalCapacity} seats</span>
                </span>
                <span className="rounded-full bg-amber-950/60 border border-amber-800/80 px-2.5 py-0.5 text-xs font-bold text-amber-400">
                  {percentageBooked}% Booked
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs uppercase tracking-wider text-neutral-400 font-medium">Available Seats Left</div>
              <div className="font-display text-2xl font-bold text-emerald-400 mt-1">
                {totalRemaining} Seats Remaining
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative h-3 w-full rounded-full bg-neutral-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 transition-all duration-700 rounded-full"
              style={{ width: `${percentageBooked}%` }}
            />
          </div>
        </div>

        {/* Tier Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((tier) => {
            const remaining = tier.totalCapacity - tier.bookedCount;
            const pct = Math.round((tier.bookedCount / tier.totalCapacity) * 100);
            const isAlmostFull = remaining <= 10;

            return (
              <div
                key={tier.id}
                className="group flex flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-950/80 p-5 transition hover:border-amber-500/50 hover:bg-neutral-900/60"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                      {tier.badge}
                    </span>
                    {isAlmostFull && (
                      <span className="inline-flex items-center gap-1 rounded bg-rose-950/80 border border-rose-800/60 px-2 py-0.5 text-[11px] font-semibold text-rose-300">
                        <AlertCircle className="h-3 w-3" />
                        Only {remaining} left!
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-base font-bold text-neutral-100 group-hover:text-amber-400 transition">
                    {tier.name}
                  </h3>
                  <div className="mt-1 text-xs text-neutral-400 line-clamp-1">{tier.tagline}</div>

                  <div className="mt-3 flex items-baseline gap-1">
                    {tier.priceZAR === 0 ? (
                      <>
                        <span className="font-display text-2xl font-black text-emerald-400">
                          R0
                        </span>
                        <span className="text-xs text-emerald-300 font-bold ml-1">FREE GRANT PASS</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xs text-neutral-400 font-semibold">ZAR</span>
                        <span className="font-display text-2xl font-black text-amber-400">
                          R{tier.priceZAR}
                        </span>
                        <span className="text-xs text-neutral-400">/ ticket</span>
                      </>
                    )}
                  </div>

                  {/* Micro Progress */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-neutral-400 mb-1.5">
                      <span>{tier.bookedCount} allocated</span>
                      <span className="font-semibold text-neutral-200">{remaining} remaining</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isAlmostFull ? 'bg-rose-500' : 'bg-amber-400'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  id={`select-tier-${tier.id}`}
                  onClick={() => onSelectTier(tier.id)}
                  disabled={remaining === 0}
                  className="mt-5 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs font-semibold text-neutral-200 transition hover:border-amber-400 hover:bg-amber-500 hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {remaining === 0 ? 'Sold Out' : `Select ${tier.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
