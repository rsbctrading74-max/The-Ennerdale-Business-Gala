import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, ShieldCheck, Sparkles, Building2, Code2, ArrowRight, Download } from 'lucide-react';

interface HeroSectionProps {
  onBookClick: () => void;
  onExploreInsights: () => void;
  onOpenFindTicket?: () => void;
  totalSeatsRemaining: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onBookClick,
  onExploreInsights,
  onOpenFindTicket,
  totalSeatsRemaining,
}) => {
  // Countdown to 31 October
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 42,
    hours: 14,
    minutes: 25,
    seconds: 10,
  });

  useEffect(() => {
    // Target: October 31 at 17:30
    const target = new Date();
    target.setMonth(9); // October (0-indexed)
    target.setDate(31);
    target.setHours(17, 30, 0, 0);

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target.getTime() - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-neutral-800 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950 py-16 sm:py-24">
      {/* Subtle geometric background accents */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="absolute top-1/2 -left-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Host Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900/80 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-neutral-300 shadow-sm backdrop-blur">
            <Code2 className="h-4 w-4 text-emerald-400" />
            <span>Presented by <strong>Future Coding Core</strong></span>
          </div>
          <span className="text-neutral-500 font-bold">&</span>
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900/80 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-neutral-300 shadow-sm backdrop-blur">
            <Building2 className="h-4 w-4 text-amber-400" />
            <span><strong>RSBC Trading</strong></span>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-950/40 px-3 py-1 text-xs font-semibold text-amber-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Official Annual Gala</span>
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-serif-gala text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-100 leading-tight">
            The Ennerdale <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
              Business Gala
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg lg:text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Uniting entrepreneurs, youth tech pioneers, and local enterprises across Ennerdale,
            Finetown, Lawley, and Region G for an unforgettable evening of procurement, networking, and celebration.
          </p>

          {/* Key Event Badges: Date & Venue */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 rounded-lg border border-neutral-800 bg-neutral-900/90 px-4 py-2.5 text-neutral-200 shadow-sm">
              <Calendar className="h-4 w-4 text-amber-400" />
              <span>
                <strong>Friday, 31 October</strong> • 17:30 for 18:00
              </span>
            </div>

            <div className="flex items-center gap-2.5 rounded-lg border border-neutral-800 bg-neutral-900/90 px-4 py-2.5 text-neutral-200 shadow-sm">
              <MapPin className="h-4 w-4 text-amber-400" />
              <span>
                <strong>Grace Assembly Church</strong>, 6th Ave & CNR Percy Street, Ennerdale
              </span>
            </div>

            <div className="flex items-center gap-2.5 rounded-lg border border-emerald-900/40 bg-emerald-950/30 px-4 py-2.5 text-emerald-300 shadow-sm">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Capitec Business Bank Verified (Acc: 1055553690)</span>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="mt-10 rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-4 sm:p-6 max-w-xl mx-auto backdrop-blur">
            <div className="text-xs uppercase tracking-widest text-neutral-400 mb-3 font-semibold">
              Event Countdown To 31 October
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
              <div className="rounded-lg bg-neutral-950/80 p-2 sm:p-3 border border-neutral-800">
                <div className="font-display text-2xl sm:text-3xl font-extrabold text-amber-400">{timeLeft.days}</div>
                <div className="text-[10px] sm:text-xs uppercase tracking-wider text-neutral-400 mt-1">Days</div>
              </div>
              <div className="rounded-lg bg-neutral-950/80 p-2 sm:p-3 border border-neutral-800">
                <div className="font-display text-2xl sm:text-3xl font-extrabold text-amber-400">{timeLeft.hours}</div>
                <div className="text-[10px] sm:text-xs uppercase tracking-wider text-neutral-400 mt-1">Hours</div>
              </div>
              <div className="rounded-lg bg-neutral-950/80 p-2 sm:p-3 border border-neutral-800">
                <div className="font-display text-2xl sm:text-3xl font-extrabold text-amber-400">{timeLeft.minutes}</div>
                <div className="text-[10px] sm:text-xs uppercase tracking-wider text-neutral-400 mt-1">Minutes</div>
              </div>
              <div className="rounded-lg bg-neutral-950/80 p-2 sm:p-3 border border-neutral-800">
                <div className="font-display text-2xl sm:text-3xl font-extrabold text-amber-400">{timeLeft.seconds}</div>
                <div className="text-[10px] sm:text-xs uppercase tracking-wider text-neutral-400 mt-1">Seconds</div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="hero-reserve-btn"
              onClick={onBookClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 py-3.5 text-sm sm:text-base font-bold text-neutral-950 transition hover:bg-amber-400 shadow-md"
            >
              <span>Reserve Your Tickets</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {onOpenFindTicket && (
              <button
                id="hero-download-ticket-btn"
                onClick={onOpenFindTicket}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-amber-500/40 bg-neutral-900/90 px-6 py-3.5 text-sm sm:text-base font-bold text-amber-300 transition hover:bg-neutral-800 hover:border-amber-400 hover:text-amber-200"
              >
                <Download className="h-4 w-4 text-amber-400" />
                <span>Download Door Ticket</span>
              </button>
            )}

            <button
              id="hero-insights-btn"
              onClick={onExploreInsights}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900 px-6 py-3.5 text-sm sm:text-base font-semibold text-neutral-200 transition hover:bg-neutral-800 hover:text-white hover:border-neutral-600"
            >
              <span>Ennerdale Local Insights</span>
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs text-neutral-400">
            <span className="rounded-full bg-neutral-900 border border-neutral-800 px-3 py-1 text-neutral-300">
              Capacity: <strong className="text-amber-400">Max 400 Tickets Total</strong>
            </span>
            <span className="rounded-full bg-neutral-900 border border-neutral-800 px-3 py-1 text-neutral-300">
              Pricing: <strong className="text-emerald-400">From R50 (Youth 15–25) & R100 (General)</strong>
            </span>
            <span className="rounded-full bg-neutral-900 border border-neutral-800 px-3 py-1 text-neutral-300">
              Real-time: <strong className="text-amber-400">{totalSeatsRemaining} Left</strong>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
