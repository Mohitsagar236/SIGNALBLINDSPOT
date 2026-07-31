import { describe, expect, it } from "vitest";
import { validateCsv } from "../lib/csv";

describe("CSV validation", () => {
  it("validates user rows", () => {
    const csv = `user_id,account_id,role,segment,region,language,plan,tenure_months,activity_level,accessibility_need,churn_status
U-1,A-1,Operator,SMB,India,Hindi,Starter,4,Medium,None,Active`;
    const result = validateCsv("users", csv);
    expect(result.errors).toHaveLength(0);
    expect(result.validRows).toBe(1);
  });

  it("reports missing columns", () => {
    const result = validateCsv("accounts", "account_id,company_name\nA-1,Atlas");
    expect(result.errors.some((error) => error.rowNumber === 0)).toBe(true);
  });

  it("reports row-level validation errors", () => {
    const csv = `feedback_id,user_id,account_id,source,feedback_text,topic,sentiment,created_at,linked_roadmap_item,severity,revenue_weight
F-1,U-1,A-1,Bad source,No,Topic,Negative,not-a-date,,High,1`;
    const result = validateCsv("feedback", csv);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
