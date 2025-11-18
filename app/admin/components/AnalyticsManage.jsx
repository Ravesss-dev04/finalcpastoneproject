"use client";
import React, { useEffect, useRef } from 'react';
import {
  Chart,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  DoughnutController,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
Chart.register(
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  DoughnutController,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AnalyticsManage = () => {
  const courseChartRef = useRef(null);
  const progressChartRef = useRef(null);
  const teacherChartRef = useRef(null);
  const systemChartRef = useRef(null);
  
  const chartInstances = useRef([]);

  useEffect(() => {
    // Destroy existing charts before creating new ones
    chartInstances.current.forEach(chart => {
      if (chart) {
        chart.destroy();
      }
    });
    chartInstances.current = [];

    // Course Popularity Chart
    if (courseChartRef.current) {
      const courseCtx = courseChartRef.current.getContext('2d');
      const courseChart = new Chart(courseCtx, {
        type: "bar",
        data: {
          labels: ["Python", "Web Dev", "Java", "Data Structures", "OOP"],
          datasets: [
            {
              label: "Students Enrolled",
              data: [50, 80, 40, 70, 60],
              backgroundColor: "#22c55e",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Course Popularity",
              color: "#e2e8f0",
              font: {
                size: 16
              }
            },
            legend: { display: false },
          },
          scales: {
            x: { 
              ticks: { 
                color: "#e2e8f0" 
              },
              grid: {
                color: 'rgba(255,255,255,0.1)'
              }
            },
            y: { 
              ticks: { 
                color: "#e2e8f0" 
              },
              grid: {
                color: 'rgba(255,255,255,0.1)'
              }
            },
          },
        },
      });
      chartInstances.current.push(courseChart);
    }

    // Average Student Progress Chart
    if (progressChartRef.current) {
      const progressCtx = progressChartRef.current.getContext('2d');
      const progressChart = new Chart(progressCtx, {
        type: "doughnut",
        data: {
          labels: ["Completed", "In Progress", "Not Started"],
          datasets: [
            {
              data: [45, 35, 20],
              backgroundColor: ["#22c55e", "#84cc16", "#facc15"],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Average Student Progress",
              color: "#e2e8f0",
              font: {
                size: 16
              }
            },
            legend: {
              labels: {
                color: "#e2e8f0",
                font: {
                  size: 12
                }
              }
            }
          },
          cutout: '60%',
        },
      });
      chartInstances.current.push(progressChart);
    }

    // Teacher Activity Stats Chart
    if (teacherChartRef.current) {
      const teacherCtx = teacherChartRef.current.getContext('2d');
      const teacherChart = new Chart(teacherCtx, {
        type: "bar",
        data: {
          labels: ["Mr. Lopez", "Mrs. Cruz", "Mr. Batongbakal", "Ms. Sulasok"],
          datasets: [
            {
              label: "Lessons Uploaded",
              data: [15, 20, 10, 18],
              backgroundColor: "#10b981",
            },
            {
              label: "Quizzes Created",
              data: [5, 8, 4, 6],
              backgroundColor: "#3b82f6",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Teacher Activity Stats",
              color: "#e2e8f0",
              font: {
                size: 16
              }
            },
            legend: { 
              labels: { 
                color: "#e2e8f0",
                font: {
                  size: 12
                }
              } 
            },
          },
          scales: {
            x: { 
              ticks: { 
                color: "#e2e8f0" 
              },
              grid: {
                color: 'rgba(255,255,255,0.1)'
              }
            },
            y: { 
              ticks: { 
                color: "#e2e8f0" 
              },
              grid: {
                color: 'rgba(255,255,255,0.1)'
              }
            },
          },
        },
      });
      chartInstances.current.push(teacherChart);
    }

    // System Usage Trends Chart
    if (systemChartRef.current) {
      const systemCtx = systemChartRef.current.getContext('2d');
      const systemChart = new Chart(systemCtx, {
        type: "line",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Active Users",
              data: [120, 150, 180, 170, 200, 250, 220],
              borderColor: "#22c55e",
              backgroundColor: "rgba(34,197,94,0.3)",
              fill: true,
              tension: 0.4,
              borderWidth: 3,
              pointBackgroundColor: "#22c55e",
              pointBorderColor: "#ffffff",
              pointBorderWidth: 2,
              pointRadius: 5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Weekly System Usage Trends",
              color: "#e2e8f0",
              font: {
                size: 16
              }
            },
            legend: { 
              labels: { 
                color: "#e2e8f0",
                font: {
                  size: 12
                }
              } 
            },
          },
          scales: {
            x: { 
              ticks: { 
                color: "#e2e8f0" 
              },
              grid: {
                color: 'rgba(255,255,255,0.1)'
              }
            },
            y: { 
              ticks: { 
                color: "#e2e8f0" 
              },
              grid: {
                color: 'rgba(255,255,255,0.1)'
              }
            },
          },
        },
      });
      chartInstances.current.push(systemChart);
    }

    // Cleanup function
    return () => {
      chartInstances.current.forEach(chart => {
        if (chart) {
          chart.destroy();
        }
      });
      chartInstances.current = [];
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-green-500 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Comprehensive system insights and real-time statistics.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
          <div className="bg-[#161b22] border border-gray-700 rounded-lg p-4 md:p-6 text-center hover:bg-[#1c2128] transition-colors duration-300">
            <h2 className="text-xl md:text-2xl font-bold text-green-500 mb-2">185</h2>
            <p className="text-gray-400 text-sm md:text-base">Total Students</p>
          </div>
          <div className="bg-[#161b22] border border-gray-700 rounded-lg p-4 md:p-6 text-center hover:bg-[#1c2128] transition-colors duration-300">
            <h2 className="text-xl md:text-2xl font-bold text-green-500 mb-2">12</h2>
            <p className="text-gray-400 text-sm md:text-base">Total Teachers</p>
          </div>
          <div className="bg-[#161b22] border border-gray-700 rounded-lg p-4 md:p-6 text-center hover:bg-[#1c2128] transition-colors duration-300">
            <h2 className="text-xl md:text-2xl font-bold text-green-500 mb-2">10</h2>
            <p className="text-gray-400 text-sm md:text-base">Active Courses</p>
          </div>
          <div className="bg-[#161b22] border border-gray-700 rounded-lg p-4 md:p-6 text-center hover:bg-[#1c2128] transition-colors duration-300">
            <h2 className="text-xl md:text-2xl font-bold text-green-500 mb-2">350</h2>
            <p className="text-gray-400 text-sm md:text-base">Total Enrollments</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Course Popularity Chart */}
          <div className="bg-[#161b22] border border-gray-700 rounded-lg p-4 md:p-6">
            <div className="h-64 md:h-80">
              <canvas ref={courseChartRef} />
            </div>
          </div>

          {/* Student Progress Chart */}
          <div className="bg-[#161b22] border border-gray-700 rounded-lg p-4 md:p-6">
            <div className="h-64 md:h-80">
              <canvas ref={progressChartRef} />
            </div>
          </div>

          {/* Teacher Activity Chart */}
          <div className="bg-[#161b22] border border-gray-700 rounded-lg p-4 md:p-6">
            <div className="h-64 md:h-80">
              <canvas ref={teacherChartRef} />
            </div>
          </div>

          {/* System Usage Chart */}
          <div className="bg-[#161b22] border border-gray-700 rounded-lg p-4 md:p-6">
            <div className="h-64 md:h-80">
              <canvas ref={systemChartRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsManage;