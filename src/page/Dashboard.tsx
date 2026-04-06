import { useState, useCallback, memo } from 'react'; 
import { useSelector, useDispatch } from 'react-redux'; 
import { logout } from '../features/auth/authSlice'; 
import type { RootState, AppDispatch } from '../store'; 
import useProjects from '../hooks/useProjects'; 
import Header from '../components/Header'; 
import Sidebar from '../components/Sidebar'; 
import MainContent from '../components/MainContent'; 
import styles from './Dashboard.module.css';

const MemoizedSidebar = memo(Sidebar); 
  
interface Project { id: string; name: string; color: string; } 
  
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
  const dispatch = useDispatch<AppDispatch>(); 
  const authState = useSelector((state: RootState) => state.auth); 
  const { projects, columns, loading, error, addProject, renameProject, deleteProject } = useProjects(); 
  const [sidebarOpen, setSidebarOpen] = useState(true); 
  const [showForm, setShowForm] = useState(false); 
  const [editingProject, setEditingProject] = useState<Project | null>(null); 
  
  // Créer handleRename avant la vérification du loading
  const handleRename = useCallback((project: Project) => {
    setEditingProject(project);
  }, []);
  
  // GET — charger les données au montage (dans le hook useProjects)
  
  // POST — ajouter un projet (dans le hook useProjects)
  
  if (loading) return <div className={styles.loading}>Chargement...</div>; 
  
  return ( 
    <div className={styles.layout}> 
      <Header 
        title="TaskFlow" 
        onMenuClick={() => setSidebarOpen(p => !p)} 
        userName={authState.user?.name} 
        onLogout={() => dispatch(logout())} 
      /> 
      <div className={styles.body}> 
        <MemoizedSidebar projects={projects} isOpen={sidebarOpen} onRename={handleRename} onDelete={deleteProject} /> 
        <div className={styles.content}> 
          {error && <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '4px', marginBottom: '12px' }}>{error}</div>}
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
                  renameProject(editingProject, name, color); 
                  setEditingProject(null); 
                }} 
                onCancel={() => setEditingProject(null)} 
                initialName={editingProject.name}
                initialColor={editingProject.color}
              /> 
            ) : null} 
          </div> 
          
          {/* TEST XSS - Partie 1.1 : Protection JSX normale */}
          {(() => {
            const dangerousName = '<img src=x onerror=alert("HACK")>';
            return (
              <div style={{ padding: '20px', border: '2px solid red', margin: '20px 0', backgroundColor: '#ffebee' }}>
                <h3 style={{ color: 'red', marginBottom: '10px' }}>🛡️ TEST XSS - Protection JSX normale</h3>
                <p><strong>Code dangereux :</strong> {dangerousName}</p>
                <p><strong>Rendu JSX normal :</strong> <span style={{ backgroundColor: '#f5f5f5', padding: '5px', borderRadius: '4px' }}>{dangerousName}</span></p>
                <p style={{ fontSize: '12px', color: '#666' }}>Le HTML est affiché comme du texte brut, pas exécuté.</p>
              </div>
            );
          })()}
          
          {/* TEST XSS - Partie 1.2 : Danger dangerouslySetInnerHTML */}
          {(() => {
            const dangerousName = '<img src=x onerror=alert("HACK")>';
            return (
              <div style={{ padding: '20px', border: '2px solid red', margin: '20px 0', backgroundColor: '#ffebee' }}>
                <h3 style={{ color: 'red', marginBottom: '10px' }}>⚠️ TEST XSS - DANGER dangerouslySetInnerHTML</h3>
                <p><strong>Code dangereux :</strong> {dangerousName}</p>
                <p><strong>Rendu avec dangerouslySetInnerHTML :</strong></p>
                <div dangerouslySetInnerHTML={{ __html: dangerousName }} 
                     style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <p style={{ fontSize: '12px', color: '#d32f2f', fontWeight: 'bold' }}>
                  ❌ ATTENTION : Le script s'exécute ! JAMAIS utiliser avec des données utilisateur !
                </p>
              </div>
            );
          })()}
          
          <MainContent columns={columns} />
        </div>
      </div>
    </div> 
  );}