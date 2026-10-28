"use client";

import { useState } from "react";

interface CityOption {
  _id: string;
  name: string;
  slug: string;
  projectCount?: number;
}

interface TransferProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceCity: {
    _id: string;
    name: string;
    slug: string;
    projectCount: number;
  };
  availableCities: CityOption[];
  onTransferSuccess: () => void;
}

export function TransferProjectsModal({
  isOpen,
  onClose,
  sourceCity,
  availableCities,
  onTransferSuccess,
}: TransferProjectsModalProps) {
  const [targetCityId, setTargetCityId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  // Filter out source city from target candidates
  const validTargets = availableCities.filter(
    (c) => c._id !== sourceCity._id && c.name.toLowerCase() !== sourceCity.name.toLowerCase()
  );

  const selectedTarget = validTargets.find((c) => c._id === targetCityId || c.slug === targetCityId);

  const handleTransfer = async () => {
    if (!targetCityId) {
      setError("Please select a target destination city.");
      return;
    }
    if (!confirmed) {
      setError("Please confirm that you understand project city assignments will change.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/cities/${sourceCity._id || sourceCity.slug}/transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetCityId }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to transfer projects.");
      }

      onTransferSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error executing transfer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300">
                🔄
              </span>
              Transfer Associated Projects
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Reassign projects from one city to another safely
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

        <div className="space-y-4 text-sm">
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 dark:text-zinc-400">Source City:</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">{sourceCity.name}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 dark:text-zinc-400">Affected Projects:</span>
              <span className="font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                {sourceCity.projectCount} project(s)
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
              Select Target Destination City <span className="text-rose-500">*</span>
            </label>
            <select
              value={targetCityId}
              onChange={(e) => setTargetCityId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-sky-500"
              disabled={loading || validTargets.length === 0}
            >
              <option value="">-- Choose Target City --</option>
              {validTargets.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.projectCount ?? 0} existing projects)
                </option>
              ))}
            </select>
            {validTargets.length === 0 && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                No other registered cities available. Please create a target city first.
              </p>
            )}
          </div>

          {selectedTarget && (
            <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/40 text-xs text-sky-800 dark:text-sky-300 space-y-1">
              <p className="font-semibold">Transfer Preview:</p>
              <p>
                All <strong>{sourceCity.projectCount}</strong> projects currently in &quot;
                {sourceCity.name}&quot; will have their canonical city updated to &quot;
                {selectedTarget.name}&quot;.
              </p>
            </div>
          )}

          <div className="flex items-start gap-2.5 pt-2">
            <input
              type="checkbox"
              id="confirmTransfer"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-sky-600 focus:ring-sky-500"
              disabled={loading}
            />
            <label htmlFor="confirmTransfer" className="text-xs text-zinc-600 dark:text-zinc-400">
              I understand that project records will be permanently updated to the target city.
            </label>
          </div>
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
          <button
            type="button"
            onClick={handleTransfer}
            disabled={loading || !targetCityId || !confirmed}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {loading ? "Transferring..." : "Confirm & Transfer Projects"}
          </button>
        </div>
      </div>
    </div>
  );
}
