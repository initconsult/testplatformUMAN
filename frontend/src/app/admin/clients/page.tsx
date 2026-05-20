"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/admin/DataTable";
import PageHeader from "@/components/admin/PageHeader";
import Modal from "@/components/admin/Modal";

interface Client {
  id: number;
  name: string;
  firstname: string;
  companyname: string;
  emailaddress: string;
  phone: string;
  language: string;
  advisors_id: number;
}

interface Advisor {
  id: number;
  name: string;
  emailaddress: string;
}

const emptyClient = {
  name: "",
  firstname: "",
  companyname: "",
  emailaddress: "",
  phone: "",
  mobile: "",
  address: "",
  zip: "",
  city: "",
  language: "NL",
  gender: "M",
  advisors_id: 0,
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState(emptyClient);
  const [saving, setSaving] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://testplatform-uman-acc.initconsult.be/api";

  const fetchData = async () => {
    setLoading(true);
    try {
      const [clientsRes, advisorsRes] = await Promise.all([
        fetch(`${apiUrl}/api/clients/`),
        fetch(`${apiUrl}/api/advisors/`),
      ]);
      setClients(await clientsRes.json());
      setAdvisors(await advisorsRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setFormData({ ...emptyClient, ...client });
    setModalOpen(true);
  };

  const handleNew = () => {
    setSelectedClient(null);
    setFormData(emptyClient);
    setModalOpen(true);
  };

  const handleDelete = (client: Client) => {
    setSelectedClient(client);
    setDeleteModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = selectedClient
        ? `${apiUrl}/api/clients/${selectedClient.id}`
        : `${apiUrl}/api/clients/`;
      const method = selectedClient ? "PATCH" : "POST";
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
    if (!selectedClient) return;
    try {
      await fetch(`${apiUrl}/api/clients/${selectedClient.id}`, {
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
      render: (_: any, row: Client) => (
        <div>
          <p className="font-medium text-gray-800">
            {row.firstname} {row.name}
          </p>
          <p className="text-xs text-gray-400">{row.emailaddress}</p>
        </div>
      ),
    },
    { key: "companyname", label: "Bedrijf" },
    { key: "phone", label: "Telefoon" },
    {
      key: "language",
      label: "Taal",
      render: (val: string) => (
        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium">
          {val}
        </span>
      ),
    },
    {
      key: "advisors_id",
      label: "Adviseur",
      render: (val: number) => {
        const advisor = advisors.find((a) => a.id === val);
        return advisor ? advisor.name : "-";
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Klanten"
        description="Beheer alle klanten in het systeem"
        action={{ label: "Nieuwe klant", onClick: handleNew }}
      />

      <DataTable
        columns={columns}
        data={clients}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchKeys={["name", "firstname", "companyname", "emailaddress"]}
      />

      {/* Formulier modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedClient ? "Klant bewerken" : "Nieuwe klant"}
        size="lg"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Voornaam *
            </label>
            <input
              type="text"
              value={formData.firstname}
              onChange={(e) =>
                setFormData({ ...formData, firstname: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
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
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bedrijfsnaam *
            </label>
            <input
              type="text"
              value={formData.companyname}
              onChange={(e) =>
                setFormData({ ...formData, companyname: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mailadres
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefoon
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adres
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postcode
            </label>
            <input
              type="text"
              value={formData.zip}
              onChange={(e) =>
                setFormData({ ...formData, zip: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stad
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Taal
            </label>
            <select
              value={formData.language}
              onChange={(e) =>
                setFormData({ ...formData, language: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            >
              <option value="NL">Nederlands</option>
              <option value="FR">Frans</option>
              <option value="EN">Engels</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Geslacht
            </label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            >
              <option value="M">Man</option>
              <option value="F">Vrouw</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adviseur *
            </label>
            <select
              value={formData.advisors_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  advisors_id: Number(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            >
              <option value={0}>Selecteer een adviseur</option>
              {advisors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
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

      {/* Verwijder modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Klant verwijderen"
        size="sm"
      >
        <p className="text-gray-600">
          Bent u zeker dat u{" "}
          <strong>
            {selectedClient?.firstname} {selectedClient?.name}
          </strong>{" "}
          wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
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
