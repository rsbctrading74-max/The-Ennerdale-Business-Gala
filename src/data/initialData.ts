import { BankDetails, LocalInsightItem, ScheduleItem, TicketTier, Attendee } from '../types';

export const BANK_DETAILS: BankDetails = {
  bankName: 'Capitec Business Bank',
  accountName: 'RSBC Trading',
  accountNumber: '1055553690',
  accountType: 'Business Current Account',
  branchCode: '470010',
  paymentNoticeEmail: 'rsbctrading74@gmail.com',
};

export const INITIAL_TIERS: TicketTier[] = [
  {
    id: 'youth',
    name: 'Youth Pass (Ages 15–25)',
    tagline: 'Special youth delegate rate for young innovators & scholars aged 15–25',
    priceZAR: 50,
    totalCapacity: 20,
    bookedCount: 0,
    color: 'emerald',
    badge: 'Ages 15–25 • R50',
    features: [
      'Special Youth Delegate Entry (Ages 15–25) - R50',
      'Access to Main Gala Auditorium Seating',
      'Future Coding Core Project & Robotics Showcase',
      'Youth Tech & Coding Mentorship Session',
      'Certificate of Attendance & Networking Buffet',
    ],
  },
  {
    id: 'general',
    name: 'General Business Delegate',
    tagline: 'Accessible entry for all local entrepreneurs & SMME owners',
    priceZAR: 100,
    totalCapacity: 280,
    bookedCount: 0,
    color: 'amber',
    badge: 'R100 Minimum Price',
    popular: true,
    features: [
      'Full Gala Access & Seat in Main Auditorium (R100)',
      'Official Event Delegate Pack & Badge',
      '3-Course Networking Dinner & Refreshments',
      'RSBC Supplier & Local Procurement Directory',
      'Access to Evening Business Pitch Deck',
    ],
  },
  {
    id: 'vip',
    name: 'VIP Executive & Corporate Table',
    tagline: 'Reserved executive seating & corporate privileges',
    priceZAR: 250,
    totalCapacity: 80,
    bookedCount: 0,
    color: 'gold',
    badge: 'VIP Reserved',
    features: [
      'Front-Row Reserved Executive Table Seating',
      'VIP Cocktail Reception with Keynote Speakers',
      'Complimentary Gala Executive Gift Hamper',
      'Feature profile in Event Commemorative Booklet',
      'Direct Business Matchmaking with RSBC & Partners',
      'Premium 3-Course Gourmet Dinner Service',
    ],
  },
  {
    id: 'exhibitor',
    name: 'SMME Exhibition Showcase Stand',
    tagline: 'Promote your enterprise at the gala grand foyer',
    priceZAR: 500,
    totalCapacity: 20,
    bookedCount: 0,
    color: 'cyan',
    badge: 'Limited Stands',
    features: [
      'Dedicated 2m x 2m Exhibition Booth in Church Foyer',
      'Includes 2 Full VIP Delegate Passes',
      'Company Banner placement on Main Stage',
      '3-Minute Elevator Pitch to All Gala Attendees',
      'Inclusion in Future Coding Core Digital Catalogue',
    ],
  },
];

export const INITIAL_ATTENDEES: Attendee[] = [];

export const LOCAL_INSIGHTS: LocalInsightItem[] = [
  {
    id: 'region-g-economy',
    title: 'Region G SMME Renaissance',
    category: 'Community Empowerment',
    summary:
      'Ennerdale is strategically positioned in the southern Johannesburg corridor, flanked by Finetown, Lawley, Lenasia South, and Walkerville. The Gala serves as a catalyst to retain expenditure within the local community through formal business networks.',
    highlight: 'Over 68 registered local SMMEs convening to establish direct inter-township trading agreements.',
    iconName: 'Building2',
  },
  {
    id: 'future-coding',
    title: 'Future Coding Core Initiative',
    category: 'Tech Innovation',
    summary:
      'Bridging the digital divide for Ennerdale youth through high-impact coding bootcamps, web development, and robotics. This gala sponsors equipment, high-speed fibre access, and tech internships for talented local learners.',
    highlight: '100% of Youth Pass proceeds go directly towards tech equipment grants for Ennerdale high school students.',
    iconName: 'Code2',
  },
  {
    id: 'rsbc-procurement',
    title: 'RSBC Trading Supply Chain Hub',
    category: 'Trade & Procurement',
    summary:
      'RSBC Trading is pioneering localized FMCG and retail distribution. The Gala provides small local manufacturers, caterers, and fabricators access to RSBC’s regional retail supply networks.',
    highlight: 'Connecting grassroots producers with supermarket and commercial supply chain shelf space.',
    iconName: 'TrendingUp',
  },
  {
    id: 'venue-logistics',
    title: 'Grace Assembly Church & Access Guide',
    category: 'Logistics & Venue',
    summary:
      'Centrally situated on 6th Avenue and Percy Street in Ennerdale. The venue features secure on-site parking monitored by community watch patrols, executive gala dining facilities, and wheelchair accessibility.',
    highlight: 'Easy access from the Golden Highway (R553) and R82 corridors, 5 minutes from Mid-Ennerdale.',
    iconName: 'MapPin',
  },
];

export const GALA_SCHEDULE: ScheduleItem[] = [
  {
    time: '17:30 - 18:15',
    title: 'Red Carpet Arrival & Registration',
    speaker: 'Welcome Desk & RSBC Hostesses',
    designation: 'Grace Assembly Church Grand Foyer',
    description: 'Digital ticket pass door inspection, red carpet photography, welcome drinks, and exhibition booth walkthrough.',
    type: 'ceremony',
  },
  {
    time: '18:15 - 18:35',
    title: 'Opening Addresses: The Ennerdale Vision',
    speaker: 'Future Coding Core & RSBC Trading Leadership',
    designation: 'Co-Founders & Event Conveners',
    description: 'Setting the theme: “Unlocking Prosperity in Region G through Digital Skills and Local Enterprise Synergies”.',
    type: 'keynote',
  },
  {
    time: '18:35 - 19:15',
    title: 'Keynote Panel: Financing & Scaling Township SMMEs',
    speaker: 'Capitec Business & Gauteng Economic Development',
    designation: 'Commercial SMME Panelists',
    description: 'Practical pathways for Ennerdale entrepreneurs to access working capital, digital payments, and compliance.',
    type: 'panel',
  },
  {
    time: '19:15 - 19:45',
    title: 'Youth In Tech Pitch Showcase',
    speaker: 'Future Coding Core Young Innovators',
    designation: 'Ennerdale & Region G Scholars',
    description: 'Live 3-minute software and hardware demonstrations solving community waste, local safety, and logistics.',
    type: 'showcase',
  },
  {
    time: '19:45 - 21:00',
    title: 'Gala Dinner & Business Matchmaking',
    speaker: 'Gourmet Catering & Live Acoustic Band',
    designation: 'Main Banquet Hall',
    description: 'A 3-course executive dinner, structured business card exchange, and procurement deal signings.',
    type: 'networking',
  },
  {
    time: '21:00 - 21:30',
    title: 'Awards Ceremony & Closing Toast',
    speaker: 'RSBC Trading & Future Coding Core',
    designation: 'Ceremony Stage',
    description: 'Honoring Ennerdale Business Leaders of the Year, scholarship announcements, and networking till late.',
    type: 'ceremony',
  },
];
