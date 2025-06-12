import { NextResponse } from 'next/server';
import { createQuiz, getQuizById, updateQuiz, addQuestionToQuiz, getQuestionsByQuizId, updateQuestion, deleteQuestion } from '@/lib/quiz-service';

export async function POST(request: Request) {
  try {
    const { title, description, startDate, endDate } = await request.json();
    if (!title || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const newQuiz = await createQuiz(title, description, new Date(startDate), new Date(endDate));
    return NextResponse.json({ message: 'Quiz created successfully', quiz: newQuiz }, { status: 201 });
  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const quizId = searchParams.get('quizId');

    if (id) {
      const quiz = await getQuizById(parseInt(id as string));
      if (!quiz) {
        return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
      }
      return NextResponse.json({ quiz }, { status: 200 });
    } else if (quizId) {
      const questions = await getQuestionsByQuizId(parseInt(quizId as string));
      return NextResponse.json({ questions }, { status: 200 });
    }

    return NextResponse.json({ error: 'Missing quiz ID or question ID' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching quiz/questions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, data, questionId, questionData } = await request.json();

    if (id && data) {
      const updatedQuiz = await updateQuiz(parseInt(id as string), data);
      if (!updatedQuiz) {
        return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Quiz updated successfully', quiz: updatedQuiz }, { status: 200 });
    } else if (questionId && questionData) {
      const updatedQuestion = await updateQuestion(parseInt(questionId as string), questionData);
      if (!updatedQuestion) {
        return NextResponse.json({ error: 'Question not found' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Question updated successfully', question: updatedQuestion }, { status: 200 });
    }

    return NextResponse.json({ error: 'Missing ID or data' }, { status: 400 });
  } catch (error) {
    console.error('Error updating quiz/question:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { questionId } = await request.json();
    if (!questionId) {
      return NextResponse.json({ error: 'Missing question ID' }, { status: 400 });
    }
    const deletedQuestion = await deleteQuestion(parseInt(questionId as string));
    if (!deletedQuestion) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Question deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { quizId, questionText, options, correctAnswer } = await request.json();
    if (!quizId || !questionText || !options || !correctAnswer) {
      return NextResponse.json({ error: 'Missing required fields for question' }, { status: 400 });
    }
    const newQuestion = await addQuestionToQuiz(parseInt(quizId as string), questionText, options, correctAnswer);
    return NextResponse.json({ message: 'Question added successfully', question: newQuestion }, { status: 201 });
  } catch (error) {
    console.error('Error adding question:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}