import React, { useState, useEffect } from 'react';
import { TicketTier, TicketTierId, Attendee, PaymentStatus } from './types';
import { INITIAL_TIERS, INITIAL_ATTENDEES } from './data/initialData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AvailabilityDashboard } from './components/AvailabilityDashboard';
import { TicketSelection } from './components/TicketSelection';
import { CheckoutModal } from './components/CheckoutModal';
import { DigitalTicketPass } from './components/DigitalTicketPass';
import { FindTicketModal } from './components/FindTicketModal';
import { AttendeeManagementPortal } from './components/AttendeeManagementPortal';
import { EnnerdaleLocalInsights } from './components/EnnerdaleLocalInsights';
import { EventSchedule } from './components/EventSchedule';
import { Footer } from './components/Footer';

const LOCAL_STORAGE_TIERS_KEY = 'ennerdale_gala_tiers_v5';
const LOCAL_STORAGE_ATTENDEES_KEY = 'ennerdale_gala_attendees_v5';

export default function App() {
  // Load tiers from localStorage or initial
  const [tiers, setTiers] = useState<TicketTier[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_TIERS_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return INITIAL_TIERS;
  });

  // Load attendees from localStorage or initial
  const [attendees, setAttendees] = useState<Attendee[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_ATTENDEES_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return INITIAL_ATTENDEES;
  });

  // Save to localStorage on state change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_TIERS_KEY, JSON.stringify(tiers));
  }, [tiers]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_ATTENDEES_KEY, JSON.stringify(attendees));
  }, [attendees]);

  // Selected tier for checkout
  const [selectedTierId, setSelectedTierId] = useState<TicketTierId>('general');
  const [checkoutQuantity, setCheckoutQuantity] = useState<number>(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Modals state
  const [isFindTicketOpen, setIsFindTicketOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [viewingPassAttendee, setViewingPassAttendee] = useState<Attendee | null>(null);

  // Seat remaining calculation (strictly 400 total capacity)
  const totalCapacity = tiers.reduce((acc, t) => acc + t.totalCapacity, 0);
  const totalBooked = tiers.reduce((acc, t) => acc + t.bookedCount, 0);
  const totalSeatsRemaining = totalCapacity - totalBooked;

  // Selected tier object
  const currentCheckoutTier = tiers.find((t) => t.id === selectedTierId) || tiers[1];

  // Handler: Proceed to checkout
  const handleProceedToCheckout = (tierId: TicketTierId, quantity: number) => {
    setSelectedTierId(tierId);
    setCheckoutQuantity(quantity);
    setIsCheckoutOpen(true);
  };

  // Handler: Select tier from dashboard
  const handleSelectTierFromDashboard = (tierId: TicketTierId) => {
    setSelectedTierId(tierId);
    setCheckoutQuantity(1);
    setIsCheckoutOpen(true);
  };

  // Handler: Booking complete
  const handleBookingComplete = (newAttendee: Attendee) => {
    // 1. Add to attendees
    setAttendees((prev) => [newAttendee, ...prev]);

    // 2. Increment tier booked count
    setTiers((prev) =>
      prev.map((t) => {
        if (t.id === newAttendee.tierId) {
          return {
            ...t,
            bookedCount: Math.min(t.totalCapacity, t.bookedCount + newAttendee.quantity),
          };
        }
        return t;
      })
    );

    // Open digital door pass for user immediately
    setViewingPassAttendee(newAttendee);
  };

  // Handler: Check in attendee (from door verification or portal)
  const handleCheckInAttendee = (attendeeId: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAttendees((prev) =>
      prev.map((a) => (a.id === attendeeId ? { ...a, checkInStatus: 'checked_in', checkInTime: timeNow } : a))
    );
  };

  // Handler: Undo check in
  const handleUndoCheckInAttendee = (attendeeId: string) => {
    setAttendees((prev) =>
      prev.map((a) => (a.id === attendeeId ? { ...a, checkInStatus: 'not_checked_in', checkInTime: undefined } : a))
    );
  };

  // Handler: Toggle payment status (e.g. approve EFT)
  const handleTogglePaymentStatus = (id: string, status: PaymentStatus) => {
    setAttendees((prev) =>
      prev.map((a) => (a.id === id ? { ...a, paymentStatus: status } : a))
    );
  };

  // Handler: Add walk-in attendee
  const handleAddWalkInAttendee = (newAttendee: Attendee) => {
    setAttendees((prev) => [newAttendee, ...prev]);
    setTiers((prev) =>
      prev.map((t) =>
        t.id === newAttendee.tierId ? { ...t, bookedCount: Math.min(t.totalCapacity, t.bookedCount + 1) } : t
      )
    );
  };

  const scrollToTickets = () => {
    const el = document.getElementById('tickets');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToInsights = () => {
    const el = document.getElementById('local-insights');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-neutral-950">
      {/* Top Navbar */}
      <Navbar
        onOpenFindTicket={() => setIsFindTicketOpen(true)}
        onOpenPortal={() => setIsPortalOpen(true)}
        onSelectTickets={scrollToTickets}
        totalSeatsRemaining={totalSeatsRemaining}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onBookClick={scrollToTickets}
          onExploreInsights={scrollToInsights}
          onOpenFindTicket={() => setIsFindTicketOpen(true)}
          totalSeatsRemaining={totalSeatsRemaining}
        />

        {/* Real-Time Availability Tracker */}
        <AvailabilityDashboard
          tiers={tiers}
          onSelectTier={handleSelectTierFromDashboard}
        />

        {/* Ticket Tiers & Secure Booking */}
        <TicketSelection
          tiers={tiers}
          selectedTierId={selectedTierId}
          onSelectTierId={setSelectedTierId}
          onProceedToCheckout={handleProceedToCheckout}
        />

        {/* Ennerdale Local Insights & Community Branding */}
        <EnnerdaleLocalInsights />

        {/* Gala Itinerary & Grace Assembly Church Logistics */}
        <EventSchedule />
      </main>

      {/* Footer */}
      <Footer
        onOpenFindTicket={() => setIsFindTicketOpen(true)}
        onOpenPortal={() => setIsPortalOpen(true)}
        onSelectTickets={scrollToTickets}
      />

      {/* Checkout Modal (Capitec Business QR & Instant Claim) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        tier={currentCheckoutTier}
        quantity={checkoutQuantity}
        onBookingComplete={handleBookingComplete}
      />

      {/* Digital Ticket Pass View (Downloadable Image / Print) */}
      <DigitalTicketPass
        isOpen={!!viewingPassAttendee}
        onClose={() => setViewingPassAttendee(null)}
        attendee={viewingPassAttendee}
        tier={tiers.find((t) => t.id === viewingPassAttendee?.tierId)}
      />

      {/* Find & Download Door Ticket Modal */}
      <FindTicketModal
        isOpen={isFindTicketOpen}
        onClose={() => setIsFindTicketOpen(false)}
        attendees={attendees}
        tiers={tiers}
        onSelectTicket={(att) => setViewingPassAttendee(att)}
      />

      {/* Attendee Management Portal (Door Check-in & Administration) */}
      <AttendeeManagementPortal
        isOpen={isPortalOpen}
        onClose={() => setIsPortalOpen(false)}
        attendees={attendees}
        tiers={tiers}
        onTogglePaymentStatus={handleTogglePaymentStatus}
        onToggleCheckIn={(id) => {
          const attendee = attendees.find((a) => a.id === id);
          if (attendee?.checkInStatus === 'checked_in') {
            handleUndoCheckInAttendee(id);
          } else {
            handleCheckInAttendee(id);
          }
        }}
        onViewTicket={(att) => setViewingPassAttendee(att)}
        onAddWalkInAttendee={handleAddWalkInAttendee}
      />
    </div>
  );
}
