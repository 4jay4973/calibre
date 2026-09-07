import { defineField, defineType } from "sanity";

// The 8 IconKey union values from lib/content/types.ts.
export const ICON_KEYS = [
  "flask",
  "resin",
  "plant",
  "optimise",
  "diagnose",
  "qc",
  "sourcing",
  "compliance",
] as const;

// Mirrors the `Capability` interface in lib/content/types.ts.
export const capability = defineType({
  name: "capability",
  title: "Capability",
  type: "document",
  fields: [
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      description: "Which line icon to render (IconKey).",
      options: {
        list: ICON_KEYS.map((key) => ({ title: key, value: key })),
        layout: "dropdown",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Homepage card copy. Keep it short.",
      validation: (rule) => rule.required(),
    }),
    // --- Detail-page fields (all optional; not shown on the homepage card). ---
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      description: "URL segment for the future service detail page.",
    }),
    defineField({
      name: "overview",
      title: "Overview",
      type: "text",
      rows: 4,
      description: "Longer intro for the detail page.",
    }),
    defineField({
      name: "whatItCovers",
      title: "What it covers",
      type: "array",
      of: [{ type: "string" }],
      description: "Bullet points of what the service includes.",
    }),
    defineField({
      name: "whoItsFor",
      title: "Who it's for",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "relatedCaseStudies",
      title: "Related case studies",
      type: "array",
      of: [{ type: "reference", to: [{ type: "caseStudy" }] }],
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
    select: { title: "title", subtitle: "icon" },
  },
});
