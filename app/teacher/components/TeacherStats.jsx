"use client";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown } from "lucide-react";
import TeacherWelcome from "./TeacherWelcome";

export default function AnalyticsPage() {
  const [openSection, setOpenSection] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("All Courses");

  const allData = [
    { name: "AI Fund. 101", value: 90 },
    { name: "ML Basics", value: 82 },
    { name: "DS & Ethics", value: 95 },
    { name: "NLP", value: 91 },
    { name: "DL Apps", value: 79 },
    { name: "RL", value: 85 },
  ];

  // Filter logic
  const filteredData =
    selectedCourse === "All Courses"
      ? allData
      : allData.filter((d) => d.name === selectedCourse);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const courses = ["All Courses", ...allData.map((d) => d.name)];

  return (
   
    <div className="min-h-screen bg-[#0d1117] text-gray-200 p-6">
 <TeacherWelcome/>
      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Total Courses", value: "8", desc: "+5% from last month", icon: "📘" },
          { title: "Enrolled Students", value: "250", desc: "+10% from last semester", icon: "🎓" },
          { title: "Pending Assignments", value: "12", desc: "3 urgent deadlines", icon: "🗓️" },
          { title: "Average Quiz Score", value: "88%", desc: "Consistent performance", icon: "🎯" },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-[#161b22] p-5 rounded-2xl shadow hover:shadow-lg hover:shadow-green-500/10 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400">{item.title}</p>
              <span className="text-xl">{item.icon}</span>
            </div>
            <h2 className="text-3xl font-bold text-green-400">{item.value}</h2>
            <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Section */}
        <div className="bg-[#161b22] p-6 rounded-2xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">
              Student Performance Per Course
            </h2>

            {/* Select Dropdown Filter */}
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="bg-[#0d1117] border border-[#30363d] text-sm text-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            >
              {courses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
              <XAxis dataKey="name" stroke="#8b949e" />
              <YAxis stroke="#8b949e" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#161b22",
                  border: "1px solid #30363d",
                  color: "#fff",
                }}
              />
              <Bar dataKey="value" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI Insights Section */}
        <div className="bg-[#161b22] p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-white">
            AI Insights Powered by Gemini
          </h2>

          {/* Accordion Section */}
          <div className="space-y-3">
            {[
              {
                title: "Common Student Questions",
                content: [
                  "What is the difference between supervised and unsupervised learning?",
                  "How do I interpret feature importance in a model?",
                  "Can AI be truly creative, or is it just mimicking?",
                ],
              },
              {
                title: "AI-Suggested Lesson Improvements",
                content: [
                  "Increase interactive exercises for NLP.",
                  "Add visual examples for Deep Learning topics.",
                  "Simplify explanations in Reinforcement Learning module.",
                ],
              },
              {
                title: "Engagement Feedback",
                content: [
                  "Students engage more with practical case studies.",
                  "Weekly recaps improve retention rates by 15%.",
                ],
              },
            ].map((section, index) => (
              <div key={index} className="border border-[#30363d] rounded-lg">
                <button
                  className="flex justify-between items-center w-full px-4 py-3 text-left hover:bg-[#21262d] transition"
                  onClick={() =>
                    setOpenSection(openSection === index ? null : index)
                  }
                >
                  <span className="font-medium text-gray-300">{section.title}</span>
                  <ChevronDown
                    className={`w-4 h-4 transform transition-transform ${
                      openSection === index
                        ? "rotate-180 text-green-400"
                        : "text-gray-500"
                    }`}
                  />
                </button>
                {openSection === index && (
                  <div className="px-6 pb-3 text-sm text-gray-400 space-y-2">
                    {section.content.map((line, i) => (
                      <p key={i}>• {line}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
