"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Stats {
  clients: number;
  advisors: number;
  tests: number;
  clientTests: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    clients: 0,
    advisors: 0,
    tests: 0,
    clientTests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

        const [clientsRes, advisorsRes, testsRes, clientTestsRes] =
          await Promise.all([
            fetch(`${apiUrl}/api/clients/`),
            fetch(`${apiUrl}/api/advisors/`),
            fetch(`${apiUrl}/api/tests/`),
            fetch(`${apiUrl}/api/client-tests/`),
          ]);

        const [clients, advisors, tests, clientTests] = await Promise.all([
          clientsRes.json(),
          advisorsRes.json(),
          testsRes.json(),
          clientTestsRes.json(),
        ]);

        setStats({
          clients: clients.length,
          advisors: advisors.length,
          tests: tests.length,
          clientTests: clientTests.length,
        });
      } catch (error) {
        console.error("Fout bij ophalen statistieken:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    router.push("/admin/login");
  };

  const menuItems = [
    { title: "Klanten", href: "/admin/clients", icon: "👥" },
    { title: "Adviseurs", href: "/admin/advisors", icon: "👤" },
    { title: "Tests", href: "/admin/tests", icon: "📝" },
    { title: "Vragenlijsten", href: "/admin/question-lists", icon: "📋" },
    { title: "Vragen", href: "/admin/questions", icon: "❓" },
    { title: "Categorieën", href: "/admin/categories", icon: "🏷️" },
  ];

  const statCards = [
    {
      title: "Klanten",
      value: stats.clients,
      icon: "👥",
      color: "bg-blue-500",
    },
    {
      title: "Adviseurs",
      value: stats.advisors,
      icon: "👤",
      color: "bg-green-500",
    },
    {
      title: "Tests",
      value: stats.tests,
      icon: "📝",
      color: "bg-purple-500",
    },
    {
      title: "Klanttests",
      value: stats.clientTests,
      icon: "📊",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigatiebalk */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">
                U-Man Beheerderportaal
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Uitloggen
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welkomstbericht */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-gray-500 mt-1">
            Welkom in het U-Man beheerderportaal
          </p>
        </div>

        {/* Statistieken */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-lg shadow-sm p-6 flex items-center"
            >
              <div
                className={`${card.color} text-white rounded-full w-12 h-12 flex items-center justify-center text-xl mr-4`}
              >
                {card.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800">
                  {loading ? "..." : card.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Menu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="bg-white rounded-lg shadow-sm p-6 flex items-center hover:shadow-md transition-shadow cursor-pointer"
            >
              <span className="text-3xl mr-4">{item.icon}</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500">
                  Beheer {item.title.toLowerCase()}
                </p>
              </div>
              <span className="ml-auto text-gray-400">→</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
