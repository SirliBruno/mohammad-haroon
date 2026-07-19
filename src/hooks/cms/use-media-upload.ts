/**
 * Uploads a file to the `media` bucket, then registers a matching row in
 * the `media` CMS table so it shows up in the library.
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { createMedia } from "@/lib/cms/media.functions";
import { uploadMedia, getPublicUrl } from "@/services/storage";
import { cmsKeys } from "@/features/cms";

export interface MediaUploadInput {
  file: File;
  /** Optional folder inside the bucket. */
  folder?: string;
  alt?: string;
  caption?: string;
  tags?: string[];
}

function safeName(name: string) {
  return name.replace(/[^\w.-]+/g, "-").toLowerCase();
}

export function useMediaUpload() {
  const register = useServerFn(createMedia);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, folder, alt, caption, tags = [] }: MediaUploadInput) => {
      const path = `${folder ? folder.replace(/^\/+|\/+$/g, "") + "/" : ""}${Date.now()}-${safeName(file.name)}`;
      await uploadMedia({ path, file, contentType: file.type, upsert: false });

      const url = getPublicUrl(path);
      const kind = file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
        ? "video"
        : file.type.startsWith("audio/")
        ? "audio"
        : "other";

      return register({
        data: {
          kind,
          url,
          storage_path: path,
          filename: file.name,
          mime_type: file.type,
          size_bytes: file.size,
          alt: alt ?? null,
          caption: caption ?? null,
          tags,
        },
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: cmsKeys.media.all }),
  });
}
