// Shared domain types for the content-management workflow.

export type CaseStudyStatus = "draft" | "pending" | "published";

export interface CaseMetric {
  label: string;
  value: string;
}

export interface CaseStudy {
  id: string;
  slug: string;
  client: string;
  industry: string;
  title: string;
  summary: string;
  body: string;
  metrics: CaseMetric[];
  tags: string[];
  status: CaseStudyStatus;
  featured: boolean;
  createdBy: string; // email of the editor who created it
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export type Role = "editor" | "admin";

export interface User {
  email: string;
  name: string;
  role: Role;
}
