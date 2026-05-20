"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/admin/PageHeader";

interface DashboardStats {
  totalUsers: number;
  totalClients: number;
  totalTests: number;
  totalAdvisors: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalClients: 0,
    totalTests: 0,
    totalAdvisors: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("access_token");
      
      // Fetch stats from different endpoints
      const [clientsRes, testsRes, advisorsRes] = await Promise.all([
        fetch("https://testplatform-uman-acc.initconsult.be/api/clients", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("https://testplatform-uman-acc.initconsult.be/api/tests", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("https://testplatform-uman-acc.initconsult.be/api/advisors", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [clients, tests, advisors] = await Promise.all([
        clientsRes.json(),
        testsRes.json(),
        advisorsRes.json(),
      ]);

      setStats({
        totalUsers: 1, // Placeholder since we don't have a users endpoint
        totalClients: clients.length || 0,
        totalTests: tests.length || 0,
        totalAdvisors: advisors.length || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Totaal Gebruikers",
      value: stats.totalUsers,
      icon: "👥",
      color: "bg-blue-500",
    },
    {
      title: "Totaal Klanten",
      value: stats.totalClients,
      icon: "👤",
      color: "bg-green-500",
    },
    {
      title: "Totaal Tests",
      value: stats.totalTests,
      icon: "📝",
      color: "bg-purple-500",
    },
    {
      title: "Totaal Adviseurs",
      value: stats.totalAdvisors,
      icon: "🎯",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overzicht van het U-Man Test Platform"
      />

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Welkom bij U-Man Admin</h2>
        <p className="text-blue-100">
          Beheer uw test platform vanuit dit centrale dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? "..." : card.value}
                </p>
              </div>
              <div
                className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center text-white text-xl`}
              >
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Snelle Acties
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/admin/clients"
            className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <span className="text-2xl mr-3">👤</span>
            <div>
              <p className="font-medium text-gray-900">Klanten Beheren</p>
              <p className="text-sm text-gray-600">Voeg toe of bewerk klanten</p>
            </div>
          </a>
          <a
            href="/admin/tests"
            className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <span className="text-2xl mr-3">📝</span>
            <div>
              <p className="font-medium text-gray-900">Tests Beheren</p>
              <p className="text-sm text-gray-600">Configureer tests</p>
            </div>
          </a>
          <a
            href="/admin/advisors"
            className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <span className="text-2xl mr-3">🎯</span>
            <div>
              <p className="font-medium text-gray-900">Adviseurs Beheren</p>
              <p className="text-sm text-gray-600">Beheer adviseurs</p>
            </div>
          </a>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recente Activiteit
        </h3>
        <div className="text-center py-8 text-gray-500">
          <p>Geen recente activiteit om weer te geven</p>
        </div>
      </div>
    </div>
  );
}
