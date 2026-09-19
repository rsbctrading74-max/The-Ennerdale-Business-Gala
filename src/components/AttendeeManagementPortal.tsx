import React, { useState } from 'react';
import { Attendee, TicketTier, TicketTierId, PaymentStatus } from '../types';
import { 
  Users, Search, Filter, Download, Plus, CheckCircle, Clock, 
  XCircle, Eye, ShieldCheck, DollarSign, Building, Sparkles, X, UserPlus, FileSpreadsheet
} from 'lucide-react';

interface AttendeeManagementPortalProps {
  isOpen: boolean;
  onClose: () => void;
  attendees: Attendee[];
  tiers: TicketTier[];
  onTogglePaymentStatus: (id: string, status: PaymentStatus) => void;
  onToggleCheckIn: (id: string) => void;
  onViewTicket: (attendee: Attendee) => void;
  onAddWalkInAttendee: (newAttendee: Attendee) => void;
}

export const AttendeeManagementPortal: React.FC<AttendeeManagementPortalProps> = ({
  isOpen,
  onClose,
  attendees,
  tiers,
  onTogglePaymentStatus,
  onToggleCheckIn,
  onViewTicket,
  onAddWalkInAttendee,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Walk-in form state
  const [walkinName, setWalkinName] = useState('');
  const [walkinEmail, setWalkinEmail] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinCompany, setWalkinCompany] = useState('');
  const [walkinArea, setWalkinArea] = useState('Ennerdale');
  const [walkinTier, setWalkinTier] = useState<TicketTierId>('general');
  const [walkinPayment, setWalkinPayment] = useState<PaymentStatus>('paid');

  if (!isOpen) return null;

  // Filtered attendees
  const filtered = attendees.filter((a) => {
    const matchesSearch =
      a.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.companyOrAffiliation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.paymentReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTier = tierFilter === 'all' || a.tierId === tierFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'checked_in' && a.checkInStatus === 'checked_in') ||
      (statusFilter === 'not_checked_in' && a.checkInStatus === 'not_checked_in') ||
      (statusFilter === 'pending' && a.paymentStatus === 'pending_verification') ||
      (statusFilter === 'paid' && a.paymentStatus === 'paid');

    return matchesSearch && matchesTier && matchesStatus;
  });

  // Analytics Metrics
  const totalRevenue = attendees.reduce((acc, a) => acc + (a.paymentStatus === 'paid' ? a.totalPaidZAR : 0), 0);
  const checkedInTotal = attendees.filter((a) => a.checkInStatus === 'checked_in').length;
  const pendingEftCount = attendees.filter((a) => a.paymentStatus === 'pending_verification').length;

  const handleExportCSV = () => {
    const headers = ['Ticket ID', 'Name', 'Email', 'Phone', 'Company', 'Area', 'Tier', 'Amount (ZAR)', 'Payment Status', 'Check-In Status', 'Check-In Time', 'Reference'];
    const rows = attendees.map((a) => [
      a.id,
      `"${a.fullName}"`,
      `"${a.email}"`,
      `"${a.phone}"`,
      `"${a.companyOrAffiliation}"`,
      `"${a.area}"`,
      a.tierId,
      a.totalPaidZAR,
      a.paymentStatus,
      a.checkInStatus,
      a.checkInTime || '',
      a.paymentReference,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Ennerdale_Gala_Attendees_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName.trim()) return;

    const tierData = tiers.find((t) => t.id === walkinTier);
    const rand = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `EBG-${rand}`;
    const ref = `WALK-EBG-${rand}`;

    const newAttendee: Attendee = {
      id: ticketId,
      fullName: walkinName.trim(),
      email: walkinEmail.trim() || 'cash.walkin@ennerdalegala.co.za',
      phone: walkinPhone.trim() || 'Door Registration',
      companyOrAffiliation: walkinCompany.trim() || 'Local Guest',
      area: walkinArea,
      tierId: walkinTier,
      quantity: 1,
      totalPaidZAR: walkinPayment === 'paid' ? (tierData?.priceZAR ?? 100) : 0,
      paymentMethod: 'card_instant',
      paymentReference: ref,
      paymentStatus: walkinPayment,
      checkInStatus: 'checked_in', // usually walk-ins are admitted immediately
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dietaryPreference: 'Standard',
      registrationDate: new Date().toISOString().split('T')[0],
      notes: 'On-site door registration',
      qrPayload: `${ticketId}|${walkinName.trim()}|${walkinTier}|${walkinPayment}|${ref}`,
    };

    onAddWalkInAttendee(newAttendee);
    setIsAddModalOpen(false);
    setWalkinName('');
    setWalkinEmail('');
    setWalkinPhone('');
    setWalkinCompany('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl rounded-2xl border border-neutral-800 bg-neutral-900 text-neutral-100 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4 bg-neutral-950 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-neutral-100 flex items-center gap-2">
                <span>Attendee Management Portal</span>
                <span className="rounded-full bg-amber-950 border border-amber-800/80 px-2 py-0.5 text-xs font-bold text-amber-400">
                  Organizer Access
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                The Ennerdale Business Gala • Future Coding Core & RSBC Trading
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="hidden sm:flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:bg-neutral-700 transition"
              title="Download attendee list as CSV"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Add Walk-In</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 sm:p-6 bg-neutral-950/40 border-b border-neutral-800 shrink-0">
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5">
            <div className="text-[11px] uppercase tracking-wider text-neutral-400">Total Delegates</div>
            <div className="font-display text-xl sm:text-2xl font-black text-neutral-100 mt-1">
              {attendees.length} <span className="text-xs font-normal text-neutral-500">registered</span>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5">
            <div className="text-[11px] uppercase tracking-wider text-neutral-400">Verified Revenue (ZAR)</div>
            <div className="font-display text-xl sm:text-2xl font-black text-amber-400 mt-1">
              R{totalRevenue.toLocaleString()}
            </div>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5">
            <div className="text-[11px] uppercase tracking-wider text-neutral-400">Door Admissions</div>
            <div className="font-display text-xl sm:text-2xl font-black text-emerald-400 mt-1">
              {checkedInTotal} <span className="text-xs font-normal text-neutral-500">checked in ({Math.round((checkedInTotal / Math.max(1, attendees.length)) * 100)}%)</span>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5">
            <div className="text-[11px] uppercase tracking-wider text-neutral-400">Pending EFT Proof</div>
            <div className={`font-display text-xl sm:text-2xl font-black mt-1 ${pendingEftCount > 0 ? 'text-amber-400' : 'text-neutral-400'}`}>
              {pendingEftCount} <span className="text-xs font-normal text-neutral-500">to verify</span>
            </div>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 sm:px-6 bg-neutral-900 border-b border-neutral-800 shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, company, ticket ID, or reference..."
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 pl-9 pr-3 py-2 text-xs sm:text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-neutral-200 focus:border-amber-400 focus:outline-none"
            >
              <option value="all">All Tiers</option>
              <option value="youth">Youth Pass (Ages 15–25)</option>
              <option value="general">General Delegate</option>
              <option value="vip">VIP Executive</option>
              <option value="exhibitor">Exhibitor Stand</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-neutral-200 focus:border-amber-400 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="checked_in">Checked In Only</option>
              <option value="not_checked_in">Not Checked In</option>
              <option value="pending">Pending Payment</option>
              <option value="paid">Paid & Verified</option>
            </select>
          </div>
        </div>

        {/* Attendee Table */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="rounded-xl border border-neutral-800 overflow-hidden bg-neutral-950">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-neutral-900/90 text-neutral-400 uppercase tracking-wider font-semibold border-b border-neutral-800">
                <tr>
                  <th className="px-4 py-3">Delegate</th>
                  <th className="px-4 py-3">Company & Area</th>
                  <th className="px-4 py-3">Tier</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Admission</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80">
                {filtered.map((att) => (
                  <tr key={att.id} className="hover:bg-neutral-900/50 transition">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-neutral-100">{att.fullName}</div>
                      <div className="text-[11px] text-neutral-400">{att.email}</div>
                      <div className="text-[10px] font-mono text-amber-400">{att.id}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="text-neutral-200">{att.companyOrAffiliation}</div>
                      <div className="text-[11px] text-neutral-400">{att.area}</div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-block rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-neutral-900 border border-neutral-700 text-amber-400">
                        {att.tierId}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {att.paymentStatus === 'paid' && (
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                            <CheckCircle className="h-3 w-3" /> Paid (R{att.totalPaidZAR})
                          </span>
                        )}
                        {att.paymentStatus === 'pending_verification' && (
                          <button
                            onClick={() => onTogglePaymentStatus(att.id, 'paid')}
                            className="inline-flex items-center gap-1 rounded bg-amber-950/80 border border-amber-800 px-2 py-0.5 text-[11px] font-bold text-amber-300 hover:bg-amber-900"
                            title="Click to approve payment"
                          >
                            <Clock className="h-3 w-3" /> Approve EFT
                          </button>
                        )}
                        {att.paymentStatus === 'comp' && (
                          <span className="inline-flex items-center rounded bg-neutral-800 px-2 py-0.5 text-[11px] font-semibold text-neutral-300">
                            Comp
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                        {att.paymentReference}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      {att.checkInStatus === 'checked_in' ? (
                        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>Admitted ({att.checkInTime || '18:00'})</span>
                        </div>
                      ) : (
                        <span className="text-neutral-500 text-[11px]">Pending Arrival</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Check-In Toggle */}
                        <button
                          type="button"
                          onClick={() => onToggleCheckIn(att.id)}
                          className={`rounded px-2.5 py-1 text-[11px] font-semibold transition ${
                            att.checkInStatus === 'checked_in'
                              ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                              : 'bg-emerald-500 text-neutral-950 hover:bg-emerald-400'
                          }`}
                        >
                          {att.checkInStatus === 'checked_in' ? 'Undo Check-in' : 'Admit'}
                        </button>

                        {/* View Pass */}
                        <button
                          type="button"
                          onClick={() => onViewTicket(att)}
                          className="rounded p-1 text-neutral-400 hover:bg-neutral-800 hover:text-amber-400 transition"
                          title="View Digital Pass"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                      No attendees found matching current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 px-6 bg-neutral-950 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 shrink-0">
          <div>
            Showing {filtered.length} of {attendees.length} registered delegates
          </div>
          <div>
            Capitec Merchant Integration • RSBC Trading (Acc: 1055553690)
          </div>
        </div>
      </div>

      {/* MODAL: ADD WALK-IN ATTENDEE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-950/90 backdrop-blur">
          <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
              <h4 className="font-display font-bold text-sm text-neutral-100 flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-amber-400" />
                <span>Issue Door / Walk-In Pass</span>
              </h4>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWalkIn} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Delegate Name *</label>
                <input
                  type="text"
                  required
                  value={walkinName}
                  onChange={(e) => setWalkinName(e.target.value)}
                  placeholder="e.g. Sipho Nkosi"
                  className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Company / Organization</label>
                <input
                  type="text"
                  value={walkinCompany}
                  onChange={(e) => setWalkinCompany(e.target.value)}
                  placeholder="e.g. Ennerdale Transport Logistics"
                  className="w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Tier</label>
                  <select
                    value={walkinTier}
                    onChange={(e) => setWalkinTier(e.target.value as TicketTierId)}
                    className="w-full rounded border border-neutral-700 bg-neutral-950 px-2.5 py-2 text-neutral-100 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="youth">Youth Pass (Ages 15–25)</option>
                    <option value="general">General Delegate</option>
                    <option value="vip">VIP Executive</option>
                    <option value="exhibitor">Exhibitor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Payment</label>
                  <select
                    value={walkinPayment}
                    onChange={(e) => setWalkinPayment(e.target.value as PaymentStatus)}
                    className="w-full rounded border border-neutral-700 bg-neutral-950 px-2.5 py-2 text-neutral-100 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="paid">Cash Paid at Door</option>
                    <option value="comp">Complimentary VIP Guest</option>
                    <option value="pending_verification">EFT Pending</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 rounded border border-neutral-700 bg-neutral-800 py-2 text-neutral-300 hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded bg-amber-500 py-2 font-bold text-neutral-950 hover:bg-amber-400 shadow"
                >
                  Issue & Admit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
