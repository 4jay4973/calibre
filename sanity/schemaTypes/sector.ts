import { defineField, defineType } from "sanity";

// The 5 SwatchKind union values from lib/content/types.ts.
export const SWATCH_KINDS = ["arch", "ind", "wood", "auto", "const"] as const;

// Mirrors the `Sector` interface in lib/content/types.ts.
// `slug` is stored as a Sanity slug and projected to `slug.current` (a plain
// string) in GROQ, matching the string field on the type.
export const sector = defineType({
  name: "sector",
  title: "Sector",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "swatch",
      title: "Swatch",
      type: "string",
      description: "Finish texture rendered in the swatch (SwatchKind).",
      options: {
        list: SWATCH_KINDS.map((k) => ({ title: k, value: k })),
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "finishLabel",
      title: "Finish label",
      type: "string",
      description: 'e.g. "Typical finish · matte emulsion".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.required().min(1),
    }),
    // --- Cross-links (optional) — for the future sector detail page. ---
    defineField({
      name: "relatedServices",
      title: "Related services",
      type: "array",
      of: [{ type: "reference", to: [{ type: "capability" }] }],
      description: "Services most relevant to this sector.",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Display order (ascending).",
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "finishLabel" },
  },
});
