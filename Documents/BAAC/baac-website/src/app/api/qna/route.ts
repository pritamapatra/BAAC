import { NextResponse } from 'next/server';
import { createQuestion, getQuestionById, getAllQuestions, answerQuestion, getAnswersByQuestionId } from '@/lib/qna-service';

export async function POST(request: Request) {
  try {
    const { userId, questionText, questionId, adminId, answerText } = await request.json();

    if (questionText) {
      if (!userId) {
        return NextResponse.json({ error: 'Missing userId for question' }, { status: 400 });
      }
      const newQuestion = await createQuestion(userId, questionText);
      return NextResponse.json({ message: 'Question created successfully', question: newQuestion }, { status: 201 });
    } else if (questionId && adminId && answerText) {
      const newAnswer = await answerQuestion(parseInt(questionId as string), adminId, answerText);
      return NextResponse.json({ message: 'Answer added successfully', answer: newAnswer }, { status: 201 });
    }

    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  } catch (error) {
    console.error('Error in Q&A POST:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const questionId = searchParams.get('questionId');

    if (id) {
      const question = await getQuestionById(parseInt(id as string));
      if (!question) {
        return NextResponse.json({ error: 'Question not found' }, { status: 404 });
      }
      return NextResponse.json({ question }, { status: 200 });
    } else if (questionId) {
      const answers = await getAnswersByQuestionId(parseInt(questionId as string));
      return NextResponse.json({ answers }, { status: 200 });
    }

    const questions = await getAllQuestions();
    return NextResponse.json({ questions }, { status: 200 });
  } catch (error) {
    console.error('Error fetching Q&A:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}