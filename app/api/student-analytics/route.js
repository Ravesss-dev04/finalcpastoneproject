// /api/student-analytics/route.js
export async function GET(req) {
  try {
    // Fake student progress data
    const analyticsData = {
      subjectMastery: [
        { title: 'Python Basics', percent: 40 },
        { title: 'HTML/CSS - Web development', percent: 80 },
        { title: 'Objective Oriented Programming - Variable', percent: 50 },
        { title: 'Java Development', percent: 30 },
        { title: 'Data Structure', percent: 45 },
      ],
      weakAreas: ['Python Basics', 'Java Development', 'Data Structure'],
      studyPattern: 'irregular',
      recommendedFocus: ['Python Functions', 'CSS Flexbox', 'Java Loops'],
      dailyStudyTime: [
        { day: 'Mon', hours: 2 },
        { day: 'Tue', hours: 1 },
        { day: 'Wed', hours: 1.5 },
        { day: 'Thu', hours: 1 },
        { day: 'Fri', hours: 3 },
        { day: 'Sat', hours: 0.5 },
        { day: 'Sun', hours: 0.25 },
      ],
    };

    return new Response(JSON.stringify(analyticsData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch analytics' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
