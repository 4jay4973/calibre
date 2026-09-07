import { defineField, defineType } from "sanity";

// Mirrors the `ApproachStep` interface in lib/content/types.ts.
export const approachStep = defineType({
  name: "approachStep",
  title: "Approach step",
  type: "document",
  fields: [
    defineField({
      name: "index",
      title: "Index",
      type: "string",
      description: 'Stage label shown above the title, e.g. "Stage 01".',
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
    select: { title: "title", subtitle: "index" },
  },
});
