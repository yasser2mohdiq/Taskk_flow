import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
interface Project { id: string; name: string; color: string; }
interface SidebarProps { 
  projects: Project[]; 
  isOpen: boolean; 
  onRename?: (project: Project) => void;
  onDelete?: (id: string) => void;
}
export default function Sidebar({ projects, isOpen, onRename, onDelete }: SidebarProps) {
  console.log('Sidebar re-render');
  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
<h2 className={styles.title}>Mes Projets</h2>
<ul className={styles.list}>
{projects.map(p => (
<li key={p.id} className={styles.item}>
<NavLink
  to={`/projects/${p.id}`}
  className={({ isActive }) => `${styles.itemLink} ${isActive ? styles.active : ''}`}
>
  <span className={styles.dot} style={{ background: p.color }} />
  <span className={styles.name}>{p.name}</span>
</NavLink>
<div className={styles.actions}>
{onRename && (
<button className={styles.editBtn} onClick={() => onRename(p)}>✏️</button>
)}
{onDelete && (
<button className={styles.deleteBtn} onClick={() => {
  if (confirm('Supprimer ce projet?')) onDelete(p.id);
}}>🗑️</button>
)}
</div>
</li>
))}
</ul>
</aside>
);
}