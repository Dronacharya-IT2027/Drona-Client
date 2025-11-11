import React, { useEffect, useMemo, useState } from "react";

/**
 * AdminSignupRequests
 * ------------------------------------------------------
 * A single-file React component (TailwindCSS) that lets admins:
 *  - View pending/accepted/rejected signup requests (same-branch, handled server-side)
 *  - Accept or reject a request
 *  - Filter by status and search (name/email/enrollment)
 *  - Paginate
 *  - Refresh
 *
 * API endpoints used (relative to `apiBase` prop or same-origin):
 *  - GET    /api/admin/signup-requests?status=under_review|accepted|rejected
 *  - POST   /api/admin/signup-requests/:id/accept
 *  - POST   /api/admin/signup-requests/:id/reject
 *  - (Optional) GET /api/auth/role — to verify user is admin; not required here because
 *    server enforces admin + same-branch filtering already.
 *
 * Auth: expects a JWT in localStorage under key `token` ("Bearer ${token}")
 *
 * Usage:
 * <AdminSignupRequests apiBase="" /> // keep empty string for same-origin
 */

const PAGE_SIZE = 10;

const API_BASE =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE_URL) ||
  process.env.REACT_APP_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "";

export default function AdminSignupRequests() {
  const [status, setStatus] = useState("under_review");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [adminBranch, setAdminBranch] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [banner, setBanner] = useState(null); // {type:"success"|"error"|"info", message:string}
  const [confirm, setConfirm] = useState(null); // { id, action:"accept"|"reject", name }

  const token = useMemo(() => {
    return typeof window !== "undefined" ? localStorage.getItem("token") : null;
  }, []);

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    }),
    [token]
  );

  // fetch list
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");
      setBanner(null);

      const url = `${API_BASE}/api/auth/admin/signup-requests?status=${encodeURIComponent(
        status
      )}`.replace(/\/+\/\//g, "/");
      const res = await fetch(url, { headers });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || body?.error || `Failed to fetch (${res.status})`);
      }
      const data = await res.json();
      setRequests(Array.isArray(data?.requests) ? data.requests : []);
      if (data?.admin?.branch) setAdminBranch(data.admin.branch);
      setPage(1);
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return requests;
    return requests.filter((r) => {
      const hay = `${r?.name || ""} ${r?.email || ""} ${r?.enrollmentNumber || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [requests, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const doAction = async (id, action) => {
    try {
      setBanner(null);
      const url = `${API_BASE}/api/auth/admin/signup-requests/${id}/${action}`.replace(/\/+\/\//g, "/");
      const res = await fetch(url, { method: "POST", headers });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.message || body?.error || `Failed to ${action}`);

      setBanner({ type: "success", message: body?.message || `Request ${action}ed.` });
      // Optimistic: remove from list if we are on under_review; otherwise refresh
      if (status === "under_review") {
        setRequests((prev) => prev.filter((r) => r._id !== id));
      } else {
        fetchRequests();
      }
    } catch (err) {
      setBanner({ type: "error", message: err?.message || `Could not ${action}.` });
    } finally {
      setConfirm(null);
    }
  };

  const statusPill = (s) => {
    const map = {
      under_review: "bg-yellow-100 text-yellow-800",
      accepted: "bg-emerald-100 text-emerald-800",
      rejected: "bg-rose-100 text-rose-800",
    };
    return <span className={`px-2 py-1 text-xs rounded-full ${map[s]}`}>{s.replace("_", " ")}</span>;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Signup Requests</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {adminBranch ? (
              <>
                Reviewing for branch <span className="font-medium">{adminBranch}</span>
              </>
            ) : (
              <>Requests visible are filtered by your branch.</>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchRequests}
            className="px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-4 flex items-center gap-2">
        {[
          { key: "under_review", label: "Under review" },
          { key: "accepted", label: "Accepted" },
          { key: "rejected", label: "Rejected" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setStatus(t.key)}
            className={`px-3 py-2 rounded-xl text-sm border transition ${
              status === t.key
                ? "bg-black text-white border-black"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mt-4">
        <div className="relative max-w-md">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email or enrollment..."
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-black/10"
          />
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">⌕</div>
        </div>
      </div>

      {/* Banner */}
      {banner && (
        <div
          className={`mt-4 rounded-xl px-4 py-3 text-sm border ${
            banner.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : banner.type === "error"
              ? "bg-rose-50 text-rose-800 border-rose-200"
              : "bg-gray-50 text-gray-700 border-gray-200"
          }`}
        >
          {banner.message}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-xl px-4 py-3 text-sm border bg-rose-50 text-rose-800 border-rose-200">
          {error}
        </div>
      )}

      {/* Table/Card list */}
      <div className="mt-4">
        <div className="hidden md:grid grid-cols-12 gap-2 px-2 py-2 text-xs font-medium text-gray-500">
          <div className="col-span-4">Applicant</div>
          <div className="col-span-2">Enrollment</div>
          <div className="col-span-2">Branch</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        <div className="divide-y rounded-2xl border border-gray-200 bg-white">
          {loading ? (
            <div className="p-6 text-sm text-gray-500">Loading…</div>
          ) : pageItems.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">No requests found.</div>
          ) : (
            pageItems.map((r) => (
              <div key={r._id} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 md:p-3 items-center">
                <div className="md:col-span-4">
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-gray-600">{r.email}</div>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-600">
                    {r.linkedin && (
                      <a className="underline" href={r.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                    )}
                    {r.leetcode && (
                      <a className="underline" href={r.leetcode} target="_blank" rel="noreferrer">LeetCode</a>
                    )}
                    {r.github && (
                      <a className="underline" href={r.github} target="_blank" rel="noreferrer">GitHub</a>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2 text-sm">{r.enrollmentNumber}</div>
                <div className="md:col-span-2 text-sm">{r.branch}</div>
                <div className="md:col-span-2">{statusPill(r.status)}</div>

                <div className="md:col-span-2 flex md:justify-end gap-2">
                  {r.status === "under_review" ? (
                    <>
                      <button
                        onClick={() => setConfirm({ id: r._id, action: "reject", name: r.name })}
                        className="px-3 py-2 rounded-xl border text-sm border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => setConfirm({ id: r._id, action: "accept", name: r.name })}
                        className="px-3 py-2 rounded-xl border text-sm border-emerald-600 bg-emerald-600 text-white hover:brightness-95"
                      >
                        Accept
                      </button>
                    </>
                  ) : r.status === "accepted" ? (
                    <span className="text-sm text-emerald-700">Accepted ✓</span>
                  ) : (
                    <span className="text-sm text-rose-700">Rejected ✕</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="text-gray-600">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-2 rounded-xl border border-gray-200 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-2 rounded-xl border border-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold">Confirm {confirm.action}</h2>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to {confirm.action} the request for <span className="font-medium">{confirm.name}</span>?
            </p>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setConfirm(null)}
                className="px-3 py-2 rounded-xl border border-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => doAction(confirm.id, confirm.action)}
                className={`px-3 py-2 rounded-xl text-white ${
                  confirm.action === "accept" ? "bg-emerald-600 hover:brightness-95" : "bg-rose-600 hover:brightness-95"
                }`}
              >
                Yes, {confirm.action}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
