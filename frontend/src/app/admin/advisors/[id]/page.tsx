"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";

interface Advisor {
  id: number;
  name: string;
  emailaddress: string;
}

interface Test {
  id: number;
  nameNL: string;
  nameFR?: string;
  nameEN?: string;
  nameDE?: string;
  enabledNL?: boolean;
  enabledFR?: boolean;
  enabledEN?: boolean;
  enabledDE?: boolean;
}

type LanguageKey = "NL" | "FR" | "EN" | "DE";

const languageConfig: Array<{
  key: LanguageKey;
  label: string;
  suffix: string;
  enabledField: keyof Test;
  nameField: keyof Test;
}> = [
  { key: "NL", label: "NL", suffix: "", enabledField: "enabledNL", nameField: "nameNL" },
  { key: "FR", label: "FR", suffix: "/FR", enabledField: "enabledFR", nameField: "nameFR" },
  { key: "EN", label: "EN", suffix: "/EN", enabledField: "enabledEN", nameField: "nameEN" },
  { key: "DE", label: "DE", suffix: "/DE", enabledField: "enabledDE", nameField: "nameDE" },
];

export default function AdvisorDetailPage() {
  const params = useParams();
  const advisorId = Number(params?.id);
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://testplatform-uman-acc.initconsult.be/api";
  const frontendBaseUrl =
    process.env.NEXT_PUBLIC_FRONTEND_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");

  const [advisor, setAdvisor] = useState<Advisor | null>(null);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const testUrls = useMemo(() => {
    if (!advisor || !frontendBaseUrl) {
      return [];
    }

    return tests.map((test) => {
      const availableLanguages = languageConfig.filter((lang) => {
        const enabledValue = test[lang.enabledField];
        const nameValue = test[lang.nameField];
        const enabled = enabledValue === undefined ? true : Boolean(enabledValue);
        return Boolean(nameValue) && enabled;
      });

      return {
        test,
        languages: availableLanguages.map((lang) => {
          const nameValue = test[lang.nameField] as string;
          const url = `${frontendBaseUrl}/test/${encodeURIComponent(
            advisor.name
          )}/${encodeURIComponent(test.nameNL)}${lang.suffix}`;
          return {
            key: lang.key,
            label: lang.label,
            name: nameValue,
            url,
          };
        }),
      };
    });
  }, [advisor, tests, frontendBaseUrl]);

  useEffect(() => {
    const fetchData = async () => {
      if (!advisorId || Number.isNaN(advisorId)) {
        setError("Ongeldige adviseur.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("access_token");
        const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

        const [advisorRes, testsRes] = await Promise.all([
          fetch(`${apiUrl}/advisors/${advisorId}`, {
            headers,
            credentials: "include",
          }),
          fetch(`${apiUrl}/tests/`, {
            headers,
            credentials: "include",
          }),
        ]);

        if (!advisorRes.ok) {
          setError("Adviseur kon niet geladen worden.");
          setLoading(false);
          return;
        }

        const advisorData = await advisorRes.json();
        const testsData = testsRes.ok ? await testsRes.json() : [];

        setAdvisor(advisorData);
        setTests(Array.isArray(testsData) ? testsData : []);
      } catch (fetchError) {
        console.error(fetchError);
        setError("Er ging iets mis bij het laden van de gegevens.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [advisorId, apiUrl]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Adviseur" description="Gegevens worden geladen..." />
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          Laden...
        </div>
      </div>
    );
  }

  if (error || !advisor) {
    return (
      <div className="space-y-6">
        <PageHeader title="Adviseur" description="Detailoverzicht" />
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error || "Adviseur niet gevonden."}
        </div>
        <Link href="/admin/advisors" className="text-blue-600 hover:text-blue-800">
          Terug naar adviseurs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={advisor.name}
        description="Detailoverzicht met test-URL’s per taal"
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-2">
        <div className="text-sm text-gray-500">E-mailadres</div>
        <div className="text-lg font-semibold text-gray-900">{advisor.emailaddress}</div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Testlinks per taal
        </h2>
        <div className="space-y-4">
          {testUrls.map(({ test, languages }) => (
            <div
              key={test.id}
              className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
            >
              <div className="text-sm text-gray-500">Testnamen</div>
              <div className="grid gap-1 text-sm text-gray-900">
                <div>NL: {test.nameNL}</div>
                {test.nameFR && <div>FR: {test.nameFR}</div>}
                {test.nameEN && <div>EN: {test.nameEN}</div>}
                {test.nameDE && <div>DE: {test.nameDE}</div>}
              </div>
              <div className="mt-3 flex flex-wrap gap-3">
                {languages.map((lang) => (
                  <a
                    key={`${test.id}-${lang.key}`}
                    href={lang.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-lg border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-100"
                  >
                    {lang.label}: {lang.name}
                  </a>
                ))}
                {languages.length === 0 && (
                  <span className="text-sm text-gray-500">
                    Geen actieve talen voor deze test.
                  </span>
                )}
              </div>
            </div>
          ))}
          {testUrls.length === 0 && (
            <div className="text-sm text-gray-500">Geen testen gevonden.</div>
          )}
        </div>
      </div>

      <Link href="/admin/advisors" className="text-blue-600 hover:text-blue-800">
        Terug naar adviseurs
      </Link>
    </div>
  );
}
