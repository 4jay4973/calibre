import { defineField, defineType } from "sanity";

// Mirrors the `CaseStudy` interface in lib/content/types.ts.
export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case study",
  type: "document",
  fields: [
    defineField({
      name: "tag",
      title: "Tag",
      type: "string",
      description: 'e.g. "Decorative emulsion · Western India".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "challenge",
      title: "Challenge",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "approach",
      title: "Approach",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "resultValue",
      title: "Result value",
      type: "string",
      description: 'The headline figure, e.g. "12% → <2%".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "resultNote",
      title: "Result note",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    // --- Detail-page fields (all optional). Stays BLINDED: never add fields
    //     that identify the client (name, logo, location beyond the region tag). ---
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      description: "URL segment for the future case-study detail page.",
    }),
    defineField({
      name: "bodyDetail",
      title: "Body (detailed writeup)",
      type: "array",
      of: [{ type: "block" }],
      description: "Fuller, still-blinded writeup for the detail page.",
    }),
    defineField({
      name: "sector",
      title: "Sector",
      type: "reference",
      to: [{ type: "sector" }],
    }),
    defineField({
      name: "relatedServices",
      title: "Related services",
      type: "array",
      of: [{ type: "reference", to: [{ type: "capability" }] }],
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
    select: { title: "title", subtitle: "tag" },
  },
});
