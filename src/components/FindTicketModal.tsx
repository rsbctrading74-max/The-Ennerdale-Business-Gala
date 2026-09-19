import React, { useState } from 'react';
import { Attendee, TicketTier } from '../types';
import { Search, Ticket, ArrowRight, Download, CheckCircle, X, ShieldCheck, User } from 'lucide-react';

interface FindTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendees: Attendee[];
  tiers: TicketTier[];
  onSelectTicket: (attendee: Attendee) => void;
}

export const FindTicketModal: React.FC<FindTicketModalProps> = ({
  isOpen,
  onClose,
  attendees,
  tiers,
  onSelectTicket,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();
  const matchedAttendees = trimmed
    ? attendees.filter(
        (a) =>
          a.fullName.toLowerCase().includes(trimmed) ||
          a.email.toLowerCase().includes(trimmed) ||
          a.phone.toLowerCase().includes(trimmed) ||
          a.id.toLowerCase().includes(trimmed) ||
          a.paymentReference.toLowerCase().includes(trimmed)
      )
    : attendees.slice(0, 4); // show recent 4 by default

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 text-neutral-100 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4 bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-neutral-100">
                Find & Download Door Ticket
              </h3>
              <p className="text-xs text-neutral-400">
                Present on your smartphone or print for Grace Assembly door entry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by your name, email, phone or ticket ID (e.g. EBG-7201)..."
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-amber-400 focus:outline-none"
              autoFocus
            />
          </div>

          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
            <span>{trimmed ? 'Matching Tickets' : 'Recent Registered Delegates'}</span>
            <span className="text-amber-400">{matchedAttendees.length} Found</span>
          </div>

          {/* Results List */}
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {matchedAttendees.map((att) => {
              const tier = tiers.find((t) => t.id === att.tierId);
              return (
                <div
                  key={att.id}
                  onClick={() => {
                    onSelectTicket(att);
                    onClose();
                  }}
                  className="group rounded-xl border border-neutral-800 bg-neutral-950/70 p-3.5 transition hover:border-amber-500/50 hover:bg-neutral-900 cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 text-amber-400 group-hover:bg-amber-500 group-hover:text-neutral-950 transition">
                      <Ticket className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-neutral-100 group-hover:text-amber-400 transition">
                        {att.fullName}
                      </div>
                      <div className="text-[11px] text-neutral-400 flex items-center gap-2">
                        <span>{att.companyOrAffiliation}</span>
                        <span>•</span>
                        <span className="font-mono text-amber-400 font-semibold">{att.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-right">
                    <div>
                      <span className="inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-neutral-900 border border-neutral-800 text-neutral-300">
                        {tier?.name || att.tierId}
                      </span>
                      <div className="text-[10px] text-emerald-400 font-medium mt-0.5">
                        R{att.totalPaidZAR} • {att.paymentStatus.toUpperCase()}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-neutral-500 group-hover:text-amber-400 transition shrink-0" />
                  </div>
                </div>
              );
            })}

            {matchedAttendees.length === 0 && (
              <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-6 text-center text-xs text-neutral-400">
                No registered tickets found matching "{query}".
                <div className="mt-2 text-neutral-500">
                  Try searching your surname or email, or book a new ticket package below.
                </div>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-[11px] text-neutral-400 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>
              Every ticket includes a high-resolution QR verification code for Grace Assembly Church door staff.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
