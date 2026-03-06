"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const menuItems = [
  { title: "Dashboard", href: "/admin", icon: "📊" },
  { title: "Klanten", href: "/admin/clients", icon: "👥" },
  { title: "Adviseurs", href: "/admin/advisors", icon: "👤" },
  { title: "Tests", href: "/admin/tests", icon: "📝" },
  { title: "Vragenlijsten", href: "/admin/question-lists", icon: "📋" },
  { title: "Vragen", href: "/admin/questions", icon: "❓" },
  { title: "Categorieën", href: "/admin/categories", icon: "🏷️" },
  { title: "Klanttests", href: "/admin/client-tests", icon: "📊" },
  { title: "PCA Tabellen", href: "/admin/pca-tables", icon: "📈" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [mounted, pathname, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Laden...</div>
      </div>
    );
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gray-900 text-white flex flex-col transition-all duration-300 fixed h-full z-20`}
      >
        {/* Logo */}
        <div className="flex items-center p-4 border-b border-gray-700 h-16">
          {sidebarOpen ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                  U
                </div>
                <span className="font-bold text-lg">U-Man Admin</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ◀
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <button
                onClick={() => setSidebarOpen(true)}
                className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-sm hover:bg-blue-400 transition-colors"
              >
                U
              </button>
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 mb-1 mx-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                {sidebarOpen && (
                  <span className="ml-3 font-medium text-sm">{item.title}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className={`flex items-center text-gray-400 hover:text-white transition-colors w-full rounded-lg px-2 py-2 hover:bg-gray-800 ${
              !sidebarOpen ? "justify-center" : ""
            }`}
          >
            <span className="text-xl flex-shrink-0">🚪</span>
            {sidebarOpen && (
              <span className="ml-3 font-medium text-sm">Uitloggen</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={`flex-1 min-h-screen flex flex-col transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Top bar */}
        <header className="bg-white shadow-sm sticky top-0 z-10 h-16 flex items-center">
          <div className="px-6 w-full flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">
              {menuItems.find(
                (item) =>
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href))
              )?.title || "Dashboard"}
            </h1>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">Admin</span>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-6 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
