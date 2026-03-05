"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/admin/DataTable";
import PageHeader from "@/components/admin/PageHeader";
import Modal from "@/components/admin/Modal";

interface Test {
  id: number;
  nameNL: string;
  nameFR: string;
  nameEN: string;
  descriptionNL: string;
  reporttitleNL: string;
  enabledNL: boolean;
  enabledFR: boolean;
  enabledEN: boolean;
}

const emptyTest = {
  nameNL: "",
  nameFR: "",
  nameEN: "",
  nameDE: "",
  reporttitleNL: "",
  reporttitleFR: "",
  reporttitleEN: "",
  reporttitleDE: "",
  descriptionNL: "",
  descriptionFR: "",
  descriptionEN: "",
  descriptionDE: "",
  enabledNL: true,
  enabledFR: false,
  enabledEN: false,
  enabledDE: false,
};

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [formData, setFormData] = useState(emptyTest);
  const [saving, setSaving] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/tests/`);
      setTests(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (test: Test) => {
    setSelectedTest(test);
    setFormData({ ...emptyTest, ...test });
    setModalOpen(true);
  };

  const handleNew = () => {
    setSelectedTest(null);
    setFormData(emptyTest);
    setModalOpen(true);
  };

  const handleDelete = (test: Test) => {
    setSelectedTest(test);
    setDeleteModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = selectedTest
        ? `${apiUrl}/api/tests/${selectedTest.id}`
        : `${apiUrl}/api/tests/`;
      const method = selectedTest ? "PATCH" : "POST";
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
    if (!selectedTest) return;
    try {
      await fetch(`${apiUrl}/api/tests/${selectedTest.id}`, {
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
      key: "nameNL",
      label: "Naam (NL)",
      render: (val: string, row: Test) => (
        <div>
          <p className="font-medium text-gray-800">{val}</p>
          <p className="text-xs text-gray-400">{row.reporttitleNL}</p>
        </div>
      ),
    },
    { key: "nameFR", label: "Naam (FR)" },
    { key: "nameEN", label: "Naam (EN)" },
    {
      key: "enabledNL",
      label: "Actief",
      render: (_: any, row: Test) => (
        <div className="flex space-x-1">
          {row.enabledNL && (
            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">
              NL
            </span>
          )}
          {row.enabledFR && (
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
              FR
            </span>
          )}
          {row.enabledEN && (
            <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs">
              EN
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Tests"
        description="Beheer alle testen in het systeem"
        action={{ label: "Nieuwe test", onClick: handleNew }}
      />

      <DataTable
        columns={columns}
        data={tests}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchKeys={["nameNL", "nameFR", "nameEN"]}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedTest ? "Test bewerken" : "Nieuwe test"}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Naam NL *
              </label>
              <input
                type="text"
                value={formData.nameNL}
                onChange={(e) =>
                  setFormData({ ...formData, nameNL: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Naam FR
              </label>
              <input
                type="text"
                value={formData.nameFR}
                onChange={(e) =>
                  setFormData({ ...formData, nameFR: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Naam EN
              </label>
              <input
                type="text"
                value={formData.nameEN}
                onChange={(e) =>
                  setFormData({ ...formData, nameEN: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rapporttitel NL *
              </label>
              <input
                type="text"
                value={formData.reporttitleNL}
                onChange={(e) =>
                  setFormData({ ...formData, reporttitleNL: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rapporttitel FR
              </label>
              <input
                type="text"
                value={formData.reporttitleFR}
                onChange={(e) =>
                  setFormData({ ...formData, reporttitleFR: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rapporttitel EN
              </label>
              <input
                type="text"
                value={formData.reporttitleEN}
                onChange={(e) =>
                  setFormData({ ...formData, reporttitleEN: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Beschrijving NL *
            </label>
            <textarea
              value={formData.descriptionNL}
              onChange={(e) =>
                setFormData({ ...formData, descriptionNL: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Actief in talen
            </label>
            <div className="flex space-x-4">
              {["NL", "FR", "EN", "DE"].map((lang) => (
                <label key={lang} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={
                      formData[`enabled${lang}` as keyof typeof formData] as boolean
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [`enabled${lang}`]: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">{lang}</span>
                </label>
              ))}
            </div>
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
        title="Test verwijderen"
        size="sm"
      >
        <p className="text-gray-600">
          Bent u zeker dat u <strong>{selectedTest?.nameNL}</strong> wilt
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
