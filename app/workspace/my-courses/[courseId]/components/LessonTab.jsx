"use client";
import React from "react";
import { BookOpen, FileText, Video } from "lucide-react";
import { useState } from "react";

export default function LessonTab ({ lessons }) {
    return (
        <div className="space-y-4">
            {lessons.map((lesson,index) => (
                <div
                key={index}
                className="bg-gray-800 p-4 rounded-lg flex items-center justify-between hover:bg-gray-700 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                        {lesson.type === "video" ? (
                            <Video  className="text-red-500"/>
                        ) : (
                            <FileText className="text-blue-500" />
                        )}
                        <span> {lesson.title}</span>
                    </div>
                    <span className={`text-xs ${lesson.status === "viewed" ? "text-green-500" : "text-gray-400"}`}></span>
                        {lesson.status === "viewed" ? "Viewed" : "View"}
                </div>
            ))}
        </div>
    )
}