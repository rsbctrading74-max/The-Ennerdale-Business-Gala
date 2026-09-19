import React, { useState } from 'react';
import { LOCAL_INSIGHTS } from '../data/initialData';
import { 
  Building2, Code2, TrendingUp, MapPin, Compass, ShieldCheck, 
  Lightbulb, Users, ArrowUpRight, CheckCircle2, ChevronRight, HeartHandshake 
} from 'lucide-react';

export const EnnerdaleLocalInsights: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');

  const categories = ['all', 'Community Empowerment', 'Tech Innovation', 'Trade & Procurement', 'Logistics & Venue'];

  const filtered = activeTab === 'all'
    ? LOCAL_INSIGHTS
    : LOCAL_INSIGHTS.filter((item) => item.category === activeTab);

  return (
    <section id="local-insights" className="border-b border-neutral-800 bg-neutral-900/50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-semibold text-emerald-400 mb-3">
            <HeartHandshake className="h-3.5 w-3.5" />
            <span>Community-First Regional Focus</span>
          </div>
          <h2 className="font-serif-gala text-3xl sm:text-4xl font-bold text-neutral-100">
            Ennerdale & Region G Local Insights
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-400 leading-relaxed">
            The Gala is not merely a social event—it is an economic catalyst for Ennerdale,
            Finetown, Lawley, Lenasia South, and the greater Vaal-Johannesburg South corridor.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                activeTab === cat
                  ? 'bg-amber-500 text-neutral-950 shadow-sm'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All Insights' : cat}
            </button>
          ))}
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {filtered.map((item) => {
            const isTech = item.category === 'Tech Innovation';
            const isTrade = item.category === 'Trade & Procurement';
            const isVenue = item.category === 'Logistics & Venue';

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-neutral-800 bg-neutral-950/90 p-6 sm:p-8 flex flex-col justify-between transition hover:border-amber-500/40 hover:bg-neutral-950 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="rounded-full bg-neutral-900 border border-neutral-800 px-3 py-1 text-[11px] font-semibold text-amber-400">
                      {item.category}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-amber-400 border border-neutral-800">
                      {isTech && <Code2 className="h-5 w-5 text-emerald-400" />}
                      {isTrade && <TrendingUp className="h-5 w-5 text-amber-400" />}
                      {isVenue && <MapPin className="h-5 w-5 text-rose-400" />}
                      {!isTech && !isTrade && !isVenue && <Building2 className="h-5 w-5 text-amber-400" />}
                    </div>
                  </div>

                  <h3 className="font-display text-xl font-bold text-neutral-100 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4">
                    {item.summary}
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-3.5 flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span className="text-xs text-neutral-300 font-medium leading-snug">
                    {item.highlight}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Local Ecosystem Spotlight: Future Coding Core & RSBC Trading Synergy */}
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-6 sm:p-10 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-2">
                Grassroots Economic Alliance
              </div>
              <h3 className="font-serif-gala text-2xl sm:text-3xl font-bold text-neutral-100">
                Bridging Software Innovation with Grassroots Commerce
              </h3>
              <p className="mt-3 text-sm text-neutral-300 leading-relaxed">
                By uniting <strong>Future Coding Core</strong> (empowering Ennerdale youth with high-value digital coding, cloud development, and robotics) and <strong>RSBC Trading</strong> (specializing in regional distribution, FMCG supply chain, and SMME trade), this gala builds an end-to-end corridor where local youth code the systems that power local community commerce.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-xs text-neutral-200">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold">1</div>
                  <span><strong>Mentorship & Tech Grants:</strong> Providing high school developers with hardware and internet access.</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-200">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-bold">2</div>
                  <span><strong>Direct Supplier Contracting:</strong> Introducing Ennerdale fabricators and caterers directly to enterprise procurement desks.</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-200">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20 text-sky-400 font-bold">3</div>
                  <span><strong>Capitec Business Integration:</strong> Equipping every delegate with digital payment and invoicing readiness.</span>
                </div>
              </div>
            </div>

            {/* Geographic & Community Breakdown */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/80 p-5 space-y-4">
              <div className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center justify-between">
                <span>Participating Community Hubs</span>
                <span className="text-amber-400">Region G Corridor</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800/80 flex items-center justify-between">
                  <div>
                    <strong className="text-neutral-100">Ennerdale (Ext 1 - 9) & Mid-Ennerdale</strong>
                    <div className="text-[11px] text-neutral-400">Host Community • Retail, Artisanal & Tech Pioneers</div>
                  </div>
                  <span className="font-mono text-xs text-amber-400 font-bold">120+ Delegates</span>
                </div>

                <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800/80 flex items-center justify-between">
                  <div>
                    <strong className="text-neutral-100">Finetown & Poortjie</strong>
                    <div className="text-[11px] text-neutral-400">Micro-Enterprises, FMCG Traders & Youth Scholars</div>
                  </div>
                  <span className="font-mono text-xs text-amber-400 font-bold">45 Delegates</span>
                </div>

                <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800/80 flex items-center justify-between">
                  <div>
                    <strong className="text-neutral-100">Lawley & Lenasia South</strong>
                    <div className="text-[11px] text-neutral-400">Commercial Services, Healthcare & Construction SMMEs</div>
                  </div>
                  <span className="font-mono text-xs text-amber-400 font-bold">40 Delegates</span>
                </div>

                <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800/80 flex items-center justify-between">
                  <div>
                    <strong className="text-neutral-100">Walkerville & Midvaal</strong>
                    <div className="text-[11px] text-neutral-400">Agri-Processing & Logistics Distribution</div>
                  </div>
                  <span className="font-mono text-xs text-amber-400 font-bold">20 Delegates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
