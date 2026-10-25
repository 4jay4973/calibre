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

export default defineConfig({
  name: "calibre",
  title: "Calibre Content",
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // No "create new" template for singleton types.
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    // Singletons can be edited and published, but not duplicated or deleted.
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
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
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => !singletonTypes.has(item.getId() ?? ""),
            ),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
