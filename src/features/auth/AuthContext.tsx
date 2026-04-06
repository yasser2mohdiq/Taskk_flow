import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { authReducer, initialState, type AuthState, type AuthAction } from './authReducer';
import { setAuthToken } from '../../api/axios';

/* eslint-disable react-refresh/only-export-components */ 
  
interface AuthContextType { 
  state: AuthState; 
  dispatch: React.Dispatch<AuthAction>; 
} 
  
const AuthContext = createContext<AuthContextType | null>(null); 
  
export function AuthProvider({ children }: { children: ReactNode }) { 
  const [state, dispatch] = useReducer(authReducer, initialState); 
  
  // Mettre à jour le token dans axios quand il change
  useEffect(() => { 
    setAuthToken(state.token); 
  }, [state.token]); 
  
  return ( 
    <AuthContext.Provider value={{ state, dispatch }}> 
      {children} 
    </AuthContext.Provider> 
  ); 
} 
  
// Custom hook pour consommer le context 
export function useAuth() { 
  const context = useContext(AuthContext); 
  if (!context) { 
    throw new Error('useAuth doit être utilisé dans un AuthProvider'); 
  } 
  return context; 
}

/* eslint-enable react-refresh/only-export-components */