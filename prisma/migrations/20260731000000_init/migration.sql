-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "externalAccountId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "segment" TEXT NOT NULL,
    "arr" INTEGER NOT NULL,
    "plan" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EndUser" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "externalUserId" TEXT NOT NULL,
    "accountId" TEXT,
    "role" TEXT NOT NULL,
    "segment" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "tenureMonths" INTEGER NOT NULL,
    "activityLevel" TEXT NOT NULL,
    "accessibilityNeed" TEXT NOT NULL,
    "churnStatus" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EndUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "externalFeedbackId" TEXT NOT NULL,
    "userId" TEXT,
    "accountId" TEXT,
    "source" TEXT NOT NULL,
    "feedbackText" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "sentiment" TEXT NOT NULL,
    "createdAtSource" TIMESTAMP(3) NOT NULL,
    "severity" TEXT NOT NULL,
    "revenueWeight" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interview" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "externalInterviewId" TEXT NOT NULL,
    "userId" TEXT,
    "researcher" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "interviewDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoadmapItem" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "externalRoadmapItemId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "productArea" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "decisionDate" TIMESTAMP(3) NOT NULL,
    "owner" TEXT NOT NULL,
    "targetSegment" TEXT NOT NULL,
    "evidenceCoverageScore" DOUBLE PRECISION,
    "decisionConfidence" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RoadmapItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoadmapEvidenceLink" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "roadmapItemId" TEXT NOT NULL,
    "evidenceType" TEXT NOT NULL,
    "feedbackId" TEXT,
    "interviewId" TEXT,
    "linkReason" TEXT NOT NULL,
    "linkedById" TEXT,
    "confidence" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RoadmapEvidenceLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SegmentDefinition" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dimension" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SegmentDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoverageScore" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "roadmapItemId" TEXT NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "evidenceQuantityScore" DOUBLE PRECISION NOT NULL,
    "segmentRepresentationScore" DOUBLE PRECISION NOT NULL,
    "sourceDiversityScore" DOUBLE PRECISION NOT NULL,
    "recencyScore" DOUBLE PRECISION NOT NULL,
    "targetSegmentCoverageScore" DOUBLE PRECISION NOT NULL,
    "churnedUserInclusionScore" DOUBLE PRECISION NOT NULL,
    "accessibilityLanguageInclusionScore" DOUBLE PRECISION NOT NULL,
    "confidenceLabel" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "scoreBreakdown" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CoverageScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlindSpot" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "roadmapItemId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "affectedSegment" TEXT NOT NULL,
    "actualPopulationPercentage" DOUBLE PRECISION NOT NULL,
    "evidencePopulationPercentage" DOUBLE PRECISION NOT NULL,
    "representationGap" DOUBLE PRECISION NOT NULL,
    "recommendedAction" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "ownerId" TEXT,
    "resolutionNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "BlindSpot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchRecommendation" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "roadmapItemId" TEXT NOT NULL,
    "blindSpotId" TEXT,
    "title" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "recommendedSegment" TEXT NOT NULL,
    "suggestedSampleSize" INTEGER NOT NULL,
    "suggestedResearchMethod" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "expectedImpact" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "ownerId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ResearchRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DecisionReport" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "roadmapItemId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "markdownContent" TEXT NOT NULL,
    "decisionRecommendation" TEXT NOT NULL,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DecisionReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoringSetting" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "evidenceQuantityWeight" DOUBLE PRECISION NOT NULL,
    "segmentRepresentationWeight" DOUBLE PRECISION NOT NULL,
    "sourceDiversityWeight" DOUBLE PRECISION NOT NULL,
    "recencyWeight" DOUBLE PRECISION NOT NULL,
    "targetSegmentCoverageWeight" DOUBLE PRECISION NOT NULL,
    "churnedUserInclusionWeight" DOUBLE PRECISION NOT NULL,
    "accessibilityLanguageInclusionWeight" DOUBLE PRECISION NOT NULL,
    "minimumEvidenceThreshold" INTEGER NOT NULL,
    "recencyThresholdDays" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ScoringSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DecisionNote" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "roadmapItemId" TEXT NOT NULL,
    "userId" TEXT,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DecisionNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportBatch" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "totalRows" INTEGER NOT NULL,
    "successfulRows" INTEGER NOT NULL,
    "failedRows" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ImportBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportError" (
    "id" TEXT NOT NULL,
    "importBatchId" TEXT NOT NULL,
    "rowNumber" INTEGER NOT NULL,
    "field" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "rawData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ImportError_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "Account_organizationId_segment_idx" ON "Account"("organizationId", "segment");
CREATE UNIQUE INDEX "Account_organizationId_externalAccountId_key" ON "Account"("organizationId", "externalAccountId");
CREATE INDEX "EndUser_organizationId_role_idx" ON "EndUser"("organizationId", "role");
CREATE INDEX "EndUser_organizationId_segment_idx" ON "EndUser"("organizationId", "segment");
CREATE UNIQUE INDEX "EndUser_organizationId_externalUserId_key" ON "EndUser"("organizationId", "externalUserId");
CREATE INDEX "Feedback_organizationId_topic_idx" ON "Feedback"("organizationId", "topic");
CREATE UNIQUE INDEX "Feedback_organizationId_externalFeedbackId_key" ON "Feedback"("organizationId", "externalFeedbackId");
CREATE INDEX "Interview_organizationId_topic_idx" ON "Interview"("organizationId", "topic");
CREATE UNIQUE INDEX "Interview_organizationId_externalInterviewId_key" ON "Interview"("organizationId", "externalInterviewId");
CREATE INDEX "RoadmapItem_organizationId_status_idx" ON "RoadmapItem"("organizationId", "status");
CREATE UNIQUE INDEX "RoadmapItem_organizationId_externalRoadmapItemId_key" ON "RoadmapItem"("organizationId", "externalRoadmapItemId");
CREATE INDEX "RoadmapEvidenceLink_organizationId_roadmapItemId_idx" ON "RoadmapEvidenceLink"("organizationId", "roadmapItemId");
CREATE UNIQUE INDEX "ScoringSetting_organizationId_key" ON "ScoringSetting"("organizationId");

ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Account" ADD CONSTRAINT "Account_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EndUser" ADD CONSTRAINT "EndUser_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EndUser" ADD CONSTRAINT "EndUser_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "EndUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "EndUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "RoadmapItem" ADD CONSTRAINT "RoadmapItem_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RoadmapEvidenceLink" ADD CONSTRAINT "RoadmapEvidenceLink_roadmapItemId_fkey" FOREIGN KEY ("roadmapItemId") REFERENCES "RoadmapItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RoadmapEvidenceLink" ADD CONSTRAINT "RoadmapEvidenceLink_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "Feedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RoadmapEvidenceLink" ADD CONSTRAINT "RoadmapEvidenceLink_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RoadmapEvidenceLink" ADD CONSTRAINT "RoadmapEvidenceLink_linkedById_fkey" FOREIGN KEY ("linkedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SegmentDefinition" ADD CONSTRAINT "SegmentDefinition_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CoverageScore" ADD CONSTRAINT "CoverageScore_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CoverageScore" ADD CONSTRAINT "CoverageScore_roadmapItemId_fkey" FOREIGN KEY ("roadmapItemId") REFERENCES "RoadmapItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BlindSpot" ADD CONSTRAINT "BlindSpot_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BlindSpot" ADD CONSTRAINT "BlindSpot_roadmapItemId_fkey" FOREIGN KEY ("roadmapItemId") REFERENCES "RoadmapItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BlindSpot" ADD CONSTRAINT "BlindSpot_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ResearchRecommendation" ADD CONSTRAINT "ResearchRecommendation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ResearchRecommendation" ADD CONSTRAINT "ResearchRecommendation_roadmapItemId_fkey" FOREIGN KEY ("roadmapItemId") REFERENCES "RoadmapItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ResearchRecommendation" ADD CONSTRAINT "ResearchRecommendation_blindSpotId_fkey" FOREIGN KEY ("blindSpotId") REFERENCES "BlindSpot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ResearchRecommendation" ADD CONSTRAINT "ResearchRecommendation_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DecisionReport" ADD CONSTRAINT "DecisionReport_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DecisionReport" ADD CONSTRAINT "DecisionReport_roadmapItemId_fkey" FOREIGN KEY ("roadmapItemId") REFERENCES "RoadmapItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DecisionReport" ADD CONSTRAINT "DecisionReport_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ScoringSetting" ADD CONSTRAINT "ScoringSetting_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DecisionNote" ADD CONSTRAINT "DecisionNote_roadmapItemId_fkey" FOREIGN KEY ("roadmapItemId") REFERENCES "RoadmapItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DecisionNote" ADD CONSTRAINT "DecisionNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ImportBatch" ADD CONSTRAINT "ImportBatch_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ImportError" ADD CONSTRAINT "ImportError_importBatchId_fkey" FOREIGN KEY ("importBatchId") REFERENCES "ImportBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
