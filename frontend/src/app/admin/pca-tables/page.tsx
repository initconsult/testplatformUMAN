"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/admin/DataTable";
import PageHeader from "@/components/admin/PageHeader";
import Modal from "@/components/admin/Modal";

interface PCAItem {
  id: number;
  category_id: number;
  score: number;
  scorereport: number;
}

interface Category {
  id: number;
  nameNL: string;
}

type PCATable = "PCAMA" | "PCAFY" | "PCAFA" | "PCAMY";

const tableLabels = {
  PCAMA: "PCA Volwassen Man",
  PCAFY: "PCA Jonge Vrouw",
  PCAFA: "PCA Volwassen Vrouw", 
  PCAMY: "PCA Jonge Man"
};

export default function PCATablesPage() {
  const [activeTable, setActiveTable] = useState<PCATable>("PCAMA");
  const [pcaItems, setPcaItems] = useState<PCAItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PCAItem | null>(null);
  const [formData, setFormData] = useState({
    category_id: 0,
    score: 0,
    scorereport: 0,
  });
  const [saving, setSaving] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://testplatform-uman-acc.initconsult.be/api";

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pcaRes, catRes] = await Promise.all([
        fetch(`${apiUrl}/pca/${activeTable.toLowerCase()}/`),
        fetch(`${apiUrl}/categories/`),
      ]);
      setPcaItems(await pcaRes.json());
      setCategories(await catRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTable]);

  const handleNew = () => {
    setSelectedItem(null);
    setFormData({ category_id: 0, score: 0, scorereport: 0 });
    setModalOpen(true);
  };

  const handleEdit = (item: PCAItem) => {
    setSelectedItem(item);
    setFormData({
      category_id: item.category_id,
      score: item.score,
      scorereport: item.scorereport,
    });
    setModalOpen(true);
  };

  const handleDelete = (item: PCAItem) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = selectedItem
        ? `${apiUrl}/pca/${activeTable.toLowerCase()}/${selectedItem.id}`
        : `${apiUrl}/pca/${activeTable.toLowerCase()}/`;
      
      await fetch(url, {
        method: selectedItem ? "PATCH" : "POST",
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
    if (!selectedItem) return;
    try {
      await fetch(`${apiUrl}/pca/${activeTable.toLowerCase()}/${selectedItem.id}`, {
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
      key: "category_id",
      label: "Categorie",
      render: (val: number) => {
        const category = categories.find((c) => c.id === val);
        return category ? (
          <span className="font-medium text-gray-800">
            {category.nameNL}
          </span>
        ) : (
          <span className="text-gray-400">ID: {val}</span>
        );
      },
    },
    {
      key: "score",
      label: "Score",
      render: (val: number) => (
        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium">
          {val}
        </span>
      ),
    },
    {
      key: "scorereport",
      label: "Rapport Score",
      render: (val: number) => (
        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-medium">
          {val}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="PCA Tabellen"
        description="Beheer PCA score tabellen voor verschillende demografische groepen"
        action={{ label: "Nieuwe entry", onClick: handleNew }}
      />

      {/* Table selector */}
      <div className="mb-6">
        <div className="flex space-x-2">
          {(Object.keys(tableLabels) as PCATable[]).map((table) => (
            <button
              key={table}
              onClick={() => setActiveTable(table)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTable === table
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tableLabels[table]}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={pcaItems}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchKeys={["score", "scorereport"]}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`${selectedItem ? "Bewerk" : "Nieuwe"} ${tableLabels[activeTable]} Entry`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categorie *
            </label>
            <select
              value={formData.category_id}
              onChange={(e) =>
                setFormData({ ...formData, category_id: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            >
              <option value={0}>Selecteer een categorie</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameNL}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Score *
            </label>
            <input
              type="number"
              value={formData.score}
              onChange={(e) =>
                setFormData({ ...formData, score: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rapport Score *
            </label>
            <input
              type="number"
              value={formData.scorereport}
              onChange={(e) =>
                setFormData({ ...formData, scorereport: Number(e.target.value) })
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
        title="PCA Entry verwijderen"
        size="sm"
      >
        <p className="text-gray-600">
          Bent u zeker dat u deze PCA entry wilt verwijderen?
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
