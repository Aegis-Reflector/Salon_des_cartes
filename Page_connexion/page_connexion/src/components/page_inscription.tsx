import { useState } from "react";
import { useNavigate } from "react-router";

export default function PageInscription() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    description: "",
    location: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const changedHtmlElement = e.target;
    setFormData({
      ...formData, // Makes a full copy of the current formData
      // Updates only the element that was changed
      [changedHtmlElement.name]: changedHtmlElement.value,
    });
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    fetch("http://localhost:4000/events/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to create event");
        }
        navigate("/events");
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="container mt-5">
      <h2>Create Event</h2>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Start Date</label>
          <input
            type="datetime-local"
            className="form-control"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">End Date</label>
          <input
            type="datetime-local"
            className="form-control"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Location</label>
          <input
            type="text"
            className="form-control"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Create Event
        </button>
      </form>
    </div>
  );
}
