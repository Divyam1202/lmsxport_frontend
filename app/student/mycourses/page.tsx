"use client";

import { useState, useEffect } from "react";
import axios from "axios"; // Use Axios for HTTP requests

type Course = {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  capacity: number;
  progress: number; // Progress percentage (0-100)
};

const EnrolledCoursesPage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeCourses, setActiveCourses] = useState<Map<string, boolean>>(new Map()); // Track active state for each course

  const token = localStorage.getItem("token"); // Fetch token from localStorage or context

  // Fetch enrolled courses when the component mounts
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/student/mycourses`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Ensure token is valid
            },
          }
        );

        console.log("API Response:", response.data); // Debugging log to check response

        if (response.data.success) {
          const updatedCourses = response.data.courses.map((course: Course) => ({
            ...course,
            progress: course.progress || 0, // Default progress to 0 if not provided
          }));
          setEnrolledCourses(updatedCourses);
        } else {
          setError(response.data.message || "Error fetching enrolled courses");
        }
      } catch (error) {
        setError("Something went wrong while fetching enrolled courses");
      } finally {
        setIsLoading(false); // Set loading to false once the request is complete
      }
    };

    if (token) {
      fetchEnrolledCourses();
    } else {
      setError("Token not found in localStorage.");
      setIsLoading(false);
    }
  }, [token]);

  const handlePlayCourse = (courseId: string) => {
    setActiveCourses((prevState) => {
      const updatedState = new Map(prevState);
      const currentState = updatedState.get(courseId) || false;

      // Toggle play/pause state for the clicked course
      updatedState.set(courseId, !currentState);
      return updatedState;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Your Enrolled Courses
        </h1>

        {error && <div className="bg-red-100 text-red-800 p-4 rounded mb-6">{error}</div>}

        {isLoading ? (
          <div>Loading your courses...</div>
        ) : enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrolledCourses.map((course) => {
              const isCourseActive = activeCourses.get(course.id) || false; // Get active state for each course
              return (
                <div
                  key={course.id}
                  className="p-4 border rounded-lg shadow-lg bg-white dark:bg-gray-800"
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{course.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{course.description}</p>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Progress: {course.progress}%
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Play Course Button */}
                  <button
                    onClick={() => handlePlayCourse(course.id)}
                    className={`mt-4 px-4 py-2 ${isCourseActive ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"} text-white font-semibold rounded-lg transition`}
                  >
                    {isCourseActive ? "Pause Course" : "Play Course"}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-gray-500 dark:text-gray-400 text-center">
            You are not enrolled in any courses.
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrolledCoursesPage;
