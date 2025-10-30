import React, { useEffect, useState } from "react";
import api from "../services/api"

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);

  const fetchContacts = async (p = 1, q = "") => {
    setLoading(true);
    try {
      const resp = await api.get("/contacts", {
        params: { page: p, limit, search: q || undefined },
      });
      const json = resp.data;
      if (json && json.success) {
        setContacts(json.data || []);
        setPage(json.meta?.page || p);
        setTotalPages(json.meta?.totalPages || 1);
      } else {
        console.error("Failed to load contacts:", json);
      }
    } catch (err) {
      console.error("Error fetching contacts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts(1, "");
  }, []);

  const handleSearch = async (e) => {
    e?.preventDefault?.();
    await fetchContacts(1, search);
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllOnPage = () => {
    const allIds = contacts.map((c) => c._id);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const allSelected = allIds.every((id) => next.has(id));
      if (allSelected) {
        allIds.forEach((id) => next.delete(id));
      } else {
        allIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return alert("No contacts selected");
    if (!window.confirm(`Delete ${selectedIds.size} contact(s)? This action cannot be undone.`)) return;

    try {
      const resp = await api.delete("/contacts", { data: { ids: Array.from(selectedIds) } });
      const json = resp.data;
      if (json && json.success) {
        alert(`Deleted ${json.deletedCount ?? json.deletedCount ?? 0} contacts`);
        setSelectedIds(new Set());
        fetchContacts(page, search);
      } else {
        alert(json?.error || "Failed to delete");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting contacts");
    }
  };

  const handleDeleteOne = async (id) => {
    if (!window.confirm("Delete this contact?")) return;
    try {
      const resp = await api.delete(`/contacts/${id}`);
      const json = resp.data;
      if (json && json.success) {
        fetchContacts(page, search);
      } else {
        alert(json?.error || "Failed to delete");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting contact");
    }
  };

  const handleFileImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!window.confirm(`Import ${file.name}? Rows with existing emails will be upserted.`)) {
      e.target.value = null;
      return;
    }

    setImporting(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const resp = await api.post("/contacts/import", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const json = resp.data;
      if (json && json.success) {
        alert(`Imported ${json.imported ?? 0} rows (upserted).`);
        fetchContacts(1, "");
        setSearch("");
      } else {
        alert(json?.error || "Import failed");
      }
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.error || err?.message || "Import error";
      alert(msg);
    } finally {
      setImporting(false);
      e.target.value = null;
    }
  };

  const handleExport = async () => {
    try {
      const resp = await api.get("/contacts/export", {
        params: search ? { search } : {},
        responseType: "blob",
      });
      const blob = resp.data;
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = `contacts_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
    } catch (err) {
      console.error(err);
      alert("Export failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <div className="flex items-center space-x-3">
          <label className="px-3 py-2 bg-gray-100 text-gray-800 rounded cursor-pointer">
            {importing ? "Importing..." : "Import CSV"}
            <input type="file" accept=".csv" onChange={handleFileImport} style={{ display: "none" }} />
          </label>
          <button onClick={handleExport} className="px-3 py-2 bg-gray-100 text-gray-900 border rounded">Export CSV</button>
          <button
            onClick={handleBulkDelete}
            disabled={selectedIds.size === 0}
            className="px-3 py-2 bg-red-600 text-gray-100 rounded"
          >
            Delete Selected ({selectedIds.size})
          </button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 items-center mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email or phone..."
          className="flex-1 px-3 py-2 border rounded text-gray-800"
        />
        <button type="submit" onClick={handleSearch} className="px-3 py-2 bg-blue-600 text-white rounded">Search</button>
      </form>

      <div className="overflow-x-auto bg-gray-200 rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-200">
            <tr>
              <th className="px-3 py-2 text-left">
                <input type="checkbox" onChange={selectAllOnPage} />
              </th>
              <th className="px-3 text-gray-800 py-2 text-left">Name</th>
              <th className="px-3 text-gray-800 py-2 text-left">Email</th>
              <th className="px-3 text-gray-800 py-2 text-left">Phone</th>
              <th className="px-3 text-gray-800 py-2 text-left">Tags</th>
              <th className="px-3 text-gray-800 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="p-4 text-center">Loading...</td></tr>
            ) : contacts.length === 0 ? (
              <tr><td colSpan="7" className="p-4 text-center">No contacts found</td></tr>
            ) : contacts.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="px-3 py-2">
                  <input type="checkbox" checked={selectedIds.has(c._id)} onChange={() => toggleSelect(c._id)} />
                </td>
                <td className="px-3 text-gray-600 py-2">{c.name}</td>
                <td className="px-3 text-gray-600 py-2">{c.email}</td>
                <td className="px-3 text-gray-600 py-2">{c.phone}</td>
                <td className="px-3 text-gray-600 py-2">{(c.tags || []).join(", ")}</td>
                <td className="px-3 text-gray-800 py-2">
                  <button className="px-2 py-1 bg-yellow-400 text-gray-200 rounded mr-2" onClick={() => navigator.clipboard.writeText(c.email)}>Copy Email</button>
                  <button className="px-2 py-1 bg-red-600 text-gray-200 rounded" onClick={() => handleDeleteOne(c._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          Page {page} of {totalPages}
        </div>
        <div className="space-x-2">
          <button disabled={page <= 1} onClick={() => { const np = Math.max(1, page - 1); setPage(np); fetchContacts(np, search); }} className="px-3 py-1 bg-white border text-gray-800 rounded disabled:opacity-50">Prev</button>
          <button disabled={page >= totalPages} onClick={() => { const np = Math.min(totalPages, page + 1); setPage(np); fetchContacts(np, search); }} className="px-3 py-1 text-gray-800 bg-white border rounded disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
}