"use client";

// Configuration for the embedded Sanity Studio mounted at /studio.
// This runs in the browser (Studio is a client-side React app).
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";

// Singleton settings documents: one fixed _id each, pinned at the top of the
// Studio, and excluded from "create new" / duplicate / delete.
const SINGLETONS = [{ type: "siteCopy", id: "siteCopy", title: "Homepage / Site copy" }];
const singletonTypes = new Set(SINGLETONS.map((s) => s.type));
const singletonActions = new Set(["publish", "discardChanges", "restore"]);
// Enquiries arrive from the website form only: no "create new", no duplicate.
const formOnlyTypes = new Set(["enquiry"]);

export default defineConfig({
  name: "calibre",
  title: "Calibre Content",
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // No "create new" template for singleton types.
    templates: (templates) =>
      templates.filter(
        ({ schemaType }) => !singletonTypes.has(schemaType) && !formOnlyTypes.has(schemaType),
      ),
  },
  document: {
    // Singletons can be edited and published, but not duplicated or deleted.
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : formOnlyTypes.has(context.schemaType)
          ? input.filter(({ action }) => action !== "duplicate")
          : input,
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            ...SINGLETONS.map((s) =>
              S.listItem()
                .title(s.title)
                .id(s.id)
                .child(S.document().schemaType(s.type).documentId(s.id).title(s.title)),
            ),
            S.listItem()
              .title("Enquiries")
              .id("enquiry")
              .schemaType("enquiry")
              .child(
                S.documentTypeList("enquiry")
                  .title("Enquiries")
                  .defaultOrdering([{ field: "submittedAt", direction: "desc" }]),
              ),
            S.divider(),
            ...S.documentTypeListItems().filter((item) => {
              const id = item.getId() ?? "";
              return !singletonTypes.has(id) && !formOnlyTypes.has(id);
            }),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
