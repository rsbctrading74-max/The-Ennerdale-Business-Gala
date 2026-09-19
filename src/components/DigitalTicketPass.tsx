import React, { useEffect, useState, useRef } from 'react';
import { Attendee, TicketTier } from '../types';
import { generateQrCodeDataUrl } from '../utils/qrUtils';
import { 
  X, Printer, Download, MapPin, Calendar, CheckCircle2, 
  Ticket, Sparkles, ShieldCheck, Check, Share2, Copy 
} from 'lucide-react';

interface DigitalTicketPassProps {
  isOpen: boolean;
  onClose: () => void;
  attendee: Attendee | null;
  tier?: TicketTier;
}

export const DigitalTicketPass: React.FC<DigitalTicketPassProps> = ({
  isOpen,
  onClose,
  attendee,
  tier,
}) => {
  const [ticketQrUrl, setTicketQrUrl] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (attendee) {
      // Generate QR code for ticket check-in verification
      generateQrCodeDataUrl(attendee.qrPayload || attendee.id, {
        width: 320,
        margin: 1,
      }).then((url) => {
        setTicketQrUrl(url);
      });
    }
  }, [attendee]);

  if (!isOpen || !attendee) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyTicketInfo = () => {
    const text = `The Ennerdale Business Gala Ticket
Delegate: ${attendee.fullName}
Ticket ID: ${attendee.id}
Tier: ${tier?.name || attendee.tierId}
Date: Friday, 31 October 2026 • 17:30
Venue: Grace Assembly Church, 6th Ave & CNR Percy St, Ennerdale
Reference: ${attendee.paymentReference}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // High-Resolution Canvas PNG Ticket Image Generator
  const handleDownloadTicketImage = async () => {
    if (!attendee) return;
    setIsDownloading(true);

    try {
      const canvas = document.createElement('canvas');
      const width = 800;
      const height = 1100;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);

      // Gradient accent header
      const grad = ctx.createLinearGradient(0, 0, width, 0);
      grad.addColorStop(0, '#f59e0b');
      grad.addColorStop(0.5, '#10b981');
      grad.addColorStop(1, '#f59e0b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, 14);

      // Card border
      ctx.strokeStyle = '#262626';
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, width - 40, height - 40);

      // Inner gold border accent
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(30, 30, width - 60, height - 60);

      // 2. Co-hosts header
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '3px';
      ctx.fillText('FUTURE CODING CORE & RSBC TRADING', width / 2, 75);

      // 3. Main Title
      ctx.fillStyle = '#f3f4f6';
      ctx.font = 'bold 36px Georgia, serif';
      ctx.letterSpacing = '1px';
      ctx.fillText('The Ennerdale Business Gala', width / 2, 125);

      // Door Notice Ribbon
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(50, 150, width - 100, 36);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1;
      ctx.strokeRect(50, 150, width - 100, 36);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 13px sans-serif';
      ctx.letterSpacing = '2px';
      ctx.fillText('★ OFFICIAL ADMISSION PASS • PRESENT AT DOOR ★', width / 2, 173);

      // 4. Ticket Notch Lines
      ctx.setLineDash([8, 6]);
      ctx.strokeStyle = '#404040';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(40, 210);
      ctx.lineTo(width - 40, 210);
      ctx.stroke();
      ctx.setLineDash([]); // reset

      // 5. Delegate Details
      ctx.fillStyle = '#9ca3af';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('DELEGATE NAME', 60, 250);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(attendee.fullName.toUpperCase(), 60, 285);

      ctx.fillStyle = '#9ca3af';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('COMPANY / AFFILIATION', 60, 330);

      ctx.fillStyle = '#d1d5db';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(attendee.companyOrAffiliation || 'Independent Entrepreneur', 60, 358);

      ctx.fillStyle = '#9ca3af';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('REGION / COMMUNITY AREA', 60, 400);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(attendee.area || 'Ennerdale & Region G', 60, 425);

      // Right column: Tier & Ticket ID
      ctx.fillStyle = '#9ca3af';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('ADMISSION TIER', 480, 250);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 20px sans-serif';
      const tierName = (tier?.name || attendee.tierId).toUpperCase();
      ctx.fillText(tierName.slice(0, 22), 480, 280);

      ctx.fillStyle = '#9ca3af';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('TICKET ID & REF', 480, 330);

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 20px monospace';
      ctx.fillText(attendee.id, 480, 358);
      ctx.fillStyle = '#9ca3af';
      ctx.font = '13px monospace';
      ctx.fillText(attendee.paymentReference, 480, 380);

      // Payment Status
      ctx.fillStyle = '#9ca3af';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('PAYMENT VERIFICATION', 480, 415);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 15px sans-serif';
      const amtText = attendee.totalPaidZAR === 0 ? 'R0 COMP/GRANT' : `R${attendee.totalPaidZAR} (CAPITEC)`;
      ctx.fillText(`✓ ${attendee.paymentStatus.toUpperCase()} • ${amtText}`, 480, 438);

      // 6. QR Code in White Box
      const qrBoxX = 260;
      const qrBoxY = 475;
      const qrBoxSize = 280;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrBoxX - 10, qrBoxY - 10, qrBoxSize + 20, qrBoxSize + 20);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.strokeRect(qrBoxX - 10, qrBoxY - 10, qrBoxSize + 20, qrBoxSize + 20);

      if (ticketQrUrl) {
        const qrImg = new Image();
        qrImg.crossOrigin = 'anonymous';
        await new Promise<void>((resolve) => {
          qrImg.onload = () => {
            ctx.drawImage(qrImg, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize);
            resolve();
          };
          qrImg.onerror = () => resolve();
          qrImg.src = ticketQrUrl;
        });
      }

      ctx.fillStyle = '#6b7280';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`SCAN AT ENTRANCE • ${attendee.id}`, width / 2, qrBoxY + qrBoxSize + 30);

      // 7. Event Date & Venue Box
      ctx.fillStyle = '#171717';
      ctx.fillRect(50, 820, width - 100, 150);
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(50, 820, width - 100, 150);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('📅 Friday, 31 October 2026 • 17:30 (Sharp)', width / 2, 860);

      ctx.fillStyle = '#f3f4f6';
      ctx.font = 'bold 20px Georgia, serif';
      ctx.fillText('Grace Assembly Church, Ennerdale', width / 2, 900);

      ctx.fillStyle = '#9ca3af';
      ctx.font = '14px sans-serif';
      ctx.fillText('Intersection of 6th Avenue & CNR Percy Street, Johannesburg South', width / 2, 930);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('Dress Code: Black Tie / Executive African Elegance • Secure Patrolled Parking', width / 2, 955);

      // 8. Footer anti-counterfeit
      ctx.fillStyle = '#6b7280';
      ctx.font = '10px monospace';
      ctx.fillText(`ISSUED BY FUTURE CODING CORE & RSBC TRADING • 062 101 3195 • RSBCTRADING74@GMAIL.COM`, width / 2, 1025);
      ctx.fillText(`SERIAL: ${attendee.id}-${Date.now().toString(36).toUpperCase()} • DOOR ADMITTANCE VERIFIED`, width / 2, 1045);

      // Trigger download
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `Ennerdale-Gala-Ticket-${attendee.id}-${attendee.fullName.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to download ticket image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-xl rounded-2xl border border-neutral-800 bg-neutral-900 text-neutral-100 shadow-2xl overflow-hidden my-4 print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-4 sm:px-6 py-3.5 bg-neutral-950/90 print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
            <Ticket className="h-4 w-4 text-amber-400" />
            <span>Official Gala Admission Ticket</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Download Image Button */}
            <button
              id="download-ticket-image-btn"
              onClick={handleDownloadTicketImage}
              disabled={isDownloading}
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition shadow"
              title="Download ticket as a PNG image to show on your phone"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isDownloading ? 'Saving...' : 'Download Image'}</span>
            </button>

            {/* Print / Save PDF Button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:bg-neutral-700 transition"
              title="Print or Save as PDF"
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            <button
              onClick={handleCopyTicketInfo}
              className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
              title="Copy Ticket Details"
            >
              {copiedLink ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Door Presentation Callout Banner (Screen only) */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-5 py-2.5 text-center text-xs text-amber-300 flex items-center justify-center gap-2 print:hidden">
          <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
          <span>
            <strong>Show this ticket at the door:</strong> Download the image or save the PDF to your phone to present at Grace Assembly Church entrance.
          </span>
        </div>

        {/* Printable Pass Body */}
        <div id="printable-ticket" className="p-5 sm:p-7 bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 print:bg-white print:p-4">
          {/* Ticket Header */}
          <div className="rounded-xl border border-amber-500/30 bg-neutral-950 p-5 text-center relative overflow-hidden print:border print:border-black print:bg-white">
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-500 print:bg-black" />

            <div className="text-[11px] uppercase tracking-widest text-amber-400 font-bold mb-1 print:text-black">
              Future Coding Core & RSBC Trading
            </div>
            <h2 className="font-serif-gala text-2xl font-black text-neutral-100 tracking-wide print:text-black">
              The Ennerdale Business Gala
            </h2>
            <div className="mt-1 flex items-center justify-center gap-2 text-xs text-neutral-400 print:text-gray-700">
              <span>Annual Township Economic Revival</span>
              <span>•</span>
              <span className="text-amber-400 font-bold uppercase print:text-black">
                {tier?.name || `${attendee.tierId} PASS`}
              </span>
            </div>

            <div className="mt-3 inline-block rounded-md bg-amber-500/20 border border-amber-500/40 px-3 py-1 text-[11px] font-bold text-amber-300 print:border print:border-black print:text-black">
              ★ OFFICIAL DOOR ADMISSION PASS ★
            </div>
          </div>

          {/* Ticket Notch Divider */}
          <div className="relative my-4 flex items-center justify-center print:hidden">
            <div className="absolute -left-6 h-6 w-6 rounded-full bg-neutral-950 border-r border-neutral-800" />
            <div className="w-full border-t-2 border-dashed border-neutral-800" />
            <div className="absolute -right-6 h-6 w-6 rounded-full bg-neutral-950 border-l border-neutral-800" />
          </div>

          {/* Attendee Details & QR Section */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/80 p-5 print:border print:border-black print:bg-white">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* QR Code */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <div className="rounded-xl bg-white p-3 shadow-md border-2 border-amber-500/40 print:border-black">
                  {ticketQrUrl ? (
                    <img
                      src={ticketQrUrl}
                      alt="Ticket Verification QR"
                      className="h-40 w-40 object-contain"
                    />
                  ) : (
                    <div className="h-40 w-40 flex items-center justify-center text-xs text-neutral-700">
                      Generating Pass...
                    </div>
                  )}
                </div>
                <div className="mt-2 text-xs font-mono text-amber-400 font-bold print:text-black">
                  {attendee.id}
                </div>
                <div className="text-[10px] text-neutral-500 font-mono">
                  REF: {attendee.paymentReference}
                </div>
              </div>

              {/* Info Details */}
              <div className="w-full space-y-3 text-xs text-left">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-neutral-400 print:text-gray-600 font-bold">
                    Delegate Name
                  </div>
                  <div className="text-xl font-black text-neutral-100 print:text-black">
                    {attendee.fullName}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-wider text-neutral-400 print:text-gray-600 font-bold">
                    Company / Affiliation
                  </div>
                  <div className="font-semibold text-neutral-200 print:text-black text-sm">
                    {attendee.companyOrAffiliation}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-neutral-800/80 print:border-gray-300">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-neutral-400 print:text-gray-600 font-bold">
                      Community Hub
                    </div>
                    <div className="text-neutral-200 print:text-black font-medium">{attendee.area}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-neutral-400 print:text-gray-600 font-bold">
                      Dietary Preference
                    </div>
                    <div className="text-neutral-200 print:text-black font-medium">{attendee.dietaryPreference}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-800/80 print:border-gray-300 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-neutral-400 print:text-gray-600 font-bold">
                      Payment Verification
                    </div>
                    <div className="font-bold text-emerald-400 print:text-black flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>
                        {attendee.paymentStatus.toUpperCase()} (
                        {attendee.totalPaidZAR === 0 ? 'R0 Grant' : `R${attendee.totalPaidZAR}`})
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-neutral-400 print:text-gray-600 font-bold">
                      Admission Status
                    </div>
                    <div className={`font-bold ${attendee.checkInStatus === 'checked_in' ? 'text-emerald-400' : 'text-amber-400'} print:text-black`}>
                      {attendee.checkInStatus === 'checked_in' ? '✓ ADMITTED' : 'VALID AT DOOR'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Logistics Block */}
            <div className="mt-5 rounded-xl bg-neutral-900 p-4 text-xs text-neutral-300 space-y-2 border border-neutral-800 print:border print:border-black print:bg-white print:text-black">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-amber-400 print:text-black shrink-0" />
                <span><strong>Friday, 31 October 2026</strong> • Doors open 17:30 (Sharp)</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-400 print:text-black shrink-0" />
                <span><strong>Grace Assembly Church</strong>, 6th Ave & CNR Percy Street, Ennerdale</span>
              </div>
            </div>

            {/* Quick Action Footer in Modal */}
            <div className="mt-4 pt-3 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
              <div className="text-[11px] text-neutral-400 text-center sm:text-left leading-tight">
                <span>Present pass at entrance on 31 October.</span>
                <span className="block text-neutral-500">Helpline: 062 101 3195 • rsbctrading74@gmail.com</span>
              </div>

              <button
                type="button"
                onClick={handleDownloadTicketImage}
                disabled={isDownloading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition shadow"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{isDownloading ? 'Generating Image...' : 'Save Ticket to Phone'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
