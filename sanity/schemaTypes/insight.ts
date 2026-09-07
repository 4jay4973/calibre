import { defineField, defineType } from "sanity";

// Mirrors the `Insight` interface in lib/content/types.ts.
export const insight = defineType({
  name: "insight",
  title: "Insight",
  type: "document",
  fields: [
    defineField({
      name: "topic",
      title: "Topic",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      title: "Link (href)",
      type: "string",
      description:
        'External/legacy link for the homepage card. Use "#" or the internal ' +
        "slug path once the article page exists.",
      validation: (rule) => rule.required(),
    }),
    // --- Detail-page (article) fields — all optional. ---
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      description: "URL segment for the future article page.",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
      description: "The article content.",
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "date",
      options: { dateFormat: "YYYY-MM-DD" },
    }),
    defineField({
      name: "readMinutes",
      title: "Read time (minutes)",
      type: "number",
      validation: (rule) => rule.min(1).integer(),
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
    select: { title: "title", subtitle: "topic" },
  },
});
