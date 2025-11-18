"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Tabs from "./components/Tabs";
import LessonTab from "./components/LessonTab";
import CourseProgressBar from "./components/CourseProgressBar";
import AiTutorCard from "./components/AiTutorCard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import QuizzesTab from "./components/QuizzesTab";
import AssignmentTab from "./components/AssignmentTab";
import AnnouncementTab from "./components/AnnouncementsTab";

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "lessons";
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      // Fetch course details
      const courseResponse = await fetch(`/api/courses/${courseId}`);
      if (courseResponse.ok) {
        const courseData = await courseResponse.json();
        setCourse(courseData);
        
        // Fetch course content
        const [lessonsRes, quizzesRes, assignmentsRes, announcementsRes] = await Promise.all([
          fetch(`/api/courses/${courseId}/lessons`),
          fetch(`/api/courses/${courseId}/quizzes`),
          fetch(`/api/courses/${courseId}/assignments`),
          fetch(`/api/courses/${courseId}/announcements`)
        ]);

        if (lessonsRes.ok) setLessons(await lessonsRes.json());
        if (quizzesRes.ok) setQuizzes(await quizzesRes.json());
        if (assignmentsRes.ok) setAssignments(await assignmentsRes.json());
        if (announcementsRes.ok) setAnnouncements(await announcementsRes.json());
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-white">Loading course...</div>;
  }

  if (!course) {
    return <div className="p-6 text-red-500">Course not found.</div>;
  }

  return (
    <div className="p-6 text-white">
      {/* Header */}
      <div className="bg-green-600 text-white p-8 w-80 md:w-full md:ml-0 -ml-11 rounded-lg mb-6">
        <Link href={`/workspace/my-courses/`}>
          <ArrowLeft className="w-4 h-4 text-white" />
        </Link>
        <h1 className="text-2xl font-bold">{course.title}</h1>
        <p className="text-sm">By {course.teacher_name}</p>
      </div>
      
      {/* Main layout */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main content */}
        <div className="lg:col-span-3">
          {/* Tabs only visible on large screens */}
          <div className="hidden lg:block">
            <Tabs courseId={courseId} activeTab={activeTab} />
          </div>
          <div className="w-80 md:w-full md:ml-0 -ml-11">
            {activeTab === "lessons" && <LessonTab lessons={lessons} courseId={courseId} />}
            {activeTab === "quizzes" && <QuizzesTab quizzes={quizzes} courseId={courseId} />}
            {activeTab === "assignments" && (
              <AssignmentTab assignments={assignments} courseId={courseId} />
            )}
            {activeTab === "announcement" && (
              <AnnouncementTab announcements={announcements} courseId={courseId} />
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1 space-2 w-80 md:w-80 -ml-11 md:ml-0">
          <CourseProgressBar 
            courseId={courseId} 
            lessonsCount={lessons.length}
            quizzesCount={quizzes.length}
            assignmentsCount={assignments.length}
          />
          <AiTutorCard />
        </div>
      </div>

      {/* Mobile Footer Tabs */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#111827] border-t border-gray-700">
        <div className="flex justify-around py-3">
          <Tabs courseId={courseId} activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
}