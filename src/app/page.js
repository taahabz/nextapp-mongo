"use client";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", age: "", dept: "", gpa: "" });
  const [counts, setCounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStudents = async (query = "") => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/students${query}`);
      const data = await res.json();
      setStudents(data.students || []);
      setCounts(data.counts || []);
    } catch (e) {
      setError("Failed to fetch students");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    setLoading(true);
    await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", age: "", dept: "", gpa: "" });
    fetchStudents();
  };

  const handleRemove = async (id) => {
    setLoading(true);
    await fetch("/api/students", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchStudents();
  };

  const queries = [
    { label: "All CS Students", query: "?dept=CS" },
    { label: "Age > 25", query: "?ageGt=25" },
    { label: "CGPA ≥ 2.7", query: "?gpaGte=2.7" },
    { label: "Math or Physics Dept", query: "?depts=Math,Physics" },
    { label: "Name starts with 'A'", query: "?nameStartsWith=A" },
    { label: "Count by Dept", query: "?countByDept=1" },
    { label: "Sort by CGPA Desc", query: "?sortByGpaDesc=1" },
    { label: "Show All", query: "" },
  ];

  return (
    <main className="h-screen bg-gradient-to-br from-gray-900 to-indigo-950 p-4 overflow-hidden text-gray-100 flex flex-col">
      <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2 flex items-center">
        <span className="mr-2">⚡</span>
        Student Management
        <span className="ml-2">⚡</span>
      </h1>

      <div className="flex flex-1 gap-4 overflow-hidden min-h-0">
        {/* Left Sidebar */}
        <div className="w-1/4 flex flex-col gap-3 overflow-y-auto">
          {/* Add Student Form */}
          <div className="bg-gray-900/70 p-4 rounded-lg border border-cyan-500/30 backdrop-blur-sm shadow-lg shadow-cyan-500/20 flex-shrink-0">
            <h2 className="text-lg font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 flex items-center">
              <span className="mr-2">+</span>
              Add Student
            </h2>
            <div className="flex flex-col gap-2">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                className="input-style"
              />
              <input
                name="age"
                value={form.age}
                onChange={handleChange}
                placeholder="Age"
                type="number"
                className="input-style"
              />
              <input
                name="dept"
                value={form.dept}
                onChange={handleChange}
                placeholder="Dept"
                className="input-style"
              />
              <input
                name="gpa"
                value={form.gpa}
                onChange={handleChange}
                placeholder="GPA"
                type="number"
                step="0.01"
                className="input-style"
              />
              <button
                onClick={handleAdd}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-3 py-1 rounded font-medium shadow-md shadow-cyan-500/30 transition text-sm transform hover:scale-105 duration-200"
              >
                Add Student
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gray-900/70 p-4 rounded-lg shadow-lg border border-purple-500/30 backdrop-blur-sm shadow-purple-500/20 flex-1 overflow-y-auto">
            <h2 className="text-lg font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 flex items-center">
              <span className="mr-2">🔍</span>
              Filters
            </h2>
            <div className="flex flex-col gap-2">
              {queries.map((q) => (
                <button
                  key={q.label}
                  className="px-3 py-1 bg-gray-800 border border-indigo-500/30 text-gray-200 text-xs font-medium rounded shadow-md shadow-indigo-500/20 hover:bg-indigo-900/50 transition focus:outline-none focus:ring-1 focus:ring-indigo-400 transform hover:translate-x-1 duration-200"
                  onClick={() => fetchStudents(q.query)}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-3/4 flex flex-col gap-3 overflow-hidden min-h-0">
          <div className="h-6">
            {error && <div className="text-red-400 text-sm font-medium">{error}</div>}
            {loading && <div className="text-cyan-400 text-sm animate-pulse">Loading...</div>}
          </div>

          {counts.length > 0 && (
            <div className="bg-gray-900/70 p-3 rounded-lg shadow-lg border border-blue-500/30 backdrop-blur-sm shadow-blue-500/20">
              <h2 className="font-bold mb-1 text-sm text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center">
                <span className="mr-2">📊</span>
                Student Count by Department
              </h2>
              <div className="flex flex-wrap gap-2">
                {counts.map((c) => (
                  <div key={c._id} className="bg-gray-800/80 px-2 py-1 rounded text-gray-200 font-medium text-xs shadow-sm border border-blue-500/20 flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-1"></span>
                    <span className="font-bold">{c._id || 'Unknown'}:</span> {c.count}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scrollable Table Section */}
          <div className="flex-1 overflow-y-auto bg-gray-900/70 rounded-lg shadow-lg border border-indigo-500/30 backdrop-blur-sm shadow-indigo-500/20">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-indigo-900/50 text-gray-100 border-b border-indigo-500/30">
                  <th className="py-2 px-3 text-left">Name</th>
                  <th className="py-2 px-3 text-left">Age</th>
                  <th className="py-2 px-3 text-left">Dept</th>
                  <th className="py-2 px-3 text-left">GPA</th>
                  <th className="py-2 px-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id} className="border-b border-gray-700/50 hover:bg-indigo-900/20 text-gray-300 transition duration-150">
                    <td className="py-2 px-3 font-medium text-cyan-300">{student.name}</td>
                    <td className="py-2 px-3">{student.age}</td>
                    <td className="py-2 px-3">{student.dept}</td>
                    <td className="py-2 px-3">{student.gpa}</td>
                    <td className="py-2 px-3">
                      <button
                        className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-2 py-1 rounded text-xs font-medium shadow-md shadow-red-500/30 transform hover:scale-105 transition duration-200"
                        onClick={() => handleRemove(student._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500 text-sm">No students found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Input style reused */}
      <style jsx>{`
        .input-style {
          background: rgba(31, 41, 55, 0.8);
          color: #e5e7eb;
          border-radius: 0.375rem;
          padding: 0.25rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input-style::placeholder {
          color: #6b7280;
        }
        .input-style:focus {
          box-shadow: 0 0 0 1px #22d3ee;
        }
      `}</style>
    </main>
  );
}
