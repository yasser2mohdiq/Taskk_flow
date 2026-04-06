import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import api from '../../api/axios';
import { loginStart, loginSuccess, loginFailure } from './authSlice';
import type { RootState, AppDispatch } from '../../store';

export default function LoginBS() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
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
    } catch {
      dispatch(loginFailure('Erreur serveur'));
    }
  }

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Card style={{ maxWidth: 400, width: '100%' }}>
        <Card.Body>
          <Card.Title className="text-center" style={{ color: '#1B8C3E' }}>TaskFlow</Card.Title>
          <p className="text-center text-muted mb-4">Connectez-vous pour continuer</p>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button
              type="submit"
              className="w-100"
              style={{ backgroundColor: '#1B8C3E', borderColor: '#1B8C3E' }}
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}