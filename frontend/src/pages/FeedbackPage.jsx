import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function FeedbackPage() {
  const { grievanceId } = useParams();
  const [searchParams] = useSearchParams();
  const [rating, setRating] = useState(Number(searchParams.get("rating")) || 0);
  const [hover, setHover]   = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!rating) { setError("Please select a rating."); return; }
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API}/grievances/${grievanceId}/feedback`, {
        rating,
        comment: comment || null,
      });
      setSubmitted(true);
    } catch (e) {
      setError(e.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
        <h2 style={{ color: "#27ae60", marginBottom: 8 }}>Thank you for your feedback!</h2>
        <p style={{ color: "#666" }}>Your response has been recorded.</p>
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={{ color: "#fff", margin: 0 }}>Consent Management</h2>
          <p style={{ color: "#aaa", margin: "4px 0 0" }}>Resolution Feedback</p>
        </div>
        <div style={styles.body}>
          <h3 style={{ color: "#1a1a2e", marginBottom: 4 }}>How satisfied were you with the resolution?</h3>
          <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>
            Your feedback helps us improve and is required for DPDP compliance.
          </p>

          {/* Star rating */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 24 }}>
            {[1, 2, 3, 4, 5].map(i => (
              <button
                key={i}
                onClick={() => setRating(i)}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(0)}
                style={{
                  ...styles.star,
                  background: i <= (hover || rating) ? "#f1c40f" : "#eee",
                  color:      i <= (hover || rating) ? "#333"    : "#999",
                }}
              >
                ★
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p style={{ textAlign: "center", color: "#666", fontSize: 13, marginBottom: 16 }}>
              {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
            </p>
          )}

          {/* Comment */}
          <textarea
            placeholder="Optional: share any additional comments..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={4}
            style={styles.textarea}
          />

          {error && <p style={{ color: "#e74c3c", fontSize: 13, marginBottom: 12 }}>{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Submitting…" : "Submit Feedback"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page:     { minHeight: "100vh", background: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 },
  card:     { width: "100%", maxWidth: 480, borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.1)" },
  header:   { background: "#1a1a2e", padding: "20px 24px" },
  body:     { background: "#fff", padding: "28px 24px" },
  star:     { width: 52, height: 52, fontSize: 28, border: "none", borderRadius: 8, cursor: "pointer", transition: "background 0.15s" },
  textarea: { width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, resize: "vertical", boxSizing: "border-box", marginBottom: 16 },
  btn:      { width: "100%", padding: "12px 0", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer" },
};