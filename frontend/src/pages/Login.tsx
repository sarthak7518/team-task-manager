import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import { api } from "../api";
import { LogIn } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setUser(data.user);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="auth-layout">
      <div className="card glass auth-card">
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ display: "inline-flex", padding: "12px", borderRadius: "50%", background: "rgba(99, 102, 241, 0.1)", color: "var(--primary)", marginBottom: "16px" }}>
            <LogIn size={32} />
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "700" }}>Welcome Back</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "8px" }}>Enter your credentials to access your account</p>
        </div>

        {error && <div style={{ padding: "12px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "var(--radius-md)", color: "var(--danger)", marginBottom: "16px", fontSize: "14px" }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" required className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "16px", padding: "12px" }}>Sign In</button>
        </form>

        <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--text-muted)" }}>
          Don't have an account? <Link to="/signup" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: "500" }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
