// Sanity environment configuration.
// projectId + dataset come from env so the same code runs against any project.
// See .env.example for the variables and README for setup.

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your-project-id";

// Placeholder value shipped in .env.example. When the project is still the
// placeholder we treat Sanity as "not configured" and let the getters fall back
// to empty results so `next build` succeeds without an account. Once a real
// projectId is set (and the dataset seeded), content flows normally.
const PLACEHOLDER_PROJECT_ID = "your-project-id";

export const isSanityConfigured =
  !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== PLACEHOLDER_PROJECT_ID;

// Revalidation window (seconds) for ISR. Pages stay statically generated and
// are re-generated at most this often when content changes in Sanity.
export const revalidate = 60;
