import React from 'react';
import { BANK_DETAILS } from '../data/initialData';
import { Calendar, MapPin, Mail, ShieldCheck, Ticket, Building2, Code2, Download } from 'lucide-react';

interface FooterProps {
  onOpenFindTicket: () => void;
  onOpenPortal: () => void;
  onSelectTickets: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenFindTicket,
  onOpenPortal,
  onSelectTickets,
}) => {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 py-12 sm:py-16 text-neutral-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Event Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                <Ticket className="h-5 w-5" />
              </div>
              <span className="font-serif-gala text-base font-bold text-neutral-100">
                The Ennerdale Business Gala
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Presented collaboratively by <strong>Future Coding Core</strong> and <strong>RSBC Trading</strong>.
              Catalyzing youth digital mastery and SMME commercial trade across Region G, Johannesburg.
            </p>
            <div className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>Friday, 31 October • Grace Assembly Church</span>
            </div>
          </div>

          {/* Column 2: Capitec Bank Details */}
          <div className="space-y-3 text-xs">
            <div className="font-bold text-neutral-100 uppercase tracking-wider text-xs">
              Official Banking Details
            </div>
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3 space-y-1.5 text-neutral-300">
              <div>
                <span className="text-neutral-500">Bank:</span> <strong>{BANK_DETAILS.bankName}</strong>
              </div>
              <div>
                <span className="text-neutral-500">Account Name:</span> <strong>{BANK_DETAILS.accountName}</strong>
              </div>
              <div>
                <span className="text-neutral-500">Account No:</span>{' '}
                <strong className="font-mono text-amber-400">{BANK_DETAILS.accountNumber}</strong>
              </div>
              <div>
                <span className="text-neutral-500">Branch Code:</span>{' '}
                <strong className="font-mono">{BANK_DETAILS.branchCode}</strong>
              </div>
              <div className="text-[11px] text-neutral-400 pt-1 border-t border-neutral-800">
                Direct QR & EFT payments supported.
              </div>
            </div>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-3 text-xs">
            <div className="font-bold text-neutral-100 uppercase tracking-wider text-xs">
              Quick Links
            </div>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <a href="#availability" className="hover:text-amber-400 transition">
                  Live Seat Availability (400 Max)
                </a>
              </li>
              <li>
                <a href="#tickets" className="hover:text-amber-400 transition">
                  Tickets (From R50)
                </a>
              </li>
              <li>
                <a href="#local-insights" className="hover:text-amber-400 transition">
                  Ennerdale & Region G Insights
                </a>
              </li>
              <li>
                <a href="#schedule" className="hover:text-amber-400 transition">
                  Gala Event Schedule
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenFindTicket}
                  className="hover:text-amber-400 transition text-left flex items-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5 text-amber-400" />
                  <span>Download Your Door Ticket</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPortal}
                  className="hover:text-amber-400 transition text-left"
                >
                  Attendee Management Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Venue */}
          <div className="space-y-3 text-xs">
            <div className="font-bold text-neutral-100 uppercase tracking-wider text-xs">
              Contact & Inquiries
            </div>
            <div className="space-y-2 text-neutral-300">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                <a
                  href={`mailto:${BANK_DETAILS.paymentNoticeEmail}`}
                  className="hover:text-amber-400 transition underline underline-offset-2"
                >
                  {BANK_DETAILS.paymentNoticeEmail}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  Grace Assembly Church, 6th Ave & CNR Percy Street, Ennerdale, Johannesburg South
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onSelectTickets}
                className="w-full rounded-lg bg-amber-500 py-2 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition shadow"
              >
                Book Gala Tickets Now
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-neutral-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © 2026 The Ennerdale Business Gala. Hosted with pride by Future Coding Core & RSBC Trading.
          </div>
          <div className="flex items-center gap-4">
            <span>Ennerdale • Finetown • Lawley • Lenasia South</span>
            <span>•</span>
            <span>Region G, JHB</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
