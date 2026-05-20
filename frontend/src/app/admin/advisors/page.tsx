"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/admin/DataTable";
import PageHeader from "@/components/admin/PageHeader";
import Modal from "@/components/admin/Modal";

interface Advisor {
  id: number;
  name: string;
  emailaddress: string;
}

const emptyAdvisor = {
  name: "",
  emailaddress: "",
};

export default function AdvisorsPage() {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [formData, setFormData] = useState(emptyAdvisor);
  const [saving, setSaving] = useState(false);

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://testplatform-uman-acc.initconsult.be/api";

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const headers: HeadersInit = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      const res = await fetch(`${apiUrl}/advisors/`, {
        headers,
        credentials: "include",
      });

      const data = res.ok ? await res.json() : [];
      setAdvisors(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setAdvisors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (advisor: Advisor) => {
    setSelectedAdvisor(advisor);
    setFormData({ name: advisor.name, emailaddress: advisor.emailaddress });
    setModalOpen(true);
  };

  const handleNew = () => {
    setSelectedAdvisor(null);
    setFormData(emptyAdvisor);
    setModalOpen(true);
  };

  const handleDelete = (advisor: Advisor) => {
    setSelectedAdvisor(advisor);
    setDeleteModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = selectedAdvisor
        ? `${apiUrl}/advisors/${selectedAdvisor.id}`
        : `${apiUrl}/advisors/`;
      const method = selectedAdvisor ? "PATCH" : "POST";
      const token = localStorage.getItem("access_token");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      await fetch(url, {
        method,
        headers,
        credentials: "include",
        body: JSON.stringify(formData),
      });
      setModalOpen(false);
      fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedAdvisor) return;
    try {
      const token = localStorage.getItem("access_token");
      const headers: HeadersInit = token
        ? { Authorization: `Bearer ${token}` }
        : {};
      await fetch(`${apiUrl}/advisors/${selectedAdvisor.id}`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });
      setDeleteModalOpen(false);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const columns = [
    {
      key: "name",
      label: "Naam",
      render: (val: string, row: Advisor) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-semibold text-sm">
            {val.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-gray-800">{val}</span>
        </div>
      ),
    },
    { key: "emailaddress", label: "E-mailadres" },
  ];

  return (
    <div>
      <PageHeader
        title="Adviseurs"
        description="Beheer alle adviseurs in het systeem"
        action={{ label: "Nieuwe adviseur", onClick: handleNew }}
      />

      <DataTable
        columns={columns}
        data={advisors}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchKeys={["name", "emailaddress"]}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedAdvisor ? "Adviseur bewerken" : "Nieuwe adviseur"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Naam *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mailadres *
            </label>
            <input
              type="email"
              value={formData.emailaddress}
              onChange={(e) =>
                setFormData({ ...formData, emailaddress: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={() => setModalOpen(false)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Annuleren
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
          >
            {saving ? "Opslaan..." : "Opslaan"}
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Adviseur verwijderen"
        size="sm"
      >
        <p className="text-gray-600">
          Bent u zeker dat u <strong>{selectedAdvisor?.name}</strong> wilt
          verwijderen?
        </p>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => setDeleteModalOpen(false)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Annuleren
          </button>
          <button
            onClick={handleConfirmDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Verwijderen
          </button>
        </div>
      </Modal>
    </div>
  );
}
