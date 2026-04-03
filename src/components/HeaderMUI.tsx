import { AppBar, Toolbar, Typography, IconButton, Button, Box } from '@mui/material'; 
import MenuIcon from '@mui/icons-material/Menu'; 
import styles from './HeaderMUI.module.css';
  
interface HeaderProps { 
  title: string; 
  onMenuClick: () => void; 
  userName?: string; 
  onLogout?: () => void; 
} 
  
export default function HeaderMUI({ title, onMenuClick, userName, onLogout }: HeaderProps) { 
  return ( 
    <AppBar position="static" className={styles.appBar}> 
      <Toolbar className={styles.toolbar}> 
        <Box className={styles.leftSection}>
          <IconButton 
            edge="start" 
            color="inherit" 
            onClick={onMenuClick}
            className={styles.menuButton}
          > 
            <MenuIcon /> 
          </IconButton> 
          <Typography variant="h6" className={styles.title}> 
            {title} 
          </Typography>
        </Box>
        <Box className={styles.rightSection}> 
          {userName && (
            <Typography variant="body2" className={styles.userName}>
              {userName}
            </Typography>
          )} 
          {onLogout && ( 
            <Button 
              color="inherit" 
              variant="outlined" 
              className={styles.logoutButton}
              onClick={onLogout}
            > 
              Déconnexion 
            </Button> 
          )} 
        </Box>
      </Toolbar> 
    </AppBar> 
  ); 
} 