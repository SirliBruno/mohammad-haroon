import { useState, useMemo, useEffect, useRef } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Folder,
  FolderOpen,
  FolderPlus,
  Plus,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
  Save,
  RotateCcw,
  Check,
  Search,
  FolderTree,
  Upload,
  Layers,
  Sparkles,
  ChevronRight,
  Eye,
  Star,
  UploadCloud,
  Loader2,
  CheckCircle2,
  Copy,
  Link as LinkIcon,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  adminListClientWorks,
  adminSaveClientWork,
  adminDeleteClientWork,
} from "@/lib/cms/client-works.functions";
import { signHeroMediaPath } from "@/lib/cms/hero.functions";
import { supabase } from "@/integrations/supabase/client";
import { getOptimizedImageUrl } from "@/lib/optimized-images";
import type { ClientEntity, DeliverableFolder } from "@/data/client-works";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/client-works")({
  component: AdminClientWorksPage,
  head: () => ({ meta: [{ title: "إدارة مجلدات وملفات الأعمال" }] }),
});

const CATEGORIES = ["هوية", "متاجر", "مواقع", "أنظمة", "مطبوعات", "تسويق"] as const;

export function AdminClientWorksPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const listFn = useServerFn(adminListClientWorks);
  const saveFn = useServerFn(adminSaveClientWork);
  const deleteFn = useServerFn(adminDeleteClientWork);
  const signMedia = useServerFn(signHeroMediaPath);

  const { data: rawEntities = [], isLoading } = useQuery({
    queryKey: ["admin-client-works"],
    queryFn: () => listFn(),
    staleTime: 30_000,
  });

  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Local draft state for the active editing entity
  const [draft, setDraft] = useState<ClientEntity | null>(null);
  const [activeFolderIndex, setActiveFolderIndex] = useState<number>(0);

  // Upload & File state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [autoSetAsCover, setAutoSetAsCover] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const entityCoverInputRef = useRef<HTMLInputElement>(null);

  // Direct URL input state
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [newImageSrc, setNewImageSrc] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");

  // Sync initial selection
  useEffect(() => {
    if (!selectedId && rawEntities.length > 0) {
      setSelectedId(rawEntities[0].id);
      setDraft(JSON.parse(JSON.stringify(rawEntities[0])));
      setActiveFolderIndex(0);
    }
  }, [rawEntities, selectedId]);

  const filteredEntities = useMemo(() => {
    return rawEntities.filter((e) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.folders.some((f) => f.title.toLowerCase().includes(q))
      );
    });
  }, [rawEntities, search]);

  // Set active entity reference
  const activeEntity = useMemo(() => {
    if (draft && draft.id === selectedId) return draft;
    if (selectedId) {
      const found = rawEntities.find((e) => e.id === selectedId);
      if (found) return found;
    }
    return rawEntities[0] || null;
  }, [rawEntities, selectedId, draft]);

  const currentEntity = draft || activeEntity;
  const currentFolder: DeliverableFolder | undefined = currentEntity?.folders[activeFolderIndex];

  const currentWorkCover =
    currentEntity?.cover ||
    currentEntity?.folders[0]?.cover ||
    currentEntity?.folders[0]?.images[0]?.src ||
    "";

  const currentFolderCover =
    currentFolder?.cover ||
    currentFolder?.images[0]?.src ||
    "";

  const selectEntity = (entity: ClientEntity) => {
    setSelectedId(entity.id);
    setDraft(JSON.parse(JSON.stringify(entity)));
    setActiveFolderIndex(0);
    setNewImageSrc("");
    setNewImageAlt("");
  };

  // Mutation to save
  const saveMutation = useMutation({
    mutationFn: async (entityToSave: ClientEntity) => {
      return await saveFn({ data: { entity: entityToSave } });
    },
    onSuccess: (res) => {
      toast.success(`تم حفظ مجلدات وملفات "${res.entity.name}" بنجاح`);
      queryClient.invalidateQueries({ queryKey: ["admin-client-works"] });
      queryClient.invalidateQueries({ queryKey: ["client-works-public"] });
      router.invalidate();
      setDraft(JSON.parse(JSON.stringify(res.entity)));
      setSelectedId(res.entity.id);
    },
    onError: (err: Error) => {
      toast.error(err.message || "حدث خطأ أثناء الحفظ");
    },
  });

  // Mutation to reset to default
  const resetMutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteFn({ data: { id } });
    },
    onSuccess: () => {
      toast.success("تمت استعادة الإعدادات الافتراضية للجهة");
      queryClient.invalidateQueries({ queryKey: ["admin-client-works"] });
      queryClient.invalidateQueries({ queryKey: ["client-works-public"] });
      router.invalidate();
      setDraft(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || "فشلت الاستعادة");
    },
  });

  // Helper actions on folders
  const addFolder = () => {
    if (!currentEntity) return;
    const newFolderId = `${currentEntity.id}-folder-${Date.now().toString(36)}`;
    const newFolder: DeliverableFolder = {
      id: newFolderId,
      title: "مجلد جديد",
      category: currentEntity.category || "هوية",
      summary: `أعمال وتصاميم جديدة لـ ${currentEntity.name}`,
      cover: "",
      images: [],
    };
    const updated = {
      ...currentEntity,
      folders: [...currentEntity.folders, newFolder],
    };
    setDraft(updated);
    setActiveFolderIndex(updated.folders.length - 1);
    toast.info("تمت إضافة مجلد جديد. أضف الصور والتصاميم ثم اضغط حفظ التغييرات.");
  };

  const removeFolder = (index: number) => {
    if (!currentEntity) return;
    if (currentEntity.folders.length <= 1) {
      toast.error("يجب الإبقاء على مجلد واحد على الأقل للجهة.");
      return;
    }
    const confirmed = window.confirm(`هل أنت متأكد من حذف المجلد "${currentEntity.folders[index]?.title}"؟`);
    if (!confirmed) return;

    const nextFolders = currentEntity.folders.filter((_, i) => i !== index);
    setDraft({
      ...currentEntity,
      folders: nextFolders,
    });
    setActiveFolderIndex(Math.max(0, index - 1));
    toast.info("تم حذف المجلد محلياً. اضغط حفظ لتطبيق التغيير.");
  };

  const updateFolderField = <K extends keyof DeliverableFolder>(key: K, value: DeliverableFolder[K]) => {
    if (!currentEntity || !currentFolder) return;
    const nextFolders = [...currentEntity.folders];
    nextFolders[activeFolderIndex] = {
      ...nextFolders[activeFolderIndex],
      [key]: value,
    };
    setDraft({
      ...currentEntity,
      folders: nextFolders,
    });
  };

  // Helper to upload files directly into current folder
  const uploadFiles = async (files: FileList | File[], setAsCover = false) => {
    if (!currentEntity || !currentFolder) {
      toast.error("يرجى اختيار جهة عمل ومجلد أولاً.");
      return;
    }

    const fileList = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (fileList.length === 0) {
      toast.error("يرجى اختيار ملفات صور صالحة (PNG, JPG, WEBP, SVG, GIF).");
      return;
    }

    setIsUploading(true);
    const uploadedImages: Array<{ src: string; alt: string }> = [];

    try {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        setUploadStatus(`جارٍ رفع (${i + 1} من ${fileList.length}): ${file.name}`);

        const ext = (file.name.split(".").pop() ?? "png").toLowerCase();
        const safeEntityId = currentEntity.id.replace(/[^a-zA-Z0-9_\-\.]/g, "-");
        const safeFolderId = currentFolder.id.replace(/[^a-zA-Z0-9_\-\.]/g, "-");
        const path = `projects/client-works/${safeEntityId}/${safeFolderId}/${crypto.randomUUID()}.${ext}`;

        const { error: upErr } = await supabase.storage
          .from("media")
          .upload(path, file, { contentType: file.type, upsert: false });

        if (upErr) throw upErr;

        const { url } = (await signMedia({ data: { path } })) as { url: string };
        if (!url) throw new Error("تعذر إنشاء رابط الصورة الموقّع من السيرفر.");

        const cleanAlt = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]/g, " ")
          .trim() || currentFolder.title;

        uploadedImages.push({ src: url, alt: cleanAlt });
      }

      // Add uploaded images directly to folder
      setDraft((prevDraft) => {
        if (!prevDraft) return prevDraft;
        const nextFolders = [...prevDraft.folders];
        const targetFolder = nextFolders[activeFolderIndex];
        if (!targetFolder) return prevDraft;

        const shouldCover = setAsCover || autoSetAsCover || !targetFolder.cover;
        const firstSrc = uploadedImages[0]?.src;
        const nextCover = shouldCover && firstSrc ? firstSrc : targetFolder.cover;

        let combined = [...targetFolder.images, ...uploadedImages];
        if (shouldCover && firstSrc) {
          const coverImg = combined.find((img) => img.src === nextCover);
          const others = combined.filter((img) => img.src !== nextCover);
          combined = coverImg ? [coverImg, ...others] : combined;
        }

        nextFolders[activeFolderIndex] = {
          ...targetFolder,
          cover: nextCover,
          images: combined,
        };

        const nextWorkCover =
          shouldCover && firstSrc && (!prevDraft.cover || setAsCover)
            ? firstSrc
            : prevDraft.cover;

        return {
          ...prevDraft,
          cover: nextWorkCover,
          folders: nextFolders,
        };
      });

      toast.success(
        `تم بنجاح رفع وإضافة ${uploadedImages.length} صورة إلى مجلد "${currentFolder.title}". اضغط "حفظ التغييرات" لتثبيتها.`,
      );
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(`فشل رفع الصور: ${err.message || "خطأ غير متوقع"}`);
    } finally {
      setIsUploading(false);
      setUploadStatus(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Helper to upload a main work cover directly
  const uploadWorkCoverDirect = async (file: File) => {
    if (!currentEntity) return;
    try {
      setIsUploading(true);
      setUploadStatus(`جارٍ رفع غلاف العمل: ${file.name}...`);
      const ext = (file.name.split(".").pop() ?? "png").toLowerCase();
      const safeEntityId = currentEntity.id.replace(/[^a-zA-Z0-9_\-\.]/g, "-");
      const path = `projects/client-works/${safeEntityId}/cover/${crypto.randomUUID()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("media")
        .upload(path, file, { contentType: file.type, upsert: false });

      if (upErr) throw upErr;

      const { url } = (await signMedia({ data: { path } })) as { url: string };
      if (!url) throw new Error("تعذر إنشاء رابط الصورة الموقّع");

      const cleanAlt = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") || currentEntity.name;
      const newImg = { src: url, alt: cleanAlt };

      // Also append to the primary folder so it's part of the files list
      setDraft((prevDraft) => {
        if (!prevDraft) return prevDraft;
        const nextFolders = [...prevDraft.folders];
        if (nextFolders.length > 0) {
          const f0 = nextFolders[0];
          nextFolders[0] = {
            ...f0,
            cover: url,
            images: [newImg, ...f0.images.filter((img) => img.src !== url)],
          };
        }
        return {
          ...prevDraft,
          cover: url,
          folders: nextFolders,
        };
      });

      toast.success(`تم تعيين "${file.name}" كغلاف رئيسي للعمل وإضافتها للمجلد الرئيسي!`);
    } catch (err: any) {
      console.error("Cover upload error:", err);
      toast.error(`فشل رفع الغلاف: ${err.message || "خطأ غير متوقع"}`);
    } finally {
      setIsUploading(false);
      setUploadStatus(null);
      if (entityCoverInputRef.current) entityCoverInputRef.current.value = "";
    }
  };

  // Helper actions on images inside active folder
  const addImageToFolderByUrl = () => {
    if (!currentEntity || !currentFolder) return;
    if (!newImageSrc.trim()) {
      toast.error("يرجى إدخال رابط الصورة أولاً.");
      return;
    }
    const cleanSrc = newImageSrc.trim();
    const cleanAlt = newImageAlt.trim() || currentFolder.title;
    const newImg = { src: cleanSrc, alt: cleanAlt };

    const shouldSetCover = !currentFolder.cover;
    const nextImages = shouldSetCover
      ? [newImg, ...currentFolder.images]
      : [...currentFolder.images, newImg];
    const nextCover = shouldSetCover ? cleanSrc : currentFolder.cover;

    const nextFolders = [...currentEntity.folders];
    nextFolders[activeFolderIndex] = {
      ...currentFolder,
      cover: nextCover,
      images: nextImages,
    };

    setDraft({
      ...currentEntity,
      cover: currentEntity.cover || (shouldSetCover ? cleanSrc : undefined),
      folders: nextFolders,
    });

    setNewImageSrc("");
    setNewImageAlt("");
    toast.success("تمت إضافة رابط الصورة إلى المجلد بنجاح. اضغط حفظ التغييرات.");
  };

  const removeImageFromFolder = (imgIndex: number) => {
    if (!currentEntity || !currentFolder) return;
    const targetImg = currentFolder.images[imgIndex];
    if (!targetImg) return;

    const deletedSrc = targetImg.src;
    const nextImages = currentFolder.images.filter((_, i) => i !== imgIndex);
    const nextCover =
      currentFolder.cover === deletedSrc
        ? nextImages[0]?.src || ""
        : currentFolder.cover;

    const nextFolders = [...currentEntity.folders];
    nextFolders[activeFolderIndex] = {
      ...currentFolder,
      cover: nextCover,
      images: nextImages,
    };

    let nextEntityCover = currentEntity.cover;
    if (nextEntityCover === deletedSrc) {
      nextEntityCover = nextCover || undefined;
    }

    setDraft({
      ...currentEntity,
      cover: nextEntityCover,
      folders: nextFolders,
    });
    toast.info("تم حذف الصورة من المجلد محلياً. اضغط على 'حفظ التغييرات' لتثبيت التعديل.");
  };

  const setAsFolderCover = (src: string) => {
    if (!currentEntity || !currentFolder) return;
    const coverImg = currentFolder.images.find((img) => img.src === src);
    const others = currentFolder.images.filter((img) => img.src !== src);
    const reordered = coverImg ? [coverImg, ...others] : currentFolder.images;

    const nextFolders = [...currentEntity.folders];
    nextFolders[activeFolderIndex] = {
      ...currentFolder,
      cover: src,
      images: reordered,
    };

    setDraft({
      ...currentEntity,
      folders: nextFolders,
    });
    toast.success("تم تعيين الصورة كغلاف لهذا المجلد ونقلها لمقدمة التصاميم.");
  };

  const setAsWorkCover = (src: string) => {
    if (!currentEntity || !currentFolder) return;
    const coverImg = currentFolder.images.find((img) => img.src === src);
    const others = currentFolder.images.filter((img) => img.src !== src);
    const reordered = coverImg ? [coverImg, ...others] : currentFolder.images;

    const nextFolders = [...currentEntity.folders];
    nextFolders[activeFolderIndex] = {
      ...currentFolder,
      cover: src,
      images: reordered,
    };

    // If current folder is not the first folder, bring it to the top so it's showcased first everywhere
    if (activeFolderIndex !== 0) {
      const activeF = nextFolders.splice(activeFolderIndex, 1)[0];
      nextFolders.unshift(activeF);
      setActiveFolderIndex(0);
    }

    setDraft({
      ...currentEntity,
      cover: src,
      folders: nextFolders,
    });
    toast.success("تم تعيين الصورة كغلاف رئيسي للعمل وجعل هذا المجلد في صدارة العرض!");
  };

  const addNewClient = () => {
    const name = window.prompt("أدخل اسم الجهة أو المشروع الجديد (مثال: متجر الرياض):");
    if (!name?.trim()) return;
    const slug =
      name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\u0600-\u06FF-]/g, "") || `work-${Date.now().toString(36)}`;
    const newEntity: ClientEntity = {
      id: slug,
      name: name.trim(),
      tagline: `أعمال وتصاميم لـ ${name.trim()}`,
      description: `مجموعة أعمال مميزة تم تنفيذها لـ ${name.trim()}.`,
      category: "هوية",
      categoryLabel: "هوية وشعارات",
      year: new Date().getFullYear(),
      services: ["هوية بصرية"],
      mainSlug: slug,
      cover: "",
      folders: [
        {
          id: `${slug}-folder-1`,
          title: "صور الهوية",
          category: "هوية",
          summary: `مجلد صور الهوية لـ ${name.trim()}`,
          cover: "",
          images: [],
        },
      ],
    };
    selectEntity(newEntity);
    toast.success(`تم إنشاء "${name.trim()}". أضف المجلدات والملفات ثم اضغط حفظ.`);
  };

  return (
    <AdminShell
      title="مجلدات وملفات الأعمال"
      description="تحكم كامل في مجلدات وأقسام العمل للجهات، رفع الصور مباشرة للمجلدات وتعيين أغلفة الأعمال والمجلدات لتظهر مباشرة في الموقع."
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={addNewClient}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground transition-all hover:bg-muted"
          >
            <Plus className="size-3.5 text-accent" />
            <span>+ جهة عمل جديدة</span>
          </button>
          {currentEntity && (
            <button
              type="button"
              disabled={saveMutation.isPending}
              onClick={() => currentEntity && saveMutation.mutate(currentEntity)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-4 py-2 text-xs font-bold text-background transition-all hover:bg-foreground/90 disabled:opacity-50 shadow-xs"
            >
              {saveMutation.isPending ? (
                <Loader2 className="size-3.5 animate-spin text-accent" />
              ) : (
                <Save className="size-3.5 text-accent" />
              )}
              <span>{saveMutation.isPending ? "جارٍ الحفظ..." : "حفظ التغييرات"}</span>
            </button>
          )}
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar: Clients / Works List */}
        <div className="lg:col-span-4 flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <FolderTree className="size-4 text-accent" />
              <span>جهات ومشاريع الأعمال ({filteredEntities.length})</span>
            </span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="ابحث عن جهة أو مجلد..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border/80 bg-muted/40 py-2 pr-9 pl-3 text-xs focus:border-foreground/40 focus:outline-none"
            />
          </div>

          {/* List */}
          <div className="flex flex-col gap-1.5 max-h-[650px] overflow-y-auto pr-1">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
                <Loader2 className="size-4 animate-spin text-accent" />
                <span>جارٍ تحميل الأعمال...</span>
              </div>
            ) : filteredEntities.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">لا توجد نتائج مطابقة</div>
            ) : (
              filteredEntities.map((entity) => {
                const isSelected = (currentEntity?.id || rawEntities[0]?.id) === entity.id;
                const totalFiles =
                  entity.totalFiles ?? entity.folders.reduce((acc, f) => acc + f.images.length, 0);
                return (
                  <button
                    key={entity.id}
                    type="button"
                    onClick={() => selectEntity(entity)}
                    className={cn(
                      "flex items-start justify-between gap-2 rounded-xl p-3 text-right transition-all",
                      isSelected
                        ? "bg-foreground text-background shadow-xs ring-2 ring-foreground/20"
                        : "border border-border/60 bg-muted/20 hover:border-foreground/30 hover:bg-muted/40",
                    )}
                  >
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-xs font-bold">{entity.name}</span>
                        {(entity as any).isCustomized && (
                          <span
                            className={cn(
                              "rounded-md px-1.5 py-0.2 text-[9px] font-semibold shrink-0",
                              isSelected
                                ? "bg-accent text-accent-foreground"
                                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30",
                            )}
                          >
                            مُعدّل
                          </span>
                        )}
                      </div>
                      <span
                        className={cn(
                          "mt-1 text-[11px] truncate",
                          isSelected ? "text-background/80" : "text-muted-foreground",
                        )}
                      >
                        {entity.categoryLabel || entity.category} • {entity.year}
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-[10px] font-semibold",
                          isSelected ? "bg-background/20 text-background" : "bg-muted text-foreground",
                        )}
                      >
                        {entity.folders.length} مجلدات
                      </span>
                      <span
                        className={cn(
                          "text-[10px]",
                          isSelected ? "text-background/70" : "text-muted-foreground",
                        )}
                      >
                        {totalFiles} ملف
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Main Work Area: Deliverable Folders & Files */}
        {currentEntity ? (
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Entity Header & Meta Card */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold text-foreground">{currentEntity.name}</h2>
                    <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
                      {currentEntity.categoryLabel || currentEntity.category}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">{currentEntity.year}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{currentEntity.tagline}</p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <a
                    href={`/work`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted/40 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <span>معاينة في صفحة الأعمال</span>
                    <ExternalLink className="size-3 text-accent" />
                  </a>

                  {(currentEntity as any).isCustomized && (
                    <button
                      type="button"
                      disabled={resetMutation.isPending}
                      onClick={() => {
                        if (window.confirm("هل تريد استعادة البيانات الافتراضية لهذه الجهة؟")) {
                          resetMutation.mutate(currentEntity.id);
                        }
                      }}
                      className="inline-flex items-center gap-1 rounded-xl border border-red-500/20 bg-red-500/10 px-2.5 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/20"
                      title="استعادة المجلدات الأصلية"
                    >
                      <RotateCcw className="size-3" />
                      <span>استعادة الأصل</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Editable Entity Meta Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground">اسم الجهة / المشروع</label>
                  <input
                    type="text"
                    value={currentEntity.name}
                    onChange={(e) => setDraft({ ...currentEntity, name: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border/80 bg-muted/30 p-2 focus:border-foreground/40 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground">التصنيف</label>
                  <select
                    value={currentEntity.category}
                    onChange={(e) => {
                      const cat = e.target.value as any;
                      const labels: Record<string, string> = {
                        "هوية": "هوية وشعارات",
                        "متاجر": "متاجر إلكترونية",
                        "مواقع": "مواقع وأنظمة",
                        "أنظمة": "أنظمة ولوحات تحكم",
                        "مطبوعات": "مطبوعات وتغليف",
                        "تسويق": "إعلانات وسوشيال ميديا",
                      };
                      setDraft({
                        ...currentEntity,
                        category: cat,
                        categoryLabel: labels[cat] || cat,
                      });
                    }}
                    className="mt-1 w-full rounded-xl border border-border/80 bg-muted/30 p-2 focus:border-foreground/40 focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground">السنة</label>
                  <input
                    type="number"
                    value={currentEntity.year}
                    onChange={(e) => setDraft({ ...currentEntity, year: Number(e.target.value) || 2026 })}
                    className="mt-1 w-full rounded-xl border border-border/80 bg-muted/30 p-2 focus:border-foreground/40 focus:outline-none"
                  />
                </div>
              </div>

              {/* Work Main Cover Showcase & Quick Uploader */}
              <div className="mt-1 rounded-xl border border-border/70 bg-muted/20 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-border/80 bg-neutral-900 shadow-xs">
                    {currentWorkCover ? (
                      <img
                        src={getOptimizedImageUrl(currentWorkCover)}
                        alt="غلاف العمل الرئيسي"
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-muted-foreground text-[10px]">
                        بدون غلاف
                      </div>
                    )}
                    <span className="absolute bottom-0 inset-x-0 bg-amber-500/90 text-[8px] font-bold text-black text-center py-0.5">
                      غلاف العمل
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Star className="size-3.5 text-amber-500 fill-amber-500" />
                      <span>الغلاف الرئيسي للعمل المعروض في الموقع</span>
                    </span>
                    <span className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1 max-w-md" dir="ltr">
                      {currentWorkCover || "لم يتم تحديد غلاف (يُعتمد غلاف أول مجلد تلقائياً)"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-xs">
                    <Upload className="size-3 text-accent" />
                    <span>رفع غلاف رئيسي</span>
                    <input
                      type="file"
                      ref={entityCoverInputRef}
                      accept="image/*"
                      className="hidden"
                      disabled={isUploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadWorkCoverDirect(file);
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Deliverable Folders Navigation (Interactive Tabs) */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <Folder className="size-4 text-accent" />
                  <span className="text-sm font-bold text-foreground">
                    مجلدات وأقسام العمل للجهة ({currentEntity.folders.length})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={addFolder}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-accent/60 bg-accent/10 px-3 py-1.5 text-xs font-bold text-accent hover:bg-accent/20 transition-colors"
                >
                  <FolderPlus className="size-3.5" />
                  <span>+ إضافة مجلد جديد</span>
                </button>
              </div>

              {/* Folder Tabs Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {currentEntity.folders.map((f, i) => {
                  const isActive = i === activeFolderIndex;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        setActiveFolderIndex(i);
                        setNewImageSrc("");
                        setNewImageAlt("");
                      }}
                      className={cn(
                        "flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all",
                        isActive
                          ? "bg-foreground text-background shadow-xs ring-2 ring-foreground/20"
                          : "border border-border/80 bg-muted/30 text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                      )}
                    >
                      {isActive ? <FolderOpen className="size-3.5 text-accent" /> : <Folder className="size-3.5" />}
                      <span>{f.title}</span>
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.2 text-[10px]",
                          isActive ? "bg-background/20 text-background" : "bg-muted text-muted-foreground",
                        )}
                      >
                        {f.images.length}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Folder Controls */}
              {currentFolder && (
                <div className="mt-2 rounded-xl border border-border/70 bg-muted/20 p-4 flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <FolderOpen className="size-3.5 text-accent" />
                      <span>إعدادات المجلد النشط: </span>
                      <span className="text-accent">{currentFolder.title}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => removeFolder(activeFolderIndex)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="size-3.5" />
                      <span>حذف هذا المجلد</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground">عنوان المجلد</label>
                      <input
                        type="text"
                        value={currentFolder.title}
                        onChange={(e) => updateFolderField("title", e.target.value)}
                        placeholder="مثال: صور الهوية، موك اب، بنرات الموقع..."
                        className="mt-1 w-full rounded-xl border border-border/80 bg-card p-2 focus:border-foreground/40 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground">تصنيف المجلد</label>
                      <input
                        type="text"
                        value={currentFolder.category}
                        onChange={(e) => updateFolderField("category", e.target.value)}
                        placeholder="مثال: هوية، مطبوعات، سوشيال ميديا..."
                        className="mt-1 w-full rounded-xl border border-border/80 bg-card p-2 focus:border-foreground/40 focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-medium text-muted-foreground">نبذة توضيحية للمجلد</label>
                      <input
                        type="text"
                        value={currentFolder.summary}
                        onChange={(e) => updateFolderField("summary", e.target.value)}
                        placeholder="وصف مختصر للأعمال الموجودة داخل هذا المجلد..."
                        className="mt-1 w-full rounded-xl border border-border/80 bg-card p-2 focus:border-foreground/40 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Folder Cover Quick View & Selector */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/50 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-border/80 bg-neutral-900">
                        {currentFolderCover ? (
                          <img
                            src={getOptimizedImageUrl(currentFolderCover)}
                            alt="غلاف المجلد"
                            className="size-full object-cover"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center text-[9px] text-muted-foreground">
                            فارغ
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-semibold text-foreground flex items-center gap-1">
                          <CheckCircle2 className="size-3 text-emerald-500" />
                          <span>غلاف هذا المجلد:</span>
                        </span>
                        <span className="text-[10px] text-muted-foreground line-clamp-1 max-w-xs" dir="ltr">
                          {currentFolderCover || "لم يتم تعيين غلاف (سيعتمد التصميم الأول تلقائياً)"}
                        </span>
                      </div>
                    </div>

                    {currentFolder.images.length > 0 && (
                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <span className="text-[11px] text-muted-foreground">اختر الغلاف:</span>
                        <select
                          value={currentFolder.cover || currentFolder.images[0]?.src || ""}
                          onChange={(e) => setAsFolderCover(e.target.value)}
                          className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs focus:border-foreground/40 focus:outline-none"
                        >
                          {currentFolder.images.map((img, i) => (
                            <option key={img.src + i} value={img.src}>
                              صورة {i + 1}: {img.alt || "بدون وصف"}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Folder Files & Upload Zone */}
            {currentFolder && (
              <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs flex flex-col gap-5">
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="size-4 text-accent" />
                    <span className="text-sm font-bold text-foreground">
                      الملفات والتصاميم داخل مجلد "{currentFolder.title}" ({currentFolder.images.length})
                    </span>
                  </div>
                </div>

                {/* Modern Multi-File Dropzone & Upload Box */}
                <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-border/90 bg-muted/20 p-5 transition-all">
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragActive(true);
                    }}
                    onDragLeave={() => setIsDragActive(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragActive(false);
                      if (e.dataTransfer.files) {
                        uploadFiles(e.dataTransfer.files);
                      }
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center p-6 text-center rounded-xl border-2 border-dashed transition-all cursor-pointer bg-card/60",
                      isDragActive
                        ? "border-accent bg-accent/10 scale-[1.01]"
                        : "border-border/80 hover:border-foreground/40 hover:bg-card",
                    )}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      multiple
                      accept="image/*"
                      className="hidden"
                      disabled={isUploading}
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          uploadFiles(e.target.files);
                        }
                      }}
                    />

                    <div className="flex size-12 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-3">
                      {isUploading ? (
                        <Loader2 className="size-6 animate-spin text-accent" />
                      ) : (
                        <UploadCloud className="size-6 text-accent" />
                      )}
                    </div>

                    <span className="text-sm font-bold text-foreground">
                      {isUploading
                        ? uploadStatus || "جارٍ رفع الصور..."
                        : "اضغط لاختيار صور من جهازك أو اسحبها وأفلتها هنا"}
                    </span>

                    <span className="text-xs text-muted-foreground mt-1">
                      يدعم رفع عدة صور معاً دفعة واحدة (PNG, JPG, WEBP, SVG) وإدراجها فوراً في هذا المجلد.
                    </span>

                    <button
                      type="button"
                      disabled={isUploading}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-foreground px-4 py-2 text-xs font-bold text-background transition-opacity hover:opacity-90 shadow-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      <Upload className="size-3.5" />
                      <span>{isUploading ? "جارٍ الرفع..." : "اختيار ملفات من الجهاز"}</span>
                    </button>
                  </div>

                  {/* Upload Settings / Auto Cover Option */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 pt-1 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-muted-foreground hover:text-foreground">
                      <input
                        type="checkbox"
                        checked={autoSetAsCover}
                        onChange={(e) => setAutoSetAsCover(e.target.checked)}
                        className="rounded border-border accent-accent size-3.5"
                      />
                      <span>تعيين أول صورة يتم رفعها كغلاف لهذا المجلد تلقائياً</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent hover:underline self-start sm:self-auto"
                    >
                      <LinkIcon className="size-3" />
                      <span>{showUrlInput ? "إخفاء إضافة الرابط المباشر" : "أو إضافة صورة عبر رابط مباشر (URL)"}</span>
                    </button>
                  </div>

                  {/* Direct URL Input Row (Collapsible) */}
                  {showUrlInput && (
                    <div className="mt-2 rounded-xl border border-border/80 bg-card p-3.5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                      <div className="sm:col-span-6">
                        <label className="text-[11px] font-medium text-muted-foreground">
                          رابط الصورة المباشر (URL أو مسار محلي)
                        </label>
                        <input
                          type="text"
                          placeholder="https://... أو /images/..."
                          dir="ltr"
                          value={newImageSrc}
                          onChange={(e) => setNewImageSrc(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-border/80 bg-muted/20 p-2 text-xs focus:border-foreground/40 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <label className="text-[11px] font-medium text-muted-foreground">
                          وصف التصميم (Alt Text)
                        </label>
                        <input
                          type="text"
                          placeholder="مثال: الشعار الرئيسي، بطاقة عمل..."
                          value={newImageAlt}
                          onChange={(e) => setNewImageAlt(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-border/80 bg-muted/20 p-2 text-xs focus:border-foreground/40 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <button
                          type="button"
                          onClick={addImageToFolderByUrl}
                          className="w-full rounded-xl bg-foreground p-2 text-xs font-bold text-background transition-opacity hover:opacity-90 shadow-xs flex items-center justify-center gap-1"
                        >
                          <Plus className="size-3.5" />
                          <span>إضافة الرابط</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Existing Images Grid in Active Folder */}
                {currentFolder.images.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border p-12 text-center flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <ImageIcon className="size-8 stroke-[1.5] text-muted-foreground/60" />
                    <span className="text-xs font-semibold">هذا المجلد لا يحتوي على أي ملفات حتى الآن.</span>
                    <span className="text-[11px]">ارفع صوراً أو تصاميم من الصندوق أعلاه لتظهر هنا فوراً.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentFolder.images.map((img, imgIdx) => {
                      const isFolderCover = currentFolder.cover === img.src;
                      const isWorkCover =
                        currentWorkCover === img.src ||
                        (!currentEntity.cover && currentEntity.folders[0]?.id === currentFolder.id && isFolderCover);

                      return (
                        <div
                          key={img.src + imgIdx}
                          className={cn(
                            "group relative flex flex-col overflow-hidden rounded-2xl border transition-all shadow-xs hover:shadow-md",
                            isWorkCover
                              ? "border-amber-500/80 bg-amber-500/5 ring-1 ring-amber-500/20"
                              : isFolderCover
                              ? "border-accent bg-accent/5 ring-1 ring-accent/20"
                              : "border-border/80 bg-muted/20 hover:border-foreground/30",
                          )}
                        >
                          {/* Image preview frame */}
                          <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
                            <img
                              src={getOptimizedImageUrl(img.src)}
                              alt={img.alt}
                              className="size-full object-cover transition-transform duration-300 group-hover:scale-102"
                              loading="lazy"
                            />

                            {/* Prominent Badges */}
                            <div className="absolute top-2 inset-x-2 flex items-center justify-between gap-1 pointer-events-none">
                              {isWorkCover ? (
                                <span className="rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-black shadow-sm flex items-center gap-1">
                                  <Star className="size-3 fill-black" />
                                  <span>غلاف العمل الرئيسي</span>
                                </span>
                              ) : <span />}

                              {isFolderCover && (
                                <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm flex items-center gap-1">
                                  <Check className="size-3" />
                                  <span>غلاف المجلد</span>
                                </span>
                              )}
                            </div>

                            {/* Quick Overlay Preview on Hover */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                              <a
                                href={img.src}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-xl bg-card/90 p-2 text-foreground hover:bg-card shadow-xs transition-transform hover:scale-105"
                                title="معاينة الصورة الأصلية بالحجم الكامل"
                              >
                                <ExternalLink className="size-3.5" />
                              </a>
                            </div>
                          </div>

                          {/* Action Toolbar on the Card (Always Accessible) */}
                          <div className="p-3 flex flex-col gap-2.5 bg-card/60">
                            {/* Buttons: Set as Folder Cover & Work Cover */}
                            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                              <button
                                type="button"
                                disabled={isFolderCover}
                                onClick={() => setAsFolderCover(img.src)}
                                className={cn(
                                  "inline-flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 font-semibold transition-all",
                                  isFolderCover
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 cursor-default"
                                    : "border border-border bg-card text-foreground hover:bg-muted hover:border-foreground/30",
                                )}
                                title="تعيين كغلاف لهذا المجلد"
                              >
                                <Check className="size-3 text-emerald-500" />
                                <span>{isFolderCover ? "غلاف المجلد ✓" : "غلاف المجلد"}</span>
                              </button>

                              <button
                                type="button"
                                disabled={isWorkCover}
                                onClick={() => setAsWorkCover(img.src)}
                                className={cn(
                                  "inline-flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 font-semibold transition-all",
                                  isWorkCover
                                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 cursor-default"
                                    : "border border-border bg-card text-foreground hover:bg-muted hover:border-foreground/30",
                                )}
                                title="تعيين كغلاف رئيسي للعمل بالكامل"
                              >
                                <Star className={cn("size-3", isWorkCover ? "text-amber-500 fill-amber-500" : "text-amber-500")} />
                                <span>{isWorkCover ? "غلاف العمل ★" : "غلاف للعمل ★"}</span>
                              </button>
                            </div>

                            {/* Caption editor & Delete */}
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={img.alt}
                                placeholder="وصف التصميم (Alt text)..."
                                onChange={(e) => {
                                  const nextImages = [...currentFolder.images];
                                  nextImages[imgIdx] = { ...img, alt: e.target.value };
                                  const nextFolders = [...currentEntity.folders];
                                  nextFolders[activeFolderIndex] = { ...currentFolder, images: nextImages };
                                  setDraft({ ...currentEntity, folders: nextFolders });
                                }}
                                className="flex-1 rounded-lg border border-border/70 bg-muted/30 px-2 py-1 text-[11px] text-foreground focus:border-foreground/40 focus:outline-none"
                              />

                              <button
                                type="button"
                                onClick={() => removeImageFromFolder(imgIdx)}
                                className="rounded-lg border border-red-500/20 bg-red-500/10 p-1.5 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors shrink-0"
                                title="حذف الصورة من المجلد"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>

                            <span dir="ltr" className="text-[9px] text-muted-foreground truncate" title={img.src}>
                              {img.src}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center text-sm text-muted-foreground">
            اختر جهة عمل من القائمة لتعديل مجلداتها وملفاتها
          </div>
        )}
      </div>
    </AdminShell>
  );
}
