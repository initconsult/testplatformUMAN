"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/admin/DataTable";
import PageHeader from "@/components/admin/PageHeader";
import Modal from "@/components/admin/Modal";

interface ClientTest {
  id: number;
  test_id: number;
  client_id: number;
  safeurl: string;
  complete: boolean;
}

interface Client {
  id: number;
  name: string;
  firstname: string;
}

interface Test {
  id: number;
  nameNL: string;
}

export default function ClientTestsPage() {
  const [clientTests, setClientTests] = useState<ClientTest[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedClientTest, setSelectedClientTest] =
    useState<ClientTest | null>(null);
  const [formData, setFormData] = useState({ test_id: 0, client_id: 0 });
  const [saving, setSaving] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://testplatform-uman-acc.initconsult.be/api";

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ctRes, cRes, tRes] = await Promise.all([
        fetch(`${apiUrl}/api/client-tests/`),
        fetch(`${apiUrl}/api/clients/`),
        fetch(`${apiUrl}/api/tests/`),
      ]);
      setClientTests(await ctRes.json());
      setClients(await cRes.json());
      setTests(await tRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNew = () => {
    setFormData({ test_id: 0, client_id: 0 });
    setModalOpen(true);
  };

  const handleDelete = (ct: ClientTest) => {
    setSelectedClientTest(ct);
    setDeleteModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`${apiUrl}/api/client-tests/`, {
        method: "POST",
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
    if (!selectedClientTest) return;
    try {
      await fetch(`${apiUrl}/api/client-tests/${selectedClientTest.id}`, {
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
      key: "client_id",
      label: "Klant",
      render: (val: number) => {
        const client = clients.find((c) => c.id === val);
        return client ? (
          <span className="font-medium text-gray-800">
            {client.firstname} {client.name}
          </span>
        ) : "-";
      },
    },
    {
      key: "test_id",
      label: "Test",
      render: (val: number) => {
        const test = tests.find((t) => t.id === val);
        return test ? (
          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-lg text-xs font-medium">
            {test.nameNL}
          </span>
        ) : "-";
      },
    },
    {
      key: "safeurl",
      label: "URL",
      render: (val: string) => (
        <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
          {val}
        </code>
      ),
    },
    {
      key: "complete",
      label: "Status",
      render: (val: boolean) => (
        <span
          className={`px-2 py-1 rounded-lg text-xs font-medium ${
            val
              ? "bg-green-100 text-green-700"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {val ? "✓ Voltooid" : "⏳ In behandeling"}
        </span>
      ),
    },
    {
      key: "safeurl",
      label: "Rapporten",
      render: (val: string, row: ClientTest) => {
        if (!row.complete) return <span className="text-gray-400">-</span>;
        
        return (
          <div className="flex space-x-1">
            <a
              href={`${apiUrl}/api/reports/nl/${val}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-xs bg-blue-50 px-2 py-1 rounded"
            >
              NL
            </a>
            <a
              href={`${apiUrl}/api/reports/fr/${val}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-xs bg-blue-50 px-2 py-1 rounded"
            >
              FR
            </a>
            <a
              href={`${apiUrl}/api/reports/en/${val}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-xs bg-blue-50 px-2 py-1 rounded"
            >
              EN
            </a>
            <a
              href={`${apiUrl}/api/reports/pca/nl/${val}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-800 text-xs bg-purple-50 px-2 py-1 rounded"
            >
              PCA
            </a>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Klanttests"
        description="Beheer alle klanttests in het systeem"
        action={{ label: "Nieuwe klanttest", onClick: handleNew }}
      />

      <DataTable
        columns={columns}
        data={clientTests}
        loading={loading}
        onDelete={handleDelete}
        searchKeys={["safeurl"]}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nieuwe klanttest"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Klant *
            </label>
            <select
              value={formData.client_id}
              onChange={(e) =>
                setFormData({ ...formData, client_id: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            >
              <option value={0}>Selecteer een klant</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstname} {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test *
            </label>
            <select
              value={formData.test_id}
              onChange={(e) =>
                setFormData({ ...formData, test_id: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            >
              <option value={0}>Selecteer een test</option>
              {tests.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nameNL}
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
            {saving ? "Aanmaken..." : "Aanmaken"}
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Klanttest verwijderen"
        size="sm"
      >
        <p className="text-gray-600">
          Bent u zeker dat u deze klanttest wilt verwijderen? Alle resultaten
          worden ook verwijderd.
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
