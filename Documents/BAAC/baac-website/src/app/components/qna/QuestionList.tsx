"use client";

import React, { useEffect, useState } from 'react';

interface Question {
  id: string;
  userId: string;
  questionText: string;
  createdAt: string;
}

interface Answer {
  id: string;
  questionId: string;
  adminId: string;
  answerText: string;
  createdAt: string;
}

interface QuestionWithAnswers extends Question {
  answers: Answer[];
}

const QuestionList: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionWithAnswers[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/qna');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        const questionsWithAnswers = await Promise.all(data.questions.map(async (q: Question) => {
          const answersResponse = await fetch(`/api/qna?questionId=${q.id}`);
          if (!answersResponse.ok) {
            throw new Error(`HTTP error! status: ${answersResponse.status}`);
          }
          const answersData = await answersResponse.json();
          return { ...q, answers: answersData.answers };
        }));
        setQuestions(questionsWithAnswers);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading questions...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Public Q&A</h1>
      {questions.length === 0 ? (
        <p className="text-center text-gray-600">No questions found.</p>
      ) : (
        <div className="space-y-6">
          {questions.map((q) => (
            <div key={q.id} className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-800 font-semibold mb-2">Q: {q.questionText}</p>
              <p className="text-gray-500 text-sm">Asked by User {q.userId} on {new Date(q.createdAt).toLocaleDateString()}</p>
              {q.answers.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {q.answers.map((a) => (
                    <div key={a.id} className="bg-gray-50 p-3 rounded-md">
                      <p className="text-gray-700">A: {a.answerText}</p>
                      <p className="text-gray-500 text-xs">Answered by Admin {a.adminId} on {new Date(a.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-gray-600 text-sm italic">No answers yet.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionList;