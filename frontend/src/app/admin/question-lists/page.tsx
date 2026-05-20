"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/admin/DataTable";
import PageHeader from "@/components/admin/PageHeader";
import Modal from "@/components/admin/Modal";

interface QuestionList {
  id: number;
  name: string;
  report: number;
}

const emptyQuestionList = {
  name: "",
  report: 1,
};

export default function QuestionListsPage() {
  const [questionLists, setQuestionLists] = useState<QuestionList[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedQL, setSelectedQL] = useState<QuestionList | null>(null);
  const [formData, setFormData] = useState(emptyQuestionList);
  const [saving, setSaving] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://testplatform-uman-acc.initconsult.be/api";

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/question-lists/`);
      setQuestionLists(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (ql: QuestionList) => {
    setSelectedQL(ql);
    setFormData({ name: ql.name, report: ql.report });
    setModalOpen(true);
  };

  const handleNew = () => {
    setSelectedQL(null);
    setFormData(emptyQuestionList);
    setModalOpen(true);
  };

  const handleDelete = (ql: QuestionList) => {
    setSelectedQL(ql);
    setDeleteModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = selectedQL
        ? `${apiUrl}/question-lists/${selectedQL.id}`
        : `${apiUrl}/question-lists/`;
      const method = selectedQL ? "PATCH" : "POST";
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
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
    if (!selectedQL) return;
    try {
      await fetch(`${apiUrl}/question-lists/${selectedQL.id}`, {
        method: "DELETE",
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
      render: (val: string) => (
        <span className="font-medium text-gray-800">{val}</span>
      ),
    },
    {
      key: "report",
      label: "Rapport type",
      render: (val: number) => (
        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg text-xs font-medium">
          Type {val}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Vragenlijsten"
        description="Beheer alle vragenlijsten in het systeem"
        action={{ label: "Nieuwe vragenlijst", onClick: handleNew }}
      />

      <DataTable
        columns={columns}
        data={questionLists}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchKeys={["name"]}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedQL ? "Vragenlijst bewerken" : "Nieuwe vragenlijst"}
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
              Rapport type *
            </label>
            <input
              type="number"
              value={formData.report}
              onChange={(e) =>
                setFormData({ ...formData, report: Number(e.target.value) })
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
        title="Vragenlijst verwijderen"
        size="sm"
      >
        <p className="text-gray-600">
          Bent u zeker dat u <strong>{selectedQL?.name}</strong> wilt
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
