import type { SchemaTypeDefinition } from "sanity";

import { metric } from "./metric";
import { capability } from "./capability";
import { sector } from "./sector";
import { approachStep } from "./approachStep";
import { caseStudy } from "./caseStudy";
import { insight } from "./insight";

// Registry of every document type. These map 1:1 to lib/content/types.ts.
export const schemaTypes: SchemaTypeDefinition[] = [
  metric,
  capability,
  sector,
  approachStep,
  caseStudy,
  insight,
];
