import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextValue } from "@/lib/content";

// Map Sanity Portable Text onto the site's typography. Body copy renders in
// Source Serif 4 via the `.pt-body` wrapper; headings fall back to Archivo
// (both handled in app/globals.css). Lists, strong/em use sensible defaults.
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = (value?.href as string) ?? "#";
      const external = /^https?:\/\//.test(href);
      return (
        <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
          {children}
        </a>
      );
    },
  },
};

/**
 * Renders Sanity Portable Text with the site's typography. Presentational only.
 */
export function PortableTextBody({ value }: { value?: PortableTextValue }) {
  if (!value?.length) return null;
  return (
    <div className="pt-body">
      <PortableText value={value} components={components} />
    </div>
  );
}
