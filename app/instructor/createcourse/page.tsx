"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

// Types for state and components
interface Module {
  title: string;
  resourceLink: string;
}

interface CourseDetails {
  title: string;
  description: string;
  courseCode: string;
  capacity: string;
}

interface Message {
  type: "success" | "error";
  text: string;
}

const CreateCourse = () => {
  const [courseDetails, setCourseDetails] = useState<CourseDetails>({
    title: "",
    description: "",
    courseCode: "",
    capacity: "",
  });

  const [modules, setModules] = useState<Module[]>([
    { title: "", resourceLink: "" },
  ]);

  const [message, setMessage] = useState<Message | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourseDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleModuleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedModules = modules.map((module, i) =>
      i === index ? { ...module, [name]: value } : module
    );
    setModules(updatedModules);
  };

  const addModule = () => {
    setModules([...modules, { title: "", resourceLink: "" }]);
  };

  const removeModule = (index: number) => {
    if (modules.length > 1) {
      setModules(modules.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // Assuming you store JWT in localStorage
      const response = await axios.post(
        "http://localhost:5000/api/courses/create",
        { ...courseDetails, modules },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage({ type: "success", text: response.data.message });
      setCourseDetails({ title: "", description: "", courseCode: "", capacity: "" });
      setModules([{ title: "", resourceLink: "" }]);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage({
          type: "error",
          text: error.response.data.message || "An error occurred",
        });
      } else {
        setMessage({
          type: "error",
          text: "An unexpected error occurred",
        });
      }
    }
  };

  return (
    <div className="create-course-container">
      <h2>Create a New Course</h2>
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="create-course-form">
        <div className="form-group">
          <label>Course Title</label>
          <input
            type="text"
            name="title"
            value={courseDetails.title}
            onChange={handleInputChange}
            required
            placeholder="Enter course title"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={courseDetails.description}
            onChange={handleInputChange}
            required
            placeholder="Enter course description"
          ></textarea>
        </div>

        <div className="form-group">
          <label>Course Code</label>
          <input
            type="text"
            name="courseCode"
            value={courseDetails.courseCode}
            onChange={handleInputChange}
            required
            placeholder="Enter course code"
          />
        </div>

        <div className="form-group">
          <label>Capacity</label>
          <input
            type="number"
            name="capacity"
            value={courseDetails.capacity}
            onChange={handleInputChange}
            required
            placeholder="Enter course capacity"
          />
        </div>

        <h3>Modules</h3>
        {modules.map((module, index) => (
          <div key={index} className="module-group">
            <div className="form-group">
              <label>Module Title</label>
              <input
                type="text"
                name="title"
                value={module.title}
                onChange={(e) => handleModuleChange(index, e)}
                required
                placeholder="Enter module title"
              />
            </div>
            <div className="form-group">
              <label>Resource Link</label>
              <input
                type="url"
                name="resourceLink"
                value={module.resourceLink}
                onChange={(e) => handleModuleChange(index, e)}
                required
                placeholder="Enter resource link (YouTube URL)"
              />
            </div>
            <button
              type="button"
              className="remove-module-btn"
              onClick={() => removeModule(index)}
              disabled={modules.length === 1}
            >
              Remove Module
            </button>
          </div>
        ))}
        <button
          type="button"
          className="add-module-btn"
          onClick={addModule}
        >
          Add Module
        </button>

        <button type="submit" className="submit-btn">
          Create Course
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
