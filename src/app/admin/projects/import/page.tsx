"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";

interface ImportError {
  row: number;
  project: string;
  field: string;
  error: string;
  suggestion?: string;
}

interface ImportSummary {
  totalRows: number;
  created: number;
  updated: number;
  failed: number;
  skipped: number;
  batchDuplicates: number;
  processingMs?: number;
}

type ImportState = "idle" | "uploading" | "done" | "error";

export default function BulkImportPage() {
  const [state, setState] = useState<ImportState>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [errors, setErrors] = useState<ImportError[]>([]);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [errorSearch, setErrorSearch] = useState("");
  const [errorPage, setErrorPage] = useState(1);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const ERROR_PAGE_SIZE = 20;

  // ── File selection ──────────────────────────────────────────
  const handleFileSelect = (file: File) => {
    const allowedExt = [".xlsx", ".xls"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!allowedExt.includes(ext)) {
      setGlobalError("Only Excel files (.xlsx, .xls) are accepted.");
      setSelectedFile(null);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setGlobalError("File size exceeds the 10 MB limit. Split your file and try again.");
      setSelectedFile(null);
      return;
    }
    setGlobalError(null);
    setSelectedFile(file);
    setState("idle");
    setSummary(null);
    setErrors([]);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
  };

  // Drag-and-drop handlers
  const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const onDragLeave = useCallback(() => setIsDragging(false), []);
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Template download ───────────────────────────────────────
  const handleDownloadTemplate = async () => {
    setIsDownloadingTemplate(true);
    try {
      const res = await fetch("/api/admin/projects/import/template");
      if (!res.ok) throw new Error("Failed to download template");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "zvisory-project-import-template.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      setGlobalError(err instanceof Error ? err.message : "Template download failed");
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  // ── Upload & process ────────────────────────────────────────
  const handleUpload = async () => {
    if (!selectedFile) return;

    setState("uploading");
    setGlobalError(null);
    setSummary(null);
    setErrors([]);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("/api/admin/projects/import", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        // Workbook-level error (bad headers, empty file, etc.)
        setState("error");
        setGlobalError(json.message || "Import failed. See details below.");
        return;
      }

      setState("done");
      setSummary(json.summary);
      setErrors(json.errors || []);
    } catch (err: unknown) {
      setState("error");
      setGlobalError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    }
  };

  // ── Error report download ───────────────────────────────────
  const handleDownloadErrorReport = () => {
    if (errors.length === 0) return;
    const header = ["Excel Row", "Project", "Slug", "Action", "Field", "Error", "Suggestion"].join(",");
    const rows = (errors as any[]).map((e) =>
      [
        e.row,
        `"${e.project}"`,
        `"${e.slug || ""}"`,
        `"${e.action || ""}"`,
        `"${e.field}"`,
        `"${e.error.replace(/"/g, '""')}"`,
        `"${(e.suggestion || "").replace(/"/g, '""')}"`,
      ].join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `import-errors-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Filtered & paginated errors ─────────────────────────────
  const filteredErrors = errors.filter((e) => {
    const q = errorSearch.toLowerCase();
    return !q || e.project.toLowerCase().includes(q) || e.field.toLowerCase().includes(q) || e.error.toLowerCase().includes(q) || String(e.row).includes(q);
  });
  const errorTotalPages = Math.ceil(filteredErrors.length / ERROR_PAGE_SIZE);
  const paginatedErrors = filteredErrors.slice((errorPage - 1) * ERROR_PAGE_SIZE, errorPage * ERROR_PAGE_SIZE);

  const importStatus = summary
    ? summary.failed === 0 && summary.batchDuplicates === 0
      ? "success"
      : summary.created === 0 && summary.updated === 0
      ? "failure"
      : "partial"
    : null;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-1">
            <Link href="/admin/projects" className="hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">Projects</Link>
            <span>/</span>
            <span>Bulk Import</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Bulk Excel Import</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Import multiple projects at once using the official Excel template.
          </p>
        </div>
        <Link
          href="/admin/projects"
          className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 transition-colors"
        >
          ← Back to Projects
        </Link>
      </div>

      {/* Step 1: Download Template */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-sm font-bold shrink-0">1</div>
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Download the Official Template</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Always use the latest template to avoid header mismatches.</p>
          </div>
        </div>

        <div className="ml-11 space-y-3">
          <button
            onClick={handleDownloadTemplate}
            disabled={isDownloadingTemplate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 transition-colors shadow-sm"
          >
            {isDownloadingTemplate ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>📥 Download Excel Template</>
            )}
          </button>
          <p className="text-[11px] text-zinc-400">
            The template contains a <strong>Projects</strong> sheet for data and an <strong>Instructions</strong> sheet with field explanations.
          </p>
        </div>
      </div>

      {/* Step 2: Instructions */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 flex items-center justify-center text-sm font-bold shrink-0">2</div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Prepare Your Excel File</h2>
        </div>

        <div className="ml-11 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-600 dark:text-zinc-400">
          {[
            "✅ Download the official template first",
            "✅ Do NOT rename or remove column headers (Row 1)",
            "✅ Add one project per row starting from Row 5",
            "✅ Remove template instruction rows (2–4) before uploading",
            "✅ Use the exact city and developer names registered in the system",
            "✅ Separate multiple values with semicolons (;)",
            "✅ Separate location categories with pipes (|)",
            "🔄 New slug (keywords) → project is CREATED",
            "🔄 Existing slug → project is UPDATED (no duplicate created)",
            "🔄 Blank optional cells → existing DB values are PRESERVED during update",
            "⚠️ Same slug twice in one file → only first row processed, second skipped",
            "⚠️ Maximum 500 rows per upload — split larger files into batches",
            "⚠️ Maximum file size: 10 MB (.xlsx or .xls only)",
            "⚠️ Review failed rows in the error report and fix before re-uploading",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0">{item.slice(0, 2)}</span>
              <span>{item.slice(2)}</span>
            </div>
          ))}
        </div>

        {/* Required columns callout */}
        <div className="ml-11 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs">
          <p className="font-semibold text-amber-800 dark:text-amber-300 mb-1">Required columns (must not be empty):</p>
          <div className="flex flex-wrap gap-1.5">
            {["project_title", "developer", "locations"].map((col) => (
              <span key={col} className="font-mono bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded">
                {col}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Step 3: Upload */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-sm font-bold shrink-0">3</div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Upload Your Prepared File</h2>
        </div>

        <div className="ml-11 space-y-4">
          {/* Drop zone */}
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
              isDragging
                ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20"
                : "border-zinc-200 dark:border-zinc-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={onFileChange}
              className="hidden"
            />
            <div className="text-3xl mb-2">📊</div>
            {selectedFile ? (
              <div className="space-y-1">
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{selectedFile.name}</p>
                <p className="text-xs text-zinc-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB · Click to change file
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Drag & drop your Excel file here
                </p>
                <p className="text-xs text-zinc-400">or click to browse — .xlsx, .xls · max 10 MB</p>
              </div>
            )}
          </div>

          {globalError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-700 dark:text-rose-300">
              ⚠️ {globalError}
            </div>
          )}

          {/* Upload button */}
          <button
            onClick={handleUpload}
            disabled={!selectedFile || state === "uploading"}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {state === "uploading" ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>🚀 Import Projects</>
            )}
          </button>
        </div>
      </div>

      {/* Step 4: Results */}
      {(state === "done" || state === "error") && summary && (
        <div className="space-y-5">
          {/* Summary card */}
          <div
            className={`rounded-2xl border p-5 space-y-4 ${
              importStatus === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900"
                : importStatus === "failure"
                ? "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900"
                : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {importStatus === "success" ? "✅" : importStatus === "failure" ? "❌" : "⚠️"}
              </span>
              <div>
                <h3 className="text-sm font-bold">
                  {importStatus === "success"
                    ? "Import Successful"
                    : importStatus === "failure"
                    ? "Import Failed"
                    : "Import Partially Completed"}
                </h3>
                {summary.processingMs && (
                  <p className="text-xs text-zinc-500">Processed in {(summary.processingMs / 1000).toFixed(1)}s</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              {[
                { label: "Total Rows", value: summary.totalRows, color: "text-zinc-700 dark:text-zinc-300" },
                { label: "Created", value: summary.created, color: "text-emerald-700 dark:text-emerald-300" },
                { label: "Updated", value: summary.updated, color: "text-sky-700 dark:text-sky-300" },
                { label: "Failed", value: summary.failed, color: "text-rose-700 dark:text-rose-300" },
                { label: "Skipped", value: summary.skipped, color: "text-amber-700 dark:text-amber-300" },
                { label: "Batch Dupes", value: summary.batchDuplicates, color: "text-zinc-500" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/70 dark:bg-zinc-900/70 rounded-xl p-3 text-center">
                  <div className={`text-xl font-bold tabular-nums ${stat.color}`}>{stat.value}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Error report */}
          {errors.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Error Report ({errors.length} row{errors.length !== 1 ? "s" : ""})
                </h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-zinc-400 text-xs">🔍</span>
                    <input
                      type="text"
                      value={errorSearch}
                      onChange={(e) => { setErrorSearch(e.target.value); setErrorPage(1); }}
                      placeholder="Search errors..."
                      className="pl-7 pr-3 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                    />
                  </div>
                  <button
                    onClick={handleDownloadErrorReport}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 transition-colors"
                  >
                    📥 Download CSV
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-[10px] uppercase tracking-wider text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                    <tr>
                      <th className="py-2.5 px-3 w-16">Row</th>
                      <th className="py-2.5 px-3">Project</th>
                      <th className="py-2.5 px-3">Field</th>
                      <th className="py-2.5 px-3">Error</th>
                      <th className="py-2.5 px-3">Suggestion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {paginatedErrors.map((err, i) => (
                      <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                          {err.row}
                        </td>
                        <td className="py-2.5 px-3 text-zinc-700 dark:text-zinc-300 max-w-[160px] truncate">
                          {err.project || "—"}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-rose-600 dark:text-rose-400">
                          {err.field}
                        </td>
                        <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-400">
                          {err.error}
                        </td>
                        <td className="py-2.5 px-3 text-zinc-500 dark:text-zinc-500 italic">
                          {err.suggestion || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {errorTotalPages > 1 && (
                <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <span>
                    Showing {(errorPage - 1) * ERROR_PAGE_SIZE + 1}–{Math.min(errorPage * ERROR_PAGE_SIZE, filteredErrors.length)} of {filteredErrors.length} errors
                  </span>
                  <div className="flex gap-1">
                    <button disabled={errorPage <= 1} onClick={() => setErrorPage((p) => p - 1)} className="px-3 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 disabled:opacity-40 hover:bg-zinc-100">Previous</button>
                    <span className="px-3 py-1 font-bold">{errorPage}/{errorTotalPages}</span>
                    <button disabled={errorPage >= errorTotalPages} onClick={() => setErrorPage((p) => p + 1)} className="px-3 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 disabled:opacity-40 hover:bg-zinc-100">Next</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Upload another */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setState("idle");
                setSelectedFile(null);
                setSummary(null);
                setErrors([]);
                setGlobalError(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-zinc-700 hover:bg-zinc-800 transition-colors"
            >
              Upload Another File
            </button>
            <Link
              href="/admin/projects"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 transition-colors"
            >
              View All Projects
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
