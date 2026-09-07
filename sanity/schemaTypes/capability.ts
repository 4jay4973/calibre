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
    select: { title: "title", subtitle: "icon" },
  },
});
