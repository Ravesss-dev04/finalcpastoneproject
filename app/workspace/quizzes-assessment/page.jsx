'use client';
import React from 'react';

const quizzes = [
  {
    title: 'Quiz 1: Python Basics',
    course: 'Intro to Python',
    due: 'Oct 26, 2025',
    status: 'Completed',
    score: '95%',
    actionText: 'View Score',
    bgColor: 'bg-green-600',
    statusColor: 'bg-green-500',
  },
  {
    title: 'Quiz 2: Python Functions',
    course: 'Intro to Python',
    due: 'Nov 5, 2025',
    status: 'Pending',
    score: null,
    actionText: 'Start Quiz',
    bgColor: 'bg-yellow-500',
    statusColor: 'bg-yellow-500',
  },
  {
    title: 'Midterm: Web Dev',
    course: 'Web Development',
    due: 'Nov 10, 2025',
    status: 'Pending',
    score: null,
    actionText: 'Start Quiz',
    bgColor: 'bg-yellow-500',
    statusColor: 'bg-yellow-500',
  },
   {
    title: 'Midterm: Web Dev',
    course: 'Web Development',
    due: 'Nov 10, 2025',
    status: 'Pending',
    score: null,
    actionText: 'Start Quiz',
    bgColor: 'bg-yellow-500',
    statusColor: 'bg-yellow-500',
  },
   {
    title: 'Midterm: Web Dev',
    course: 'Web Development',
    due: 'Nov 10, 2025',
    status: 'Pending',
    score: null,
    actionText: 'Start Quiz',
    bgColor: 'bg-yellow-500',
    statusColor: 'bg-yellow-500',
  },
   {
    title: 'Midterm: Web Dev',
    course: 'Web Development',
    due: 'Nov 10, 2025',
    status: 'Pending',
    score: null,
    actionText: 'Start Quiz',
    bgColor: 'bg-yellow-500',
    statusColor: 'bg-yellow-500',
  }
];

const QuizzessAssessment = () => {
  return (
    <div className="p-6 min-h-screen bg-[#161B22] text-white md:w-full md:-ml-0 w-82 -ml-6">
      <h1 className="text-[22px] font-bold mb-6 lg:text-3xl ">All Quizzes & Assessments</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz, index) => (
          <div key={index} className="bg-[#181e27] rounded-lg p-5 shadow-md border border-slate-700">
            <h2 className="text-xl font-semibold mb-1">{quiz.title}</h2>
            <p className="text-sm text-slate-300 mb-2">Course: {quiz.course}</p>
            <p className="text-sm text-slate-400 mb-4">Due: {quiz.due}</p>
            
            {quiz.status === 'Completed' ? (
              <div className="mb-3">
                <span className="inline-block px-2 py-1 text-xs rounded bg-green-700 text-white">Completed</span>
                <span className="ml-2 text-green-400 font-semibold">Score: {quiz.score}</span>
              </div>
            ) : (
              <div className="mb-3">
                <span className={`inline-block px-2 py-1 text-xs rounded ${quiz.statusColor} text-white`}>{quiz.status}</span>
              </div>
            )}

            <button className="mt-auto w-full py-2 bg-[#2D6F17] hover:bg-green-700 rounded text-white font-medium">
              {quiz.actionText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};



export default QuizzessAssessment;