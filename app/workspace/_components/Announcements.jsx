"use client"
import React from 'react'

function Announcements() {
  const announcements = [
    {
      title: "New Course 'Python' is now available",
      time: "3 hours ago",
      type: "new"
    },
    {
      title: "New Quiz for 'web-dev' is now available",
      time: "5 hours ago",
      type: "quiz"
    },
    {
      title: "Your 'Python' Assignment has been graded",
      time: "5 hours ago",    
      type: "grade" 
    }     
  ]   
      
  return (
    <div className="bg-[#13181F] p-6 rounded-xl shadow-sm md:w-full md:ml-0 w-82 -ml-6">
      <h3 className="text-lg font-semibold mb-4 text-center text-white">Announcements</h3>
      <div className="space-y-4">
        {announcements.map((announcement, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white opacity-90">{announcement.title}</p>
              <p className="text-xs text-gray-500">{announcement.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Announcements
