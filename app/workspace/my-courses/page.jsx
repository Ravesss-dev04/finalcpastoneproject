import React from 'react'
import CourseList from '../_components/CourseList'

function MyCourses() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-300">My Courses</h1>
        <p className="text-green-300 mt-2 ">Manage and track your learning progress</p>
      </div>
      <CourseList />
    </div>
  )
}
 
export default MyCourses



