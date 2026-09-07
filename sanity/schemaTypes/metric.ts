import { defineField, defineType } from "sanity";

// Mirrors the `Metric` interface in lib/content/types.ts.
export const metric = defineType({
  name: "metric",
  title: "Metric",
  type: "document",
  fields: [
    defineField({
      name: "value",
      title: "Value",
      type: "number",
      description: "The number that counts up, e.g. 40.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "suffix",
      title: "Suffix",
      type: "string",
      description: 'Optional unit shown after the number, e.g. "+".',
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "text",
      rows: 2,
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
    select: { title: "label", value: "value", suffix: "suffix" },
    prepare({ title, value, suffix }) {
      return { title: `${value ?? ""}${suffix ?? ""}`, subtitle: title };
    },
  },
});
