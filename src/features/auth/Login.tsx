import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import { loginStart, loginSuccess, loginFailure } from './authSlice';
import type { RootState, AppDispatch } from '../../store';
import styles from './Login.module.css';

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || '/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const { data: users } = await api.get(`/users?email=${email}`);
      if (users.length === 0 || users[0].password !== password) {
        dispatch(loginFailure('Email ou mot de passe incorrect'));
        return;
      }

      const { password: _password, ...user } = users[0]; // eslint-disable-line @typescript-eslint/no-unused-vars

      // Générer un faux token JWT simulé
      const fakeToken = btoa(JSON.stringify({
        userId: user.id,
        email: user.email,
        role: 'admin',
        exp: Date.now() + 3600000  // expire dans 1h
      }));

      // Stocker le token dans le state
      dispatch(loginSuccess({ user, token: fakeToken }));
      navigate(from, { replace: true });
    } catch {
      dispatch(loginFailure('Erreur de connexion au serveur'));
    }
  }

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>TaskFlow</h1>
        <p className={styles.subtitle}>Connectez-vous pour continuer</p>

        {error && <div className={styles.error}>{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className={styles.input}
          required
        />

        <button
          type="submit"
          className={styles.button}
          disabled={loading}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
} 