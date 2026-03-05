"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  clients: number;
  advisors: number;
  tests: number;
  clientTests: number;
}

export default function AdminDashboard() {
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
          clients: Array.isArray(clients) ? clients.length : 0,
          advisors: Array.isArray(advisors) ? advisors.length : 0,
          tests: Array.isArray(tests) ? tests.length : 0,
          clientTests: Array.isArray(clientTests) ? clientTests.length : 0,
        });
      } catch (error) {
        console.error("Fout bij ophalen statistieken:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Klanten",
      value: stats.clients,
      icon: "👥",
      color: "from-blue-500 to-blue-600",
      href: "/admin/clients",
    },
    {
      title: "Adviseurs",
      value: stats.advisors,
      icon: "👤",
      color: "from-green-500 to-green-600",
      href: "/admin/advisors",
    },
    {
      title: "Tests",
      value: stats.tests,
      icon: "📝",
      color: "from-purple-500 to-purple-600",
      href: "/admin/tests",
    },
    {
      title: "Klanttests",
      value: stats.clientTests,
      icon: "📊",
      color: "from-orange-500 to-orange-600",
      href: "/admin/client-tests",
    },
  ];

  const quickLinks = [
    {
      title: "Nieuwe klant",
      href: "/admin/clients/new",
      icon: "➕",
      desc: "Voeg een nieuwe klant toe",
    },
    {
      title: "Nieuwe test",
      href: "/admin/tests/new",
      icon: "📝",
      desc: "Maak een nieuwe test aan",
    },
    {
      title: "Nieuwe adviseur",
      href: "/admin/advisors/new",
      icon: "👤",
      desc: "Voeg een adviseur toe",
    },
    {
      title: "Nieuwe vragenlijst",
      href: "/admin/question-lists/new",
      icon: "📋",
      desc: "Maak een vragenlijst aan",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welkomstbanner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold">Welkom terug! 👋</h2>
        <p className="text-blue-100 mt-1">
          Hier is een overzicht van uw U-Man platform
        </p>
      </div>

      {/* Statistieken */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <Link key={card.title} href={card.href}>
            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`bg-gradient-to-br ${card.color} text-white rounded-xl w-12 h-12 flex items-center justify-center text-xl shadow-sm`}
                >
                  {card.icon}
                </div>
                <span className="text-gray-400 text-sm">→</span>
              </div>
              <p className="text-3xl font-bold text-gray-800">
                {loading ? (
                  <span className="inline-block w-8 h-8 bg-gray-200 rounded animate-pulse"></span>
                ) : (
                  card.value
                )}
              </p>
              <p className="text-gray-500 text-sm mt-1">{card.title}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Snelle acties */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Snelle acties
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <Link key={link.title} href={link.href}>
              <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group">
                <div className="text-2xl mb-3">{link.icon}</div>
                <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {link.title}
                </h4>
                <p className="text-sm text-gray-500 mt-1">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Navigatie overzicht */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Beheer modules
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: "Klanten",
              href: "/admin/clients",
              icon: "👥",
              desc: "Beheer alle klanten",
              color: "border-blue-200 hover:border-blue-400",
            },
            {
              title: "Adviseurs",
              href: "/admin/advisors",
              icon: "👤",
              desc: "Beheer adviseurs",
              color: "border-green-200 hover:border-green-400",
            },
            {
              title: "Tests",
              href: "/admin/tests",
              icon: "📝",
              desc: "Beheer testen",
              color: "border-purple-200 hover:border-purple-400",
            },
            {
              title: "Vragenlijsten",
              href: "/admin/question-lists",
              icon: "📋",
              desc: "Beheer vragenlijsten",
              color: "border-yellow-200 hover:border-yellow-400",
            },
            {
              title: "Vragen",
              href: "/admin/questions",
              icon: "❓",
              desc: "Beheer vragen",
              color: "border-red-200 hover:border-red-400",
            },
            {
              title: "Categorieën",
              href: "/admin/categories",
              icon: "🏷️",
              desc: "Beheer categorieën",
              color: "border-indigo-200 hover:border-indigo-400",
            },
          ].map((item) => (
            <Link key={item.title} href={item.href}>
              <div
                className={`bg-white rounded-2xl p-5 border-2 ${item.color} transition-all cursor-pointer hover:shadow-md`}
              >
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-800">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <span className="ml-auto text-gray-300">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
