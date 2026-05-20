"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import DataTable from "@/components/admin/DataTable";
import PageHeader from "@/components/admin/PageHeader";
import Modal from "@/components/admin/Modal";

interface Category {
  id: number;
  nameNL: string;
  nameFR: string;
  nameEN: string;
  descriptionNL: string;
  question_list_id: number;
}

interface QuestionList {
  id: number;
  name: string;
}

const emptyCategory = {
  nameNL: "",
  nameFR: "",
  nameEN: "",
  nameDE: "",
  descriptionNL: "",
  descriptionFR: "",
  descriptionEN: "",
  descriptionDE: "",
  question_list_id: 0,
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [questionLists, setQuestionLists] = useState<QuestionList[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState(emptyCategory);
  const [saving, setSaving] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://testplatform-uman-acc.initconsult.be/api";

  const searchParams = useSearchParams();
  const questionListIdParam = searchParams.get("questionListId");
  const questionListIdValue = questionListIdParam ? Number(questionListIdParam) : null;
  const activeQuestionListId =
    questionListIdValue !== null && !Number.isNaN(questionListIdValue)
      ? questionListIdValue
      : null;

  const activeQuestionList = useMemo(
    () =>
      activeQuestionListId
        ? questionLists.find((ql) => ql.id === activeQuestionListId) || null
        : null,
    [activeQuestionListId, questionLists]
  );

  const filteredCategories = useMemo(() => {
    if (!activeQuestionListId) {
      return categories;
    }
    return categories.filter(
      (category) => category.question_list_id === activeQuestionListId
    );
  }, [categories, activeQuestionListId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, qlRes] = await Promise.all([
        fetch(`${apiUrl}/categories/`),
        fetch(`${apiUrl}/question-lists/`),
      ]);
      setCategories(await catRes.json());
      setQuestionLists(await qlRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormData({ ...emptyCategory, ...category });
    setModalOpen(true);
  };

  const handleNew = () => {
    setSelectedCategory(null);
    setFormData(emptyCategory);
    setModalOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = selectedCategory
        ? `${apiUrl}/categories/${selectedCategory.id}`
        : `${apiUrl}/categories/`;
      const method = selectedCategory ? "PATCH" : "POST";
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
    if (!selectedCategory) return;
    try {
      await fetch(`${apiUrl}/categories/${selectedCategory.id}`, {
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
      render: (val: string, row: Category) => (
        <Link
          href={`/admin/questions?categoryId=${row.id}&questionListId=${row.question_list_id}`}
          className="font-medium text-gray-800 hover:text-blue-600"
        >
          {val}
        </Link>
      ),
    },
    { key: "nameFR", label: "Naam (FR)" },
    { key: "nameEN", label: "Naam (EN)" },
    { key: "nameDE", label: "Naam (DE)" },
    {
      key: "question_list_id",
      label: "Vragenlijst",
      render: (val: number) => {
        const ql = questionLists.find((q) => q.id === val);
        return ql ? (
          <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-lg text-xs font-medium">
            {ql.name}
          </span>
        ) : "-";
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Categorieën"
        description="Beheer alle categorieën in het systeem"
        action={{ label: "Nieuwe categorie", onClick: handleNew }}
      />

      {activeQuestionList && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
          <span>
            Filter: vragenlijst <strong>{activeQuestionList.name}</strong>
          </span>
          <Link
            href="/admin/categories"
            className="text-blue-700 hover:text-blue-900 underline"
          >
            Toon alle categorieën
          </Link>
          <Link
            href="/admin/question-lists"
            className="text-blue-700 hover:text-blue-900 underline"
          >
            Terug naar vragenlijsten
          </Link>
        </div>
      )}

      <DataTable
        columns={columns}
        data={filteredCategories}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchKeys={["nameNL", "nameFR", "nameEN", "nameDE"]}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedCategory ? "Categorie bewerken" : "Nieuwe categorie"}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Naam DE
              </label>
              <input
                type="text"
                value={formData.nameDE}
                onChange={(e) =>
                  setFormData({ ...formData, nameDE: e.target.value })
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

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beschrijving FR
              </label>
              <textarea
                value={formData.descriptionFR}
                onChange={(e) =>
                  setFormData({ ...formData, descriptionFR: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beschrijving EN
              </label>
              <textarea
                value={formData.descriptionEN}
                onChange={(e) =>
                  setFormData({ ...formData, descriptionEN: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beschrijving DE
              </label>
              <textarea
                value={formData.descriptionDE}
                onChange={(e) =>
                  setFormData({ ...formData, descriptionDE: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vragenlijst *
            </label>
            <select
              value={formData.question_list_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  question_list_id: Number(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
            >
              <option value={0}>Selecteer een vragenlijst</option>
              {questionLists.map((ql) => (
                <option key={ql.id} value={ql.id}>
                  {ql.name}
                </option>
              ))}
            </select>
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
        title="Categorie verwijderen"
        size="sm"
      >
        <p className="text-gray-600">
          Bent u zeker dat u <strong>{selectedCategory?.nameNL}</strong> wilt
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
