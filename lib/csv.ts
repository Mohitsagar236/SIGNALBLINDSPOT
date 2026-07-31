import { parse } from "csv-parse/sync";
import { z } from "zod";

export type ImportType = "users" | "accounts" | "feedback" | "interviews" | "roadmap_items";

export interface CsvValidationError {
  rowNumber: number;
  field: string;
  message: string;
  rawData: Record<string, string>;
}

export interface CsvPreviewResult {
  type: ImportType;
  headers: string[];
  rows: Record<string, string>[];
  errors: CsvValidationError[];
  validRows: number;
}

const requiredColumns: Record<ImportType, string[]> = {
  users: [
    "user_id",
    "account_id",
    "role",
    "segment",
    "region",
    "language",
    "plan",
    "tenure_months",
    "activity_level",
    "accessibility_need",
    "churn_status"
  ],
  accounts: ["account_id", "company_name", "segment", "arr", "plan", "region", "industry"],
  feedback: [
    "feedback_id",
    "user_id",
    "account_id",
    "source",
    "feedback_text",
    "topic",
    "sentiment",
    "created_at",
    "linked_roadmap_item",
    "severity",
    "revenue_weight"
  ],
  interviews: ["interview_id", "user_id", "researcher", "topic", "date", "notes", "linked_roadmap_item"],
  roadmap_items: [
    "roadmap_item_id",
    "title",
    "description",
    "product_area",
    "priority",
    "status",
    "decision_date",
    "owner",
    "target_segment"
  ]
};

export function getRequiredColumns(type: ImportType) {
  return requiredColumns[type];
}

const userSchema = z.object({
  user_id: z.string().min(1),
  account_id: z.string().min(1),
  role: z.enum(["Admin", "Manager", "Operator", "External Collaborator", "Executive"]),
  segment: z.enum(["SMB", "Mid-Market", "Enterprise"]),
  region: z.string().min(1),
  language: z.string().min(1),
  plan: z.string().min(1),
  tenure_months: z.coerce.number().int().min(0),
  activity_level: z.enum(["Low", "Medium", "High", "Power User"]),
  accessibility_need: z.enum(["None", "Visual", "Motor", "Cognitive", "Hearing", "Unknown"]),
  churn_status: z.enum(["Active", "Churned", "At Risk"])
});

const accountSchema = z.object({
  account_id: z.string().min(1),
  company_name: z.string().min(1),
  segment: z.enum(["SMB", "Mid-Market", "Enterprise"]),
  arr: z.coerce.number().int().min(0),
  plan: z.string().min(1),
  region: z.string().min(1),
  industry: z.string().min(1)
});

const feedbackSchema = z.object({
  feedback_id: z.string().min(1),
  user_id: z.string().min(1),
  account_id: z.string().min(1),
  source: z.enum([
    "Support ticket",
    "Sales call",
    "Customer interview",
    "NPS survey",
    "App feedback",
    "Customer success note",
    "Internal stakeholder",
    "Churn interview",
    "Usability test",
    "Community forum"
  ]),
  feedback_text: z.string().min(3),
  topic: z.string().min(1),
  sentiment: z.string().min(1),
  created_at: z.string().refine((value) => !Number.isNaN(Date.parse(value)), "Must be a date"),
  linked_roadmap_item: z.string().optional().default(""),
  severity: z.string().min(1),
  revenue_weight: z.coerce.number().min(0)
});

const interviewSchema = z.object({
  interview_id: z.string().min(1),
  user_id: z.string().min(1),
  researcher: z.string().min(1),
  topic: z.string().min(1),
  date: z.string().refine((value) => !Number.isNaN(Date.parse(value)), "Must be a date"),
  notes: z.string().min(3),
  linked_roadmap_item: z.string().optional().default("")
});

const roadmapSchema = z.object({
  roadmap_item_id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  product_area: z.string().min(1),
  priority: z.string().min(1),
  status: z.string().min(1),
  decision_date: z.string().refine((value) => !Number.isNaN(Date.parse(value)), "Must be a date"),
  owner: z.string().min(1),
  target_segment: z.string().min(1)
});

const schemas = {
  users: userSchema,
  accounts: accountSchema,
  feedback: feedbackSchema,
  interviews: interviewSchema,
  roadmap_items: roadmapSchema
};

export function parseCsv(text: string): Record<string, string>[] {
  return parse(text, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  }) as Record<string, string>[];
}

export function validateCsv(type: ImportType, text: string, previewLimit = 10): CsvPreviewResult {
  const rows = parseCsv(text);
  const headers = rows[0] ? Object.keys(rows[0]) : [];
  const missing = requiredColumns[type].filter((column) => !headers.includes(column));
  const errors: CsvValidationError[] = missing.map((column) => ({
    rowNumber: 0,
    field: column,
    message: `Missing required column: ${column}`,
    rawData: {}
  }));

  rows.forEach((row, index) => {
    const result = schemas[type].safeParse(row);
    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push({
          rowNumber: index + 2,
          field: String(issue.path[0] ?? "row"),
          message: issue.message,
          rawData: row
        });
      }
    }
  });

  return {
    type,
    headers,
    rows: rows.slice(0, previewLimit),
    errors,
    validRows: rows.length - errors.filter((error) => error.rowNumber > 0).length
  };
}
