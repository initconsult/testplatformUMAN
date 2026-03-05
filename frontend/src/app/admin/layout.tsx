"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [pathname, router]);

  return <>{children}</>;
}
