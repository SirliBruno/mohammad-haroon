import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
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
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { ImageInput } from "@/components/admin/image-input";
import {
  adminListClientWorks,
  adminSaveClientWork,
  adminDeleteClientWork,
} from "@/lib/cms/client-works.functions";
import type { ClientEntity, DeliverableFolder } from "@/data/client-works";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/client-works")({
  component: AdminClientWorksPage,
  head: () => ({ meta: [{ title: "إدارة مجلدات وملفات الأعمال" }] }),
});

const CATEGORIES = ["هوية", "متاجر", "مواقع", "أنظمة", "مطبوعات", "تسويق"] as const;

export function AdminClientWorksPage() {
  const queryClient = useQueryClient();
  const listFn = useServerFn(adminListClientWorks);
  const saveFn = useServerFn(adminSaveClientWork);
  const deleteFn = useServerFn(adminDeleteClientWork);

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

  // New file input state
  const [newImageSrc, setNewImageSrc] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");

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

  // Set initial selected entity
  const activeEntity = useMemo(() => {
    if (draft && draft.id === selectedId) return draft;
    if (selectedId) {
      const found = rawEntities.find((e) => e.id === selectedId);
      if (found) return found;
    }
    return rawEntities[0] || null;
  }, [rawEntities, selectedId, draft]);

  const selectEntity = (entity: ClientEntity) => {
    setSelectedId(entity.id);
    // Deep clone to draft
    setDraft(JSON.parse(JSON.stringify(entity)));
    setActiveFolderIndex(0);
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
      setDraft(JSON.parse(JSON.stringify(res.entity)));
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
      toast.success("تمت استعادة الإعدادات الافتراضية");
      queryClient.invalidateQueries({ queryKey: ["admin-client-works"] });
      queryClient.invalidateQueries({ queryKey: ["client-works-public"] });
      setDraft(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || "فشلت الاستعادة");
    },
  });

  // Ensure draft is initialized if not yet
  const currentEntity = draft || activeEntity;
  const currentFolder: DeliverableFolder | undefined = currentEntity?.folders[activeFolderIndex];

  // Helper actions on folders
  const addFolder = () => {
    if (!currentEntity) return;
    const newFolderId = `${currentEntity.id}-folder-${Date.now().toString(36)}`;
    const newFolder: DeliverableFolder = {
      id: newFolderId,
      title: "مجلد جديد",
      category: currentEntity.category || "هوية",
      summary: `أعمال جديدة لـ ${currentEntity.name}`,
      cover: "",
      images: [],
    };
    const updated = {
      ...currentEntity,
      folders: [...currentEntity.folders, newFolder],
    };
    setDraft(updated);
    setActiveFolderIndex(updated.folders.length - 1);
    toast.info("تمت إضافة مجلد جديد. لا تنس حفظ التغييرات.");
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

  // Helper actions on images/files inside active folder
  const addImageToFolder = () => {
    if (!currentEntity || !currentFolder) return;
    if (!newImageSrc.trim()) {
      toast.error("يرجى إدخال رابط أو رفع صورة أولاً.");
      return;
    }
    const nextImages = [
      ...currentFolder.images,
      { src: newImageSrc.trim(), alt: newImageAlt.trim() || currentFolder.title },
    ];
    const nextCover = currentFolder.cover || newImageSrc.trim();

    const nextFolders = [...currentEntity.folders];
    nextFolders[activeFolderIndex] = {
      ...currentFolder,
      cover: nextCover,
      images: nextImages,
    };

    setDraft({
      ...currentEntity,
      folders: nextFolders,
    });

    setNewImageSrc("");
    setNewImageAlt("");
    toast.success("تمت إضافة الملف إلى المجلد. اضغط حفظ التغييرات.");
  };

  const removeImageFromFolder = (imgIndex: number) => {
    if (!currentEntity || !currentFolder) return;
    const nextImages = currentFolder.images.filter((_, i) => i !== imgIndex);
    const nextFolders = [...currentEntity.folders];
    nextFolders[activeFolderIndex] = {
      ...currentFolder,
      cover: currentFolder.cover === currentFolder.images[imgIndex]?.src ? nextImages[0]?.src || "" : currentFolder.cover,
      images: nextImages,
    };
    setDraft({
      ...currentEntity,
      folders: nextFolders,
    });
    toast.info("تم حذف الملف من المجلد.");
  };

  const setAsFolderCover = (src: string) => {
    updateFolderField("cover", src);
    toast.success("تم تعيين الصورة كغلاف لهذا المجلد.");
  };

  const addNewClient = () => {
    const name = window.prompt("أدخل اسم الجهة أو المشروع الجديد (مثال: متجر الرياض):");
    if (!name?.trim()) return;
    const slug = name
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
      description="تحكم كامل في مجلدات وأقسام العمل للجهات، وإضافة وحذف الصور والتصاميم بداخل كل مجلد لتظهر مباشرة في صفحة الأعمال."
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
              <Save className="size-3.5 text-accent" />
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
              <div className="p-8 text-center text-xs text-muted-foreground">جارٍ تحميل الأعمال...</div>
            ) : filteredEntities.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">لا توجد نتائج مطابقة</div>
            ) : (
              filteredEntities.map((entity) => {
                const isSelected = (currentEntity?.id || rawEntities[0]?.id) === entity.id;
                const totalFiles = entity.totalFiles ?? entity.folders.reduce((acc, f) => acc + f.images.length, 0);
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
                              isSelected ? "bg-accent text-accent-foreground" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30",
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
            {/* Entity Header Card */}
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

              {/* Editable Entity Meta */}
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
                      onClick={() => setActiveFolderIndex(i)}
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
                    <span className="text-xs font-bold text-foreground">
                      إعدادات المجلد النشط: <span className="text-accent">{currentFolder.title}</span>
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
                </div>
              )}
            </div>

            {/* Folder Files & Designs Grid */}
            {currentFolder && (
              <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="size-4 text-accent" />
                    <span className="text-sm font-bold text-foreground">
                      الملفات والتصاميم داخل مجلد "{currentFolder.title}" ({currentFolder.images.length})
                    </span>
                  </div>
                </div>

                {/* Add New File / Image Box */}
                <div className="rounded-xl border border-dashed border-border/90 bg-muted/30 p-4 flex flex-col gap-3">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Plus className="size-3.5 text-accent" />
                    <span>إضافة تصميم أو ملف جديد إلى هذا المجلد:</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                    <div className="sm:col-span-5">
                      <label className="text-[11px] font-medium text-muted-foreground">رابط الصورة أو مسارها المحلي</label>
                      <input
                        type="text"
                        placeholder="/images/... أو https://..."
                        dir="ltr"
                        value={newImageSrc}
                        onChange={(e) => setNewImageSrc(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-border/80 bg-card p-2 text-xs focus:border-foreground/40 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-5">
                      <label className="text-[11px] font-medium text-muted-foreground">وصف التصميم (Alt Text)</label>
                      <input
                        type="text"
                        placeholder="مثال: الشعار باللون الأبيض، بطاقة عمل..."
                        value={newImageAlt}
                        onChange={(e) => setNewImageAlt(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-border/80 bg-card p-2 text-xs focus:border-foreground/40 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <button
                        type="button"
                        onClick={addImageToFolder}
                        className="w-full rounded-xl bg-foreground p-2 text-xs font-bold text-background transition-opacity hover:opacity-90 shadow-xs flex items-center justify-center gap-1"
                      >
                        <Plus className="size-3.5" />
                        <span>إضافة</span>
                      </button>
                    </div>
                  </div>

                  {/* Or upload from device */}
                  <div className="pt-2 border-t border-border/40">
                    <ImageInput
                      label="أو ارفع ملفًا مباشرة من جهازك إلى هذا المجلد:"
                      value={newImageSrc}
                      onChange={(url) => {
                        if (url) {
                          setNewImageSrc(url);
                          toast.success("تم رفع الملف بنجاح، اضغط 'إضافة' لإلحاقه بالمجلد.");
                        }
                      }}
                      folder={`client-works/${currentEntity.id}/${currentFolder.id}`}
                    />
                  </div>
                </div>

                {/* Existing Images Grid */}
                {currentFolder.images.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
                    هذا المجلد لا يحتوي على أي ملفات حتى الآن. أضف تصميماً جديداً من الصندوق أعلاه.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentFolder.images.map((img, imgIdx) => {
                      const isCover = currentFolder.cover === img.src;
                      return (
                        <div
                          key={imgIdx}
                          className="group relative flex flex-col overflow-hidden rounded-xl border border-border/80 bg-muted/20 transition-all hover:border-foreground/30 hover:shadow-md"
                        >
                          {/* Image preview frame */}
                          <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
                            <img
                              src={img.src}
                              alt={img.alt}
                              className="size-full object-cover transition-transform duration-300 group-hover:scale-102"
                              loading="lazy"
                            />

                            {isCover && (
                              <span className="absolute top-2 right-2 rounded-md bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground shadow-sm">
                                غلاف المجلد
                              </span>
                            )}

                            {/* Hover overlay actions */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                              {!isCover && (
                                <button
                                  type="button"
                                  onClick={() => setAsFolderCover(img.src)}
                                  className="rounded-lg bg-card/90 px-2.5 py-1.5 text-[11px] font-semibold text-foreground hover:bg-card shadow-xs transition-transform hover:scale-105"
                                >
                                  تعيين كغلاف
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => removeImageFromFolder(imgIdx)}
                                className="rounded-lg bg-red-600/90 p-1.5 text-white hover:bg-red-600 shadow-xs transition-transform hover:scale-105"
                                title="حذف من المجلد"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Editable caption */}
                          <div className="p-2.5 flex flex-col gap-1">
                            <input
                              type="text"
                              value={img.alt}
                              placeholder="وصف التصميم..."
                              onChange={(e) => {
                                const nextImages = [...currentFolder.images];
                                nextImages[imgIdx] = { ...img, alt: e.target.value };
                                const nextFolders = [...currentEntity.folders];
                                nextFolders[activeFolderIndex] = { ...currentFolder, images: nextImages };
                                setDraft({ ...currentEntity, folders: nextFolders });
                              }}
                              className="w-full rounded-lg border border-border/60 bg-card px-2 py-1 text-[11px] text-foreground focus:border-foreground/40 focus:outline-none"
                            />
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
