"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type LanguageKey = "NL" | "FR" | "EN" | "DE";

interface Advisor {
  id: number;
  name: string;
  emailaddress: string;
}

interface TestData {
  id: number;
  nameNL: string;
  nameFR?: string;
  nameEN?: string;
  nameDE?: string;
  descriptionNL?: string;
  descriptionFR?: string;
  descriptionEN?: string;
  descriptionDE?: string;
  enabledNL?: boolean;
  enabledFR?: boolean;
  enabledEN?: boolean;
  enabledDE?: boolean;
}

interface TestLookupResponse {
  language: LanguageKey;
  test: TestData;
}

const languageConfig: Record<LanguageKey, { label: string; suffix: string }> = {
  NL: { label: "NL", suffix: "" },
  FR: { label: "FR", suffix: "" },
  EN: { label: "EN", suffix: "" },
  DE: { label: "DE", suffix: "" },
};

const translations: Record<
  LanguageKey,
  {
    titlePrivacy: string;
    privacyText: string;
    titlePersonal: string;
    titleGuidelines: string;
    guidelinesText: string;
    consentPrivacy: string;
    consentPersonal: string;
    consentGuidelines: string;
    submitLabel: string;
    fieldLabels: Record<string, string>;
  }
> = {
  NL: {
    titlePrivacy: "Privacy",
    privacyText:
      "PRIVACY CLAUSULE: U-Man verwerkt je persoonlijke gegevens met gepaste zorgvuldigheid en respecteert de privacy van ieder individu dat de site bezoekt. De persoonsgegevens verkregen via deze website kunnen door U-Man worden verwerkt met het oog op een analyse van de beroepssituatie. De gegevens worden niet doorgegeven aan derden, behalve aan de werkgever indien de invulling gebeurt op initiatief van de werkgever. Je antwoorden op deze analyse worden omgezet in grafieken die je overhandigd worden bij de mondelinge bespreking van de testresultaten.",
    titlePersonal: "Persoonsgegevens",
    titleGuidelines: "Richtlijnen",
    guidelinesText:
      "Gelieve de volgende instructies te lezen vooraleer je de vragenlijst afwerkt. Zorg ervoor dat je elke vraag goed begrepen hebt, herlees ze zo vaak als nodig. Gelieve alle vragen te beantwoorden. Voor deze test wordt geen tijd opgenomen. Werk aan jouw eigen tempo, maar blijf niet te lang aarzelen bij een vraag. Beantwoord ze zodra je ze begrepen hebt en ga dan verder naar de volgende vraag. Wees natuurlijk en eerlijk in het beantwoorden van de vragen. De gegeven informatie kan je oriënteren met het oog op een eventuele verbetering van jouw professionele capaciteiten. Indien je naar het verleden kijkt zou je sommige vragen misschien anders beantwoorden. Voor de test is echter alleen het heden van belang. Vergeet niet de privacy clausule aan te vinken. Om te antwoorden op een vraag selecteert je naar keuze een van de drie kolommen aan (+, M, -). + betekent \"meestal ja\", of \"zeker ja\". M betekent \"onzeker\", \"misschien\", \"niet echt ja of neen\". - betekent \"meestal neen\" of \"zeker neen\".",
    consentPrivacy: "* Ik aanvaard de privacy clausule",
    consentPersonal: "* Mijn persoonsgegevens zijn volledig en correct",
    consentGuidelines: "* Ik begrijp de richtlijnen voor deze test",
    submitLabel: "Start test",
    fieldLabels: {
      name: "Naam *",
      firstname: "Voornaam *",
      emailaddress: "E-mail *",
      gender: "Geslacht *",
      byear: "Geboortejaar *",
      phone: "Telefoon *",
      mobile: "Mobiel",
      address: "Bedrijfsadres *",
      zip: "Postcode *",
      city: "Plaats *",
      companyname: "Bedrijf *",
      function: "Functie *",
    },
  },
  FR: {
    titlePrivacy: "Confidentialité",
    privacyText:
      "U-MAN traite vos données personnelles avec les précautions nécessaires et respecte la vie privée de chaque personne qui visite le site. Les données personnelles obtenues via ce site peuvent être utilisées par U-MAN dans le cadre d’une analyse de la situation professionnelle de la personne. Les données ne sont pas transmises à des tiers, à l’exception de l’employeur de la personne dans le cas où les données auraient été introduites à l’initiative de ce dernier.",
    titlePersonal: "Données personnelles",
    titleGuidelines: "Directives",
    guidelinesText:
      "Avant d' aller plus loin dans ce questionnaire, veuillez lire les instructions ci-dessous. Assurez-vous de bien comprendre chaque question, lisez-la autant de fois qu'il faudra. Vous êtes prié(e) de répondre à toutes les questions. Ces tests ne sont pas chronométrés; vous pouvez y répondre à votre rythme. Evitez cependant de vous attarder trop longuement sur une question. Répondez-y aussitôt que vous l'avez comprise et passez à la question suivante. Répondez aux questions naturellement et honnêtement. Les informations fournies sont susceptibles d'être utilisées dans le but d'une amélioration éventuelle de vos performances professionnelles. Pour répondre, cochez au choix l'une des trois colonnes (+, M, -). + signifie \"le plus souvent oui\", M signifie \"incertain\", - signifie \"le plus souvent non\".",
    consentPrivacy: "* J'accepte la clause de confidentialité",
    consentPersonal: "* Je confirme que les informations renseignées ci-dessus sont exactes et complètes",
    consentGuidelines: "* Je comprends les directives pour ce test",
    submitLabel: "Commencer le test",
    fieldLabels: {
      name: "Nom *",
      firstname: "Prénom *",
      emailaddress: "Email *",
      gender: "Sexe *",
      byear: "Année de naissance *",
      phone: "Téléphone *",
      mobile: "GSM",
      address: "Addresse *",
      zip: "Code postal *",
      city: "Ville *",
      companyname: "Entreprise *",
      function: "Fonction *",
    },
  },
  EN: {
    titlePrivacy: "Privacy",
    privacyText:
      "PRIVACY CLAUSE: U-Man processes your personal data with due care and respects the privacy of every individual who visits the site. The data obtained from this Website may be processed by U-Man with a view to an analysis of the professional situation. The data will not be disclosed to third parties, except to the employer if the implementation is done at the initiative of the employer.",
    titlePersonal: "Personal information",
    titleGuidelines: "Instructions",
    guidelinesText:
      "Please read the following instructions before you finish the questionnaire. Make sure that you have understood each question, reread them as often as needed. Please answer all questions. For this test, no time is recorded. Work at your own pace, but do not hesitate too long with a question. Answer them as soon as you have understood and then continue to the next question. To reply to a question tick either one of the three columns (+, M, -). + means \"mostly yes\", M means \"uncertain\", - means \"mostly no\".",
    consentPrivacy:
      "* I have read the Privacy clause and agree that my personal data will be processed.",
    consentPersonal:
      "* I have entered all my personal information completely and correctly",
    consentGuidelines: "* I understand the guidelines for this test",
    submitLabel: "Begin test",
    fieldLabels: {
      name: "Surname *",
      firstname: "Firstname *",
      emailaddress: "Email *",
      gender: "Gender *",
      byear: "Year of birth *",
      phone: "Phone *",
      mobile: "Cell",
      address: "Address *",
      zip: "Zip *",
      city: "City *",
      companyname: "Company *",
      function: "Current position *",
    },
  },
  DE: {
    titlePrivacy: "Datenschutz",
    privacyText:
      "U-Man verarbeitet Ihre persönlichen Daten mit der gebotenen Sorgfalt und respektiert die Privatsphäre jeder Person, die die Website besucht. Die über diese Website erhaltenen personenbezogenen Daten können zum Zwecke einer Analyse der beruflichen Situation verarbeitet werden.",
    titlePersonal: "Persönliche Daten",
    titleGuidelines: "Richtlinien",
    guidelinesText:
      "Bitte lesen Sie die folgenden Anweisungen, bevor Sie den Fragebogen ausfüllen. Stellen Sie sicher, dass Sie jede Frage verstanden haben. Beantworten Sie alle Fragen. Für diesen Test wird keine Zeit erfasst. Arbeiten Sie in Ihrem eigenen Tempo. Um zu antworten, wählen Sie eine der drei Spalten (+, M, -). + bedeutet \"meistens ja\", M bedeutet \"unsicher\", - bedeutet \"meistens nein\".",
    consentPrivacy: "* Ich akzeptiere die Datenschutzklausel",
    consentPersonal: "* Meine persönlichen Daten sind vollständig und korrekt",
    consentGuidelines: "* Ich verstehe die Richtlinien für diesen Test",
    submitLabel: "Test starten",
    fieldLabels: {
      name: "Name *",
      firstname: "Vorname *",
      emailaddress: "E-Mail *",
      gender: "Geschlecht *",
      byear: "Geburtsjahr *",
      phone: "Telefon *",
      mobile: "Mobil",
      address: "Adresse *",
      zip: "PLZ *",
      city: "Ort *",
      companyname: "Firma *",
      function: "Funktion *",
    },
  },
};

const emptyForm = {
  name: "",
  firstname: "",
  emailaddress: "",
  gender: "",
  byear: "",
  phone: "",
  mobile: "",
  address: "",
  zip: "",
  city: "",
  companyname: "",
  function: "",
  privacy: false,
  persoonsgegevens: false,
  richtlijnen: false,
};

export default function PublicTestLandingPage() {
  const params = useParams();
  const router = useRouter();
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://testplatform-uman-acc.initconsult.be/api";

  const advisorSlug = decodeURIComponent(String(params?.advisor || ""));
  const testSlug = decodeURIComponent(String(params?.testname || ""));

  const [advisor, setAdvisor] = useState<Advisor | null>(null);
  const [test, setTest] = useState<TestData | null>(null);
  const [language, setLanguage] = useState<LanguageKey>("NL");
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const list: number[] = [];
    for (let year = currentYear; year >= 1905; year -= 1) {
      list.push(year);
    }
    return list;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [advisorRes, testRes] = await Promise.all([
          fetch(`${apiUrl}/advisors/by-name/${encodeURIComponent(advisorSlug)}`),
          fetch(`${apiUrl}/tests/by-name/${encodeURIComponent(testSlug)}`),
        ]);

        if (!advisorRes.ok || !testRes.ok) {
          setError("Test of adviseur niet gevonden.");
          setLoading(false);
          return;
        }

        const advisorData = await advisorRes.json();
        const testData: TestLookupResponse = await testRes.json();
        setAdvisor(advisorData);
        setTest(testData.test);
        setLanguage(testData.language || "NL");
        setFormData((prev) => ({
          ...prev,
          gender: prev.gender || "",
        }));
      } catch (fetchError) {
        console.error(fetchError);
        setError("Er ging iets mis bij het laden van de test.");
      } finally {
        setLoading(false);
      }
    };

    if (advisorSlug && testSlug) {
      fetchData();
    }
  }, [advisorSlug, testSlug, apiUrl]);

  const activeTranslations = translations[language];

  const description = useMemo(() => {
    if (!test) {
      return "";
    }
    switch (language) {
      case "FR":
        return test.descriptionFR || test.descriptionNL || "";
      case "EN":
        return test.descriptionEN || test.descriptionNL || "";
      case "DE":
        return test.descriptionDE || test.descriptionNL || "";
      default:
        return test.descriptionNL || "";
    }
  }, [test, language]);

  const languageLinks = useMemo(() => {
    if (!test || !advisor) {
      return [];
    }
    const links: Array<{ label: string; href: string }> = [];
    const entries: Array<{ key: LanguageKey; name?: string; enabled?: boolean }> = [
      { key: "NL", name: test.nameNL, enabled: test.enabledNL },
      { key: "FR", name: test.nameFR, enabled: test.enabledFR },
      { key: "EN", name: test.nameEN, enabled: test.enabledEN },
      { key: "DE", name: test.nameDE, enabled: test.enabledDE },
    ];

    entries.forEach((entry) => {
      if (!entry.name) return;
      if (entry.enabled === false) return;
      links.push({
        label: entry.key,
        href: `/test/${encodeURIComponent(advisor.name)}/${encodeURIComponent(
          entry.name
        )}`,
      });
    });

    return links;
  }, [test, advisor]);

  const handleChange = (field: keyof typeof emptyForm, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!advisor || !test) {
      return;
    }
    if (!formData.privacy || !formData.persoonsgegevens || !formData.richtlijnen) {
      setError("Gelieve alle verplichte bevestigingen aan te vinken.");
      return;
    }
    if (
      !formData.name ||
      !formData.firstname ||
      !formData.emailaddress ||
      !formData.gender ||
      !formData.byear ||
      !formData.phone ||
      !formData.address ||
      !formData.zip ||
      !formData.city ||
      !formData.companyname ||
      !formData.function
    ) {
      setError("Gelieve alle verplichte velden in te vullen.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        advisor_id: advisor.id,
        test_id: test.id,
        client: {
          name: formData.name,
          firstname: formData.firstname,
          emailaddress: formData.emailaddress,
          gender: formData.gender,
          language,
          bday: 1,
          bmonth: 1,
          byear: Number(formData.byear),
          phone: formData.phone,
          mobile: formData.mobile || null,
          address: formData.address,
          zip: formData.zip,
          city: formData.city,
          companyname: formData.companyname,
          function: formData.function,
        },
      };

      const response = await fetch(`${apiUrl}/client-tests/public-create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setError("Aanmaken van de test is mislukt.");
        setSaving(false);
        return;
      }

      const data = await response.json();
      router.push(`/klanttest/${data.safeurl}/q`);
    } catch (submitError) {
      console.error(submitError);
      setError("Er ging iets mis bij het opslaan van de gegevens.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">Laden...</div>
      </main>
    );
  }

  if (error && !advisor && !test) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto text-red-600">{error}</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-wrap gap-4 text-sm">
          {languageLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-blue-600 hover:text-blue-800"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <h1 className="text-3xl font-bold text-gray-900">{test?.nameNL}</h1>
        <p className="text-gray-700 whitespace-pre-line">{description}</p>

        {error && <div className="rounded-lg bg-red-50 p-4 text-red-700">{error}</div>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold">{activeTranslations.titlePrivacy}</h2>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {activeTranslations.privacyText}{" "}
              <a
                href="https://www.uman.be/over-ons/privacy/"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                Klik hier
              </a>
            </p>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.privacy}
                onChange={(e) => handleChange("privacy", e.target.checked)}
              />
              {activeTranslations.consentPrivacy}
            </label>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">{activeTranslations.titlePersonal}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(["name", "firstname", "emailaddress", "phone", "mobile", "address", "zip", "city", "companyname", "function"] as const).map(
                (field) => (
                  <label key={field} className="text-sm text-gray-600">
                    {activeTranslations.fieldLabels[field]}
                    <input
                      type="text"
                      value={formData[field]}
                      onChange={(e) => handleChange(field, e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                    />
                  </label>
                )
              )}
              <label className="text-sm text-gray-600">
                {activeTranslations.fieldLabels.gender}
                <div className="mt-2 flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="M"
                      checked={formData.gender === "M"}
                      onChange={() => handleChange("gender", "M")}
                    />
                    M
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="F"
                      checked={formData.gender === "F"}
                      onChange={() => handleChange("gender", "F")}
                    />
                    V
                  </label>
                </div>
              </label>
              <label className="text-sm text-gray-600">
                {activeTranslations.fieldLabels.byear}
                <select
                  value={formData.byear}
                  onChange={(e) => handleChange("byear", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="">Selecteer jaar</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.persoonsgegevens}
                onChange={(e) => handleChange("persoonsgegevens", e.target.checked)}
              />
              {activeTranslations.consentPersonal}
            </label>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">{activeTranslations.titleGuidelines}</h2>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {activeTranslations.guidelinesText}
            </p>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.richtlijnen}
                onChange={(e) => handleChange("richtlijnen", e.target.checked)}
              />
              {activeTranslations.consentGuidelines}
            </label>
          </section>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Even wachten..." : activeTranslations.submitLabel}
          </button>
        </form>
      </div>
    </main>
  );
}
