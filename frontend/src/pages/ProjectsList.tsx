import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuthStore } from "../store";
import { Plus, Users, LayoutList } from "lucide-react";

export default function ProjectsList() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuthStore();

  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [users, setUsers] = useState<any[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get("/projects");
      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    if (user?.role === "Admin") {
      api.get("/users").then(res => setUsers(res.data)).catch(console.error);
    }
  }, [user]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/projects", { ...newProject, memberIds: selectedMembers });
      setIsModalOpen(false);
      setNewProject({ name: "", description: "" });
      setSelectedMembers([]);
      fetchProjects();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleMember = (id: string) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(selectedMembers.filter(m => m !== id));
    } else {
      setSelectedMembers([...selectedMembers, id]);
    }
  };

  if (loading) return <div>Loading projects...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Projects</h1>
        {user?.role === "Admin" && (
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            <Plus size={18} />
            New Project
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ display: "inline-flex", padding: "16px", borderRadius: "50%", background: "var(--bg-surface-hover)", color: "var(--text-muted)", marginBottom: "20px" }}>
            <LayoutList size={40} />
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>No Projects Yet</h2>
          <p style={{ color: "var(--text-muted)", maxWidth: "400px", margin: "0 auto" }}>
            You haven't been assigned to any projects yet. {user?.role === "Admin" && "Create a new project to get started."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3">
          {projects.map(project => (
            <Link to={`/projects/${project.id}`} key={project.id} style={{ textDecoration: "none" }}>
              <div className="card glass" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "var(--text-main)", marginBottom: "8px" }}>{project.name}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "14px", flex: 1, marginBottom: "20px" }}>
                  {project.description || "No description provided."}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-color)", paddingTop: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "13px" }}>
                    <Users size={16} />
                    {project.members?.length || 0} Members
                  </div>
                  <span style={{ fontSize: "13px", color: "var(--primary)", fontWeight: "500" }}>View Details &rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create New Project</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleCreateProject}>
              <div className="input-group">
                <label>Project Name</label>
                <input required className="input" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} placeholder="E.g., Website Redesign" />
              </div>
              <div className="input-group">
                <label>Description (Optional)</label>
                <textarea className="textarea" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} placeholder="What is this project about?" rows={3} />
              </div>
              
              <div className="input-group" style={{ marginTop: "20px" }}>
                <label>Assign Members</label>
                <div style={{ maxHeight: "150px", overflowY: "auto", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "8px" }}>
                  {users.map(u => (
                    <div key={u.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px", borderBottom: "1px solid var(--border-color)" }}>
                      <input type="checkbox" id={`user-${u.id}`} checked={selectedMembers.includes(u.id)} onChange={() => toggleMember(u.id)} />
                      <label htmlFor={`user-${u.id}`} style={{ flex: 1, cursor: "pointer", color: "var(--text-main)", fontSize: "14px" }}>
                        {u.name} <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>({u.email})</span>
                      </label>
                    </div>
                  ))}
                  {users.length === 0 && <div style={{ padding: "8px", color: "var(--text-muted)", fontSize: "13px" }}>No users available</div>}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
