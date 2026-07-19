/**
 * Write-side hooks. Each mutation is bound to a server function through
 * `useServerFn`, then wrapped in `useMutation` with the right cache
 * invalidation. The visual CMS layer (built later) plugs in here.
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { cmsKeys } from "@/features/cms";

import {
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/cms/projects.functions";
import {
  createService,
  updateService,
  deleteService,
} from "@/lib/cms/services.functions";
import {
  createMedia,
  updateMedia,
  deleteMedia,
} from "@/lib/cms/media.functions";
import {
  updateMessage,
  deleteMessage,
  submitMessage,
} from "@/lib/cms/messages.functions";

function useInvalidate(keys: readonly (readonly unknown[])[]) {
  const qc = useQueryClient();
  return () => keys.forEach((queryKey) => qc.invalidateQueries({ queryKey }));
}

// ---------- Projects ----------
export function useCreateProject() {
  const fn = useServerFn(createProject);
  const invalidate = useInvalidate([cmsKeys.projects.all]);
  return useMutation({ mutationFn: fn, onSuccess: invalidate });
}
export function useUpdateProject() {
  const fn = useServerFn(updateProject);
  const invalidate = useInvalidate([cmsKeys.projects.all]);
  return useMutation({ mutationFn: fn, onSuccess: invalidate });
}
export function useDeleteProject() {
  const fn = useServerFn(deleteProject);
  const invalidate = useInvalidate([cmsKeys.projects.all]);
  return useMutation({ mutationFn: fn, onSuccess: invalidate });
}

// ---------- Services ----------
export function useCreateService() {
  const fn = useServerFn(createService);
  const invalidate = useInvalidate([cmsKeys.services.all]);
  return useMutation({ mutationFn: fn, onSuccess: invalidate });
}
export function useUpdateService() {
  const fn = useServerFn(updateService);
  const invalidate = useInvalidate([cmsKeys.services.all]);
  return useMutation({ mutationFn: fn, onSuccess: invalidate });
}
export function useDeleteService() {
  const fn = useServerFn(deleteService);
  const invalidate = useInvalidate([cmsKeys.services.all]);
  return useMutation({ mutationFn: fn, onSuccess: invalidate });
}

// ---------- Media ----------
export function useCreateMedia() {
  const fn = useServerFn(createMedia);
  const invalidate = useInvalidate([cmsKeys.media.all]);
  return useMutation({ mutationFn: fn, onSuccess: invalidate });
}
export function useUpdateMedia() {
  const fn = useServerFn(updateMedia);
  const invalidate = useInvalidate([cmsKeys.media.all]);
  return useMutation({ mutationFn: fn, onSuccess: invalidate });
}
export function useDeleteMedia() {
  const fn = useServerFn(deleteMedia);
  const invalidate = useInvalidate([cmsKeys.media.all]);
  return useMutation({ mutationFn: fn, onSuccess: invalidate });
}

// ---------- Messages ----------
export function useSubmitMessage() {
  return useMutation({ mutationFn: useServerFn(submitMessage) });
}
export function useUpdateMessage() {
  const fn = useServerFn(updateMessage);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cms", "messages"] }),
  });
}
export function useDeleteMessage() {
  const fn = useServerFn(deleteMessage);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cms", "messages"] }),
  });
}
