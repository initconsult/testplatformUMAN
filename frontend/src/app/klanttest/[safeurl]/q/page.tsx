"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type LanguageKey = "NL" | "FR" | "EN" | "DE";

interface QuestionItem {
  client_test_result_id: number;
  question_id: number;
  weight: number;
  category_id: number;
  answer: number | null;
  questionNL: string;
  questionFR?: string;
  questionEN?: string;
  questionDE?: string;
}

interface QuestionsResponse {
  safeurl: string;
  language: LanguageKey;
  test: {
    id: number;
    nameNL: string;
    nameFR?: string;
    nameEN?: string;
    nameDE?: string;
  };
  questions: QuestionItem[];
}

const thanksRoutes: Record<LanguageKey, string> = {
  NL: "bedankt",
  FR: "merci",
  EN: "thankyou",
  DE: "danke",
};

export default function ClientTestQuestionsPage() {
  const params = useParams();
  const router = useRouter();
  const safeurl = String(params?.safeurl || "");
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://testplatform-uman-acc.initconsult.be/api";

  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [language, setLanguage] = useState<LanguageKey>("NL");
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [pending, setPending] = useState<Record<number, number>>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const localKey = `client-test-${safeurl}-answers`;
  const pendingKey = `client-test-${safeurl}-pending`;

  const questionText = useCallback(
    (question: QuestionItem) => {
      if (language === "FR") return question.questionFR || question.questionNL;
      if (language === "EN") return question.questionEN || question.questionNL;
      if (language === "DE") return question.questionDE || question.questionNL;
      return question.questionNL;
    },
    [language]
  );

  const loadLocalAnswers = () => {
    if (typeof window === "undefined") return {};
    const raw = localStorage.getItem(localKey);
    if (!raw) return {};
    try {
      const parsed = JSON.parse(raw);
      return typeof parsed === "object" && parsed ? parsed : {};
    } catch {
      return {};
    }
  };

  const loadPending = () => {
    if (typeof window === "undefined") return {};
    const raw = localStorage.getItem(pendingKey);
    if (!raw) return {};
    try {
      const parsed = JSON.parse(raw);
      return typeof parsed === "object" && parsed ? parsed : {};
    } catch {
      return {};
    }
  };

  const savePending = (data: Record<number, number>) => {
    setPending(data);
    if (typeof window !== "undefined") {
      localStorage.setItem(pendingKey, JSON.stringify(data));
    }
  };

  const saveLocalAnswers = (data: Record<number, number>) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(localKey, JSON.stringify(data));
    }
  };

  const flushPending = useCallback(async () => {
    if (!navigator.onLine) {
      setStatusMessage("Geen internetverbinding. Antwoorden worden lokaal bewaard.");
      return;
    }

    const pendingData = loadPending();
    const entries = Object.entries(pendingData);
    if (entries.length === 0) return;

    const nextPending: Record<number, number> = { ...pendingData };

    for (const [questionIdStr, answer] of entries) {
      const questionId = Number(questionIdStr);
      try {
        const response = await fetch(
          `${apiUrl}/client-test-results/by-safeurl/${safeurl}/question/${questionId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answer }),
          }
        );
        if (response.ok) {
          delete nextPending[questionId];
        }
      } catch (error) {
        console.error(error);
      }
    }

    savePending(nextPending);
    if (Object.keys(nextPending).length === 0) {
      setStatusMessage(null);
    }
  }, [apiUrl, safeurl]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/client-tests/safeurl/${safeurl}/questions`);
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data: QuestionsResponse = await res.json();
        setQuestions(data.questions || []);
        setLanguage(data.language || "NL");

        const storedAnswers = loadLocalAnswers();
        const initialAnswers: Record<number, number> = {};
        data.questions.forEach((q) => {
          if (q.answer !== null && q.answer !== undefined) {
            initialAnswers[q.question_id] = q.answer;
          }
        });

        const mergedAnswers = { ...initialAnswers, ...storedAnswers };
        setAnswers(mergedAnswers);
        saveLocalAnswers(mergedAnswers);

        const storedPending = loadPending();
        setPending(storedPending);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (safeurl) {
      fetchData();
    }
  }, [apiUrl, safeurl]);

  useEffect(() => {
    const handleOnline = () => {
      flushPending();
    };
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [flushPending]);

  const handleAnswer = async (questionId: number, value: number) => {
    const nextAnswers = { ...answers, [questionId]: value };
    setAnswers(nextAnswers);
    saveLocalAnswers(nextAnswers);

    const nextPending = { ...pending, [questionId]: value };
    savePending(nextPending);
    await flushPending();
  };

  const allAnswered = useMemo(
    () => questions.every((q) => answers[q.question_id] !== undefined),
    [questions, answers]
  );

  const handleFinish = async () => {
    await flushPending();
    const remainingPending = loadPending();
    if (Object.keys(remainingPending).length > 0) {
      setStatusMessage(
        "Niet alle antwoorden zijn verzonden. Maak verbinding met het internet en probeer opnieuw."
      );
      return;
    }
    router.push(`/klanttest/${safeurl}/${thanksRoutes[language]}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">Laden...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Vragenlijst</h1>

        {statusMessage && (
          <div className="rounded-lg bg-yellow-50 p-4 text-yellow-800">
            {statusMessage}
          </div>
        )}

        <div className="space-y-4">
          {questions.map((question) => (
            <div
              key={question.question_id}
              className="rounded-lg border border-gray-200 p-4"
            >
              <p className="font-medium text-gray-800">
                {question.weight}. {questionText(question)}
              </p>
              <div className="mt-3 flex gap-6">
                {[{ label: "+", value: 1 }, { label: "M", value: 0 }, { label: "-", value: -1 }].map(
                  (option) => (
                    <label key={option.label} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`question-${question.question_id}`}
                        checked={answers[question.question_id] === option.value}
                        onChange={() => handleAnswer(question.question_id, option.value)}
                      />
                      <span>{option.label}</span>
                    </label>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleFinish}
          disabled={!allAnswered}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Verzend
        </button>
      </div>
    </main>
  );
}
