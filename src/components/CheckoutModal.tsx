import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { TicketTier, Attendee } from '../types';
import { BANK_DETAILS } from '../data/initialData';
import { generateQrCodeDataUrl, buildCapitecQrPayload, generateReferenceCode } from '../utils/qrUtils';
import { X, Check, Copy, ShieldCheck, QrCode, Building, ArrowRight, Download, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: TicketTier;
  quantity: number;
  onBookingComplete: (newAttendee: Attendee) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  tier,
  quantity,
  onBookingComplete,
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');

  // Attendee Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [area, setArea] = useState('Ennerdale Ext 3');
  const [dietary, setDietary] = useState('Standard');
  const [sponsorAddon, setSponsorAddon] = useState(false);

  // Generated payment reference & QR
  const [referenceCode, setReferenceCode] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdAttendee, setCreatedAttendee] = useState<Attendee | null>(null);

  const baseTotal = tier.priceZAR * quantity;
  const grandTotal = baseTotal + (sponsorAddon ? 100 : 0);

  // Reset or initialize on open
  useEffect(() => {
    if (isOpen) {
      setStep('details');
      const ref = generateReferenceCode();
      setReferenceCode(ref);
      setIsProcessing(false);
    }
  }, [isOpen]);

  // Generate dynamic QR code whenever we enter payment step
  useEffect(() => {
    if (step === 'payment' && referenceCode) {
      const payload = buildCapitecQrPayload(
        BANK_DETAILS.accountNumber,
        BANK_DETAILS.accountName,
        referenceCode,
        grandTotal
      );
      generateQrCodeDataUrl(payload, { width: 340 }).then((url) => {
        setQrDataUrl(url);
      });
    }
  }, [step, referenceCode, grandTotal]);

  if (!isOpen) return null;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      alert('Please fill in your name, email, and phone number.');
      return;
    }
    if (grandTotal === 0) {
      handleFinalizePayment('comp_pass');
    } else {
      setStep('payment');
    }
  };

  const handleFinalizePayment = (method: 'capitec_qr' | 'capitec_eft' | 'card_instant' | 'comp_pass') => {
    setIsProcessing(true);

    setTimeout(() => {
      const ticketId = referenceCode.replace('RSBC-', '');
      const newAttendee: Attendee = {
        id: ticketId,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        companyOrAffiliation: company.trim() || 'Independent Entrepreneur',
        area,
        tierId: tier.id,
        quantity,
        totalPaidZAR: grandTotal,
        paymentMethod: method,
        paymentReference: referenceCode,
        paymentStatus: 'paid',
        checkInStatus: 'not_checked_in',
        dietaryPreference: dietary,
        registrationDate: new Date().toISOString().split('T')[0],
        notes: sponsorAddon ? 'Includes R100 Youth Tech sponsorship contribution' : undefined,
        qrPayload: `${ticketId}|${fullName.trim()}|${tier.id}|paid|${referenceCode}`,
      };

      setCreatedAttendee(newAttendee);
      setIsProcessing(false);
      setStep('success');

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#ffffff'],
        });
      } catch (err) {
        console.error(err);
      }

      onBookingComplete(newAttendee);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 text-neutral-100 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4 bg-neutral-950/60">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
              <QrCode className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-neutral-100">
                {step === 'details' && 'Delegate Registration'}
                {step === 'payment' && 'Capitec Business Secure Payment'}
                {step === 'success' && 'Registration Confirmed!'}
              </h3>
              <p className="text-xs text-neutral-400">
                The Ennerdale Business Gala • 31 Oct • Grace Assembly Church
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* STEP 1: DELEGATE DETAILS */}
          {step === 'details' && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              {/* Order Summary Pill */}
              <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-3.5 flex items-center justify-between text-xs sm:text-sm">
                <div>
                  <span className="font-bold text-neutral-200">{tier.name}</span>
                  <span className="text-neutral-400"> × {quantity} seat{quantity > 1 ? 's' : ''}</span>
                </div>
                <div className="font-display font-black text-amber-400 text-base">
                  Total: R{grandTotal} ZAR
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Primary Attendee Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Kgosi Mokoena"
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Email Address (for Digital Ticket) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. kgosi@business.co.za"
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Mobile / WhatsApp Contact *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 082 555 1234"
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Company / Organization / Trade
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Ennerdale Logistics / RSBC Partner"
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Community / Area
                  </label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Ennerdale Ext 1-3">Ennerdale (Ext 1 - 3)</option>
                    <option value="Ennerdale Ext 4-9">Ennerdale (Ext 4 - 9)</option>
                    <option value="Mid-Ennerdale">Mid-Ennerdale</option>
                    <option value="Finetown">Finetown</option>
                    <option value="Lawley">Lawley</option>
                    <option value="Lenasia South">Lenasia South</option>
                    <option value="Walkerville / De Deur">Walkerville / De Deur</option>
                    <option value="Greater Johannesburg / Vaal">Greater Johannesburg / Vaal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Dietary Requirement (Gala Banquet)
                  </label>
                  <select
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value)}
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Standard">Standard Gourmet Menu</option>
                    <option value="Halaal Friendly">Halaal Certified Option</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Diabetic Friendly">Diabetic Friendly</option>
                  </select>
                </div>
              </div>

              {/* Future Coding Core Sponsorship Addon */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3.5 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="sponsor-checkbox"
                  checked={sponsorAddon}
                  onChange={(e) => setSponsorAddon(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-amber-500 focus:ring-amber-400"
                />
                <label htmlFor="sponsor-checkbox" className="text-xs text-neutral-300 cursor-pointer">
                  <strong className="text-amber-400">Future Coding Core Youth Sponsor (+R100):</strong> Add a voluntary donation to sponsor robotics & coding equipment for Ennerdale high school learners attending the gala.
                </label>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-amber-500 py-3 text-sm font-bold text-neutral-950 transition hover:bg-amber-400 shadow-md"
                >
                  {grandTotal === 0 ? (
                    <>
                      <span>Claim Free Community Pass (Issue Door Ticket)</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <span>Proceed to Capitec Payment (R{grandTotal})</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: CAPITEC BUSINESS QR PAYMENT */}
          {step === 'payment' && (
            <div className="space-y-6">
              {/* Instructions Banner */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-neutral-950 font-black text-sm">
                    R
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-100">
                      Scan with Capitec App or Any Banking App
                    </h4>
                    <p className="mt-0.5 text-xs text-neutral-300 leading-relaxed">
                      Use <strong>Capitec Pay / Scan to Pay</strong> on your banking app to scan the QR code below, or transfer via instant EFT using the official Capitec details.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* QR Code Presentation */}
                <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950 p-5 text-center">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                    Capitec Scan To Pay
                  </div>

                  <div className="relative rounded-lg bg-white p-3 shadow-inner">
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt="Capitec Pay QR Code"
                        className="h-48 w-48 object-contain"
                      />
                    ) : (
                      <div className="flex h-48 w-48 items-center justify-center text-xs text-neutral-700">
                        Generating QR...
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                    <ShieldCheck className="h-4 w-4" />
                    <span>EMVCo Compliant QR</span>
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    Amount: <strong>R{grandTotal}.00</strong>
                  </div>
                </div>

                {/* Bank Account Details with Copy Buttons */}
                <div className="space-y-2.5 text-xs">
                  <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-2.5 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-neutral-400 uppercase">Bank</div>
                      <div className="font-semibold text-neutral-200">{BANK_DETAILS.bankName}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(BANK_DETAILS.bankName, 'bank')}
                      className="text-neutral-400 hover:text-amber-400 transition"
                      title="Copy Bank"
                    >
                      {copiedField === 'bank' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>

                  <div className="rounded-lg border border-amber-500/40 bg-neutral-950 p-2.5 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-amber-400 uppercase font-bold">Account Number</div>
                      <div className="font-mono text-base font-extrabold text-neutral-100">{BANK_DETAILS.accountNumber}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(BANK_DETAILS.accountNumber, 'account')}
                      className="rounded bg-neutral-800 px-2 py-1 text-xs font-semibold text-amber-400 hover:bg-neutral-700 transition"
                    >
                      {copiedField === 'account' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-2.5 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-neutral-400 uppercase">Account Name</div>
                      <div className="font-semibold text-neutral-200">{BANK_DETAILS.accountName}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(BANK_DETAILS.accountName, 'name')}
                      className="text-neutral-400 hover:text-amber-400 transition"
                    >
                      {copiedField === 'name' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>

                  <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-2.5 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-neutral-400 uppercase">Branch Code</div>
                      <div className="font-mono font-semibold text-neutral-200">{BANK_DETAILS.branchCode}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(BANK_DETAILS.branchCode, 'branch')}
                      className="text-neutral-400 hover:text-amber-400 transition"
                    >
                      {copiedField === 'branch' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>

                  <div className="rounded-lg border border-amber-500/40 bg-neutral-950 p-2.5 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-amber-400 uppercase font-bold">Your Payment Reference *</div>
                      <div className="font-mono font-bold text-amber-300 text-sm">{referenceCode}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(referenceCode, 'ref')}
                      className="rounded bg-neutral-800 px-2 py-1 text-xs font-semibold text-amber-400 hover:bg-neutral-700 transition"
                    >
                      {copiedField === 'ref' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons to finalize payment */}
              <div className="pt-2 border-t border-neutral-800 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-xs font-semibold text-neutral-300 hover:bg-neutral-700 transition"
                >
                  Back to Details
                </button>

                <button
                  type="button"
                  id="confirm-capitec-paid-btn"
                  onClick={() => handleFinalizePayment('capitec_qr')}
                  disabled={isProcessing}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-emerald-500 py-2.5 text-xs font-bold text-neutral-950 transition hover:bg-emerald-400 shadow-md disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Verifying Banking Confirmation...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>I Have Scanned & Paid R{grandTotal} (Issue My Ticket)</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-lg border border-neutral-800 bg-neutral-950/80 p-3 text-center text-xs text-neutral-300 space-y-1">
                <div className="text-neutral-400 text-[11px]">
                  Need payment assistance or sending Proof of Payment (POP)?
                </div>
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs">
                  <a href={`mailto:${BANK_DETAILS.paymentNoticeEmail}`} className="text-amber-400 hover:underline">
                    {BANK_DETAILS.paymentNoticeEmail}
                  </a>
                  <span className="text-neutral-600 hidden sm:inline">•</span>
                  <a href={`tel:${BANK_DETAILS.contactPhone.replace(/\s+/g, '')}`} className="text-neutral-200 hover:text-amber-400 font-mono">
                    Call: {BANK_DETAILS.contactPhone}
                  </a>
                  <span className="text-neutral-600 hidden sm:inline">•</span>
                  <a href={BANK_DETAILS.contactWhatsApp || 'https://wa.me/27621013195'} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
                    WhatsApp: 062 101 3195
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS & DIGITAL TICKET PREVIEW */}
          {step === 'success' && createdAttendee && (
            <div className="text-center space-y-6 py-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div>
                <h3 className="font-serif-gala text-2xl font-bold text-neutral-100">
                  Congratulations, {createdAttendee.fullName}!
                </h3>
                <p className="mt-1 text-sm text-neutral-300">
                  Your seat for <strong>The Ennerdale Business Gala</strong> is secured and confirmed.
                </p>
                <div className="mt-2 text-xs text-amber-400 font-mono">
                  Ticket ID: {createdAttendee.id} • Ref: {createdAttendee.paymentReference}
                </div>
              </div>

              {/* Mini Pass Summary */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between border-b border-neutral-800 pb-2">
                  <span className="text-neutral-400">Event Date:</span>
                  <span className="font-bold text-neutral-200">Friday, 31 October • 17:30</span>
                </div>
                <div className="flex justify-between border-b border-neutral-800 pb-2">
                  <span className="text-neutral-400">Venue:</span>
                  <span className="font-bold text-neutral-200 text-right">Grace Assembly Church (6th Ave & Percy St)</span>
                </div>
                <div className="flex justify-between border-b border-neutral-800 pb-2">
                  <span className="text-neutral-400">Package:</span>
                  <span className="font-bold text-amber-400">{tier.name} ({quantity} Attendee{quantity > 1 ? 's' : ''})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Capitec Payment Status:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <Check className="h-3 w-3" /> Paid & Verified (R{createdAttendee.totalPaidZAR})
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  id="done-ticket-btn"
                  onClick={onClose}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 py-2.5 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition shadow-md"
                >
                  <Download className="h-4 w-4" />
                  <span>View & Download Door Ticket</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
