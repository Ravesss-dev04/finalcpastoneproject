'use client';

import React from 'react';

const studyData = {
  week: 'June 10–16, 2025',
  recommendation: "Based on your recent quiz scores. Focus on `Python Functions` and `CSS` Flexbox this week to improve your mastery.",
  days: [
    { day: 'Mon', date: 10, tasks: ['Python Practice', 'Variables & Loopings'] },
    { day: 'Tuesday', date: 11, tasks: [] },
    { day: 'Wednesday', date: 12, tasks: [] },
    { day: 'Thursday', date: 13, tasks: [] },
    { day: 'Friday', date: 14, tasks: [] },
    { day: 'Saturday', date: 15, tasks: [] },
    { day: 'Sunday', date: 16, tasks: [] },
  ],
};

const StudyPlanList = () => {
  return (
    <div className="bg-[#161B22] text-white min-h-screen px-6 py-10 w-80 md:w-full md:-ml-0 -ml-5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold uppercase">Study Plan</h2>
        <span className="text-sm text-gray-300">{studyData.week}</span>
      </div>

      {/* AI Recommendation */}
      <div className="bg-[#111827] border border-green-700 text-green-400 p-4 mb-6 rounded">
        <p className="text-sm font-medium">⚡ AI RECOMMENDATION</p>
        <p className="mt-2 text-green-300">{studyData.recommendation}</p>
      </div>

      {/* Week View */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {studyData.days.map((dayItem, index) => (
          <div
            key={index}
            className="bg-[#1f2937] rounded-lg p-4 shadow hover:shadow-lg transition-all"
          >
            <h3 className="font-medium text-white mb-2">{dayItem.day}</h3>
            <p className="text-sm text-gray-400 mb-4">{dayItem.date}</p>
            {dayItem.tasks.length > 0 ? (
              dayItem.tasks.map((task, idx) => (
                <span
                  key={idx}
                  className="block bg-green-200 text-green-900 text-xs px-2 py-1 rounded mb-2"
                >
                  {task}
                </span>
              ))
            ) : (
              <p className="text-xs text-gray-500 italic">No tasks</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyPlanList;