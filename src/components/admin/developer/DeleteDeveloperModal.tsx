"use client";

import { useState } from "react";

interface DeleteDeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
  developer: {
    _id: string;
    name: string;
    slug: string;
    projectCount: number;
  };
  onDeleteSuccess: () => void;
  onRequestTransfer: () => void;
}

export function DeleteDeveloperModal({
  isOpen,
  onClose,
  developer,
  onDeleteSuccess,
  onRequestTransfer,
}: DeleteDeveloperModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const hasProjects = developer.projectCount > 0;

  const handleDelete = async () => {
    if (!confirmed) {
      setError("Please confirm you want to permanently delete this developer.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/developers/${developer._id}`, {
        method: "DELETE",
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        // Backend may return requiresTransfer
        if (json.requiresTransfer) {
          setError(json.message);
          return;
        }
        throw new Error(json.message || "Failed to delete developer.");
      }

      onDeleteSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error deleting developer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                🗑️
              </span>
              Delete Developer
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              This action cannot be undone
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-lg p-1"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Developer:</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">{developer.name}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Slug:</span>
              <span className="font-mono text-zinc-600">{developer.slug}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Associated Projects:</span>
              <span
                className={`font-bold px-2 py-0.5 rounded-md ${
                  hasProjects
                    ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
              >
                {developer.projectCount} project(s)
              </span>
            </div>
          </div>

          {hasProjects ? (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 space-y-3">
              <p className="font-semibold text-sm">⚠️ Cannot delete — active projects exist</p>
              <p>
                This developer has <strong>{developer.projectCount}</strong> associated project(s). You must
                transfer these projects to another developer before deleting.
              </p>
              <button
                type="button"
                onClick={() => { onClose(); onRequestTransfer(); }}
                className="w-full px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 transition-colors"
              >
                Transfer Projects First →
              </button>
            </div>
          ) : (
            <>
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-800 dark:text-rose-300">
                <p>Permanently deleting <strong>{developer.name}</strong>. This cannot be undone.</p>
              </div>

              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="confirmDevDelete"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-rose-600 focus:ring-rose-500"
                  disabled={loading}
                />
                <label htmlFor="confirmDevDelete" className="text-xs text-zinc-600 dark:text-zinc-400">
                  I understand this will permanently delete the developer record.
                </label>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          {!hasProjects && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading || !confirmed}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {loading ? "Deleting..." : "Delete Developer"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
