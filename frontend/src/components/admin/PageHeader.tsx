"use client";

import Link from "next/link";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export default function PageHeader({
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        {description && (
          <p className="text-gray-500 mt-1 text-sm">{description}</p>
        )}
      </div>
      {action && (
        <>
          {action.href ? (
            <Link
              href={action.href}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm shadow-blue-200 flex items-center space-x-2"
            >
              <span>➕</span>
              <span>{action.label}</span>
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm shadow-blue-200 flex items-center space-x-2"
            >
              <span>➕</span>
              <span>{action.label}</span>
            </button>
          )}
        </>
      )}
    </div>
  );
}
