import { defineField, defineType } from "sanity";

// Singleton "Homepage / Site copy" settings document.
// Mirrors the `SiteCopy` interface in lib/content/types.ts. There is exactly one
// document of this type, with the fixed _id "siteCopy" (see sanity.config.ts,
// which pins it in the Studio and removes create/duplicate/delete).
// Every field is plain text; the homepage markup and styling stay in code.

/** Kicker + heading + intro — the standard homepage section header. */
function sectionHead(name: string, title: string, description: string) {
  return defineField({
    name,
    title,
    description,
    type: "object",
    options: { collapsible: true, collapsed: true },
    fields: [
      defineField({
        name: "kicker",
        title: "Kicker",
        type: "string",
        description: "Small label above the heading.",
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "heading",
        title: "Heading",
        type: "string",
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "intro",
        title: "Intro text",
        type: "text",
        rows: 3,
        description: "Short paragraph under the heading.",
        validation: (rule) => rule.required(),
      }),
    ],
  });
}

export const siteCopy = defineType({
  name: "siteCopy",
  title: "Homepage / Site copy",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Hero",
      description: "The first screen of the homepage.",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "eyebrow",
          title: "Eyebrow",
          type: "string",
          description: "Small line above the headline.",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "headlineStart",
          title: "Headline — text before the highlighted word",
          type: "string",
          description:
            "Spaces around the highlighted word are added automatically — don't type them.",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "highlightedWord",
          title: "Headline — highlighted word",
          type: "string",
          description:
            "Shown in the accent colour. Keep it to a word or two. Leave empty for no highlight.",
        }),
        defineField({
          name: "headlineEnd",
          title: "Headline — text after the highlighted word",
          type: "string",
          description: "Optional. Spaces are added automatically.",
        }),
        defineField({
          name: "lead",
          title: "Lead paragraph",
          type: "text",
          rows: 3,
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "ndaNote",
          title: "NDA note",
          type: "string",
          description: "The line next to the shield icon under the buttons.",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    sectionHead("capabilities", "What we do (capabilities)", "Header of the capabilities section."),
    sectionHead("sectors", "Who we work with (sectors)", "Header of the sector showcase."),
    sectionHead("approach", "How we work (approach)", "Header of the approach steps."),
    sectionHead("cases", "Selected work (case studies)", "Header of the case-study grid."),
    defineField({
      name: "confidentiality",
      title: "Confidentiality band",
      description: "The dark band with the NDA seal.",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "kicker", title: "Kicker", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "heading", title: "Heading", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "intro", title: "First paragraph", type: "text", rows: 3, validation: (rule) => rule.required() }),
        defineField({ name: "secondParagraph", title: "Second paragraph", type: "text", rows: 3 }),
      ],
    }),
    sectionHead("insights", "Insights", "Header of the insights grid."),
    defineField({
      name: "contact",
      title: "Contact",
      description:
        "Contact section (left column; the form itself is fixed). The email, phone and WhatsApp number are also shown in the footer.",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "kicker", title: "Kicker", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "heading", title: "Heading", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "intro", title: "Intro text", type: "text", rows: 3, validation: (rule) => rule.required() }),
        defineField({ name: "emailLabel", title: "Email — label", type: "string", validation: (rule) => rule.required() }),
        defineField({
          name: "email",
          title: "Email — public address",
          type: "string",
          description: "Shown on the site as a mailto link. (Enquiries from the form go to the inbox set on the server.)",
          validation: (rule) => rule.required().email(),
        }),
        defineField({ name: "phoneLabel", title: "Phone — label", type: "string", validation: (rule) => rule.required() }),
        defineField({
          name: "phone",
          title: "Phone — as displayed",
          type: "string",
          description: 'Include the country code, e.g. "+91 98765 43210". The call link uses its digits.',
          validation: (rule) =>
            rule.required().custom((v) =>
              typeof v === "string" && v.replace(/[^\d]/g, "").length >= 8
                ? true
                : "Enter a full phone number with country code.",
            ),
        }),
        defineField({
          name: "whatsapp",
          title: "WhatsApp number (optional)",
          type: "string",
          description:
            "Digits with country code, e.g. 919876543210. Leave empty to use the phone number above.",
          validation: (rule) =>
            rule.custom((v) =>
              !v || /^\+?[\d\s]{8,20}$/.test(v) ? true : "Digits only, with country code.",
            ),
        }),
        defineField({ name: "basedInLabel", title: "Location — label", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "basedIn", title: "Location — text", type: "string", validation: (rule) => rule.required() }),
      ],
    }),
    defineField({
      name: "about",
      title: "About the consultant",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "kicker", title: "Kicker", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "heading", title: "Heading", type: "string", validation: (rule) => rule.required() }),
        defineField({
          name: "role",
          title: "Role line",
          type: "string",
          description: "e.g. Principal Consultant · Paint, Coating & Resin Technology",
        }),
        defineField({
          name: "leadBio",
          title: "Lead bio (serif paragraph)",
          type: "text",
          rows: 4,
          validation: (rule) => rule.required(),
        }),
        defineField({ name: "secondBio", title: "Second bio paragraph", type: "text", rows: 4 }),
        defineField({
          name: "standards",
          title: "Standards chips",
          type: "array",
          of: [{ type: "string" }],
          description: "Each item is one chip. Remove all items to show no chips.",
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Homepage / Site copy" };
    },
  },
});
