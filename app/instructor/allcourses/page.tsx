// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// interface Student {
//   _id: string;
//   name: string;
//   email: string;
// }

// interface Module {
//   title: string;
//   resourceLink: string;
// }

// interface Course {
//   _id: string;
//   title: string;
//   description: string;
//   courseCode: string;
//   capacity: number;
//   students: Student[];
//   modules: Module[];
// }

// const TeacherCourses = () => {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const token = localStorage.getItem("token"); // Assuming token is stored here
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/allinstructorcourses`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         setCourses(response.data.courses);
//         setError(null);
//       } catch (err: unknown) {
//         if (axios.isAxiosError(err) && err.response) {
//           setError(err.response.data.message || "Failed to fetch courses.");
//         } else {
//           setError("An unexpected error occurred.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div className="error-message">{error}</div>;
//   }

//   return (
//     <div className="teacher-courses-container">
//       <h2>My Published Courses</h2>
//       {courses.length === 0 ? (
//         <div>No courses found.</div>
//       ) : (
//         <div className="courses-list">
//           {courses.map((course) => (
//             <div
//               key={course._id}
//               className="course-card p-4 bg-gray-100 rounded-md shadow-lg hover:bg-purple-200 transition duration-300"
//             >
//               <h3>{course.title}</h3>
//               <p><strong>Description:</strong> {course.description}</p>
//               <p><strong>Course Code:</strong> {course.courseCode}</p>
//               <p><strong>Capacity:</strong> {course.capacity}</p>
//               <h4>Enrolled Students ({course.students.length}):</h4>
//               {course.students.length > 0 ? (
//                 <ul>
//                   {course.students.map((student) => (
//                     <li key={student._id}>
//                       {student.name} ({student.email})
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p>No students enrolled yet.</p>
//               )}
//               <h4>Modules:</h4>
//               {course.modules.length > 0 ? (
//                 <div className="modules-list">
//                   {course.modules.map((module, index) => (
//                     <div
//                       key={index}
//                       className="module-card p-4 bg-gray-200 rounded-md shadow-md hover:bg-purple-200 transition-colors duration-300"
//                     >
//                       <h5 className="font-medium">{module.title}</h5>
//                       {module.resourceLink && module.resourceLink.includes("youtube.com") ? (
//                         <div className="video-container mt-2">
//                           <iframe
//                             width="100%"
//                             height="315"
//                             src={module.resourceLink.replace("watch?v=", "embed/")}
//                             title={`YouTube video for ${module.title}`}
//                             frameBorder="0"
//                             allowFullScreen
//                           ></iframe>
//                         </div>
//                       ) : (
//                         <p>No video available for this module.</p>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p>No modules available.</p>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TeacherCourses;
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface Student {
  _id: string;
  name: string;
  email: string;
}

interface Module {
  title: string;
  resourceLink: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  courseCode: string;
  capacity: number;
  students: Student[];
  modules: Module[];
}

const TeacherCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseCode: "",
    capacity: 0,
  });
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/courses/allinstructorcourses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCourses(response.data.courses);
        setError(null);
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data.message || "Failed to fetch courses.");
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEditClick = (course: Course) => {
    setSelectedCourse(course); // Set the course to edit
    setFormData({
      title: course.title,
      description: course.description,
      courseCode: course.courseCode,
      capacity: course.capacity,
    });
    setModules(course.modules); // Set the course modules to edit
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleModuleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: "title" | "resourceLink"
  ) => {
    const updatedModules = [...modules];
    updatedModules[index][field] = e.target.value;
    setModules(updatedModules);
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    try {
      const updatedCourse = {
        ...selectedCourse,
        ...formData,
        modules, // Include the updated modules
      };

      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${updatedCourse._id}`,
        updatedCourse,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the courses state with the updated course
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course._id === updatedCourse._id ? updatedCourse : course
        )
      );
      setSelectedCourse(null); // Close the edit form
    } catch (err) {
      setError("Failed to update course.");
    }
  };

  const handleCloseEdit = () => {
    setSelectedCourse(null); // Close the edit form without saving
  };

  const handleAddModule = () => {
    setModules([...modules, { title: "", resourceLink: "" }]);
  };

  const handleRemoveModule = (index: number) => {
    const updatedModules = modules.filter((_, i) => i !== index);
    setModules(updatedModules);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="teacher-courses-container">
      <h2>My Published Courses</h2>
      {courses.length === 0 ? (
        <div>No courses found.</div>
      ) : (
        <div className="courses-list">
          {courses.map((course) => (
            <div
              key={course._id}
              className="course-card p-4 bg-gray-100 rounded-md shadow-lg hover:bg-purple-200 transition duration-300"
            >
              <h3>{course.title}</h3>
              <p>
                <strong>Description:</strong> {course.description}
              </p>
              <p>
                <strong>Course Code:</strong> {course.courseCode}
              </p>
              <p>
                <strong>Capacity:</strong> {course.capacity}
              </p>
              <h4>Enrolled Students ({course.students.length}):</h4>
              {course.students.length > 0 ? (
                <ul>
                  {course.students.map((student) => (
                    <li key={student._id}>
                      {student.name} ({student.email})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No students enrolled yet.</p>
              )}
              <h4>Modules:</h4>
              {course.modules.length > 0 ? (
                <div className="modules-list">
                  {course.modules.map((module, index) => (
                    <div
                      key={index}
                      className="module-card p-4 bg-gray-200 rounded-md shadow-md hover:bg-purple-200 transition-colors duration-300"
                    >
                      <h5 className="font-medium">{module.title}</h5>
                      {module.resourceLink && module.resourceLink.includes("youtube.com") ? (
                        <div className="video-container mt-2">
                          <iframe
                            width="100%"
                            height="315"
                            src={module.resourceLink.replace("watch?v=", "embed/")}
                            title={`YouTube video for ${module.title}`}
                            frameBorder="0"
                            allowFullScreen
                          ></iframe>
                        </div>
                      ) : (
                        <p>No video available for this module.</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No modules available.</p>
              )}

              <button
                className="edit-button bg-blue-500 text-white p-2 rounded-md"
                onClick={() => handleEditClick(course)}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedCourse && (
        <div className="edit-course-form bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Edit Course
          </h2>
          <form onSubmit={handleSaveChanges} className="space-y-4">
            {/* Course details form */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Course Code
              </label>
              <input
                type="text"
                name="courseCode"
                value={formData.courseCode}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Capacity
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Module editing section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Edit Modules</h3>

              {modules.map((module, index) => (
                <div key={index} className="module-form space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Module Title
                    </label>
                    <input
                      type="text"
                      value={module.title}
                      onChange={(e) => handleModuleChange(e, index, "title")}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Resource Link
                    </label>
                    <input
                      type="url"
                      value={module.resourceLink}
                      onChange={(e) => handleModuleChange(e, index, "resourceLink")}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    type="button"
                    className="remove-module bg-red-500 text-white p-2 rounded-md"
                    onClick={() => handleRemoveModule(index)}
                  >
                    Remove Module
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="add-module bg-green-500 text-white p-2 rounded-md"
                onClick={handleAddModule}
              >
                Add New Module
              </button>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                className="cancel-button px-6 py-3 text-sm font-medium rounded-xl bg-gray-500 text-white"
                onClick={handleCloseEdit}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="save-button px-6 py-3 text-sm font-medium rounded-xl bg-blue-500 text-white"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TeacherCourses;
