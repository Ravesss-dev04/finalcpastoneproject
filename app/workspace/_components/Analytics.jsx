'use client'
import React from 'react'

const Analytics = () => {
  return (
    <div className="min-h-screen bg-[#13181F]  text-white p-8 space-y-8 w-80 md:w-full md:-ml-0 -ml-5">
      <h1 className="text-2xl font-semibold lg:ml-0 md:ml-0 ml-20">Analytics</h1>
      {/* Top Section: Mastery & Completion Rate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-74 md:w-full md:-ml-0 -ml-5">
        {/* Subject Mastery */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Subject Mastery</h2>
          {[
            { title: 'Python Basics', percent: 60 },
            { title: 'HTML/CSS - Web development', percent: 90 },
            { title: 'Objective Oriented Programming - Variable', percent: 70 },
            { title: 'Java Development', percent: 65 },
            { title: 'Data Structure', percent: 60 },
          ].map((subject, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>{subject.title}</span>
                <span>{subject.percent}%</span>
              </div>
              <div className="w-full h-3 bg-gray-700 rounded">
                <div
                  className="h-3 bg-green-500 rounded"
                  style={{ width: `${subject.percent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        {/* Lesson Completion Rate (Donut Chart Placeholder) */}
        <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center justify-center">
          <h2 className="text-lg font-medium mb-4">Lesson Complete Rate</h2>
          <div className="relative w-48 h-48">
            {/* Placeholder pie chart */}
            <div className="absolute inset-0 rounded-full border-8 border-green-500 border-t-yellow-400 border-r-yellow-400"></div>
            <div className="absolute inset-8 bg-gray-800 rounded-full"></div>
          </div>
          <div className="flex justify-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span> Completed
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-yellow-400 rounded-full"></span> In Progress
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Daily Study Time */}
      <div className="bg-gray-800 rounded-lg p-6 md:w-full w-75 md:-ml-0 -ml-5">
        <h2 className="text-lg font-medium mb-4">Daily Study Time (Last 7 Days)</h2>
        <div className="flex items-end gap-4 h-40 md:full ">
          {[
            { day: 'Mon', height: 32 },
            { day: 'Tue', height: 16 },
            { day: 'Wed', height: 20 },
            { day: 'Thu', height: 16 },
            { day: 'Fri', height: 40 },
            { day: 'Sat', height: 12 },
            { day: 'Sun', height: 8 },
          ].map((entry, i) => (
            <div key={i} className="flex flex-col items-center justify-end">
              <div
                className="w-6 bg-green-500"
                style={{ height: `${entry.height}px` }}
              ></div>
              <span className="text-xs mt-1">{entry.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Analytics