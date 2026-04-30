import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import { api } from "../api";
import { LayoutDashboard, FolderKanban, LogOut, User } from "lucide-react";

export default function DashboardLayout() {
  const { user, setUser } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px", padding: "0 12px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, var(--primary), var(--secondary))", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold" }}>
            T
          </div>
          <span style={{ fontSize: "18px", fontWeight: "700", letterSpacing: "-0.5px" }}>TaskMaster</span>
        </div>

        <nav style={{ flex: 1 }}>
          <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link to="/projects" className={`nav-link ${location.pathname.startsWith("/projects") ? "active" : ""}`}>
            <FolderKanban size={20} />
            Projects
          </Link>
        </nav>

        <div style={{ marginTop: "auto", borderTop: "1px solid var(--border-color)", paddingTop: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", marginBottom: "12px", background: "rgba(0,0,0,0.2)", borderRadius: "var(--radius-md)" }}>
            <div style={{ background: "var(--bg-surface-hover)", padding: "8px", borderRadius: "50%" }}>
              <User size={20} />
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ fontSize: "14px", fontWeight: "600", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{user?.name}</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                {user?.role}
                <span className={`badge ${user?.role === "Admin" ? "badge-admin" : "badge-member"}`} style={{ fontSize: "10px", padding: "2px 6px" }}>{user?.role}</span>
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ width: "100%", justifyContent: "flex-start", color: "var(--danger)", borderColor: "transparent", background: "transparent" }}>
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>
      
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
