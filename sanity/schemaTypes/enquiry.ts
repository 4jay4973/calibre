import { defineField, defineType } from "sanity";

// Contact-form submissions, created by app/api/contact/route.ts (never in the
// Studio). Ids are "enquiries.<uuid>": the dot puts them in a sub-path, which a
// public dataset does NOT expose to unauthenticated reads — only signed-in
// Studio users and token holders can see them.
// The submitted fields are read-only; the team tracks follow-up with
// `status` and `notes`.
export const enquiry = defineType({
  name: "enquiry",
  title: "Enquiry",
  type: "document",
  fields: [
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Replied", value: "replied" },
          { title: "Closed", value: "closed" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "new",
    }),
    defineField({ name: "notes", title: "Internal notes", type: "text", rows: 3 }),
    defineField({ name: "submittedAt", title: "Submitted", type: "datetime", readOnly: true }),
    defineField({ name: "name", title: "Name", type: "string", readOnly: true }),
    defineField({ name: "company", title: "Company", type: "string", readOnly: true }),
    defineField({ name: "email", title: "Email", type: "string", readOnly: true }),
    defineField({ name: "phone", title: "Phone", type: "string", readOnly: true }),
    defineField({ name: "projectType", title: "What they need help with", type: "string", readOnly: true }),
    defineField({ name: "message", title: "Project details", type: "text", rows: 8, readOnly: true }),
    defineField({
      name: "emailDelivered",
      title: "Email notification sent",
      type: "boolean",
      readOnly: true,
      description: "Whether the notification email was delivered when this enquiry arrived.",
    }),
  ],
  orderings: [
    { title: "Newest first", name: "submittedDesc", by: [{ field: "submittedAt", direction: "desc" }] },
  ],
  preview: {
    select: { name: "name", company: "company", projectType: "projectType", submittedAt: "submittedAt", status: "status" },
    prepare({ name, company, projectType, submittedAt, status }) {
      const date = submittedAt ? new Date(submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";
      const flag = status === "new" ? "● " : "";
      return {
        title: `${flag}${name ?? "Unknown"}${company ? ` — ${company}` : ""}`,
        subtitle: [projectType, date].filter(Boolean).join(" · "),
      };
    },
  },
});
