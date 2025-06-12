"use client";

import React, { useState } from 'react';

const QuestionForm: React.FC = () => {
  const [questionText, setQuestionText] = useState('');
  const [userId, setUserId] = useState('user123'); // Placeholder for logged-in user ID
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) {
      setMessage('Question cannot be empty.');
      setIsError(true);
      return;
    }

    setSubmitting(true);
    setMessage(null);
    setIsError(false);

    try {
      const response = await fetch('/api/qna', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, questionText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit question');
      }

      setMessage('Question submitted successfully!');
      setIsError(false);
      setQuestionText('');
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
      setIsError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-center mb-6">Ask a Question</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="question" className="block text-gray-700 text-sm font-bold mb-2">
            Your Question:
          </label>
          <textarea
            id="question"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={4}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Type your question here..."
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Question'}
        </button>
        {message && (
          <p className={`text-sm ${isError ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default QuestionForm;