"use client"
import React from 'react'

function QuizReminders() {
  const reminders = [
    {
      title: "Javascript for web development",
      subtitle: "Quiz in 1 day",
      priority: "High Priority"
    },
    {
      title: "web-dev is now available",
      subtitle: "3 hours ago",
      priority: ""
    }
  ]

  return (
    <div className="bg-[#13181F] p-6 rounded-xl shadow-sm border border-[#232935] md:w-full md:-ml-0 w-82 -ml-6">
      <h3 className="text-lg font-semibold mb-4 text-white text-center">Quiz Reminders</h3>
      <div className="space-y-4">
        {reminders.map((reminder, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white opacity-90">{reminder.title}</p>
              <p className="text-xs text-gray-500">{reminder.subtitle}</p>
              {reminder.priority && ( 
                <span className="text-xs text-red-500 font-medium">{reminder.priority}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuizReminders
