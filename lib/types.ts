export type UserRole = "Admin" | "Manager" | "Operator" | "External Collaborator" | "Executive";
export type CustomerSegment = "SMB" | "Mid-Market" | "Enterprise";
export type ActivityLevel = "Low" | "Medium" | "High" | "Power User";
export type ChurnStatus = "Active" | "Churned" | "At Risk";
export type AccessibilityNeed = "None" | "Visual" | "Motor" | "Cognitive" | "Hearing" | "Unknown";
export type Severity = "Low" | "Medium" | "High" | "Critical";
export type ConfidenceLabel = "High" | "Medium" | "Low" | "Insufficient Evidence";
export type RecommendationStatus = "Open" | "Planned" | "In Progress" | "Completed" | "Dismissed";
export type RoadmapStatus =
  | "Draft"
  | "Evidence Review"
  | "Research Gap Identified"
  | "More Research Needed"
  | "Ready for Prioritization"
  | "Prioritized"
  | "Paused"
  | "Shipped"
  | "Archived";

export type SegmentDimension =
  | "role"
  | "segment"
  | "region"
  | "language"
  | "plan"
  | "activityLevel"
  | "tenure"
  | "accessibilityNeed"
  | "churnStatus"
  | "arrBand"
  | "industry";

export interface AccountRecord {
  id: string;
  externalAccountId: string;
  companyName: string;
  segment: CustomerSegment;
  arr: number;
  plan: string;
  region: string;
  industry: string;
}

export interface EndUserRecord {
  id: string;
  externalUserId: string;
  accountId: string;
  role: UserRole;
  segment: CustomerSegment;
  region: string;
  language: string;
  plan: string;
  tenureMonths: number;
  activityLevel: ActivityLevel;
  accessibilityNeed: AccessibilityNeed;
  churnStatus: ChurnStatus;
  industry?: string;
  arrBand?: string;
}

export interface FeedbackRecord {
  id: string;
  externalFeedbackId: string;
  userId: string;
  accountId: string;
  source: string;
  feedbackText: string;
  topic: string;
  sentiment: string;
  createdAtSource: Date;
  linkedRoadmapItem?: string;
  severity: string;
  revenueWeight: number;
}

export interface InterviewRecord {
  id: string;
  externalInterviewId: string;
  userId: string;
  researcher: string;
  topic: string;
  interviewDate: Date;
  notes: string;
  linkedRoadmapItem?: string;
}

export interface RoadmapItemRecord {
  id: string;
  externalRoadmapItemId: string;
  title: string;
  description: string;
  productArea: string;
  priority: string;
  status: RoadmapStatus;
  decisionDate: Date;
  owner: string;
  targetSegment: string;
}

export interface EvidenceRecord {
  id: string;
  roadmapItemId: string;
  evidenceType: "Feedback" | "Interview";
  user: EndUserRecord;
  source: string;
  createdAt: Date;
  severity?: string;
  revenueWeight?: number;
  text: string;
}

export interface DistributionItem {
  segment: string;
  count: number;
  percentage: number;
}

export interface RepresentationGap {
  segment: string;
  actualPercentage: number;
  evidencePercentage: number;
  gap: number;
  direction: "underrepresented" | "overrepresented" | "balanced";
}

export interface ScoringWeights {
  evidenceQuantity: number;
  segmentRepresentation: number;
  sourceDiversity: number;
  recency: number;
  targetSegmentCoverage: number;
  churnedUserInclusion: number;
  accessibilityLanguageInclusion: number;
}

export interface ScoreBreakdown {
  evidenceQuantityScore: number;
  segmentRepresentationScore: number;
  sourceDiversityScore: number;
  recencyScore: number;
  targetSegmentCoverageScore: number;
  churnedUserInclusionScore: number;
  accessibilityLanguageInclusionScore: number;
  overallScore: number;
  confidenceLabel: ConfidenceLabel;
  explanation: string;
  gaps: RepresentationGap[];
}

export interface BlindSpotRecord {
  id: string;
  roadmapItemId: string;
  type: string;
  severity: Severity;
  explanation: string;
  affectedSegment: string;
  actualPopulationPercentage: number;
  evidencePopulationPercentage: number;
  representationGap: number;
  recommendedAction: string;
  status: "Open" | "Acknowledged" | "Research Planned" | "Research Completed" | "Dismissed" | "Resolved";
  createdAt: Date;
}

export interface ResearchRecommendationRecord {
  id: string;
  roadmapItemId: string;
  blindSpotId?: string;
  title: string;
  explanation: string;
  recommendedSegment: string;
  suggestedSampleSize: number;
  suggestedResearchMethod: string;
  priority: Severity;
  expectedImpact: string;
  status: RecommendationStatus;
  owner?: string;
  notes?: string;
}
