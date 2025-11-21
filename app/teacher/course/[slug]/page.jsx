"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { BookOpen, FileText, Megaphone, Users, BarChart2, Trash2, Edit, Lightbulb, X } from "lucide-react";

const CoursePage = () => {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState("Lesson");
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [newLesson, setNewLesson] = useState({
    title: "",
    content: "",
    video_url: "",
    order_index: 0
  });

  useEffect(() => {
    fetchCourseData();
  }, [slug]);

  const fetchCourseData = async () => {
    try {
      const courseResponse = await fetch(`/api/courses?slug=${slug}`);
      if (courseResponse.ok) {
        const courseData = await courseResponse.json();
        setCourse(courseData[0]);
        
        const [lessonsRes, quizzesRes, assignmentsRes, announcementsRes, studentsRes] = await Promise.all([
          fetch(`/api/courses/${courseData[0].id}/lessons`),
          fetch(`/api/courses/${courseData[0].id}/quizzes`),
          fetch(`/api/courses/${courseData[0].id}/assignments`),
          fetch(`/api/courses/${courseData[0].id}/announcements`),
          fetch(`/api/courses/${courseData[0].id}/students`)
        ]);

        if (lessonsRes.ok) setLessons(await lessonsRes.json());
        if (quizzesRes.ok) setQuizzes(await quizzesRes.json());
        if (assignmentsRes.ok) setAssignments(await assignmentsRes.json());
        if (announcementsRes.ok) setAnnouncements(await announcementsRes.json());
        if (studentsRes.ok) setStudents(await studentsRes.json());
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLesson = () => {
    setShowAddLessonModal(true);
  };

 const handleSubmitLesson = async (lessonData) => {
  if (!lessonData.title.trim()) {
    alert("Please enter a lesson title");
    return;
  }

  try {
    const response = await fetch(`/api/courses/${course.id}/lessons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ...lessonData,
        status: "published"
      })
    });
    
    if (response.ok) {
      const createdLesson = await response.json();
      setLessons(prev => [...prev, createdLesson]);
      
      // Close modal
      setShowAddLessonModal(false);
      
      // Notify students about new lesson
      await notifyStudentsAboutNewLesson(lessonData.title);
      
      alert("Lesson created successfully!");
    }
  } catch (error) {
    console.error('Error adding lesson:', error);
    alert("Error creating lesson. Please try again.");
  }
};

  const notifyStudentsAboutNewLesson = async (lessonTitle) => {
  try {
    const response = await fetch('/api/student-notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        course_id: course.id,
        course_title: course.title,
        teacher_name: course.teacher_name || "Teacher", // Make sure this field exists in your course data
        lesson_title: lessonTitle,
        type: 'new_lesson'
      })
    });

    if (response.ok) {
      console.log("✅ Students notified about new lesson");
    }
  } catch (error) {
    console.error('Error notifying students:', error);
  }
};

const handleDeleteLesson = async (lessonId) => {
  if (confirm("Are you sure you want to delete this lesson?")) {
    try {
      const response = await fetch(`/api/courses/${course.id}/lessons/${lessonId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
        alert("Lesson deleted successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
      alert("Error deleting lesson. Please try again.");
    }
  }
};

  const handleEditLesson = (lesson) => {
    const newTitle = prompt("Enter new lesson title:", lesson.title);
    if (newTitle && newTitle !== lesson.title) {
      // Implement edit functionality
      console.log("Edit lesson:", lesson.id, newTitle);
    }
  };

  // Add Lesson Modal Component
  const AddLessonModal = () => {
    if (!showAddLessonModal) return null;

    return (
      <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#161b22] border border-gray-700 rounded-lg w-full max-w-md">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Add New Lesson</h2>
            <button 
              onClick={() => setShowAddLessonModal(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Modal Body */}
          <form onSubmit={handleSubmitLesson} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Lesson Title *
              </label>
              <input
                type="text"
                value={newLesson.title}
                onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                className="w-full bg-[#0d1117] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                placeholder="Enter lesson title"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Lesson Content
              </label>
              <textarea
                value={newLesson.content}
                onChange={(e) => setNewLesson({...newLesson, content: e.target.value})}
                className="w-full bg-[#0d1117] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500 min-h-[100px]"
                placeholder="Enter lesson content (optional)"
                rows="4"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Video URL
              </label>
              <input
                type="url"
                value={newLesson.video_url}
                onChange={(e) => setNewLesson({...newLesson, video_url: e.target.value})}
                className="w-full bg-[#0d1117] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                placeholder="https://example.com/video (optional)"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Order Index
              </label>
              <input
                type="number"
                value={newLesson.order_index}
                onChange={(e) => setNewLesson({...newLesson, order_index: parseInt(e.target.value) || 0})}
                className="w-full bg-[#0d1117] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                min="0"
              />
            </div>
          </form>
          
          {/* Modal Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-700">
            <button
              type="button"
              onClick={() => setShowAddLessonModal(false)}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitLesson}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <BookOpen size={16} />
              Create Lesson
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Lesson":
        return (
          <table className="w-full text-left text-gray-300 text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 uppercase text-xs">
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Date Created</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson) => (
                <tr key={lesson.id} className="border-b border-gray-800 hover:bg-[#1c2128] transition">
                  <td className="py-3 px-4">{lesson.title}</td>
                  <td className="py-3 px-4">{lesson.order_index}</td>
                  <td className="py-3 px-4">{new Date(lesson.created_at).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      lesson.status === 'published' ? 'bg-green-500 text-white' : 'bg-gray-500 text-gray-300'
                    }`}>
                      {lesson.status || 'Published'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right flex items-center justify-end gap-3">
                    <button 
                      onClick={() => handleEditLesson(lesson)}
                      className="hover:text-green-500 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteLesson(lesson.id)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "Students":
        return (
          <table className="w-full text-left text-gray-300 text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 uppercase text-xs">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Last Accessed</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b border-gray-800 hover:bg-[#1c2128] transition">
                  <td className="py-3 px-4">{student.student_name}</td>
                  <td className="py-3 px-4">{student.student_email}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-green-500 text-xs">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-400">
                    {student.last_accessed ? new Date(student.last_accessed).toLocaleDateString() : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      default:
        return <div className="p-4 text-gray-400">Content for {activeTab}</div>;
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0d1117] text-gray-100 p-6">Loading...</div>;
  }

  if (!course) {
    return <div className="min-h-screen bg-[#0d1117] text-gray-100 p-6">Course not found</div>;
  }

  return (
    <>
      <div className="min-h-screen bg-[#0d1117] text-gray-100 p-6 flex flex-col lg:flex-row gap-6">
        {/* Left Content */}
        <div className="flex-1 space-y-6">
          {/* Course Header */}
          <div className="bg-[#161b22] p-6 rounded-lg border border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h1 className="text-3xl font-bold text-green-500">{course.title}</h1>
                <p className="text-gray-400 mt-2">{students.length} Students • {lessons.length} Lessons</p>
              </div>
              <img
                src={course.image_url || "/hand.png"}
                alt="Course"
                className="relative w-full aspect-square h-32 object-cover rounded-lg"
              />
            </div>
            
            {/* Progress */}
            <div className="mt-6">
              <div className="text-sm text-gray-300 mb-2 flex justify-between">
                <span>Course Progress</span>
                <span>65% complete</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "65%" }}></div>
              </div>
            </div>
            
            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-6">
              <button 
                onClick={handleAddLesson}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <BookOpen size={16} /> Add Lesson
              </button>
              <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                <FileText size={16} /> Add Quiz
              </button>
              <button className="flex items-center gap-2 border border-green-600 text-green-500 hover:bg-green-600 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                <Megaphone size={16} /> Add Announcement
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-[#161b22] border border-gray-800 rounded-lg">
            <div className="flex justify-around text-gray-400 text-sm font-medium border-b border-gray-700">
              {["Lesson", "Quiz", "Assignments", "Announcement", "Students", "Analytics"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-4 hover:text-green-500 transition-colors duration-200 ${
                    activeTab === tab ? "text-green-500 border-b-2 border-green-500" : ""
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              {lessons.length === 0 && activeTab === "Lesson" ? (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen size={48} className="mx-auto mb-4 text-gray-600" />
                  <p>No lessons created yet</p>
                  <button 
                    onClick={handleAddLesson}
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Create Your First Lesson
                  </button>
                </div>
              ) : (
                renderTabContent()
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-96 bg-[#161b22] border border-gray-800 rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Lightbulb size={20} className="text-green-500" />
            <h2 className="text-lg font-semibold">AI Assistant</h2>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-400">Course Insights</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <div className="text-green-500 mt-1">☑</div>
                {students.length} students enrolled in this course
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <div className="text-green-500 mt-1">☑</div>
                {lessons.length} lessons created
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <div className="text-green-500 mt-1">☑</div>
                {quizzes.length} quizzes available
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <div className="text-green-500 mt-1">☑</div>
                Average progress: {Math.round(students.reduce((acc, student) => acc + student.progress, 0) / (students.length || 1))}%
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Add Lesson Modal */}
      <AddLessonModal />
    </>
  );
};

export default CoursePage;