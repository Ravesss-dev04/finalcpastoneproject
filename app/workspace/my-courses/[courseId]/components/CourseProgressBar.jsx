"use client";
import { useState, useEffect } from "react";
import { CheckCircle, FileText, ListCheck } from "lucide-react";

export default function CourseProgressBar({ courseId, lessonsCount, quizzesCount, assignmentsCount }) {
  const [progress, setProgress] = useState({
    lessonsCompleted: 0,
    quizzesCompleted: 0,
    assignmentsSubmitted: 0
  });

  useEffect(() => {
    fetchProgress();
  }, [courseId]);

  const fetchProgress = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/progress`);
      if (response.ok) {
        const progressData = await response.json();
        setProgress(progressData);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  return (
    <div className="bg-[#1a1d24] p-10 rounded-lg space-y-4 shadow-md">
      <h2 className="text-lg font-bold text-white mb-4">Course Progress</h2>
      <ul className="text-sm space-y-2 text-white">
        <li className="flex items-center gap-2">
          <CheckCircle className="text-green-400 w-4 h-4"/>
          <span>{progress.lessonsCompleted}/{lessonsCount} Lessons Viewed</span>
        </li>
        <li className="flex items-center gap-2">
          <ListCheck className="text-yellow-400 w-4 h-4"/>
          <span>{progress.quizzesCompleted}/{quizzesCount} Quizzes Completed</span>
        </li>
        <li className="flex items-center gap-2">
          <FileText className="text-blue-400 w-4 h-4"/>
          <span>{progress.assignmentsSubmitted}/{assignmentsCount} Assignments Submitted</span>
        </li>
      </ul>
    </div>
  );
}