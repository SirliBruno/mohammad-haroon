/**
 * Storage service — thin wrapper around Supabase Storage for the `media`
 * bucket. UI never talks to Supabase directly; it goes through here so we
 * can swap implementations without touching components.
 */
import { supabase } from "@/integrations/supabase/client";

export const MEDIA_BUCKET = "media";

export interface UploadOptions {
  /** Relative path inside the bucket, e.g. `projects/hero.png`. */
  path: string;
  file: File | Blob;
  contentType?: string;
  upsert?: boolean;
}

export async function uploadMedia({ path, file, contentType, upsert = false }: UploadOptions) {
  const { data, error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { contentType, upsert });
  if (error) throw error;
  return data;
}

export async function removeMedia(paths: string[]) {
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove(paths);
  if (error) throw error;
}

/**
 * Signed, time-limited URL for a private object. Prefer this for anything
 * shown on the site since the bucket is private by workspace policy.
 */
export async function getSignedUrl(path: string, expiresInSec = 60 * 60) {
  const { data, error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .createSignedUrl(path, expiresInSec);
  if (error) throw error;
  return data.signedUrl;
}

export function getPublicUrl(path: string) {
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}
