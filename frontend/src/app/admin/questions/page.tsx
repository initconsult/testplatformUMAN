"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/admin/DataTable";
import PageHeader from "@/components/admin/PageHeader";
import Modal from "@/components/admin/Modal";

interface Question {
  id: number;
  questionNL: string;
  questionFR: string;
  questionEN: string;
  category_id: number;
  question_list_id: number;
  weight: number;
}

interface Category {
  id: number;
  nameNL: string;
}

interface QuestionList {
  id: number;
  name: string;
}

const emptyQuestion = {
  questionNL: "",
  questionFR: "",
  questionEN: "",
  questionDE: "",
  ScoreYesMinorMale: 0,
  ScoreYesAdultMale: 0,
  ScoreUndefinedMinorMale: 0,
  ScoreUndefinedAdultMale: 0,
  ScoreNoMinorMale: 0,
  ScoreNoAdultMale: 0,
  ScoreYesMinorFemale: 0,
  ScoreYesAdultFemale: 0,
  ScoreUndefinedMinorFemale: 0,
  ScoreUndefinedAdultFemale: 0,
  ScoreNoMinorFemale: 0,
  ScoreNoAdultFemale: 0,
  category_id: 0,
  question_list_id: 0,
  weight: 1,
};

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [questionLists, setQuestionLists] = useState<QuestionList[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState(emptyQuestion);
  const [saving, setSaving] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://testplatform-uman-acc.initconsult.be/api";

  const fetchData = async () => {
    setLoading(true);
    try {
      const [qRes, cRes, qlRes] = await Promise.all([
        fetch(`${apiUrl}/questions/`),
        fetch(`${apiUrl}/categories/`),
        fetch(`${apiUrl}/question-lists/`),
      ]);
      setQuestions(await qRes.json());
      setCategories(await cRes.json());
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

  const handleEdit = (question: Question) => {
    setSelectedQuestion(question);
    setFormData({ ...emptyQuestion, ...question });
    setModalOpen(true);
  };

  const handleNew = () => {
    setSelectedQuestion(null);
    setFormData(emptyQuestion);
    setModalOpen(true);
  };

  const handleDelete = (question: Question) => {
    setSelectedQuestion(question);
    setDeleteModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = selectedQuestion
        ? `${apiUrl}/questions/${selectedQuestion.id}`
        : `${apiUrl}/questions/`;
      const method = selectedQuestion ? "PATCH" : "POST";
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
    if (!selectedQuestion) return;
    try {
      await fetch(`${apiUrl}/questions/${selectedQuestion.id}`, {
        method: "DELETE",
      });
      setDeleteModalOpen(false);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const scoreFields = [
    { key: "ScoreYesMinorMale", label: "Ja Minderjarig Man" },
    { key: "ScoreYesAdultMale", label: "Ja Volwassen Man" },
    { key: "ScoreUndefinedMinorMale", label: "Onbepaald Minderjarig Man" },
    { key: "ScoreUndefinedAdultMale", label: "Onbepaald Volwassen Man" },
    { key: "ScoreNoMinorMale", label: "Nee Minderjarig Man" },
    { key: "ScoreNoAdultMale", label: "Nee Volwassen Man" },
    { key: "ScoreYesMinorFemale", label: "Ja Minderjarig Vrouw" },
    { key: "ScoreYesAdultFemale", label: "Ja Volwassen Vrouw" },
    { key: "ScoreUndefinedMinorFemale", label: "Onbepaald Minderjarig Vrouw" },
    { key: "ScoreUndefinedAdultFemale", label: "Onbepaald Volwassen Vrouw" },
    { key: "ScoreNoMinorFemale", label: "Nee Minderjarig Vrouw" },
    { key: "ScoreNoAdultFemale", label: "Nee Volwassen Vrouw" },
  ];

  const columns = [
    {
      key: "questionNL",
      label: "Vraag (NL)",
      render: (val: string) => (
        <p className="max-w-xs truncate font-medium text-gray-800">{val}</p>
      ),
    },
    {
      key: "category_id",
      label: "Categorie",
      render: (val: number) => {
        const cat = categories.find((c) => c.id === val);
        return cat ? (
          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-lg text-xs font-medium">
            {cat.nameNL}
          </span>
        ) : "-";
      },
    },
    {
      key: "question_list_id",
      label: "Vragenlijst",
      render: (val: number) => {
        const ql = questionLists.find((q) => q.id === val);
        return ql ? (
          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg text-xs font-medium">
            {ql.name}
          </span>
        ) : "-";
      },
    },
    {
      key: "weight",
      label: "Gewicht",
      render: (val: number) => (
        <span className="text-gray-600 font-medium">{val}</span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Vragen"
        description="Beheer alle vragen in het systeem"
        action={{ label: "Nieuwe vraag", onClick: handleNew }}
      />

      <DataTable
        columns={columns}
        data={questions}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchKeys={["questionNL", "questionFR", "questionEN"]}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedQuestion ? "Vraag bewerken" : "Nieuwe vraag"}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vraag NL *
            </label>
            <textarea
              value={formData.questionNL}
              onChange={(e) =>
                setFormData({ ...formData, questionNL: e.target.value })
              }
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vraag FR
              </label>
              <textarea
                value={formData.questionFR}
                onChange={(e) =>
                  setFormData({ ...formData, questionFR: e.target.value })
                }
                rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vraag EN
              </label>
              <textarea
                value={formData.questionEN}
                onChange={(e) =>
                  setFormData({ ...formData, questionEN: e.target.value })
                }
                rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vraag DE
              </label>
              <textarea
                value={formData.questionDE}
                onChange={(e) =>
                  setFormData({ ...formData, questionDE: e.target.value })
                }
                rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categorie *
              </label>
              <select
                value={formData.category_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category_id: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gewicht *
            </label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) =>
                setFormData({ ...formData, weight: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Scores
            </label>
            <div className="grid grid-cols-2 gap-2">
              {scoreFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-xs text-gray-500 mb-1">
                    {field.label}
                  </label>
                  <input
                    type="number"
                    value={
                      formData[field.key as keyof typeof formData] as number
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [field.key]: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
                  />
                </div>
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
        title="Vraag verwijderen"
        size="sm"
      >
        <p className="text-gray-600">
          Bent u zeker dat u deze vraag wilt verwijderen?
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
