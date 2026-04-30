import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";
import { useAuthStore } from "../store";
import { ArrowLeft, Plus, Calendar, User as UserIcon } from "lucide-react";

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", status: "TODO", dueDate: "", assignedToId: "" });

  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/tasks/project/${id}`, newTask);
      setIsTaskModalOpen(false);
      setNewTask({ title: "", description: "", status: "TODO", dueDate: "", assignedToId: "" });
      fetchProject();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchProject();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Loading project details...</div>;
  if (!project) return <div>Project not found</div>;

  const canEdit = user?.role === "Admin" || project.members.some((m: any) => m.id === user?.id);

  const renderTaskColumn = (status: string, title: string) => {
    const tasks = project.tasks.filter((t: any) => t.status === status);
    
    return (
      <div style={{ background: "var(--bg-surface)", borderRadius: "var(--radius-lg)", padding: "20px", display: "flex", flexDirection: "column", gap: "16px", minHeight: "500px", border: "1px solid var(--border-color)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "600", color: status === 'TODO' ? 'var(--text-main)' : status === 'IN_PROGRESS' ? 'var(--primary)' : 'var(--success)' }}>
            {title}
          </h3>
          <span style={{ background: "rgba(0,0,0,0.3)", padding: "2px 8px", borderRadius: "var(--radius-full)", fontSize: "12px", color: "var(--text-muted)" }}>
            {tasks.length}
          </span>
        </div>
        
        {tasks.map((task: any) => (
          <div key={task.id} className="card glass" style={{ padding: "16px", cursor: "pointer", transition: "transform 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
            <h4 style={{ fontWeight: "600", fontSize: "15px", marginBottom: "8px" }}>{task.title}</h4>
            {task.description && <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{task.description}</p>}
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "12px", marginTop: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "var(--text-muted)" }}>
                <UserIcon size={14} />
                {task.assignedTo ? task.assignedTo.name : "Unassigned"}
              </div>
              {task.dueDate && (
                <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: new Date(task.dueDate) < new Date() && task.status !== "DONE" ? "var(--danger)" : "var(--text-muted)" }}>
                  <Calendar size={14} />
                  {new Date(task.dueDate).toLocaleDateString()}
                </div>
              )}
            </div>

            {canEdit && (
              <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                {status !== "TODO" && <button onClick={() => handleUpdateStatus(task.id, "TODO")} className="btn btn-secondary" style={{ flex: 1, padding: "4px", fontSize: "11px" }}>To Do</button>}
                {status !== "IN_PROGRESS" && <button onClick={() => handleUpdateStatus(task.id, "IN_PROGRESS")} className="btn btn-secondary" style={{ flex: 1, padding: "4px", fontSize: "11px", color: "var(--primary)" }}>In Progress</button>}
                {status !== "DONE" && <button onClick={() => handleUpdateStatus(task.id, "DONE")} className="btn btn-secondary" style={{ flex: 1, padding: "4px", fontSize: "11px", color: "var(--success)" }}>Done</button>}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="page-header" style={{ marginBottom: "20px" }}>
        <div>
          <Link to="/projects" style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", textDecoration: "none", fontSize: "14px", marginBottom: "12px", fontWeight: "500" }}>
            <ArrowLeft size={16} /> Back to Projects
          </Link>
          <h1 className="page-title">{project.name}</h1>
          <p style={{ color: "var(--text-muted)", marginTop: "8px", maxWidth: "600px" }}>{project.description}</p>
        </div>
        {canEdit && (
          <button onClick={() => setIsTaskModalOpen(true)} className="btn btn-primary">
            <Plus size={18} />
            Add Task
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "32px", flexWrap: "wrap" }}>
        {project.members.map((m: any) => (
          <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px", background: "rgba(255,255,255,0.05)", borderRadius: "var(--radius-full)", fontSize: "13px", border: "1px solid var(--border-color)" }}>
            <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "white", fontWeight: "bold" }}>
              {m.name.charAt(0).toUpperCase()}
            </div>
            {m.name}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3">
        {renderTaskColumn("TODO", "To Do")}
        {renderTaskColumn("IN_PROGRESS", "In Progress")}
        {renderTaskColumn("DONE", "Done")}
      </div>

      {isTaskModalOpen && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsTaskModalOpen(false); }}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Task</h2>
              <button className="modal-close" onClick={() => setIsTaskModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleCreateTask}>
              <div className="input-group">
                <label>Task Title</label>
                <input required className="input" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="E.g., Design Homepage" />
              </div>
              <div className="input-group">
                <label>Description (Optional)</label>
                <textarea className="textarea" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} placeholder="Task details..." rows={3} />
              </div>
              
              <div className="grid grid-cols-2" style={{ gap: "16px" }}>
                <div className="input-group">
                  <label>Status</label>
                  <select className="select" value={newTask.status} onChange={e => setNewTask({...newTask, status: e.target.value})}>
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Due Date</label>
                  <input type="date" className="input" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
                </div>
              </div>

              <div className="input-group">
                <label>Assign To</label>
                <select className="select" value={newTask.assignedToId} onChange={e => setNewTask({...newTask, assignedToId: e.target.value})}>
                  <option value="">Unassigned</option>
                  {project.members.map((m: any) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsTaskModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
