"use client";

export default function QuizzesTab ({quizzes}) {
    return(
        <div className="space-y-4">
            {quizzes.map((quiz, index) => (
                <div key={index} className="p-4 bg-gray-800 rounded-lg flex justify-between items-center">
                    <span>{quiz.title}</span>
                    <span className="text-sm text-yellow-400">{quiz.status || "Not Taken"}</span>
                </div>
            ))}
        </div>
    )
}