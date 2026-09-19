import React from 'react';
import { GALA_SCHEDULE, BANK_DETAILS } from '../data/initialData';
import { Clock, MapPin, Calendar, Award, Sparkles, Navigation, ShieldCheck, Phone, Mail, MessageSquare } from 'lucide-react';

export const EventSchedule: React.FC = () => {
  return (
    <section id="schedule" className="border-b border-neutral-800 bg-neutral-950 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-950/40 px-3.5 py-1 text-xs font-semibold text-amber-400 mb-3">
            <Calendar className="h-3.5 w-3.5" />
            <span>Evening Itinerary</span>
          </div>
          <h2 className="font-serif-gala text-3xl sm:text-4xl font-bold text-neutral-100">
            Official Gala Program • 31 October
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-400">
            Grace Assembly Church • 6th Ave and CNR Percy Street, Ennerdale
          </p>
        </div>

        {/* Schedule Timeline */}
        <div className="max-w-4xl mx-auto space-y-4">
          {GALA_SCHEDULE.map((item, idx) => (
            <div
              key={idx}
              className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 transition hover:border-amber-500/40 hover:bg-neutral-900"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-amber-400 border border-neutral-800 font-mono text-xs font-bold text-center leading-tight">
                  <Clock className="h-5 w-5 text-amber-400" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-amber-400">
                      {item.time}
                    </span>
                    <span className="rounded bg-neutral-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-300">
                      {item.type}
                    </span>
                  </div>

                  <h3 className="font-display text-base sm:text-lg font-bold text-neutral-100">
                    {item.title}
                  </h3>

                  <p className="text-xs text-neutral-400 mt-1 max-w-xl leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="sm:text-right shrink-0 border-t sm:border-t-0 border-neutral-800 pt-2 sm:pt-0 w-full sm:w-auto">
                <div className="text-xs font-semibold text-neutral-200">{item.speaker}</div>
                <div className="text-[11px] text-amber-400/90">{item.designation}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Venue Location Guide & Interactive Directions Block */}
        <div id="venue" className="mt-16 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <MapPin className="h-4 w-4" />
                <span>Venue & Security Logistics</span>
              </div>
              <h3 className="font-display text-xl font-bold text-neutral-100">
                Grace Assembly Church, Ennerdale
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-lg">
                Intersection of <strong>6th Avenue and Percy Street</strong>, Ennerdale, Johannesburg South.
                Ample secure parking with dedicated community security patrols and access control.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <a
                href="https://maps.google.com/?q=6th+Avenue+and+Percy+Street+Ennerdale+Johannesburg"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition shadow"
              >
                <Navigation className="h-4 w-4" />
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-neutral-300">
            <div>
              <strong className="text-neutral-100 block mb-0.5">From Golden Highway (R553):</strong>
              Turn onto James Street or Provincial Rd into 6th Ave. Approximately 4 mins.
            </div>
            <div>
              <strong className="text-neutral-100 block mb-0.5">From R82 Corridor / Walkerville:</strong>
              Follow R82 North and connect via Walkerville Rd towards Ennerdale East.
            </div>
            <div>
              <strong className="text-neutral-100 block mb-0.5">Dress Code:</strong>
              Black Tie / Executive Traditional African Elegance.
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400">
            <span className="font-semibold text-neutral-300">RSVP & Logistics Helpline:</span>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={`tel:${BANK_DETAILS.contactPhone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-1.5 text-amber-400 hover:underline font-mono"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>{BANK_DETAILS.contactPhone}</span>
              </a>
              <a
                href={BANK_DETAILS.contactWhatsApp || 'https://wa.me/27621013195'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-400 hover:underline"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>WhatsApp Hotline</span>
              </a>
              <a
                href={`mailto:${BANK_DETAILS.paymentNoticeEmail}`}
                className="inline-flex items-center gap-1.5 text-neutral-300 hover:text-amber-400 hover:underline"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>{BANK_DETAILS.paymentNoticeEmail}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
