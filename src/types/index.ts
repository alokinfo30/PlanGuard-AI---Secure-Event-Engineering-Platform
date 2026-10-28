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
