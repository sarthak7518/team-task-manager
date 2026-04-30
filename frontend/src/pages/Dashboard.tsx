import { useEffect, useState } from "react";
import { api } from "../api";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await api.get("/tasks/my-tasks");
        setTasks(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  const todoTasks = tasks.filter(t => t.status === "TODO");
  const inProgressTasks = tasks.filter(t => t.status === "IN_PROGRESS");
  const doneTasks = tasks.filter(t => t.status === "DONE");
  
  const overdueTasks = tasks.filter(t => {
    if (t.status === "DONE" || !t.dueDate) return false;
    return new Date(t.dueDate) < new Date();
  });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-3" style={{ marginBottom: "40px" }}>
        <div className="card glass" style={{ borderLeft: "4px solid var(--text-muted)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ color: "var(--text-muted)", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}>To Do</h3>
            <Clock size={20} color="var(--text-muted)" />
          </div>
          <div style={{ fontSize: "36px", fontWeight: "700" }}>{todoTasks.length}</div>
        </div>
        
        <div className="card glass" style={{ borderLeft: "4px solid var(--primary)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ color: "var(--primary)", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}>In Progress</h3>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--primary)", boxShadow: "var(--shadow-glow)" }}></div>
          </div>
          <div style={{ fontSize: "36px", fontWeight: "700" }}>{inProgressTasks.length}</div>
        </div>
        
        <div className="card glass" style={{ borderLeft: "4px solid var(--success)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ color: "var(--success)", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}>Completed</h3>
            <CheckCircle2 size={20} color="var(--success)" />
          </div>
          <div style={{ fontSize: "36px", fontWeight: "700" }}>{doneTasks.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="card">
          <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertCircle size={20} color="var(--warning)" />
            Needs Attention (Overdue)
          </h2>
          {overdueTasks.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No overdue tasks. Great job!</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {overdueTasks.map(task => (
                <div key={task.id} style={{ padding: "16px", background: "rgba(245, 158, 11, 0.05)", border: "1px solid rgba(245, 158, 11, 0.2)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <h4 style={{ fontWeight: "600", color: "var(--warning)" }}>{task.title}</h4>
                    <span className="badge badge-todo">{task.status}</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px" }}>Project: {task.project.name}</p>
                  <Link to={`/projects/${task.projectId}`} className="btn btn-secondary" style={{ fontSize: "12px", padding: "6px 12px" }}>Go to Project</Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px" }}>Recent Tasks</h2>
          {tasks.slice(0, 5).length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No tasks assigned to you yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {tasks.slice(0, 5).map(task => (
                <div key={task.id} style={{ padding: "16px", background: "var(--bg-surface-hover)", borderRadius: "var(--radius-md)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h4 style={{ fontWeight: "500", marginBottom: "4px" }}>{task.title}</h4>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{task.project.name}</p>
                  </div>
                  <span className={`badge ${task.status === 'DONE' ? 'badge-done' : task.status === 'IN_PROGRESS' ? 'badge-inprogress' : 'badge-todo'}`}>
                    {task.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
