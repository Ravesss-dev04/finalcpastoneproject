"use client"
import React from 'react'

function QuizOverview() {
  return (
    <div className="p-6 rounded-xl shadow-sm bg-[#13181F] border border-[#232935] md:w-full md:ml-0 w-82 -ml-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-100">Quiz overview</h3>
      <div className="h-full flex items-center justify-center">
        {/* Simple chart representation */}
        <div className="md:w-full h-full relative">
          <svg className="md:w-full w-90 h-full" viewBox="0 0 400 200">
            {/* Chart lines */}
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              points="50,150 80,120 110,140 140,100 170,110 200,80 230,90 260,70 290,85 320,60 350,75"
            />
            {/* Data points */}
            <circle cx="50" cy="150" r="3" fill="#3b82f6" />
            <circle cx="80" cy="120" r="3" fill="#3b82f6" />
            <circle cx="110" cy="140" r="3" fill="#3b82f6" />
            <circle cx="140" cy="100" r="3" fill="#3b82f6" />
            <circle cx="170" cy="110" r="3" fill="#3b82f6" />
            <circle cx="200" cy="80" r="3" fill="#3b82f6" />
            <circle cx="230" cy="90" r="3" fill="#3b82f6" />
            <circle cx="260" cy="70" r="3" fill="#3b82f6" />
            <circle cx="290" cy="85" r="3" fill="#3b82f6" />
            <circle cx="320" cy="60" r="3" fill="#3b82f6" />
            <circle cx="350" cy="75" r="3" fill="#3b82f6" />
            
            {/* Week labels */}
            <text x="50" y="180" textAnchor="middle" className="text-[10px] fill-gray-500">Wk 1</text>
            <text x="100" y="180" textAnchor="middle" className="text-[10px] fill-gray-500">Wk 2</text>
            <text x="150" y="180" textAnchor="middle" className="text-[10px] fill-gray-500">Wk 3</text>
            <text x="200" y="180" textAnchor="middle" className="text-[10px] fill-gray-500">Wk 4</text>
            <text x="250" y="180" textAnchor="middle" className="text-[10px] fill-gray-500">Wk 5</text>
            <text x="300" y="180" textAnchor="middle" className="text-[10px] fill-gray-500">Wk 6</text>
            <text x="350" y="180" textAnchor="middle" className="text-[10px] fill-gray-500">Wk 7</text>
          </svg>
        </div>
      </div>
    </div>
  )
}

export default QuizOverview
