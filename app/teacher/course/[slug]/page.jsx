"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  BookOpen,
  FileText,
  Megaphone,
  Users,
  BarChart2,
  Trash2,
  Edit,
  Lightbulb,
} from "lucide-react";

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

  useEffect(() => {
    fetchCourseData();
  }, [slug]);

  const fetchCourseData = async () => {
    try {
      // First get course by slug
      const courseResponse = await fetch(`/api/courses?slug=${slug}`);
      if (courseResponse.ok) {
        const courseData = await courseResponse.json();
        setCourse(courseData[0]);
        
        // Fetch all course content in parallel
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

  const handleAddLesson = async () => {
    const title = prompt("Enter lesson title:");
    if (title) {
      try {
        const response = await fetch(`/api/courses/${course.id}/lessons`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content: "Add your content here..." })
        });
        
        if (response.ok) {
          const newLesson = await response.json();
          setLessons(prev => [...prev, newLesson]);
        }
      } catch (error) {
        console.error('Error adding lesson:', error);
      }
    }
  };

  // Similar functions for adding quizzes, assignments, announcements

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
                  <td className="py-3 px-4 text-green-500">Published</td>
                  <td className="py-3 px-4 text-right flex items-center justify-end gap-3">
                    <button className="hover:text-green-500">
                      <Edit size={16} />
                    </button>
                    <button className="hover:text-red-500">
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
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b border-gray-800 hover:bg-[#1c2128] transition">
                  <td className="py-3 px-4">{student.student_name}</td>
                  <td className="py-3 px-4">{student.student_email}</td>
                  <td className="py-3 px-4 text-green-500">{student.progress}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      // Add other cases for Quiz, Assignments, Announcement, Analytics
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
    <div className="min-h-screen bg-[#0d1117] text-gray-100 p-6 flex flex-col lg:flex-row gap-6">
      {/* Left Content */}
      <div className="flex-1 space-y-6">
        {/* Course Header */}
        <div className="bg-[#161b22] p-6 rounded-lg border border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-green-500">{course.title}</h1>
              <p className="text-gray-400 mt-2">{students.length} Students</p>
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
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              <BookOpen size={16} /> Add Lesson
            </button>
            <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
              <FileText size={16} /> Add Quiz
            </button>
            <button className="flex items-center gap-2 border border-green-600 text-green-500 hover:bg-green-600 hover:text-white px-4 py-2 rounded-md text-sm font-medium">
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

          <div className="overflow-x-auto">{renderTabContent()}</div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-96 bg-[#161b22] border border-gray-800 rounded-lg p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Lightbulb size={20} className="text-green-500" />
          <h2 className="text-lg font-semibold">AI Assistant</h2>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3 text-gray-400">Insights</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-sm text-gray-300">
              <div className="text-green-500 mt-1">☑</div>
              {students.length} students enrolled in this course
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-300">
              <div className="text-green-500 mt-1">☑</div>
              {lessons.length} lessons created
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;