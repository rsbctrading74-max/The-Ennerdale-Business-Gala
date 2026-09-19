import React, { useState } from 'react';
import { TicketTier, TicketTierId } from '../types';
import { Check, ShieldCheck, Sparkles, Plus, Minus, ArrowRight, QrCode } from 'lucide-react';

interface TicketSelectionProps {
  tiers: TicketTier[];
  selectedTierId: TicketTierId;
  onSelectTierId: (id: TicketTierId) => void;
  onProceedToCheckout: (tierId: TicketTierId, quantity: number) => void;
}

export const TicketSelection: React.FC<TicketSelectionProps> = ({
  tiers,
  selectedTierId,
  onSelectTierId,
  onProceedToCheckout,
}) => {
  const [quantities, setQuantities] = useState<Record<TicketTierId, number>>({
    youth: 1,
    general: 1,
    vip: 1,
    exhibitor: 1,
  });

  const handleQuantityChange = (tierId: TicketTierId, delta: number) => {
    setQuantities((prev) => {
      const current = prev[tierId] || 1;
      const next = Math.max(1, Math.min(10, current + delta));
      return { ...prev, [tierId]: next };
    });
  };

  return (
    <section id="tickets" className="border-b border-neutral-800 bg-neutral-950 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-950/40 px-3.5 py-1 text-xs font-semibold text-amber-400 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Official Gala Passes
          </div>
          <h2 className="font-serif-gala text-3xl sm:text-4xl font-bold text-neutral-100">
            Choose Your Delegate Package
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-400 leading-relaxed">
            Strictly capped at a maximum of 400 tickets in total. Passes range from R50 Youth passes (Ages 15–25) to our accessible R100 General Delegate entry and VIP packages. Secure payments processed via Capitec Business Bank QR code & instant EFT.
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => {
            const isSelected = selectedTierId === tier.id;
            const remaining = tier.totalCapacity - tier.bookedCount;
            const isSoldOut = remaining <= 0;
            const quantity = quantities[tier.id] || 1;
            const totalZAR = tier.priceZAR * quantity;

            return (
              <div
                key={tier.id}
                onClick={() => !isSoldOut && onSelectTierId(tier.id)}
                className={`relative flex flex-col justify-between rounded-xl border p-6 transition cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-neutral-900 shadow-lg ring-1 ring-amber-400/50'
                    : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 hover:bg-neutral-900'
                } ${isSoldOut ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {/* Popular / Badge */}
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-neutral-950 shadow-sm">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      {tier.badge}
                    </span>
                    <span className="text-xs font-medium text-neutral-400">
                      {remaining} seats left
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-neutral-100 mt-2">
                    {tier.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 min-h-[32px] leading-relaxed">
                    {tier.tagline}
                  </p>

                  {/* Pricing */}
                  <div className="mt-4 flex items-baseline gap-1.5 border-y border-neutral-800/80 py-3">
                    {tier.priceZAR === 0 ? (
                      <div>
                        <span className="font-display text-3xl font-black text-emerald-400">
                          R0
                        </span>
                        <span className="text-xs text-emerald-300 font-bold ml-2 uppercase">100% Free Grant</span>
                      </div>
                    ) : (
                      <>
                        <span className="text-xs font-medium text-neutral-400">R</span>
                        <span className="font-display text-3xl font-black text-neutral-100">
                          {tier.priceZAR}
                        </span>
                        <span className="text-xs text-neutral-400">ZAR per delegate</span>
                      </>
                    )}
                  </div>

                  {/* Features list */}
                  <ul className="mt-4 space-y-2.5 text-xs text-neutral-300">
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Controls */}
                <div className="mt-6 pt-4 border-t border-neutral-800">
                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between mb-3 bg-neutral-950/80 rounded-lg p-1.5 border border-neutral-800">
                    <span className="text-xs text-neutral-400 font-medium px-2">Qty:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuantityChange(tier.id, -1);
                        }}
                        disabled={quantity <= 1 || isSoldOut}
                        className="flex h-7 w-7 items-center justify-center rounded bg-neutral-800 text-neutral-200 transition hover:bg-neutral-700 disabled:opacity-30"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-5 text-center font-bold text-sm text-neutral-100">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuantityChange(tier.id, 1);
                        }}
                        disabled={quantity >= Math.min(10, remaining) || isSoldOut}
                        className="flex h-7 w-7 items-center justify-center rounded bg-neutral-800 text-neutral-200 transition hover:bg-neutral-700 disabled:opacity-30"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    id={`book-now-${tier.id}`}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isSoldOut) onProceedToCheckout(tier.id, quantity);
                    }}
                    disabled={isSoldOut}
                    className={`w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition shadow-sm ${
                      isSelected
                        ? 'bg-amber-500 text-neutral-950 hover:bg-amber-400'
                        : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700 hover:text-white'
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    <span>
                      {isSoldOut
                        ? 'Sold Out'
                        : totalZAR === 0
                        ? 'Claim Free Pass (R0)'
                        : `Book & Pay R${totalZAR} via Capitec`}
                    </span>
                    {!isSoldOut && <ArrowRight className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bank Guarantee Banner */}
        <div className="mt-12 rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-amber-400">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-neutral-200">
                Direct Capitec QR Scan to Pay & Instant EFT
              </div>
              <p className="text-xs text-neutral-400">
                Bank: <strong>Capitec Business Bank</strong> | Account: <strong>1055553690</strong> | Name: <strong>RSBC Trading</strong> | Branch: <strong>470010</strong>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Instant Digital Ticket with verified QR check-in</span>
          </div>
        </div>
      </div>
    </section>
  );
};
