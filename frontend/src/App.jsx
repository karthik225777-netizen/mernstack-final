import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api/students";

const initialForm = {
  studentId: "",
  name: "",
  email: "",
  phone: "",
  department: "",
  course: "",
  year: "1",
};

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setStudents(response.data);
      setError("");
    } catch {
      setError("Unable to load students. Check that your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const openEditForm = (student) => {
    setEditingId(student._id);
    setForm({
      studentId: student.studentId,
      name: student.name,
      email: student.email,
      phone: student.phone || "",
      department: student.department,
      course: student.course,
      year: String(student.year),
    });
    setShowForm(true);
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const payload = { ...form, year: Number(form.year) };

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload);
        setSuccess("Student updated successfully!");
      } else {
        await axios.post(API_URL, payload);
        setSuccess("Student added successfully!");
      }

      setForm(initialForm);
      setShowForm(false);
      setEditingId(null);
      await fetchStudents();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save student. Please check your details."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (student) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${student.name}?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await axios.delete(`${API_URL}/${student._id}`);
      setSuccess(`${student.name} was deleted successfully.`);
      await fetchStudents();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete student."
      );
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Student Management System</h1>
          <p>Manage your student records in one place.</p>
        </div>
        <span className="badge">MERN Stack</span>
      </header>

      <main className="container">
        <section className="summary-card">
          <div>
            <p className="summary-label">Total Students</p>
            <h2>{students.length}</h2>
          </div>
          <div className="summary-icon">🎓</div>
        </section>

        <section className="table-card">
          <div className="section-heading">
            <div>
              <h2>Student Records</h2>
              <p>View and manage registered students.</p>
            </div>

            <div className="button-group">
              <button
                className="refresh-btn"
                onClick={fetchStudents}
                type="button"
              >
                Refresh
              </button>

              <button
                className="add-btn"
                onClick={openAddForm}
                type="button"
              >
                + Add Student
              </button>
            </div>
          </div>

          {success && <p className="success">{success}</p>}
          {error && <p className="error">{error}</p>}

          {showForm && (
            <form className="student-form" onSubmit={handleSubmit}>
              <h3>{editingId ? "Edit Student" : "Add New Student"}</h3>

              <div className="form-grid">
                <label>
                  Student ID *
                  <input
                    name="studentId"
                    value={form.studentId}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Full Name *
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Email *
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Phone
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Department *
                  <input
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Course *
                  <input
                    name="course"
                    value={form.course}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Year *
                  <select
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    required
                  >
                    {[1, 2, 3, 4, 5, 6].map((year) => (
                      <option key={year} value={year}>
                        Year {year}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="form-actions">
                <button
                  className="submit-btn"
                  type="submit"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Student"
                    : "Save Student"}
                </button>

                <button
                  className="cancel-btn"
                  type="button"
                  onClick={closeForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {loading ? (
            <p className="message">Loading students...</p>
          ) : students.length === 0 ? (
            <p className="message">No students found. Add your first student!</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Department</th>
                    <th>Course</th>
                    <th>Year</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td>{student.studentId}</td>
                      <td className="student-name">{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.phone || "—"}</td>
                      <td>{student.department}</td>
                      <td>{student.course}</td>
                      <td>
                        <span className="year-badge">{student.year}</span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="edit-btn"
                            type="button"
                            onClick={() => openEditForm(student)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            type="button"
                            onClick={() => handleDelete(student)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <footer>Student Management System · MERN Stack Capstone Project</footer>
    </div>
  );
}

export default App;