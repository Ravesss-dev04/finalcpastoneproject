'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Brain, Target, Clock, BookOpen, Sparkles, CheckCircle2, Play, Trophy, ListChecks } from 'lucide-react';

const StudyPlanList = () => {
  const { user } = useUser();
  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [currentWeek, setCurrentWeek] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [activeTab, setActiveTab] = useState('current'); // 'current' or 'completed'

  useEffect(() => {
    generateCurrentWeek();
    loadStudyPlan();
  }, []);

  const generateCurrentWeek = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - currentDay + 1);
    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      week.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getDate(),
        fullDate: date.toISOString().split('T')[0],
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        isToday: date.toDateString() === today.toDateString()
      });
    }
    setCurrentWeek(week);
  };

  const loadStudyPlan = () => {
    // Load from localStorage
    const savedStudyPlan = localStorage.getItem('currentStudyPlan');
    const savedCompleted = localStorage.getItem('completedLessons');
    
    if (savedStudyPlan) {
      const parsedPlan = JSON.parse(savedStudyPlan);
      
      // Check if study plan is for current week
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay() + 1);
      const weekStartString = weekStart.toISOString().split('T')[0];
      
      if (parsedPlan.generatedWeek === weekStartString) {
        setStudyPlan(parsedPlan);
        setLoading(false);
        return;
      }
    }
    
    // If no saved plan or old plan, generate new one
    generateStudyPlan();
  };

  const saveStudyPlan = (plan) => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1);
    const weekStartString = weekStart.toISOString().split('T')[0];
    
    const planToSave = {
      ...plan,
      generatedWeek: weekStartString,
      generatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('currentStudyPlan', JSON.stringify(planToSave));
    setStudyPlan(planToSave);
  };

  const generateStudyPlan = async (isRegenerating = false) => {
    if (isRegenerating) {
      setRegenerating(true);
    } else {
      setLoading(true);
    }

    try {
      const analyticsResponse = await fetch('/api/student-analytics');
      const analyticsData = await analyticsResponse.json();

      const studyPlanData = await generateAIStudyPlan(analyticsData);
      saveStudyPlan(studyPlanData);
      
    } catch (error) {
      console.error('Error generating study plan:', error);
      const fallbackPlan = createFallbackStudyPlan();
      saveStudyPlan(fallbackPlan);
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  };

  const generateAIStudyPlan = async (analyticsData) => {
    const weakAreas = analyticsData?.weakAreas || ['Python Basics', 'Java Development', 'Data Structure'];
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    
    const prompt = `Create a focused daily study plan for TODAY ONLY (${today}) based on student's weak areas: ${weakAreas.join(', ')}.
    
    Generate 1-3 specific study tasks for today. Make them practical and actionable.
    
    Respond with JSON:
    {
      "recommendation": "brief study advice",
      "focusAreas": ["area1", "area2"],
      "dailyTasks": ["task1", "task2"]
    }`;

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          mode: 'study_plan'
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      let aiResponse;
      try {
        aiResponse = JSON.parse(data.text);
      } catch (parseError) {
        aiResponse = extractTasksFromText(data.text, weakAreas);
      }

      const weeklySchedule = currentWeek.map(dayItem => ({
        day: dayItem.day,
        date: dayItem.date,
        tasks: dayItem.isToday ? 
          (aiResponse.dailyTasks || []).map(task => ({ 
            id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            text: task,
            completed: false 
          })) : [],
        isToday: dayItem.isToday
      }));

      return {
        recommendation: aiResponse.recommendation || `Focus on improving your ${weakAreas.join(', ')}.`,
        focusAreas: aiResponse.focusAreas || weakAreas,
        weeklySchedule: weeklySchedule
      };

    } catch (error) {
      console.error('AI generation failed:', error);
      throw error;
    }
  };

  const extractTasksFromText = (text, weakAreas) => {
    const tasks = [];
    weakAreas.forEach(area => {
      tasks.push(`Practice ${area} with coding exercises`);
      tasks.push(`Review ${area} fundamental concepts`);
    });

    return {
      recommendation: `Focus on improving your ${weakAreas.join(', ')}.`,
      focusAreas: weakAreas,
      dailyTasks: tasks.slice(0, 2)
    };
  };

  const createFallbackStudyPlan = () => {
    const weakAreas = ['Python Basics', 'Java Development', 'Data Structure'];
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    
    const dailyTasks = [
      `Practice ${weakAreas[0]} with hands-on coding`,
      `Review ${weakAreas[1]} core concepts`
    ].map(task => ({ 
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: task,
      completed: false 
    }));

    const weeklySchedule = currentWeek.map(dayItem => ({
      day: dayItem.day,
      date: dayItem.date,
      tasks: dayItem.isToday ? dailyTasks : [],
      isToday: dayItem.isToday
    }));

    return {
      recommendation: `Focus on improving your ${weakAreas.join(', ')}. Practice consistently with hands-on exercises.`,
      focusAreas: weakAreas,
      weeklySchedule: weeklySchedule
    };
  };

  const getWeekRange = () => {
    if (!currentWeek.length) return '';
    const start = currentWeek[0];
    const end = currentWeek[6];
    return `Week of ${start.month} ${start.date} - ${end.month} ${end.date}`;
  };

  const markTaskAsDone = (dayIndex, taskIndex) => {
    setStudyPlan(prev => {
      const updatedSchedule = [...prev.weeklySchedule];
      
      if (updatedSchedule[dayIndex] && updatedSchedule[dayIndex].tasks[taskIndex]) {
        const completedTask = {
          ...updatedSchedule[dayIndex].tasks[taskIndex],
          completed: true,
          completedAt: new Date().toISOString()
        };
        
        // Save to completed tasks
        const completedTasks = JSON.parse(localStorage.getItem('completedLessons') || '[]');
        completedTasks.push(completedTask);
        localStorage.setItem('completedLessons', JSON.stringify(completedTasks));
        
        // Remove from current tasks
        updatedSchedule[dayIndex].tasks = updatedSchedule[dayIndex].tasks.filter(
          (_, index) => index !== taskIndex
        );
      }
      
      const updatedPlan = {
        ...prev,
        weeklySchedule: updatedSchedule
      };
      
      localStorage.setItem('currentStudyPlan', JSON.stringify(updatedPlan));
      return updatedPlan;
    });
  };

  const getCompletedTasks = () => {
    const completedTasks = JSON.parse(localStorage.getItem('completedLessons') || '[]');
    
    // Filter tasks completed this week
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
    weekStart.setHours(0, 0, 0, 0);
    
    return completedTasks.filter(task => 
      new Date(task.completedAt) >= weekStart
    );
  };

  const viewLessonDetails = (task, dayIndex, taskIndex) => {
    const dayItem = currentWeek[dayIndex];
    setSelectedLesson({
      ...task,
      day: dayItem.day,
      date: dayItem.date,
      taskIndex: taskIndex,
      dayIndex: dayIndex,
      subject: studyPlan.focusAreas.find(area => task.text.includes(area)) || 'General Study',
      duration: '30-45 mins',
      description: `This session focuses on strengthening your understanding through practical application. Complete this task to improve your skills.`,
      steps: [
        'Review the core concepts related to this topic',
        'Work through practice problems and exercises',
        'Apply what you learned in practical scenarios',
        'Test your understanding with self-assessment'
      ]
    });
  };

  const closeLessonView = () => {
    setSelectedLesson(null);
  };

  const clearCompletedTasks = () => {
    localStorage.removeItem('completedLessons');
    // Refresh the completed tasks view
    setStudyPlan(prev => ({ ...prev }));
  };

  if (loading) {
    return (
      <div className="bg-[#161B22] text-white min-h-screen p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-green-400">Generating your personalized study plan...</p>
        </div>
      </div>
    );
  }

  const totalTasks = studyPlan?.weeklySchedule?.reduce((total, day) => total + day.tasks.length, 0) || 0;
  const focusAreasCount = studyPlan?.focusAreas?.length || 0;
  const studyDays = studyPlan?.weeklySchedule?.filter(day => day.tasks.length > 0).length || 0;
  const completedTasks = getCompletedTasks();
  const totalCompleted = completedTasks.length;

  return (
    <div className="bg-[#161B22] text-white min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-white">📚 Study Plan</h1>
            <p className="text-gray-400 mt-1 text-sm sm:text-base">{getWeekRange()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-300">Hello, {user?.firstName || 'Student'}!</p>
            <p className="text-xs text-gray-500">Your AI-powered study companion</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('current')}
            className={`flex items-center gap-2 px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'current' 
                ? 'border-green-500 text-green-400' 
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            <ListChecks size={16} />
            Current Tasks ({totalTasks})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex items-center gap-2 px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'completed' 
                ? 'border-green-500 text-green-400' 
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            <Trophy size={16} />
            Completed ({totalCompleted})
          </button>
        </div>

        {activeTab === 'current' ? (
          <>
            {/* AI Recommendation Card */}
            <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-700/50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                <div className="p-2 bg-green-600 rounded-lg w-fit">
                  <Brain size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">AI Recommendation</h3>
                  <p className="text-green-300 text-sm">Personalized based on your progress</p>
                </div>
              </div>
              <p className="text-green-100 text-base sm:text-lg leading-relaxed mb-4 sm:mb-0">{studyPlan?.recommendation}</p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {studyPlan?.focusAreas?.map((area, idx) => (
                  <span 
                    key={idx} 
                    className="bg-green-800/50 text-green-300 text-xs sm:text-sm px-3 py-2 rounded-full flex items-center gap-2 border border-green-700/30"
                  >
                    <Target size={14} />
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Weekly Schedule Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {currentWeek.map((dayItem, dayIndex) => {
                const daySchedule = studyPlan?.weeklySchedule?.find(s => 
                  s.day.toLowerCase().includes(dayItem.day.toLowerCase())
                ) || { tasks: [] };
                
                return (
                  <div 
                    key={dayIndex} 
                    className={`bg-[#1f2937] rounded-xl p-3 sm:p-4 border transition-all duration-300 min-w-0 ${
                      dayItem.isToday 
                        ? 'border-green-500 ring-2 ring-green-500/20' 
                        : 'border-gray-700 hover:border-green-500/30'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3 sm:mb-4">
                      <h3 className={`font-semibold text-sm sm:text-base ${
                        dayItem.isToday ? 'text-green-400' : 'text-white'
                      }`}>
                        {dayItem.day}
                      </h3>
                      <div className="text-right">
                        <span className="text-sm font-medium text-gray-300">{dayItem.date}</span>
                        {dayItem.isToday && (
                          <span className="block text-xs text-green-400 font-medium">Today</span>
                        )}
                      </div>
                    </div>

                    {daySchedule.tasks.length > 0 ? (
                      <div className="space-y-2 sm:space-y-3">
                        {daySchedule.tasks.map((task, taskIndex) => (
                          <div 
                            key={task.id}
                            className="bg-green-900/20 text-green-300 text-xs sm:text-sm p-2 sm:p-3 rounded-lg border border-green-700/30 group hover:bg-green-900/30 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2 flex-1 min-w-0">
                                <BookOpen size={12} className="mt-0.5 flex-shrink-0 text-green-400" />
                                <span className="leading-tight break-words flex-1">{task.text}</span>
                              </div>
                              <div className="flex gap-1 flex-shrink-0">
                                <button
                                  onClick={() => viewLessonDetails(task, dayIndex, taskIndex)}
                                  className="opacity-70 hover:opacity-100 transition-opacity text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-white flex items-center gap-1"
                                >
                                  <Play size={10} />
                                  View
                                </button>
                                <button
                                  onClick={() => markTaskAsDone(dayIndex, taskIndex)}
                                  className="opacity-70 hover:opacity-100 transition-opacity text-xs bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-white flex items-center gap-1"
                                >
                                  <CheckCircle2 size={10} />
                                  Done
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 sm:py-6">
                        <Clock size={20} className="mx-auto text-gray-500 mb-2" />
                        <p className="text-xs sm:text-sm text-gray-500 italic">No study tasks scheduled</p>
                        <p className="text-xs text-gray-600 mt-1">Rest day</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Regenerate Button */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <button
                onClick={() => generateStudyPlan(true)}
                disabled={regenerating}
                className={`
                  relative overflow-hidden px-4 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base
                  flex items-center gap-2 sm:gap-3 transition-all duration-300 w-full sm:w-auto justify-center
                  ${regenerating 
                    ? 'bg-green-700 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25'
                  }
                `}
              >
                {regenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                    <span>Regenerating Plan...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} className="text-white" />
                    <span>Regenerate Study Plan</span>
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          /* Completed Tasks Tab */
          <div className="bg-[#1f2937] rounded-xl p-4 sm:p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Trophy className="text-green-400" size={24} />
                <div>
                  <h3 className="text-lg font-semibold text-white">Completed Tasks</h3>
                  <p className="text-green-300 text-sm">Your accomplishments this week</p>
                </div>
              </div>
              {completedTasks.length > 0 && (
                <button
                  onClick={clearCompletedTasks}
                  className="text-xs bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
                >
                  Clear All
                </button>
              )}
            </div>

            {completedTasks.length > 0 ? (
              <div className="space-y-3">
                {completedTasks.map((task, index) => (
                  <div key={task.id} className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 size={16} className="text-green-400" />
                          <span className="text-green-300 text-sm font-medium">{task.text}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span>Completed: {new Date(task.completedAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy size={48} className="mx-auto text-gray-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-400 mb-2">No Completed Tasks Yet</h3>
                <p className="text-gray-500 text-sm">Complete some tasks to see them here!</p>
              </div>
            )}
          </div>
        )}

        {/* Progress Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center mt-6">
          <div className="bg-[#1f2937] p-3 sm:p-4 rounded-lg border border-gray-700">
            <p className="text-xl sm:text-2xl font-bold text-green-400">{totalTasks}</p>
            <p className="text-gray-400 text-xs sm:text-sm">Pending Tasks</p>
          </div>
          <div className="bg-[#1f2937] p-3 sm:p-4 rounded-lg border border-gray-700">
            <p className="text-xl sm:text-2xl font-bold text-blue-400">{focusAreasCount}</p>
            <p className="text-gray-400 text-xs sm:text-sm">Focus Areas</p>
          </div>
          <div className="bg-[#1f2937] p-3 sm:p-4 rounded-lg border border-gray-700">
            <p className="text-xl sm:text-2xl font-bold text-purple-400">{totalCompleted}</p>
            <p className="text-gray-400 text-xs sm:text-sm">Completed Tasks</p>
          </div>
        </div>

        {/* Lesson Detail Modal */}
        {selectedLesson && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50">
            <div className="bg-[#1f2937] rounded-xl border border-green-700/50 w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold text-white mb-1 break-words">{selectedLesson.text}</h2>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 flex-wrap">
                      <span>{selectedLesson.day} {selectedLesson.date}</span>
                      <span>•</span>
                      <span>{selectedLesson.duration}</span>
                    </div>
                  </div>
                  <button
                    onClick={closeLessonView}
                    className="p-1 hover:bg-gray-600 rounded-lg transition-colors flex-shrink-0 ml-2"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-4">
                  <span className="bg-green-600/30 text-green-300 text-xs sm:text-sm px-2 py-1 rounded">
                    {selectedLesson.subject}
                  </span>
                </div>

                <div className="mb-4 sm:mb-6">
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                    {selectedLesson.description}
                  </p>
                </div>

                <div className="mb-4 sm:mb-6">
                  <h3 className="text-sm font-semibold text-white mb-3">Study Steps:</h3>
                  <ol className="space-y-2 text-xs sm:text-sm text-gray-300">
                    {selectedLesson.steps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="bg-green-600 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="leading-tight">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={() => {
                      markTaskAsDone(selectedLesson.dayIndex, selectedLesson.taskIndex);
                      closeLessonView();
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <CheckCircle2 size={16} />
                    Mark as Done
                  </button>
                  <button
                    onClick={closeLessonView}
                    className="px-4 py-2 border border-gray-600 hover:bg-gray-600 rounded-lg text-white text-sm transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyPlanList;