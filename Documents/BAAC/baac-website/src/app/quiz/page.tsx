'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

interface Quiz {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface Question {
  id: number;
  quizId: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

export default function QuizPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [score, setScore] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuizData() {
      try {
        const quizRes = await fetch('/api/quiz/active');
        if (quizRes.ok) {
          const quizData: Quiz = await quizRes.json();
          setActiveQuiz(quizData);

          const questionsRes = await fetch('/api/quiz/questions');
          if (questionsRes.ok) {
            const questionsData: Question[] = await questionsRes.json();
            setQuestions(questionsData);
          } else {
            setError('Failed to fetch quiz questions.');
          }
        } else if (quizRes.status === 404) {
          setActiveQuiz(null);
          setQuestions([]);
        } else {
          setError('Failed to fetch active quiz.');
        }
      } catch (err) {
        console.error('Error fetching quiz data:', err);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    }

    fetchQuizData();
  }, []);

  const handleAnswerChange = (questionId: number, selectedOption: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: selectedOption }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuiz || !isSignedIn || !user) {
      setError('You must be signed in to submit a quiz.');
      return;
    }

    let currentScore = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        currentScore += 1;
      }
    });
    setScore(currentScore);

    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizId: activeQuiz.id,
          score: currentScore,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        alert('Quiz submitted successfully!');
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Failed to submit quiz.');
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError('An unexpected error occurred during submission.');
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading quiz...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  if (!activeQuiz) {
    return <div className="container mx-auto p-4">No active quiz available at the moment.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{activeQuiz.title}</h1>
      <p className="mb-4">{activeQuiz.description}</p>
      <p className="text-sm text-gray-600 mb-6">Closes: {new Date(activeQuiz.endDate).toLocaleString()}</p>

      {submitted ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Submission Successful!</strong>
          <span className="block sm:inline"> Your score: {score} / {questions.length}</span>
          <p className="mt-2">Thank you for participating. Check the leaderboard for updates!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.length > 0 ? (
            questions.map((question, index) => (
              <div key={question.id} className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-lg font-semibold mb-4">{index + 1}. {question.questionText}</p>
                <div className="space-y-2">
                  {question.options.map((option, optIndex) => (
                    <label key={optIndex} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        onChange={() => handleAnswerChange(question.id, option)}
                        checked={answers[question.id] === option}
                        className="form-radio h-4 w-4 text-blue-600"
                        required
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>No questions available for this quiz.</p>
          )}

          {questions.length > 0 && (
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit Quiz
            </button>
          )}
        </form>
      )}
    </div>
  );
}