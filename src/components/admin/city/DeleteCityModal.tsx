"use client";

import { useState } from "react";

interface DeleteCityModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: {
    _id: string;
    name: string;
    slug: string;
    projectCount: number;
  };
  onDeleteSuccess: () => void;
  onRequestTransfer: () => void;
}

export function DeleteCityModal({
  isOpen,
  onClose,
  city,
  onDeleteSuccess,
  onRequestTransfer,
}: DeleteCityModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const hasProjects = city.projectCount > 0;

  const handleDelete = async () => {
    if (hasProjects) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/cities/${city._id || city.slug}`, {
        method: "DELETE",
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to delete city.");
      }

      onDeleteSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error deleting city.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`p-2 rounded-xl text-lg ${
                hasProjects
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                  : "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
              }`}
            >
              {hasProjects ? "⚠️" : "🗑️"}
            </span>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                {hasProjects ? "Cannot Delete City" : "Delete City"}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                City: <strong>{city.name}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-base"
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

        {hasProjects ? (
          <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-200 space-y-2">
              <p className="font-semibold">
                Protected City: <strong>{city.projectCount}</strong> project(s) are currently associated with &quot;{city.name}&quot;.
              </p>
              <p>
                To prevent broken links and data loss, a city cannot be deleted while projects remain assigned to it.
              </p>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Please transfer these projects to another city before deleting this record.
            </p>
          </div>
        ) : (
          <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
            <p>
              Are you sure you want to permanently delete <strong>{city.name}</strong>?
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              This city currently has 0 associated projects. Deleting it will remove the city record and its SEO metadata.
            </p>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>

          {hasProjects ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onRequestTransfer();
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 transition-colors shadow-sm flex items-center gap-1.5"
            >
              🔄 Transfer Projects Instead
            </button>
          ) : (
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              {loading ? "Deleting..." : "Permanently Delete City"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
