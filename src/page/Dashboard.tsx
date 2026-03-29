import { useState, useEffect } from 'react'; 
import { useAuth } from '../features/auth/AuthContext'; 
import api from '../api/axios'; 
import Header from '../components/Header'; 
import Sidebar from '../components/Sidebar'; 
import MainContent from '../components/MainContent'; 
import styles from './Dashboard.module.css'; 
  
interface Project { id: string; name: string; color: string; } 
interface Column { id: string; title: string; tasks: string[]; } 
  
interface ProjectFormProps {
  submitLabel: string;
  onSubmit: (name: string, color: string) => void;
  onCancel: () => void;
  initialName?: string;
  initialColor?: string;
}

function ProjectForm({ submitLabel, onSubmit, onCancel, initialName = '', initialColor = '#000000' }: ProjectFormProps) {
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(initialColor);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), color);
      setName('');
      setColor('#000000');
    }
  };

  return (
    <form style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nom du projet"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.9rem' }}
        required
      />
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        style={{ width: '40px', height: '40px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      />
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button type="submit" style={{ padding: '0.5rem 1rem', background: '#1B8C3E', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
          {submitLabel}
        </button>
        <button type="button" onClick={onCancel} style={{ padding: '0.5rem 1rem', background: '#ccc', color: 'black', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
          Annuler
        </button>
      </div>
    </form>
  );
} 
  
export default function Dashboard() { 
  const { state: authState, dispatch } = useAuth(); 
  const [sidebarOpen, setSidebarOpen] = useState(true); 
  const [projects, setProjects] = useState<Project[]>([]); 
  const [columns, setColumns] = useState<Column[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [showForm, setShowForm] = useState(false); 
  const [editingProject, setEditingProject] = useState<Project | null>(null); 
  
  // GET — charger les données au montage 
  useEffect(() => { 
    async function fetchData() { 
      try { 
        const [projRes, colRes] = await Promise.all([ 
          api.get('/projects'), 
          api.get('/columns'), 
        ]); 
        setProjects(projRes.data); 
        setColumns(colRes.data); 
      } catch (e) { console.error(e); } 
      finally { setLoading(false); } 
    } 
    fetchData(); 
  }, []); 
  
  // POST — ajouter un projet 
  async function addProject(name: string, color: string) { 
    const { data } = await api.post('/projects', { name, color }); 
    setProjects(prev => [...prev, data]); 
  } 
  
  // PUT — renommer un projet 
  async function renameProject(id: string, name: string, color: string) {
    await api.put(`/projects/${id}`, { name, color });
    setProjects(prev => prev.map(p => p.id === id ? { ...p, name, color } : p));
  }
  
  // DELETE — supprimer un projet 
  async function deleteProject(id: string) {
    await api.delete(`/projects/${id}`);
    setProjects(prev => prev.filter(p => p.id !== id));
  } 
  
  if (loading) return <div className={styles.loading}>Chargement...</div>; 
  
  return ( 
    <div className={styles.layout}> 
      <Header 
        title="TaskFlow" 
        onMenuClick={() => setSidebarOpen(p => !p)} 
        userName={authState.user?.name} 
        onLogout={() => dispatch({ type: 'LOGOUT' })} 
      /> 
      <div className={styles.body}> 
        <Sidebar projects={projects} isOpen={sidebarOpen} onRename={setEditingProject} onDelete={deleteProject} /> 
        <div className={styles.content}> 
          <div className={styles.toolbar}> 
            {!showForm && !editingProject ? ( 
              <button className={styles.addBtn} 
                onClick={() => setShowForm(true)}> 
                + Nouveau projet 
              </button> 
            ) : showForm ? ( 
              <ProjectForm 
                submitLabel="Créer" 
                onSubmit={(name: string, color: string) => { 
                  addProject(name, color); 
                  setShowForm(false); 
                }} 
                onCancel={() => setShowForm(false)} 
              /> 
            ) : editingProject ? ( 
              <ProjectForm 
                submitLabel="Renommer" 
                onSubmit={(name: string, color: string) => { 
                  renameProject(editingProject.id, name, color); 
                  setEditingProject(null); 
                }} 
                onCancel={() => setEditingProject(null)} 
                initialName={editingProject.name}
                initialColor={editingProject.color}
              /> 
            ) : null} 
          </div> 
          <MainContent columns={columns} /> 
        </div> 
      </div> 
    </div> 
  ); 
} 
 
