/**
 * Image variant generator — pre-signs multiple sizes × formats (JPEG + WebP)
 * for a stored image using Supabase Storage's on-the-fly image transformation.
 * Server-only. Consumed by hero.functions.ts inside handler bodies via
 * `await import(...)` to keep it out of client bundles.
 */
import { createClient } from "@supabase/supabase-js";

export type ImageFormatUrls = { jpg: string; webp: string };
export type ImageVariants = {
  original: string;
  sm: ImageFormatUrls;
  md: ImageFormatUrls;
  lg: ImageFormatUrls;
};

const VARIANT_SPECS = [
  { key: "sm", width: 480 },
  { key: "md", width: 900 },
  { key: "lg", width: 1600 },
] as const;

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

/** Parse a Supabase storage signed/public URL → { bucket, path }. */
export function extractStoragePath(
  signedUrl: string,
): { bucket: string; path: string } | null {
  try {
    const u = new URL(signedUrl);
    const m = u.pathname.match(
      /\/storage\/v1\/object\/(?:sign|public|authenticated)\/([^/]+)\/(.+)$/,
    );
    if (!m) return null;
    return { bucket: m[1], path: decodeURIComponent(m[2]) };
  } catch {
    return null;
  }
}

/**
 * Generate signed URLs for sm/md/lg × jpg/webp for the given stored image URL.
 * Returns null if the URL is missing or not a Supabase storage URL.
 */
export async function generateImageVariants(
  signedUrl: string | null | undefined,
): Promise<ImageVariants | null> {
  if (!signedUrl) return null;
  const parsed = extractStoragePath(signedUrl);
  if (!parsed) return null;

  const admin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  const variants: Partial<ImageVariants> = { original: signedUrl };

  for (const spec of VARIANT_SPECS) {
    const bucketApi = admin.storage.from(parsed.bucket);
    const [jpgRes, webpRes] = await Promise.all([
      bucketApi.createSignedUrl(parsed.path, TEN_YEARS, {
        transform: {
          width: spec.width,
          resize: "cover",
          quality: 82,
          format: "origin",
        },
      }),
      bucketApi.createSignedUrl(parsed.path, TEN_YEARS, {
        transform: {
          width: spec.width,
          resize: "cover",
          quality: 78,
          format: "webp",
        },
      }),
    ]);
    if (jpgRes.error || webpRes.error || !jpgRes.data || !webpRes.data) {
      // If transform pipeline is unavailable, bail out gracefully.
      return null;
    }
    variants[spec.key] = {
      jpg: jpgRes.data.signedUrl,
      webp: webpRes.data.signedUrl,
    };
  }

  return variants as ImageVariants;
}
