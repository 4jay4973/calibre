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
