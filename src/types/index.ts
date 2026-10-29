export interface EventCategory {
  name: string;
  allocated: number;
  spent: number;
  percentage: number;
  note: string;
  costSavingTip?: string;
}

export interface Milestone {
  daysBefore: number;
  title: string;
  dueDate: string;
  status: 'completed' | 'in_progress' | 'pending';
  priority: 'high' | 'medium' | 'low';
  assignedAgent: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  sanitizedNotes: string;
  trustScore: number;
  quoteAmount: number;
  status: 'vetted' | 'pending' | 'flagged';
  verifiedStrengths?: string[];
  potentialRisks?: string[];
  recommendation?: string;
  wasSanitized?: boolean;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  maxCapacity: number;
  approxCostPerDay: number;
  securityRating: string;
  highlights: string[];
  layoutRecommended?: string;
  lat: number;
  lng: number;
}

export interface EventRecord {
  id: string;
  userId: string;
  title: string;
  type: string;
  targetDate: string;
  budgetTotal: number;
  guestCount: number;
  currency: string;
  createdAt: string;
  categories: EventCategory[];
  milestones: Milestone[];
  vendors: Vendor[];
}

export interface GatewayStatus {
  status: string;
  gateway: string;
  wafStatus: string;
  tokenBucketCapacity: number;
  remainingTokens: number;
  geminiKeyIsolated: boolean;
  geminiModel: string;
  promptIsolationProtocol: string;
  rlsEnforced: boolean;
  serverTime: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
  usage: string;
}

export interface SignatureItem {
  item: string;
  description: string;
  tag: 'food' | 'drink' | 'dessert' | 'cocktail';
}

export interface GuestExperience {
  title: string;
  description: string;
  phase: string;
}

export interface DecorConcept {
  area: string;
  concept: string;
  diyOrRentalTip: string;
}

export interface PersonalizedIdeas {
  themeName: string;
  tagline: string;
  conceptOverview: string;
  colorPalette: ColorSwatch[];
  signatureFoodDrinks: SignatureItem[];
  guestExperiences: GuestExperience[];
  decorConcepts: DecorConcept[];
}

export interface VendorChecklistItem {
  id: string;
  task: string;
  category: string;
  deadlineWeeksBefore: number;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  estimatedCost: number;
  actualCost?: number;
  status: 'pending' | 'contacted' | 'signed' | 'paid';
  assignedVendorName?: string;
  notes?: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface SearchGroundingInfo {
  enabled: boolean;
  queries: string[];
  sources: GroundingSource[];
  liveInsights?: string[];
  retrievedAt?: string;
}

export interface AssistantPlanResult {
  eventTitle: string;
  eventType: 'Wedding' | 'Birthday' | 'Community' | string;
  targetDate: string;
  budgetTotal: number;
  guestCount: number;
  perAttendeeCost: number;
  contingencyReserve: number;
  personalizedIdeas: PersonalizedIdeas;
  categories: EventCategory[];
  milestones: Milestone[];
  vendorChecklist: VendorChecklistItem[];
  searchGrounding?: SearchGroundingInfo;
  securityGuarantee: {
    mathEngine: string;
    promptShield: string;
    model: string;
  };
}

export interface SecurityTestResult {
  testId: string;
  timestamp: string;
  inputPayload: string;
  layersTriggered: string[];
  defenseStatus?: string;
  reaction?: string;
  statusCode?: number;
  timeMs?: number;
  sanitizedOutput?: string;
}
