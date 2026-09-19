import React from 'react';
import { Calendar, MapPin, Download, Users, ShieldCheck, Ticket } from 'lucide-react';

interface NavbarProps {
  onOpenFindTicket: () => void;
  onOpenPortal: () => void;
  onSelectTickets: () => void;
  totalSeatsRemaining: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenFindTicket,
  onOpenPortal,
  onSelectTickets,
  totalSeatsRemaining,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-amber-500/40 bg-neutral-900 text-amber-400 shadow-sm">
            <Ticket className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-gala text-base sm:text-lg font-bold tracking-wide text-neutral-100">
                The Ennerdale Business Gala
              </span>
              <span className="hidden sm:inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/60">
                31 Oct
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Future Coding Core & RSBC Trading
            </p>
          </div>
        </div>

        {/* Center / Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-300">
          <a href="#availability" className="transition hover:text-amber-400">
            Availability (400 Max)
          </a>
          <a href="#tickets" className="transition hover:text-amber-400">
            Tickets (From R50)
          </a>
          <a href="#local-insights" className="transition hover:text-amber-400">
            Local Insights
          </a>
          <a href="#schedule" className="transition hover:text-amber-400">
            Schedule
          </a>
          <a href="#venue" className="transition hover:text-amber-400">
            Venue
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Find & Download Ticket Button */}
          <button
            id="nav-download-ticket-btn"
            onClick={onOpenFindTicket}
            className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-neutral-900 px-3 py-2 text-xs sm:text-sm font-medium text-amber-300 transition hover:border-amber-400 hover:bg-neutral-800 hover:text-amber-200"
            title="Search and download your door ticket"
          >
            <Download className="h-4 w-4 text-amber-400" />
            <span className="hidden sm:inline">Download Ticket</span>
            <span className="sm:hidden">Ticket</span>
          </button>

          {/* Admin / Portal */}
          <button
            id="nav-portal-btn"
            onClick={onOpenPortal}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs sm:text-sm font-medium text-neutral-200 transition hover:border-amber-500/50 hover:bg-neutral-800 hover:text-white"
            title="Open attendee management portal"
          >
            <Users className="h-4 w-4 text-amber-400" />
            <span className="hidden sm:inline">Portal</span>
          </button>

          {/* Buy Ticket CTA */}
          <button
            id="nav-book-btn"
            onClick={onSelectTickets}
            className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs sm:text-sm font-semibold text-neutral-950 transition hover:bg-amber-400 shadow-sm"
          >
            <span>Book Tickets</span>
            <span className="hidden lg:inline text-xs rounded-full bg-neutral-950/20 px-2 py-0.5 font-bold">
              {totalSeatsRemaining} left
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
