export type ProjectScale = "personal" | "academic" | "startup" | "business" | "enterprise";
export type StructureMode = "strict" | "assistive";

export interface ProjectDetails {
  title: string;
  description: string;
  scale: ProjectScale;
  structureMode: StructureMode;
  projectType?: string;
  customHeadings?: string;
  advancedPrompt?: string;
  apiDetails?: string;
  pageLimit?: number;
}

export interface DocSection {
  id: string;
  title: string;
  content: string;
  subsections?: DocSection[];
}

export interface GeneratedDoc {
  title: string;
  sections: DocSection[];
  rawMarkdown: string;
  metadata: {
    generatedAt: string;
    version: string;
  };
}
